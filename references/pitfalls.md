# ToonFlow (`v1.0.0`) — Production QA & Pitfalls Checklist

## 1. Character Kinematics & Poses (`stick.tsx`)
- **Forward-Positive Mirroring (`solve()`)**:
  - `solve()` automatically mirrors all horizontal limb coordinates by `facing` (`1` = right, `-1` = left).
  - Always use forward-positive poses (`P.pointR`, `P.aimR`, `P.kneelAim`, `P.punchR`, `P.hold`) for BOTH `facing={1}` and `facing={-1}`. Never negate arm angles manually for left-facing characters.
- **Wide V-Shape Arms on `P.cheer` and `P.shock`**:
  - Keep `P.cheer` (`la1: -125, la2: -5, ra1: 125, ra2: -10`) and `P.shock` (`la1: -115, la2: -5, ra1: 115, ra2: -5`) in a wide V-shape so any hand-held prop (`handProp="coin" | "cash" | "ice" | "phone_red"`) stays 50+ px clear of the character's head and face.
- **`walkCycle(f, speedOrSeed)` Knee Bend Direction**:
  - In `solve()`, upper-leg angles (`ll1, rl1`) and lower-leg knee bends (`ll2, rl2`) are relative to vertical (`0°` = straight down). Knees must always bend backward (`ll2 <= 0`, `rl2 <= 0`) to prevent reverse/bird-leg bending.
  - Passing a value `>= 0.8` as the second argument to `walkCycle(f, seed)` treats it as a phase-offset seed rather than frequency speed.

## 2. 9:16 Vertical Reels Safe-Zone Layout (`1080×1920`)
- **Never place characters on the 16:9 floor (`GROUND_Y = 852`) in a 9:16 video**:
  - In 9:16 vertical videos, placing characters at `y = 852` puts their head labels (`y ≈ 640`) right inside the central prop/card zone.
  - Always use `V_GROUND_Y = 1220` (`const GY = groundY(SCALE, V_GROUND_Y)`) for 9:16 Reels scenes.
- **Vertical Layer Separation (`1080×1920`)**:
  - Top UI Margin: `y = 0..250` (keep clear for Instagram/TikTok header UI).
  - 2-Tier Headline Zone: Primary `<Slam>` at `y = 265`, colored pill sub-banner `<Slam>` at `y = 335`.
  - Stage Prop / Card Zone: `y = 435..685` (150+ px above character head labels).
  - Character Stage Zone: `y = 915..1220` (`V_GROUND_Y = 1220`), `x = 245..760` (clear of right-hand `x = 960..1080` button rail).
  - Faint Watermark (`<ReelBadge>`): `left: 72, top: 1236, opacity: 0.25`.
  - Burned-in Subtitles (`<Captions>`): `bottom = 480` (`y ≈ 1340..1435`, safely above the bottom `35%` caption/audio drawer).

## 3. Linux Headless Chromium & Typography
- **Avoid Color Emojis in SVG/HTML Text**:
  - Headless Chromium on Linux servers often lacks color emoji fonts, rendering emojis (`🔥`, `💰`, `👈`) as empty `[]` tofu boxes.
  - Always use pure vector SVG props (`<SafeBox>`, `<InflationMeltIcon>`, etc.) or Unicode geometric symbols (`⟵`, `★`, `٪`).
- **Persian / Arabic RTL Ligatures**:
  - Never apply positive `letterSpacing` to Persian or Arabic text, as it disconnects cursive characters in Chromium. `fx.tsx` automatically sets `letterSpacing: 0` and `direction: "rtl"` via `isRTL()`.

## 4. Voiceover Sync & Audio Quality
- **Time-Domain Silence Trimming (`scripts/sync_elevenlabs.py`)**:
  - Never apply aggressive STFT spectral gating or pitch-shifting to neural TTS / ElevenLabs v3 recordings, as it introduces metallic robotic artifacts.
  - Use pure time-domain silence trimming with `15ms` cosine fade-in/out envelopes and lock `timeline.ts` cue frames directly to the speech segments.
