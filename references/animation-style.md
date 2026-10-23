# ToonFlow (`v1.0.0`) — Animation Style, Visual Metaphors & Scene Recipes

The goal of **ToonFlow (`v1.0.0`)** is broadcast-grade 2D comic stick-figure animation: two-pass colored characters with weight and personality, physical typography that slams onto the stage, warm parchment environments with distant horizon hills, and one clear visual metaphor per narration cue.

---

## 1. Core Animation Principles

1. **Two-Pass Comic Silhouette (`#1a1a1a` Outer + Colored Inner)**:
   - Every character (`<Actor>`) is drawn with a `16px` `#1a1a1a` outer stroke and an `11px` vibrant inner color stroke (`COL.blue`, `COL.purple`, `COL.green`, `COL.red`, `COL.orange`) with zero internal joint seams.
   - Male characters use `hat="none"` (or role-specific hats like `"crown"`, `"admiral"`, `"helmet_ir"`, `"beret"`).
   - Female characters use `hat="ponytail"`, activating the complete female design (sculpted hair crown, parted bangs, temple side-lock, gold stud earring, S-curve ponytail with golden scrunchie, feminine eyelashes, rosy cheeks, and seamless two-pass A-line comic dress with golden belt).
2. **2-Tier Header System (Main `<Slam>` + Colored Pill Sub-Banner)**:
   - Anchor the top of every scene with a primary `<Slam>` headline (`size={48..54}`) paired 4 frames later with a secondary `<Slam>` (`size={26}`) wrapping a colored pill `<span style={{ background: COL.ink, padding: "6px 22px", borderRadius: 12 }}>`.
3. **Snap, Hold, React**:
   - Moves take `7–16` frames (`SNAP` or `SMOOTH` easing), then hold the pose while `idle(f, seed)` keeps the character breathing.
   - Pair every key reveal with a `<Burst>` starburst on the prop, a camera shake frame in `Stage hits={[...]}`, and an angled `<Stamp>` badge for the verdict.
4. **Warm Parchment Stage (`<Paper>`)**:
   - Use thematic parchment backgrounds (`theme="default" | "wealth" | "danger" | "airraid" | "liberation" | "gulf" | "peace"`) featuring a radial warm gradient, soft distant horizon hills (`#ebe7dc`), and a grounded floor plane (`#e5e0d2`).

---

## 2. Turning Abstract Ideas into Visual Metaphors

| Concept | ToonFlow Visual Metaphor |
|---|---|
| Initial capital / savings | `<SavingsBundleIcon>` stacked banknotes with gold band + `handProp="cash"` |
| Bank deposit vs Gold | `<Bank>` marble facade on left vs `<SafeBox>` gold coins & bullion on right |
| Real purchasing power | `<HouseProp>` 3-story apartment building + `<Burst color={COL.green}>` |
| Inflation eroding money | `<InflationMeltIcon>` cash frozen inside an ice block melting over flames + `handProp="ice"` |
| Buying at market peak (FOMO) | `<FomoTrapChartIcon>` green pump to red peak dot + steep red crash + `handProp="phone_red"` |
| Media hype / buying queue | `<BreakingHypeIcon>` breaking news banner + `<BubbleMeterIcon>` red danger gauge |
| Smart DCA / step buying | `<StepLadderIcon>` 3-step staircase (`30% - 30% - 40%`) + `handProp="coin"` |
| Historical exploration | `<Ship>` caravels on waves + `<ScrollMap>` + `<Spyglass>` |
| Military / Geopolitics | `<Tank>`, `<FighterJet>`, `<Bunker>`, `<RadarTower>`, `<MosqueDome>`, `<PeaceDove>` |
| Key rules / takeaways | Numbered `<Card n="۱" accent={COL.orange}>` & `<Card n="۲" accent={COL.green}>` + CTA pill |

---

## 3. Proven Scene Recipes

### A. 9:16 Vertical Reels & Shorts Recipes (`1080×1920`, `V_GROUND_Y = 1220`)

1. **`S01` — Two-Character Hook & Comparison (`Cues 0–2`, ~15–20s)**
   - **Stage**: Male character (`آرش`, `COL.blue`, `x = 275`, `facing = 1`) and Female character (`سارا`, `COL.purple`, `hat = "ponytail"`, `x = 755`, `facing = -1`) walk in from the edges onto `GY = groundY(1.48, 1220)`.
   - **Upper Prop Zone (`y = 535..540`)**: Cue 0 shows initial capital (`<SavingsBundleIcon>`); Cue 1 splits into left choice (`<Bank x={285}>`) vs right choice (`<SafeBox x={745}>`) as Sara jumps in `P.cheer`; Cue 2 shows real asset benchmark (`<HouseProp x={520}>`).
2. **`S02` — The Trap / Crash Reveal (`Cues 3–4`, ~10–12s)**
   - **Stage**: Switch `theme="danger"` on the crash cue. Character recoils in `P.shock` (`y = GY - 20` jump) and settles into `P.sad` holding `handProp="ice"` or `"phone_red"`.
   - **Prop & Stamp**: Show `<InflationMeltIcon>` or `<FomoTrapChartIcon>` at `y = 540`, and slam an angled red `<Stamp x={685} y={845} text="..." color={COL.red} r={-4} />`.
3. **`S03` — The Winning Strategy / Gold Shield (`Cue 5`, ~6–15s)**
   - **Stage**: `theme="wealth"`. Sara (`hat="ponytail"`, `handProp="coin"`) points at `<StepLadderIcon>` or `<SafeBox>` (`countUp` to final value) and celebrates in `P.cheer` with a green `<Stamp x={385} y={845} color={COL.green} r={-4} />`.
4. **`S04` — Golden Rules & Follow CTA (`Cues 6–7`, ~12–15s)**
   - **Stage**: Both characters on stage (`x = 285` and `x = 745`, holding gold coins) while `<Card n="۱" y={485}>` and `<Card n="۲" y={435}>` pop in above them, followed by the rounded blue Follow CTA pill at `y = 685`.

### B. 16:9 Horizontal YouTube & Documentary Recipes (`1920×1080`, `GROUND_Y = 852`)

1. **Cold Open / Invasion or Voyage Launch (`S01`)**: Multi-actor stage (`x = 260..1620`) with architectural/historical props on `GY = 852`, 2-tier `<Slam>` header at `y = 85..160`, and angled `<Stamp>` at `y = 260`.
2. **Data & Statistics Beat**: `<StatBar>` horizontal animated bars (`x = 260, y = 260..580, w = 920`) with characters reacting on the right (`x = 1480`).
3. **Legacy & Lessons (`S05`)**: Three stacked `<Card n="۱..۳">` on the right/center with characters on stage and an `<EndCard>` finale.

---

## 4. Sound Design (`scripts/gen_audio.py`)

Every visible beat gets a frame-locked sound cue in `Sxx_SFX`:
- Character walk-ins / transitions → `"whoosh"` (`0.4–0.6`)
- Cards / badges appearing → `"pop"` (`0.6–0.7`)
- Heavy landings / stamps → `"thud"` or `"slam"` (`0.7–0.9`)
- Explosions / crashes → `"impact"` or `"shatter"` (`0.8–1.0`)
- Wealth / gold reveals → `"kaching"` or `"coin"` (`0.7–0.9`)
- Freeze / inflation trap → `"freeze"` (`0.7`)
