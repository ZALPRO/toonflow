"""Original sound effects and background music, synthesised from scratch
(no samples, no licensing issues).

usage:
    python gen_audio.py --out PROJECT/public/SLUG                 # SFX only
    python gen_audio.py --out PROJECT/public/SLUG --plan plan.json
    python gen_audio.py --out PROJECT/public/SLUG --plan "intro:8.7,card:2.2,play:52.6,finale:13"

plan = ordered list of [style, seconds] (JSON file or "style:sec,..." string).
Styles: intro, play, tense, mystery, hope, finale, card (silence + orchestral hit).
Writes OUT/sfx/<name>.wav and OUT/music.mp3 (music.wav if ffmpeg is missing).
"""
import argparse
import json
import os
import shutil
import subprocess

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
ROOT = "."
rng = np.random.default_rng(7)


# ---------------------------------------------------------------- helpers
def t_(d):
    return np.arange(int(d * SR)) / SR


def noise(d):
    return rng.uniform(-1, 1, int(d * SR))


def filt(x, kind, f, order=2):
    if kind == "bp":
        sos = butter(order, [f[0] / (SR / 2), f[1] / (SR / 2)], "bandpass", output="sos")
    else:
        sos = butter(order, f / (SR / 2), kind, output="sos")
    return sosfilt(sos, x)


def sweep_filter(x, f0, f1, kind="lp", blocks=64):
    """time-varying filter (processed in blocks)"""
    out = np.zeros_like(x)
    n = len(x)
    edges = np.linspace(0, n, blocks + 1).astype(int)
    fs = np.geomspace(max(f0, 20), max(f1, 20), blocks) if np.isscalar(f0) else f0
    for i in range(blocks):
        a, b = edges[i], edges[i + 1]
        seg = x[max(0, a - 512) : b]
        y = filt(seg, kind, min(fs[i], SR / 2 - 100))
        out[a:b] = y[-(b - a) :]
    return out


def env(n, a=0.005, d=None, curve=4.0):
    """linear attack + exponential decay envelope"""
    t = np.arange(n) / SR
    na = max(1, int(a * SR))
    e = np.exp(-curve * t / (d if d else n / SR))
    e[:na] *= np.linspace(0, 1, na)
    return e


def bell_env(n, peak=0.5):
    x = np.linspace(0, 1, n)
    return np.where(x < peak, x / peak, (1 - x) / (1 - peak)) ** 1.6


def chirp(f0, f1, d, exp=True):
    t = t_(d)
    if exp:
        k = np.log(f1 / f0) / d
        ph = 2 * np.pi * f0 * (np.exp(k * t) - 1) / k
    else:
        ph = 2 * np.pi * (f0 * t + (f1 - f0) * t * t / (2 * d))
    return np.sin(ph)


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1
    return x / m * peak


def mix(*parts):
    n = max(len(p) for p in parts)
    out = np.zeros(n)
    for p in parts:
        out[: len(p)] += p
    return out


def pad_to(x, d):
    n = int(d * SR)
    return np.pad(x, (0, max(0, n - len(x))))[:n]


