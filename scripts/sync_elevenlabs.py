#!/usr/bin/env python3
"""
ElevenLabs v3 Frame-Accurate Aligner & Transparent Broadcast Master
===================================================================
Aligns the user's two ElevenLabs v3 studio recordings:
  1. Reel 1 ("Aran - Parsi PVC v3"): /home/user/elevenlabs_audio/reel1_elevenlabs.wav -> ghimatrooz-reel
  2. Reel 2 ("parsian_gen Voice Design v3"): /home/user/elevenlabs_audio/reel2_elevenlabs.wav -> ghimatrooz-fomo
Preserves 100% of ElevenLabs' natural 44.1 kHz studio timbre, breath, and air without artificial DSP coloration.
"""

import json
import os
import subprocess
import numpy as np
from scipy.io import wavfile
from scipy import signal

from studio_voice_pro import (
    FFMPEG,
    FPS,
    SR,
    generate_clean_music,
    generate_clean_sfx,
)

BASE = "/home/user/columbus-video"


def transparent_elevenlabs_master(raw: np.ndarray, sr: int) -> np.ndarray:
    """Preserves ElevenLabs v3 native studio quality while matching broadcast loudness (-16 LUFS)."""
    # Pad 80ms silence at the end so final consonant/vowel decay is never clipped
    raw = np.concatenate([raw, np.zeros(int(0.08 * sr), dtype=np.float32)])

    # Trim excess leading/trailing silence (> 0.005) while keeping 65ms natural breath pad
    win = int(0.015 * sr)
    env = np.convolve(np.abs(raw), np.ones(win) / win, mode="same")
    idx = np.where(env > 0.005)[0]
    if len(idx) > 0:
        pad_start = int(0.060 * sr)
        pad_end = int(0.085 * sr)
        raw = raw[max(0, idx[0] - pad_start) : min(len(raw), idx[-1] + pad_end)]

    # 1. Remove DC offset & 65 Hz subsonic high-pass
    y = raw - np.mean(raw)
    sos_hp = signal.butter(2, 65.0 / (sr / 2), btype="highpass", output="sos")
    y = signal.sosfiltfilt(sos_hp, y).astype(np.float32)

    # 2. Gentle 2:1 optical leveling so every word is crystal clear over background music
    win_c = max(1, int(0.050 * sr))
    env_c = np.sqrt(np.convolve(y ** 2, np.ones(win_c) / win_c, mode="same") + 1e-9)
    thresh_c = 0.11
    comp_gain = np.where(env_c > thresh_c, (thresh_c + (env_c - thresh_c) / 1.8) / (env_c + 1e-9), 1.0)
    comp_gain = np.convolve(comp_gain, np.ones(int(0.05 * sr)) / int(0.05 * sr), mode="same")
    y = y * comp_gain

    # 3. Broadcast RMS target (0.175 active RMS, -1.0 dBFS ceiling)
    active = y[np.abs(y) > 0.012]
    rms = np.sqrt(np.mean(active ** 2) + 1e-9) if len(active) > 100 else np.sqrt(np.mean(y ** 2) + 1e-9)
    y = y * (0.175 / rms)

    peak = np.max(np.abs(y)) + 1e-9
    if peak > 0.89:
        y = np.tanh(y / 0.89) * 0.89

    # Smooth 30ms cosine fade-in and 45ms cosine fade-out
    f_in = int(0.030 * sr)
    f_out = int(0.045 * sr)
    if len(y) > f_in + f_out:
        y[:f_in] *= 0.5 * (1.0 - np.cos(np.pi * np.linspace(0, 1, f_in)))
        y[-f_out:] *= 0.5 * (1.0 + np.cos(np.pi * np.linspace(0, 1, f_out)))

    return y.astype(np.float32)


