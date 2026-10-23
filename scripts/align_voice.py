#!/usr/bin/env python3
"""Re-time the video to a recorded voiceover.

A voiceover never follows the planned timing exactly: every reader has their own
pace, speeds up, slows down, pauses. This script finds where each PLANNED cue is
actually spoken in the recording and rewrites the timeline with the real times.
Scenes and beats anchored to cue indices then follow the voice automatically.

usage:
    python align_voice.py --timeline src/slug/timeline.json --audio public/slug/voice.wav --out src/slug [--lang it]
    python align_voice.py --timeline src/slug/timeline.json --srt voice_transcript.srt --out src/slug

--audio  transcribes with word timestamps (pip install faster-whisper, or openai-whisper)
--srt    uses an existing transcript of the recording (any segmentation; less precise)

How it works: the planned text and the transcript are normalised and aligned
character by character (difflib), so small reading changes, skipped or added
words and transcription errors do not break the match. Each cue's start/end is
read from the time of the aligned characters.

Writes timeline.ts / timeline.json (the old plan is kept as timeline.planned.json)
and voice.aligned.srt; prints how much each part moved and any chapter cards that
no longer have a pause in the voice.
"""
import argparse
import bisect
import difflib
import json
import os
import re
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from parse_input import TS_HEADER, fmt_srt, parse_srt  # noqa: E402


def transcribe_words(path, lang, model):
    try:
        from faster_whisper import WhisperModel

        m = WhisperModel(model, device="auto", compute_type="auto")
        segs, _ = m.transcribe(path, language=lang, word_timestamps=True, vad_filter=True)
        return [(w.word, w.start, w.end) for s in segs for w in (s.words or [])]
    except ImportError:
        pass
    try:
        import whisper

        r = whisper.load_model(model).transcribe(path, language=lang, word_timestamps=True)
        return [(w["word"], w["start"], w["end"]) for s in r["segments"] for w in s.get("words", [])]
    except ImportError:
        sys.exit("Install a transcriber: pip install faster-whisper  (or openai-whisper), or pass --srt")


def srt_words(path):
    """split each subtitle segment into words with linearly interpolated times"""
    with open(path, encoding="utf-8-sig") as fh:
        cues = parse_srt(fh.read())
    out = []
    for c in cues:
        words = c["text"].split()
        total = sum(len(w) + 1 for w in words) or 1
        t, pos = c["start"], 0
        for w in words:
            a = c["start"] + (c["end"] - c["start"]) * pos / total
            pos += len(w) + 1
            b = c["start"] + (c["end"] - c["start"]) * pos / total
            out.append((w, a, b))
    return out


def norm_chars(text):
    """lowercase alphanumerics, single spaces; returns the normalised string"""
    t = text.lower()
    t = re.sub(r"[^\w]+", " ", t, flags=re.UNICODE).replace("_", " ")
    return re.sub(r"\s+", " ", t)


def build_transcript(words):
    chars, times = [], []
    for w, a, b in words:
        n = norm_chars(w).strip()
        if not n:
            continue
        for k, ch in enumerate(n):
            chars.append(ch)
            times.append(a + (b - a) * (k + 0.5) / len(n))
        chars.append(" ")
        times.append(b)
    return "".join(chars), times


def build_plan(cues):
    parts, spans, pos = [], [], 0
    for c in cues:
        n = norm_chars(c["text"]).strip()
        spans.append((pos, pos + max(1, len(n))))
        parts.append(n + " ")
        pos += len(n) + 1
    return "".join(parts), spans