def save(name, x, peak=0.9):
    x = norm(x, peak)
    # micro fades to avoid clicks
    f = min(64, len(x) // 4)
    x[:f] *= np.linspace(0, 1, f)
    x[-f:] *= np.linspace(1, 0, f)
    os.makedirs(os.path.join(ROOT, "sfx"), exist_ok=True)
    wavfile.write(os.path.join(ROOT, "sfx", name + ".wav"), SR, (x * 32767).astype(np.int16))


# ---------------------------------------------------------------- effects
def whoosh(d=0.45, f0=250, f1=4000, peak=0.55):
    n = noise(d)
    half = int(len(n) * peak)
    fs = np.concatenate([np.geomspace(f0, f1, 32), np.geomspace(f1, f0 * 1.5, 32)])
    y = sweep_filter(n, fs, None, "lp")
    return y * bell_env(len(y), peak)


def thud(d=0.3, f0=110, f1=42):
    t = t_(d)
    body = chirp(f0, f1, d) * env(len(t), 0.002, d, 5)
    click = filt(noise(0.02), "lp", 2500) * env(int(0.02 * SR), 0.0005, 0.02, 6)
    return mix(body, click * 0.6)


def impact(d=0.9):
    boom = chirp(140, 35, d) * env(int(d * SR), 0.001, d, 4)
    crack = filt(noise(0.25), "lp", 3500) * env(int(0.25 * SR), 0.001, 0.25, 7)
    return mix(boom, crack * 0.8)


def pop():
    d = 0.09
    return chirp(500, 1400, d) * env(int(d * SR), 0.002, d, 5)


def slam():
    whack = filt(noise(0.16), "bp", (700, 3500)) * env(int(0.16 * SR), 0.001, 0.16, 6)
    return mix(thud(0.35, 130, 45), whack * 0.9)


def swish():
    return whoosh(0.22, 800, 6000, 0.4)


def punch():
    hit = filt(noise(0.12), "lp", 1800) * env(int(0.12 * SR), 0.001, 0.12, 6)
    return mix(thud(0.22, 160, 60), hit)


def bell(f=1320, d=1.4, partials=((1, 1), (2.76, 0.4), (5.4, 0.2), (8.9, 0.08))):
    t = t_(d)
    y = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (3 + k)) for k, a in partials)
    return y * env(len(t), 0.002, d, 1.0)


def kaching():
    clk = lambda: filt(noise(0.05), "bp", (3000, 7000)) * env(int(0.05 * SR), 0.0005, 0.05, 8)
    drawer = np.concatenate([clk(), np.zeros(int(0.07 * SR)), clk()])
    b = mix(np.zeros(int(0.12 * SR)), np.concatenate([np.zeros(int(0.12 * SR)), bell(1568, 1.2) + 0.7 * bell(2093, 1.2)]))
    return mix(drawer, b)


def stamp():
    slap = filt(noise(0.1), "bp", (400, 2500)) * env(int(0.1 * SR), 0.0005, 0.1, 7)
    return mix(thud(0.3, 100, 40), slap * 1.2)


def shatter(d=1.0):
    out = np.zeros(int(d * SR))
    for _ in range(45):
        st = int(rng.uniform(0, 0.45) ** 1.7 * SR)
        f = rng.uniform(2500, 9000)
        dd = rng.uniform(0.04, 0.25)
        tt = t_(dd)
        tink = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 30) * rng.uniform(0.2, 1)
        out[st : st + len(tink)] += tink[: len(out) - st]
    hiss = filt(noise(d), "hp", 3000) * env(int(d * SR), 0.001, d, 6)
    return mix(out, hiss * 0.5, impact(0.4) * 0.6)


def explosion(d=2.0):
    """5-layer physical explosion: supersonic snap + sub-bass shockwave + fireball roar + shrapnel crackle + deep rumble"""
    snap = filt(noise(0.05), "hp", 1800) * env(int(0.05 * SR), 0.0005, 0.05, 8)
    sub = chirp(160, 26, 0.65) * env(int(0.65 * SR), 0.001, 0.65, 3.8)
    roar = sweep_filter(noise(d), np.geomspace(1900, 180, 64), None, "lp") * env(int(d * SR), 0.004, d, 2.8)
    rumble = filt(noise(d), "lp", 240) * env(int(d * SR), 0.01, d, 2.2)
    debris = np.zeros(int(d * SR))
    for _ in range(26):
        st = int(rng.uniform(0.06, 0.85) * SR)
        ln = int(0.035 * SR)
        if st + ln < len(debris):
            debris[st : st + ln] += filt(noise(0.035), "bp", (1200, 6500)) * env(ln, 0.0005, 0.035, 7) * rng.uniform(0.25, 0.7)
    return mix(snap * 1.1, sub * 1.35, roar * 1.1, rumble * 1.3, debris * 0.6)


