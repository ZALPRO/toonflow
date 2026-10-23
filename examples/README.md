# ToonFlow (`v1.0.0`) — Complete Production Examples

This directory contains **5 full, broadcast-verified production projects** built with **ToonFlow (`v1.0.0`)**, covering both **16:9 Horizontal YouTube / Documentary Explainers (`1920×1080`)** and **9:16 Vertical Instagram Reels / TikTok / YouTube Shorts (`1080×1920`)**.

---

## 0. `00-english-wealth-explainer-16x9/` — Flagship English Financial Explainer (`1920×1080`)
- **Topic**: *The $10,000 Inflation Test: Bank Savings vs. Gold & Real Assets*
- **Format**: `1920×1080` (`16:9` Horizontal), `30fps`, `1589` frames (`52.97s`)
- **Characters**: **Alex** (`COL.blue`, male character) & **Maya** (`COL.purple`, `hat="ponytail"`, complete two-pass female design)
- **Rendered Video**: Included in [`docs/media/toonflow-showcase-en.mp4`](../docs/media/toonflow-showcase-en.mp4) and [`docs/media/toonflow-showcase.gif`](../docs/media/toonflow-showcase.gif).
- **Files**: `Video.tsx`, `S01TenThousandTest.tsx`, `S02SilentInflationTax.tsx`, `S03FomoVsSmartDCA.tsx`, `S04ThreeWealthRules.tsx`, `timeline.ts`, `cues.ts`, `sfx.ts`, `voiceover.srt`.

---

## 1. `01-bank-vs-gold-reel-9x16/` — Financial Inflation Reel (`1080×1920`)
- **Topic**: Bank Deposit vs. Gold & Real Assets During Inflation (*«داستان دو نفر در تورم: پس‌انداز بانکی در برابر طلا و دارایی!»*)
- **Format**: `1080×1920` (`9:16` Vertical), `30fps`, `1576` frames (`52.53s`)
- **Characters**: **Arash (`آرش`)** (`COL.blue`, male) & **Sara (`سارا`)** (`COL.purple`, `hat="ponytail"`, complete two-pass female design)
- **Files**:
  - `Video.tsx` — Master 4-scene composition with continuous voiceover, procedural SFX, faint `<ReelBadge handle="@ghimatrooz" />`, and `<Captions bottom={480}>`
  - `S01_TwoFriends.tsx`, `S02_ArashBankTrap.tsx`, `S03_SaraGoldShield.tsx`, `S04_ThreeLessons.tsx`
  - `timeline.ts` & `cues.ts` — 8 frame-locked ElevenLabs v3 speech cues

---

## 2. `02-fomo-market-trap-reel-9x16/` — Market Psychology & FOMO Reel + Covers (`1080×1920`)
- **Topic**: The FOMO Peak Buying Trap vs. Step-by-Step DCA Buying (*«تله خرید در اوج هیجان: کی بخریم که در حباب بازار گیر نکنیم؟!»*)
- **Format**: `1080×1920` (`9:16` Vertical), `30fps`, `2078` frames (`69.27s`)
- **Characters**: **Arash (`آرش`)** (`COL.blue`, holding `handProp="phone_red"`) & **Sara (`سارا`)** (`COL.purple`, `hat="ponytail"`, holding `handProp="coin"`)
- **Files**:
  - `Video.tsx`, `S01_MarketHype.tsx`, `S02_ArashPeakTrap.tsx`, `S03_SaraStepSmart.tsx`, `S04_GoldenRules.tsx`
  - `FomoProps.tsx` (`FomoTrapChartIcon`, `BreakingHypeIcon`, `BubbleMeterIcon`, `StepLadderIcon` — also built directly into `assets/engine/props.tsx`)
  - `Covers.tsx` — Standalone `CoverReel1` and `CoverReel2` (`1080×1920`) thumbnail compositions safe across `9:16`, `4:5`, and `3:4` Instagram grid crops

---

## 3. `03-iran-iraq-war-documentary-16x9/` — Historical Documentary (`1920×1080`)
- **Topic**: 8-Year Iran-Iraq War Documentary Explainer (1980–1988)
- **Format**: `1920×1080` (`16:9` Horizontal), `30fps`, `2584` frames (`86.13s`)
- **Highlights**:
  - Uses thematic `<Paper theme="airraid" | "liberation" | "gulf" | "peace" />` backgrounds
  - Military & historical props (`<Tank>`, `<FighterJet>`, `<MosqueDome>`, `<Bunker>`, `<RadarTower>`, `<OilDerrick>`, `<PeaceDove>`, `< Explosion >`)
  - Soldier/Commander accessories (`hat="helmet_ir"`, `"beret"`, `prop="rifle"`, `"binoculars"`, `"flag_ir"`)
  - Animated `<StatBar>` human & economic cost comparisons

---

## 4. `04-christopher-columbus-16x9/` — Biographical & Historical Explainer (`1920×1080`)
- **Topic**: The Story & 1492 Voyage of Christopher Columbus
- **Format**: `1920×1080` (`16:9` Horizontal), `30fps`, `2489` frames (`82.98s`)
- **Highlights**:
  - Maritime props (`<Ship>` caravels on animated waves, `<Globe>`, `<ScrollMap>`, `<Spyglass>`, `<Compass>`, `<TreasureChest>`, `<Pillar>`)
  - Royal court & exploration characters (`hat="admiral"`, `"crown"`, `"captain"`, `"sailor"`, `"scholar"`)