def char_map(plan, trans):
    """for every plan index, the aligned transcript index (interpolated where unmatched)"""
    sm = difflib.SequenceMatcher(None, plan, trans, autojunk=False)
    xs, ys = [], []
    for a, b, size in sm.get_matching_blocks():
        for k in range(size):
            xs.append(a + k)
            ys.append(b + k)
    matched = sum(b.size for b in sm.get_matching_blocks())

    def f(i):
        if not xs:
            return 0
        j = bisect.bisect_left(xs, i)
        if j < len(xs) and xs[j] == i:
            return ys[j]
        if j == 0:
            return ys[0]
        if j >= len(xs):
            return ys[-1]
        x0, x1, y0, y1 = xs[j - 1], xs[j], ys[j - 1], ys[j]
        return round(y0 + (y1 - y0) * (i - x0) / (x1 - x0))

    return f, matched / max(1, len(plan))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--timeline", required=True, help="planned timeline.json")
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--audio")
    src.add_argument("--srt")
    ap.add_argument("--out", required=True)
    ap.add_argument("--lang", default=None)
    ap.add_argument("--model", default="small")
    ap.add_argument("--tail", type=float, default=2.0)
    ap.add_argument("--min-chapter", type=float, default=1.2, help="warn if a chapter card gets less than this")
    a = ap.parse_args()

    with open(a.timeline, encoding="utf-8") as fh:
        plan_tl = json.load(fh)
    fps = plan_tl["fps"]
    cues = plan_tl["cues"]
    words = transcribe_words(a.audio, a.lang, a.model) if a.audio else srt_words(a.srt)
    if not words:
        sys.exit("no words in the recording/transcript")

    trans, times = build_transcript(words)
    plan, spans = build_plan(cues)
    fmap, coverage = char_map(plan, trans)

    new = []
    prev_end = 0.0
    for c, (s, e) in zip(cues, spans):
        ts = times[min(len(times) - 1, fmap(s))]
        te = times[min(len(times) - 1, fmap(e - 1))]
        ts = max(ts, prev_end)
        te = max(te, ts + 0.3)
        new.append({**c, "start": round(ts, 3), "end": round(te, 3)})
        prev_end = te

    # chapters sit in the gap between the cue before and the cue after them
    chapters = []
    for ch in plan_tl.get("chapters", []):
        before = [k for k, c in enumerate(cues) if c["endFrame"] <= ch["startFrame"]]
        after = [k for k, c in enumerate(cues) if c["startFrame"] >= ch["endFrame"]]
        gs = new[before[-1]]["end"] if before else 0.0
        ge = new[after[0]]["start"] if after else gs + (ch["endFrame"] - ch["startFrame"]) / fps
        chapters.append({"title": ch["title"], "start": gs, "end": max(ge, gs + 0.5), "gap": ge - gs})

    end = max([c["end"] for c in new] + [words[-1][2]])
    tl = {
        "fps": fps,
        "durationInFrames": int((end + a.tail) * fps + 0.999),
        "seconds": 0,
        "cues": [
            {**c, "startFrame": round(c["start"] * fps), "endFrame": round(c["end"] * fps)} for c in new
        ],
        "chapters": [{"title": c["title"], "startFrame": round(c["start"] * fps), "endFrame": round(c["end"] * fps)} for c in chapters],
    }
    tl["seconds"] = round(tl["durationInFrames"] / fps, 2)

    os.makedirs(a.out, exist_ok=True)
    keep = os.path.join(a.out, "timeline.planned.json")
    tj = os.path.join(a.out, "timeline.json")
    if os.path.exists(tj) and not os.path.exists(keep):
        shutil.copy2(tj, keep)
    with open(tj, "w", encoding="utf-8") as fh:
        json.dump(tl, fh, ensure_ascii=False, indent=1)
    with open(os.path.join(a.out, "timeline.ts"), "w", encoding="utf-8") as fh:
        fh.write(TS_HEADER + json.dumps(tl, ensure_ascii=False, indent=2) + ";\n")
    with open(os.path.join(a.out, "voice.aligned.srt"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(f"{c['i'] + 1}\n{fmt_srt(c['start'])} --> {fmt_srt(c['end'])}\n{c['text']}\n" for c in new))

    shifts = [c2["start"] - c1["start"] for c1, c2 in zip(cues, new)]
    print(
        json.dumps(
            {
                "coverage": round(coverage, 3),
                "planned_s": plan_tl["seconds"],
                "voice_s": tl["seconds"],
                "max_shift_s": round(max(shifts, key=abs), 2),
                "mean_shift_s": round(sum(shifts) / len(shifts), 2),
                "short_chapter_gaps": [{"title": c["title"], "gap_s": round(c["gap"], 2)} for c in chapters if c["gap"] < a.min_chapter],
                "note": "coverage < 0.8 means the recording differs a lot from the planned text: check voice.aligned.srt",
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