def siren(d=2.6):
    """Dual-rotor civil defense air-raid siren wail"""
    t = t_(d)
    f_curve = 280 + 340 * np.sin(np.pi * np.minimum(1.0, t / (d * 0.82))) ** 1.3
    ph1 = 2 * np.pi * np.cumsum(f_curve) / SR
    ph2 = 2 * np.pi * np.cumsum(f_curve * 1.2) / SR
    tone = (
        np.sin(ph1)
        + 0.45 * np.sin(2 * ph1)
        + 0.25 * np.sin(3 * ph1)
        + 0.85 * np.sin(ph2)
        + 0.35 * np.sin(2 * ph2)
    )
    e = np.minimum(1, t / 0.18) * np.minimum(1, (d - t) / 0.35)
    return filt(tone, "bp", (240, 2600)) * e


def jet(d=1.5):
    """Supersonic fighter jet flyby with Doppler shift + afterburner wash"""
    n = noise(d)
    fs = np.concatenate([np.geomspace(450, 4800, 28), np.geomspace(4800, 320, 36)])
    wash = sweep_filter(n, fs, None, "lp")
    whine = chirp(1950, 480, d) * 0.28 + chirp(980, 240, d) * 0.2
    return (wash + filt(whine, "bp", (220, 3500))) * bell_env(len(n), 0.44)


def cannon(d=1.25):
    """Heavy tank / artillery cannon breech blast + sub punch + shell whistle"""
    crack = filt(noise(0.08), "bp", (900, 5500)) * env(int(0.08 * SR), 0.0005, 0.08, 7)
    punch_sub = chirp(190, 34, 0.48) * env(int(0.48 * SR), 0.001, 0.48, 4.2)
    tail = sweep_filter(noise(d), np.geomspace(1400, 160, 64), None, "lp") * env(int(d * SR), 0.005, d, 3.2)
    whistle = np.concatenate([np.zeros(int(0.12 * SR)), chirp(2400, 680, 0.55) * env(int(0.55 * SR), 0.02, 0.55, 2.5) * 0.22])
    return mix(crack * 1.1, punch_sub * 1.4, tail * 0.9, whistle)


def gunfire(d=0.55):
    """3-round automatic rifle burst (G3 / AK-47)"""
    out = np.zeros(int(d * SR))
    for shot_t in (0.0, 0.13, 0.26):
        st = int(shot_t * SR)
        sd = 0.14
        sn = int(sd * SR)
        snap = filt(noise(sd), "bp", (1100, 6200)) * env(sn, 0.0004, sd, 9)
        body = chirp(240, 65, 0.07) * env(int(0.07 * SR), 0.0005, 0.07, 6)
        s_mix = mix(snap, body * 0.9)
        m = min(len(s_mix), len(out) - st)
        out[st : st + m] += s_mix[:m]
    return out


def radar(d=0.75):
    """Tactical military radar / sonar ping"""
    t = t_(d)
    ping = (np.sin(2 * np.pi * 1480 * t) + 0.3 * np.sin(2 * np.pi * 2960 * t)) * np.exp(-t * 9.5)
    return ping * env(len(t), 0.002, d, 1.5)


def tear(d=0.55):
    """Crisp paper tearing sound (Algiers treaty ripped in half)"""
    n = noise(d)
    rips = (rng.uniform(0, 1, len(n)) > 0.92) * rng.uniform(-1, 1, len(n))
    y = sweep_filter(n * 0.5 + rips * 1.8, np.geomspace(900, 5200, 64), None, "lp")
    return filt(y, "hp", 900) * bell_env(len(n), 0.55)


def missile(d=0.6):
    n = noise(d)
    fs = np.geomspace(800, 3500, 64)
    y = sweep_filter(n, fs, None, "lp")
    whine = chirp(900, 1500, d) * 0.15
    e = np.linspace(0.1, 1, len(y)) ** 2
    return (y + whine) * e


def tick():
    d = 0.03
    return filt(noise(d), "bp", (2000, 6000)) * env(int(d * SR), 0.0003, d, 9)


def riser(d=1.5):
    t = t_(d)
    saw = 2 * ((t * np.geomspace(120, 600, len(t))) % 1) - 1
    n = sweep_filter(noise(d), np.geomspace(300, 6000, 64), None, "lp")
    e = np.linspace(0, 1, len(t)) ** 2.2
    return (filt(saw, "lp", 2500) * 0.4 + n) * e