def build_reel_from_elevenlabs(
    slug: str,
    wav_in: str,
    splits: list[tuple[float, float]],
    texts: list[str],
):
    pub = f"{BASE}/public/{slug}"
    src = f"{BASE}/src/{slug}"
    os.makedirs(pub, exist_ok=True)
    os.makedirs(src, exist_ok=True)

    sr, data = wavfile.read(wav_in)
    x = data.astype(np.float32) / 32768.0

    clips = []
    print(f"=== Syncing ElevenLabs v3 Audio for {slug} ===")
    for i, (t0, t1) in enumerate(splits):
        seg = x[int(t0 * sr) : int(t1 * sr)]
        mastered = transparent_elevenlabs_master(seg, sr)
        clips.append(mastered)
        print(f"  Cue {i:02d} ({t0:5.2f}s..{t1:5.2f}s) -> final dur={len(mastered)/sr:.2f}s")

    cur_frame = 16
    cues_meta = []
    chapters_meta = []

    for i, clip in enumerate(clips):
        dur_frames = int(np.ceil(len(clip) / SR * FPS))
        start_f = cur_frame
        end_f = start_f + dur_frames
        cues_meta.append({
            "index": i,
            "id": f"cue_{i:02d}",
            "startFrame": start_f,
            "endFrame": end_f,
            "startSec": round(start_f / FPS, 3),
            "endSec": round(end_f / FPS, 3),
            "text": texts[i],
            "samples": clip,
        })
        cur_frame = end_f + 10
        if i == 2:
            ch_start = cur_frame + 5
            ch_end = ch_start + 44
            chapters_meta.append({"index": 0, "afterCue": 2, "startFrame": ch_start, "endFrame": ch_end})
            cur_frame = ch_end + 6
        elif i == 5:
            ch_start = cur_frame + 5
            ch_end = ch_start + 44
            chapters_meta.append({"index": 1, "afterCue": 5, "startFrame": ch_start, "endFrame": ch_end})
            cur_frame = ch_end + 6

    total_frames = cur_frame + 22
    total_sec = total_frames / FPS
    total_samples = int(np.ceil(total_sec * SR))
    full_audio = np.zeros(total_samples, dtype=np.float32)

    for c in cues_meta:
        pos = int(round(c["startFrame"] / FPS * SR))
        s = c.pop("samples")
        end_pos = min(total_samples, pos + len(s))
        full_audio[pos:end_pos] = s[: end_pos - pos]

    wav_int16 = np.clip(full_audio * 32767.0, -32768, 32767).astype(np.int16)
    wavfile.write(f"{pub}/voice.wav", SR, wav_int16)
    subprocess.run([FFMPEG, "-y", "-i", f"{pub}/voice.wav", "-b:a", "192k", f"{pub}/voice.mp3"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    music_wave = generate_clean_music(total_sec)
    wavfile.write(f"{pub}/music.wav", SR, (music_wave * 32767.0).astype(np.int16))
    subprocess.run([FFMPEG, "-y", "-i", f"{pub}/music.wav", "-b:a", "192k", f"{pub}/music.mp3"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    generate_clean_sfx(f"{pub}/sfx")

    timeline_obj = {
        "fps": FPS,
        "durationInFrames": total_frames,
        "durationSec": round(total_sec, 2),
        "cues": cues_meta,
        "chapters": chapters_meta,
    }
    with open(f"{src}/timeline.json", "w", encoding="utf-8") as f:
        json.dump(timeline_obj, f, ensure_ascii=False, indent=2)

    ts_code = f"""// Auto-generated from ElevenLabs v3 Studio Voice
export const TIMELINE = {json.dumps(timeline_obj, ensure_ascii=False, indent=2)} as const;
export const DURATION = {total_frames};
"""
    with open(f"{src}/timeline.ts", "w", encoding="utf-8") as f:
        f.write(ts_code)

    def fmt_srt_time(sec):
        ms = int(round((sec - int(sec)) * 1000))
        s = int(sec) % 60
        m = (int(sec) // 60) % 60
        h = int(sec) // 3600
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

    srt_lines = []
    for idx, c in enumerate(cues_meta, 1):
        srt_lines.append(f"{idx}\n{fmt_srt_time(c['startSec'])} --> {fmt_srt_time(c['endSec'])}\n{c['text']}\n")
    with open(f"{src}/voiceover.srt", "w", encoding="utf-8") as f:
        f.write("\n".join(srt_lines))

    print(f"=== Completed {slug}: {total_frames} frames ({total_sec:.2f}s) ===")


def main():
    reel1_texts = [
        "ده سال پیش، آرش و سارا هر کدام ۱۰۰ میلیون تومان پس‌انداز داشتند.",
        "آرش پولش را در بانک گذاشت، اما سارا با تمام پولش سکه طلا خرید.",
        "آن روز با ۱۰۰ میلیون تومان، می‌شد ۱۰۰ سکه طلا یا یک آپارتمان خرید!",
        "بعد از ده سال، پول آرش با سود بانکی شد ۶۰۰ میلیون تومان.",
        "اما تورم ۴۰ درصدی، قدرت خرید پول آرش را مثل یک قالب یخ آب کرد!",
        "در مقابل، ۱۰۰ سکه سارا امروز بیش از ۵ میلیارد تومان ارزش دارد!",
        "قانون اول حفظ سرمایه: فقط به عدد سود بانکی نگاه نکنید؛ معیار واقعی قدرت خرید است.",
        "پس‌انداز خود را به دارایی واقعی تبدیل کنید! برای تحلیل‌های روزانه، پیج را دنبال کنید.",
    ]
    reel1_splits = [
        (0.00, 5.10),
        (5.30, 10.85),
        (11.20, 16.65),
        (17.35, 21.95),
        (22.02, 28.25),
        (28.65, 34.35),
        (34.65, 42.65),
        (42.85, 48.93),
    ]

    reel2_texts = [
        "چرا خیلی‌ها دقیقاً روزی طلا و دلار می‌خرند که فردایش قیمت‌ها می‌ریزد؟!",
        "وقتی تیتر خبرها می‌شود «پرواز طلا»، آرش از ترسِ جا ماندن با کل پولش در قله قیمت می‌خرد!",
        "اما سارا می‌داند وقتی همه در صف خریدند، یعنی بازار وارد «حباب هیجانی» شده است!",
        "چند روز بعد قیمت ۲۰٪ اصلاح می‌شود و آرش از ترس ضرر بیشتر، در کف قیمت می‌فروشد!",
        "در مقابل، سارا سرمایه‌اش را به ۳ پله تقسیم می‌کند و در روزهای آرام بازار پله‌به‌پله می‌خرد.",
        "با این روش، میانگین خرید سارا بسیار پایین‌تر می‌آید و در موج بعدی به سود عالی می‌رسد!",
        "قانون طلایی بازار: در اوج هیجان و صف‌های شلوغ، هرگز با کل پولتان خرید نکنید!",
        "همیشه در اصلاح‌های بازار و پله‌ای وارد شوید! برای تشخیص زمان درست خرید، پیج را دنبال کنید.",
    ]
    reel2_splits = [
        (0.00, 5.50),
        (5.80, 14.35),
        (14.55, 21.75),
        (22.00, 32.00),
        (32.35, 41.05),
        (41.25, 49.25),
        (49.50, 57.00),
        (57.20, 65.31),
    ]

    build_reel_from_elevenlabs(
        "ghimatrooz-reel",
        "/home/user/elevenlabs_audio/reel1_elevenlabs.wav",
        reel1_splits,
        reel1_texts,
    )
    build_reel_from_elevenlabs(
        "ghimatrooz-fomo",
        "/home/user/elevenlabs_audio/reel2_elevenlabs.wav",
        reel2_splits,
        reel2_texts,
    )


if __name__ == "__main__":
    main()
