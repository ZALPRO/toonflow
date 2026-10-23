# ToonFlow (`v1.0.0`) — Studio Voice Design & 9:16 Viral Reels Guide

---

## 1. ElevenLabs v3 Studio Voice Design Guide (Persian / `fa-IR` & International)

When generating studio narration in **ElevenLabs Voice Design (v3)** for financial, historical, or educational explainers, use the following English acoustic prompt (ElevenLabs' prompt parser is trained on English audio descriptors):

### Recommended Voice Design Prompt
```text
Native Persian, Iranian Farsi (standard Tehran dialect, without any Dari or Arabic features). Male, 32–38. Studio-quality recording, perfect audio quality. Persona: charismatic financial storyteller and podcaster. Emotion: warm, confident, engaging. Deep, rich, smooth baritone timbre with natural chest resonance, forward proximity, and a noise-free broadcast signal. Speaks at a natural, relaxed conversational pace like talking to a close friend, with clear emphasis on key numbers and financial insights.
```

### Recommended ElevenLabs v3 Slider Settings
- **Guidance Scale**: `30% – 35%` (prevents metallic over-compression)
- **Stability**: `50% – 58%` (preserves natural human pitch inflection)
- **Similarity / Clarity**: `75% – 80%`
- **Style Exaggeration**: `15% – 25%`
- **Speaker Boost**: `ON`

### Frame-Accurate Sync Workflow (`scripts/sync_elevenlabs.py`)
1. Place the downloaded MP3/WAV into your project and run `python3 scripts/sync_elevenlabs.py`.
2. The script automatically detects speech boundaries (`8` cues), trims inter-sentence dead air down to natural `0.16s` breaths with `15ms` cosine fades, writes `public/<slug>/voice.wav` (`44.1 kHz`), and updates `src/<slug>/timeline.ts`, `timeline.json`, and `voiceover.srt`.

---

## 2. 2026 Instagram Reels / TikTok / Shorts Safe-Zone Blueprint (`1080×1920`)

```text
+---------------------------------------------------+ y = 0
|          TOP INSTAGRAM UI SAFE MARGIN             |
|                 (y = 0 .. 250)                    |
+---------------------------------------------------+ y = 250
|     2-TIER HEADLINE ZONE (Slam + Pill Banner)     |
|        Main Slam: y = 265 | Pill: y = 335         |
+---------------------------------------------------+ y = 380
|                                                   |
|          STAGE PROP & INFOGRAPHIC ZONE            |
|                 (y = 435 .. 700)                  |
|       Bank / SafeBox / Charts / Rule Cards        |
|                                                   |
+---------------------------------------------------+ y = 750
|         150px CLEAR BREATHING GAP + STAMPS        |
|                   (y = 845)                       |
+---------------------------------------------------+ y = 900
|                                           | R     |
|         CHARACTER STAGE (Arash & Sara)    | I     |
|           Head Labels: y ≈ 915            | G     |
|           Feet on Floor: y = 1220         | H     |
|           (x = 245 .. 760)                | T     |
+-------------------------------------------+       | y = 1220 (V_GROUND_Y)
| @handle watermark (left: 72, top: 1236, op: 0.25) | U     |
|     BURNED-IN SUBTITLES (bottom = 480)    | I     |
|             (y ≈ 1340 .. 1435)            |       |
+-------------------------------------------+-------+ y = 1450
|                                                   |
|       BOTTOM INSTAGRAM CAPTION & AUDIO UI         |
|               (y = 1450 .. 1920)                  |
+---------------------------------------------------+ y = 1920
```

---

## 3. Viral 9:16 Cover Design (`Covers.tsx`)

Every vertical Reel should include a dedicated `CoverReel` still composition (`1080×1920`) designed to survive all 3 Instagram crop ratios:
- **Full `9:16` (`1080×1920`)** Reels tab view
- **`4:5` (`1080×1350`)** Home feed preview
- **`3:4` (`1080×1440`)** Profile grid thumbnail

Keep the main Hook Card (`top: 375..640`) and the split `VS` character comparison (`y = 760..1380`) inside the central `y = 350..1460` window so nothing is clipped on the profile grid.