def freeze(d=1.1):
    t = t_(d)
    y = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) for f in (2637, 3136, 3951, 4699))
    trem = 0.6 + 0.4 * np.sin(2 * np.pi * 14 * t)
    crackle = np.zeros(len(t))
    for _ in range(60):
        i = rng.integers(0, len(t) - 200)
        crackle[i : i + 200] += filt(noise(200 / SR), "hp", 4000) * np.exp(-np.arange(200) / 30)
    return y * trem * env(len(t), 0.05, d, 2.5) * 0.3 + crackle * 0.4


def page(d=0.7):
    n = noise(d)
    crinkle = (rng.uniform(0, 1, len(n)) > 0.985) * rng.uniform(-1, 1, len(n))
    y = sweep_filter(n, np.geomspace(500, 5000, 64), None, "lp")
    return (y + filt(crinkle, "hp", 2000) * 2) * bell_env(len(n), 0.6)


def boing(d=0.6):
    t = t_(d)
    f = 220 + 180 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 4) + 200 * t
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.002, d, 3)


def clink():
    return bell(2900, 0.35, ((1, 1), (2.4, 0.5), (4.1, 0.3)))


def scribble(d=1.8):
    n = filt(noise(d), "bp", (1500, 6000))
    t = t_(d)
    am = (0.5 + 0.5 * np.sin(2 * np.pi * 7 * t + 3 * np.sin(2 * np.pi * 1.3 * t))) ** 2
    return n * am * bell_env(len(t), 0.1) ** 0.3


def horn(d=1.2):
    t = t_(d)
    saw = sum(np.sin(2 * np.pi * 98 * k * t) / k for k in range(1, 12))
    e = np.minimum(1, t / 0.08) * np.minimum(1, (d - t) / 0.3)
    return filt(saw, "lp", 900) * e


def buzz(d=0.9):
    t = t_(d)
    f = 190 + 25 * np.sin(2 * np.pi * 3 * t)
    saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
    return filt(saw, "lp", 2000) * bell_env(len(t), 0.7) * (0.7 + 0.3 * np.sin(2 * np.pi * 40 * t))


def swirl(d=2.4):
    n = noise(d)
    t = t_(d)
    fs = 600 + 1800 * (0.5 + 0.5 * np.sin(2 * np.pi * np.linspace(1, 6, 64) * np.linspace(0, d, 64)))
    y = sweep_filter(n, fs, None, "lp")
    return y * bell_env(len(t), 0.5) * (0.6 + 0.4 * np.sin(2 * np.pi * 5 * t * (1 + t)))


def crash():
    rustle = filt(noise(1.3), "bp", (1500, 7000)) * env(int(1.3 * SR), 0.01, 1.3, 3)
    rustle *= (rng.uniform(0, 1, len(rustle)) > 0.6) * 1.0 + 0.3
    return mix(impact(1.0), rustle * 0.5)


def chain_rattle(d=1.6):
    out = np.zeros(int(d * SR))
    for k in range(18):
        st = int(k / 18 * (d - 0.3) * SR)
        c = clink() * rng.uniform(0.4, 0.9)
        out[st : st + len(c)] += c[: len(out) - st]
    return out


def gold():
    return mix(bell(1760, 1.4), np.concatenate([np.zeros(int(0.08 * SR)), bell(2637, 1.2) * 0.7]), np.concatenate([np.zeros(int(0.16 * SR)), bell(3520, 1.0) * 0.5]))


def stinger():
    """orchestral hit for chapter cards"""
    t = t_(1.6)
    chord = sum(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t) for f in (110, 164.8, 220, 261.6, 329.6))
    return mix(chord * env(len(t), 0.004, 1.6, 3) * 0.35, impact(1.2) * 0.8, filt(noise(1.2), "hp", 5000) * env(int(1.2 * SR), 0.002, 1.2, 4) * 0.3)


