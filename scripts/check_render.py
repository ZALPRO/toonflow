#!/usr/bin/env python3
"""Sanity-check a rendered video against its timeline (ToonFlow v1.0.0).

usage: python3 check_render.py out/video.mp4 [--timeline src/slug/timeline.json] [--hits 5.9,61.5]
"""
import argparse
import glob
import json
import os
import shutil
import subprocess
import tempfile

import numpy as np
from scipy.io import wavfile


def find_bin(name):
    exe = shutil.which(name)
    if exe:
        return exe
    for base in ["/home/user/columbus-video/node_modules", "./node_modules", "../node_modules"]:
        matches = glob.glob(f"{base}/@remotion/compositor-*/{name}")
        if matches:
            return matches[0]
    return name


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--timeline")
    ap.add_argument("--hits", default="")
    a = ap.parse_args()
    ffmpeg = find_bin("ffmpeg")
    tmp_wav = os.path.join(tempfile.gettempdir(), f"_toonflow_chk_{os.getpid()}.wav")
    try:
        subprocess.run(
            [ffmpeg, "-y", "-loglevel", "error", "-i", a.video, "-vn", "-ac", "1", "-ar", "8000", tmp_wav],
            check=True,
        )
        sr, data = wavfile.read(tmp_wav)
        x = data.astype(np.float32) / 32768.0
    finally:
        if os.path.exists(tmp_wav):
            os.remove(tmp_wav)

    dur = len(x) / float(sr) if len(x) else 0.0
    rep = {"duration_s": round(dur, 2)}
    if a.timeline:
        with open(a.timeline, encoding="utf-8") as fh:
            tl = json.load(fh)
        rep["timeline_s"] = tl["seconds"]
        rep["delta_s"] = round(dur - tl["seconds"], 2)
    if len(x) == 0:
        rep["audio"] = "none"
    else:
        db = lambda v: round(float(20 * np.log10(max(float(v), 1e-9))), 1)
        rep["audio"] = {
            "peak_dBFS": db(abs(x).max()),
            "rms_dBFS": db(float(np.sqrt((x**2).mean()))),
            "clipped_samples": int((abs(x) >= 0.99).sum()),
        }
        hits = [float(h) for h in a.hits.split(",") if h.strip()]
        rep["hits"] = []
        for h in hits:
            now = x[int(h * sr) : int((h + 0.3) * sr)]
            before = x[max(0, int((h - 0.6) * sr)) : int((h - 0.1) * sr)]
            if len(now) and len(before):
                rep["hits"].append({"t": h, "dB": db(abs(now).max()), "before_dB": db(float(abs(before).max()))})
    print(json.dumps(rep, indent=2))


if __name__ == "__main__":
    main()
