#!/usr/bin/env python3
"""Transcribe a recorded voiceover into a timed SRT (then feed it to parse_input.py --srt).

usage: python transcribe_voice.py voice.wav --out voice.srt [--lang it] [--model small]

Uses faster-whisper if installed, otherwise openai-whisper:
    pip install faster-whisper      (recommended)
    pip install openai-whisper
If the user already has the script text, the timings still come from the audio:
the voice is the reference, the text is only used to fix transcription errors.
"""
import argparse
import sys


def ts(sec):
    ms = int(round(sec * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def segments(path, lang, model):
    try:
        from faster_whisper import WhisperModel

        m = WhisperModel(model, device="auto", compute_type="auto")
        segs, _ = m.transcribe(path, language=lang, vad_filter=True)
        return [(s.start, s.end, s.text.strip()) for s in segs]
    except ImportError:
        pass
    try:
        import whisper

        m = whisper.load_model(model)
        r = m.transcribe(path, language=lang)
        return [(s["start"], s["end"], s["text"].strip()) for s in r["segments"]]
    except ImportError:
        sys.exit("Install a transcriber first: pip install faster-whisper  (or: pip install openai-whisper)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("--out", required=True)
    ap.add_argument("--lang", default=None, help="e.g. it, en (auto-detect if omitted)")
    ap.add_argument("--model", default="small")
    a = ap.parse_args()
    segs = segments(a.audio, a.lang, a.model)
    with open(a.out, "w", encoding="utf-8") as fh:
        for i, (s, e, t) in enumerate(segs):
            fh.write(f"{i + 1}\n{ts(s)} --> {ts(e)}\n{t}\n\n")
    print(f"{len(segs)} segments, {segs[-1][1]:.1f}s -> {a.out}" if segs else "no speech found")


if __name__ == "__main__":
    main()
