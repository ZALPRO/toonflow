#!/usr/bin/env python3
"""Turn subtitles or a script into a frame-accurate timeline for the video.

Usage:
    python parse_input.py --srt subs.srt          --out src/my-video [--fps 30]
    python parse_input.py --script script.md      --out src/my-video [--wps 2.6]
    python parse_input.py --text "One. Two."      --out src/my-video

Writes into --out:
    timeline.ts     typed TIMELINE constant imported by the video (cues in frames)
    timeline.json   same data, for scripts (music plan, checks)
    voiceover.srt   subtitles matching the timeline (for recording the voiceover)

The narration drives the video length:
  * SRT input keeps its timing exactly: the video lasts as long as the subtitles.
  * Script/text input gets timing from a speaking rate (--wps, words per second;
    2.4-2.7 is a natural voiceover pace). Lines starting with "#" become chapters
    (a short silent slot for a chapter card). A blank line adds a short pause.

The report lists cues read faster than --max-wps so they can be shortened or given more time.
"""
import argparse
import json
import math
import os
import re
import sys


# ------------------------------------------------------------------ parsing
def parse_time(s):
    s = s.strip().replace(",", ".")
    parts = s.split(":")
    sec = float(parts[-1])
    if len(parts) >= 2:
        sec += int(parts[-2]) * 60
    if len(parts) >= 3:
        sec += int(parts[-3]) * 3600
    return sec


def parse_srt(text):
    text = text.lstrip("﻿").replace("\r\n", "\n").replace("\r", "\n")
    cues = []
    for block in re.split(r"\n\s*\n", text.strip()):
        lines = [l for l in block.split("\n") if l.strip()]
        idx = next((i for i, l in enumerate(lines) if "-->" in l), None)
        if idx is None:
            continue
        a, b = lines[idx].split("-->")
        body = " ".join(lines[idx + 1 :])
        body = re.sub(r"<[^>]+>|\{\\[^}]+\}", "", body).strip()
        if body:
            cues.append({"start": parse_time(a), "end": parse_time(b.split()[0]), "text": body})
    cues.sort(key=lambda c: c["start"])
    return cues


def split_sentences(par):
    parts = re.split(r"(?<=[.!?…])\s+", par.strip())
    out = []
    for p in parts:
        words = p.split()
        # split long sentences at a comma/colon/dash near the middle
        while len(words) > 16:
            txt = " ".join(words)
            cands = [m.end() for m in re.finditer(r"[,;:—–]\s", txt)]
            if not cands:
                break
            mid = len(txt) / 2
            cut = min(cands, key=lambda c: abs(c - mid))
            out.append(txt[:cut].strip())
            words = txt[cut:].split()
        if words:
            out.append(" ".join(words))
    # merge very short fragments into the next one
    merged = []
    for s in out:
        if merged and len(merged[-1].split()) < 3:
            merged[-1] = merged[-1] + " " + s
        else:
            merged.append(s)
    return merged


def script_to_cues(text, wps, lead, gap, par_pause, chapter_len):
    text = text.lstrip("﻿").replace("\r\n", "\n")
    t = lead
    cues, chapters = [], []
    paragraphs = re.split(r"\n\s*\n", text)
    for par in paragraphs:
        lines = [l.strip() for l in par.split("\n") if l.strip()]
        body = []
        for l in lines:
            if l.startswith("#"):
                if body:
                    t = emit(" ".join(body), t, cues, wps, gap)
                    body = []
                chapters.append({"title": l.lstrip("#").strip(), "start": t, "end": t + chapter_len})
                t += chapter_len
            else:
                body.append(re.sub(r"^[-*>]\s+", "", l))
        if body:
            t = emit(" ".join(body), t, cues, wps, gap)
            t += par_pause
    return cues, chapters


def emit(par, t, cues, wps, gap):
    for s in split_sentences(par):
        n = len(s.split())
        d = max(1.2, n / wps)
        cues.append({"start": round(t, 3), "end": round(t + d, 3), "text": s})
        t += d + gap
    return t