SFX = {
    "whoosh": whoosh(),
    "whoosh_long": whoosh(0.9, 200, 3500, 0.6),
    "thud": thud(),
    "impact": impact(),
    "pop": pop(),
    "slam": slam(),
    "swish": swish(),
    "punch": punch(),
    "ding": bell(),
    "kaching": kaching(),
    "stamp": stamp(),
    "shatter": shatter(),
    "explosion": explosion(),
    "siren": siren(),
    "jet": jet(),
    "cannon": cannon(),
    "gunfire": gunfire(),
    "radar": radar(),
    "tear": tear(),
    "missile": missile(),
    "tick": tick(),
    "riser": riser(),
    "freeze": freeze(),
    "page": page(),
    "boing": boing(),
    "clink": clink(),
    "scribble": scribble(),
    "horn": horn(),
    "buzz": buzz(),
    "swirl": swirl(),
    "crash": crash(),
    "chains": chain_rattle(),
    "gold": gold(),
    "stinger": stinger(),
}


# ---------------------------------------------------------------- music
def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


def kick():
    d = 0.28
    return chirp(150, 48, d) * env(int(d * SR), 0.001, d, 5)


def clap():
    d = 0.18
    n = filt(noise(d), "bp", (900, 4000)) * env(int(d * SR), 0.001, d, 7)
    return n + np.sin(2 * np.pi * 190 * t_(d)) * env(int(d * SR), 0.001, d, 12) * 0.4


def hat(d=0.05):
    return filt(noise(d), "hp", 7000) * env(int(d * SR), 0.0005, d, 8)


def marimba(f, d=0.5):
    t = t_(d)
    return (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 18)) * env(len(t), 0.002, d, 6)


def pluck(f, d=0.35):
    """plucked string (Karplus-Strong)"""
    n = int(d * SR)
    p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p)
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    return out * env(n, 0.001, d, 2)


def bass(f, d=0.24):
    t = t_(d)
    saw = 2 * ((f * t) % 1) - 1
    return filt(saw, "lp", 380 + 900 * np.exp(-t[0] * 10)) * env(len(t), 0.003, d, 3)


def pad(freqs, d):
    t = t_(d)
    y = sum(np.sin(2 * np.pi * f * (1 + det) * t) for f in freqs for det in (-0.004, 0.0, 0.004))
    e = np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.4)
    return filt(y, "lp", 1200) * e / (len(freqs) * 3)


# chords as (midi root, intervals)
MAJ, MIN = (0, 4, 7), (0, 3, 7)
STYLES = {
    #        bpm  chords                                                      layers
    "intro": (112, [(60, MAJ), (55, MAJ), (57, MIN), (53, MAJ)], {"marimba", "hat"}),
    "play": (112, [(60, MAJ), (55, MAJ), (57, MIN), (53, MAJ)], {"marimba", "hat", "kick", "clap", "bass", "pluck"}),
    "tense": (118, [(57, MIN), (53, MAJ), (50, MIN), (52, MAJ)], {"pluck16", "hat16", "kick", "clap", "bass8", "pad"}),
    "mystery": (116, [(50, MIN), (58, MAJ), (55, MIN), (57, MAJ)], {"marimba16", "hat", "kick4", "bass8", "pad"}),
    "hope": (112, [(55, MAJ), (50, MAJ), (52, MIN), (48, MAJ)], {"marimba", "hat", "kick", "clap", "bass", "pad", "pluck"}),
    "finale": (96, [(60, MAJ), (53, MAJ), (57, MIN), (55, MAJ)], {"marimba", "pad"}),
}


