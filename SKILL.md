---
name: toonflow
version: 1.0.0
description: "Create studio-grade 2D comic stick-figure explainer videos, documentaries (16:9), and viral vertical Reels/Shorts (9:16) with Remotion from a prompt, script, subtitles (.srt), or YouTube link. Features two-pass colored-limb characters (male & complete female character systems), international RTL/LTR typography (English, Persian, Arabic, European), physical Slam/Drop titles, impact bursts, 25+ unified finance/history/documentary vector props, 4 full production example projects, procedural synthesized SFX & music, and frame-accurate voiceover sync."
---

# ToonFlow (`v1.0.0`)

**ToonFlow** turns any prompt, script, subtitle file (`.srt`), recorded voiceover, or YouTube transcript into a 2D comic stick-figure animated video rendered with Remotion, complete with procedural sound effects, chapter-aware music, and frame-accurate voiceover synchronization.

The bundled engine (`assets/engine/`, copied into the project as `src/stickman/`) provides two-pass colored-limb characters (male and female), physical text, camera shake, impact bursts, RTL/LTR international typography, and a unified library of 25+ vector props.

## Reference Guides & Production Examples

- `references/engine-api.md` — Complete API documentation for `stick.tsx`, `fx.tsx`, `common.tsx`, and `props.tsx`.
- `references/animation-style.md` — 9:16 Vertical Reels & 16:9 Documentary scene recipes, 2-tier headers, and visual metaphors.
- `references/voice-design-and-reels-guide.md` — ElevenLabs v3 Voice Design prompt & sliders, frame-accurate sync workflow, and 2026 Instagram Reels `1080×1920` Safe-Zone blueprint.
- `references/pitfalls.md` — Production QA checklist (forward-positive kinematics, wide V-shape arm poses, Linux Chromium emoji avoidance, RTL ligatures).
- `examples/` — 4 complete production projects (`01-bank-vs-gold-reel-9x16`, `02-fomo-market-trap-reel-9x16`, `03-iran-iraq-war-documentary-16x9`, `04-christopher-columbus-16x9`).

## 0. Settle the Brief

Use the user's language for scripts, on-screen text, and subtitles (`RTL` is automatically detected for Persian/Arabic).

- **Content source**: prompt/topic · script/text · `.srt` · YouTube URL / transcript.
- **Voiceover**: *none* · *recorded/generated with TTS* · *already recorded* (audio file).
- **Format**:
  - `16:9` (`1920×1080`, `GROUND_Y = 852`) for YouTube & documentaries.
  - `9:16` (`1080×1920`, `V_GROUND_Y = 1220`) for Instagram Reels, TikTok, and YouTube Shorts (respecting the 2026 Safe Zone: top `y = 265..335` for 2-tier `Slam` headlines, `y = 480..680` for stage props/cards, `y = 915..1220` for characters, and `bottom = 480` for burned-in captions).
- **Length**: typically `50–70s` for vertical Reels or `1.5–4 min` for horizontal explainers.

## 1. Find or Install Remotion

```bash
python3 scripts/find_remotion.py
python3 scripts/setup_project.py --dir <project>            # existing project
python3 scripts/setup_project.py --dir <folder> --create    # new project
python3 scripts/new_video.py --project <project> --slug <video-slug> [--size 1080x1920]
```

## 2. Content → Frame-Accurate Timeline

```bash
python3 scripts/parse_input.py --script script.md --out <project>/src/<slug> --wps 2.6
python3 scripts/parse_input.py --srt narration.srt --out <project>/src/<slug>
```

Writes `timeline.ts`, `timeline.json`, and `voiceover.srt`.

## 3. Build the Scenes (`S01..Sxx.tsx`)

- Read `references/engine-api.md`, `references/animation-style.md`, and `examples/`.
- Every scene returns `<Stage svg={...} html={...} hits={...} theme="default | wealth | danger | airraid | liberation | peace" />`.
- Use `<Actor keys={...} color={COL.blue} scale={1.48} face="happy | shock | sad | smirk | angry" handProp="cash | coin | ice | phone_red | phone_green" />` for male characters, and add `hat="ponytail"` for the complete female character design (with sculpted hair crown, parted bangs, S-curve ponytail, eyelashes, gold earring, and seamless two-pass A-line dress).
- Use 2-tier headers (`<Slam>` title + colored pill sub-banner), `<Stamp>`, `<Burst>`, `<Card>`, and vector props (`<Bank>`, `<SafeBox>`, `<SavingsBundleIcon>`, `<HouseProp>`, `<InflationMeltIcon>`, `<FomoTrapChartIcon>`, `<StepLadderIcon>`, etc.).

## 4. Visual QA via Contact Sheets

```bash
cd <project> && npx tsc --noEmit
node stickman-sheet.mjs <Composition> out/sheet.png 0-450:45
```

Inspect the rendered frames to verify zero overlap between titles, props, character name labels, and captions.

## 5. Audio Synthesis & Studio Voice Sync

```bash
python3 scripts/gen_audio.py --out <project>/public/<slug> --plan "intro:8,play:35,finale:10"
python3 scripts/sync_elevenlabs.py
```

## 6. Render Final MP4 & Covers

```bash
cd <project>
npx remotion render src/index.ts <Composition> out/<slug>.mp4 --codec=h264 --audio-codec=aac --audio-bitrate=192k
npx remotion still src/index.ts <CoverComposition> out/cover.png
```
