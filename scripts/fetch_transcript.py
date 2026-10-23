#!/usr/bin/env python3
"""Download the subtitles of a YouTube video as SRT (source material for a script).

usage: python fetch_transcript.py <url-or-id> --out transcript.srt [--lang it,en]

Needs: pip install youtube-transcript-api
The SRT keeps the ORIGINAL video's timing: use it to write a summary script,
not as the timeline of the new animation (unless the animation should be as long
as the original video).
"""
import argparse
import re
import sys


def video_id(s):
    m = re.search(r"(?:v=|youtu\.be/|shorts/|embed/)([\w-]{11})", s)
    return m.group(1) if m else s.strip()


def ts(sec):
    ms = int(round(sec * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--out", required=True)
    ap.add_argument("--lang", default="it,en")
    a = ap.parse_args()
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
    except ImportError:
        sys.exit("pip install youtube-transcript-api")
    snippets = YouTubeTranscriptApi().fetch(video_id(a.video), languages=a.lang.split(",")).snippets
    with open(a.out, "w", encoding="utf-8") as fh:
        for i, s in enumerate(snippets):
            end = snippets[i + 1].start if i + 1 < len(snippets) else s.start + s.duration
            fh.write(f"{i + 1}\n{ts(s.start)} --> {ts(max(end, s.start + 0.5))}\n{s.text}\n\n")
    last = snippets[-1].start + snippets[-1].duration
    print(f"{len(snippets)} lines, {int(last // 60)}:{last % 60:04.1f} -> {a.out}")


if __name__ == "__main__":
    main()