def place(buf, x, at, g=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    m = min(len(x), len(buf) - i)
    buf[i : i + m] += x[:m] * g


def section(style, dur):
    bpm, chords, L = STYLES[style]
    beat = 60 / bpm
    bar = beat * 4
    out = np.zeros(int(dur * SR) + SR)
    nbars = int(np.ceil(dur / bar))
    for b in range(nbars):
        root, q = chords[b % len(chords)]
        notes = [root + i for i in q]
        t0 = b * bar
        if "pad" in L:
            place(out, pad([midi(n - 12) for n in notes], bar), t0, 0.5)
        for s in range(16):  # sixteenth notes
            ts = t0 + s * beat / 4
            if ts > dur:
                break
            if ("kick" in L and s in (0, 8, 10)) or ("kick4" in L and s % 4 == 0):
                place(out, kick(), ts, 0.9)
            if "clap" in L and s in (4, 12):
                place(out, clap(), ts, 0.45)
            if ("hat" in L and s % 2 == 0) or ("hat16" in L):
                place(out, hat(), ts, 0.12 if s % 4 else 0.18)
            if "bass" in L and s in (0, 3, 6, 8, 11, 14):
                place(out, bass(midi(root - 24)), ts, 0.5)
            if "bass8" in L and s % 2 == 0:
                place(out, bass(midi(root - 24 + (7 if s in (6, 14) else 0)), 0.18), ts, 0.5)
            arp = [notes[0], notes[1], notes[2], notes[0] + 12]
            if "marimba" in L and s % 2 == 0:
                # bouncy arpeggio, varied every two bars
                k = [0, 2, 1, 3, 2, 1, 3, 0][(s // 2 + b) % 8]
                place(out, marimba(midi(arp[k] + 12)), ts, 0.28)
            if "marimba16" in L:
                k = [0, 1, 2, 3, 2, 1][(s + b) % 6]
                place(out, marimba(midi(arp[k] + 12), 0.25), ts, 0.18)
            if "pluck" in L and s in (2, 7, 10, 15):
                place(out, pluck(midi(arp[(s + b) % 4] + 12)), ts, 0.22)
            if "pluck16" in L and s % 2 == 1:
                place(out, pluck(midi(arp[(s // 2) % 4]), 0.2), ts, 0.2)
    return out[: int(dur * SR)]


def music(plan):
    total = sum(d for _, d in plan)
    out = np.zeros(int(total * SR) + 2 * SR)
    at = 0.0
    for style, d in plan:
        if style == "card":
            place(out, stinger(), at, 0.7)
        else:
            seg = section(style, d + 0.3)
            fade = int(0.3 * SR)
            seg[-fade:] *= np.linspace(1, 0, fade)
            seg[:fade] *= np.linspace(0, 1, fade)
            place(out, seg, at)
        at += d
    out = out[: int(total * SR)]
    out[-int(2.5 * SR) :] *= np.linspace(1, 0, int(2.5 * SR))
    return norm(out, 0.85)


def load_plan(arg):
    if os.path.isfile(arg):
        with open(arg, encoding="utf-8") as fh:
            data = json.load(fh)
        return [(str(st), float(sec)) for st, sec in data]
    out = []
    for part in arg.split(","):
        st, sec = part.split(":")
        out.append((st.strip(), float(sec)))
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True, help="folder inside public/, e.g. my-project/public/my-video")
    ap.add_argument("--plan", help="music plan (JSON file or style:sec,...)")
    ap.add_argument("--no-sfx", action="store_true")
    a = ap.parse_args()
    ROOT = a.out
    if not a.no_sfx:
        for k, v in SFX.items():
            save(k, v)
        print("SFX:", len(SFX), "->", os.path.join(ROOT, "sfx"))
    if a.plan:
        plan = load_plan(a.plan)
        bad = [st for st, _ in plan if st != "card" and st not in STYLES]
        if bad:
            raise SystemExit(f"unknown styles {bad}; use one of {sorted(STYLES)} or card")
        m = music(plan)
        os.makedirs(ROOT, exist_ok=True)
        wav = os.path.join(ROOT, "music.wav")
        wavfile.write(wav, SR, (m * 32767).astype(np.int16))
        if shutil.which("ffmpeg"):
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-b:a", "192k", os.path.join(ROOT, "music.mp3")], check=True)
            os.remove(wav)
            print("music:", os.path.join(ROOT, "music.mp3"), round(len(m) / SR, 1), "s")
        else:
            print("music:", wav, "(ffmpeg not found: kept WAV; reference music.wav in the video)")