# ------------------------------------------------------------------ output
def fmt_srt(sec):
    ms = int(round(sec * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def build(cues, chapters, fps, tail):
    end = max([c["end"] for c in cues] + [c["end"] for c in chapters] + [0])
    dur = math.ceil((end + tail) * fps)
    tl = {
        "fps": fps,
        "durationInFrames": dur,
        "seconds": round(dur / fps, 2),
        "cues": [
            {
                "i": i,
                "start": c["start"],
                "end": c["end"],
                "startFrame": round(c["start"] * fps),
                "endFrame": round(c["end"] * fps),
                "words": len(c["text"].split()),
                "text": c["text"],
            }
            for i, c in enumerate(cues)
        ],
        "chapters": [
            {"title": c["title"], "startFrame": round(c["start"] * fps), "endFrame": round(c["end"] * fps)} for c in chapters
        ],
    }
    return tl


TS_HEADER = """// Generated by parse_input.py: re-run the script instead of editing by hand.
// Frames are global composition frames; scenes receive their own `from` to make them local.
export type TimelineCue = {
  i: number;
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
  words: number;
  text: string;
};
export type TimelineChapter = { title: string; startFrame: number; endFrame: number };
export type Timeline = {
  fps: number;
  durationInFrames: number;
  seconds: number;
  cues: TimelineCue[];
  chapters: TimelineChapter[];
};

export const TIMELINE: Timeline = """


def main():
    ap = argparse.ArgumentParser()
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--srt")
    src.add_argument("--script")
    src.add_argument("--text")
    ap.add_argument("--out", required=True)
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--wps", type=float, default=2.6, help="speaking rate for scripts (words/second)")
    ap.add_argument("--max-wps", type=float, default=3.3, help="report cues faster than this")
    ap.add_argument("--lead", type=float, default=1.0, help="seconds before the first line (scripts)")
    ap.add_argument("--gap", type=float, default=0.25, help="pause between sentences (scripts)")
    ap.add_argument("--pause", type=float, default=0.6, help="extra pause after a paragraph (scripts)")
    ap.add_argument("--chapter", type=float, default=2.2, help="seconds for a chapter card (scripts)")
    ap.add_argument("--tail", type=float, default=2.0, help="seconds after the last cue")
    a = ap.parse_args()

    if a.srt:
        with open(a.srt, encoding="utf-8-sig") as fh:
            cues, chapters = parse_srt(fh.read()), []
        mode = "srt"
    else:
        text = a.text if a.text else open(a.script, encoding="utf-8-sig").read()
        cues, chapters = script_to_cues(text, a.wps, a.lead, a.gap, a.pause, a.chapter)
        mode = "script"
    if not cues:
        sys.exit("No cues found in the input.")

    tl = build(cues, chapters, a.fps, a.tail)
    os.makedirs(a.out, exist_ok=True)
    with open(os.path.join(a.out, "timeline.json"), "w", encoding="utf-8") as fh:
        json.dump(tl, fh, ensure_ascii=False, indent=1)
    with open(os.path.join(a.out, "timeline.ts"), "w", encoding="utf-8") as fh:
        fh.write(TS_HEADER + json.dumps(tl, ensure_ascii=False, indent=2) + ";\n")
    with open(os.path.join(a.out, "voiceover.srt"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(f"{c['i'] + 1}\n{fmt_srt(c['start'])} --> {fmt_srt(c['end'])}\n{c['text']}\n" for c in tl["cues"]))

    fast = [(round(c["words"] / max(0.01, c["end"] - c["start"]), 1), c["i"], c["text"]) for c in tl["cues"]]
    fast = sorted([x for x in fast if x[0] > a.max_wps], reverse=True)
    words = sum(c["words"] for c in tl["cues"])
    m, s = divmod(tl["seconds"], 60)
    print(
        json.dumps(
            {
                "mode": mode,
                "cues": len(tl["cues"]),
                "chapters": len(tl["chapters"]),
                "words": words,
                "duration": f"{int(m)}:{s:04.1f}",
                "durationInFrames": tl["durationInFrames"],
                "too_fast": [{"wps": w, "cue": i, "text": t} for w, i, t in fast[:20]],
                "files": [os.path.join(a.out, f) for f in ("timeline.ts", "timeline.json", "voiceover.srt")],
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
