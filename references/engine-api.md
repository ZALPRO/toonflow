# ToonFlow (`v1.0.0`) — Complete Engine API Reference

Coordinates are in composition pixels:
- **Horizontal 16:9 (`1920×1080`)**: Ground floor is `GROUND_Y = 852`.
- **Vertical 9:16 (`1080×1920`)**: Ground floor is `V_GROUND_Y = 1220` (for covers: `COVER_GROUND = 1380`).
Everything is driven by `f = useCurrentFrame()` (local to the scene's `<Sequence>`).

---

## 1. `stick.tsx` — Two-Pass Comic Character Engine (Male & Female)

### Kinematics & Angles
- **Angles** (degrees): `dir(a) = (sin a, cos a)`, so `0°` = straight down, `+90°` = forward (`+facing`), `-90°` = backward (`-facing`), `180°` = straight up.
- **Forward-Positive Mirroring**: `solve(pose, scale, facing)` automatically multiplies X-coordinates by `facing` (`1` = facing right, `-1` = facing left). Always use forward-positive poses (`P.pointR`, `P.aimR`, `P.kneelAim`, `P.punchR`) and flip direction via `facing={1}` or `facing={-1}`.
- **Two-Pass Rendering**:
  - `PASS 1 (stOuter)`: Continuous `16 * scale` `#1a1a1a` comic ink outline across legs, torso, and arms.
  - `PASS 2 (stInner)`: Continuous `11 * scale` character `color` fill across legs, torso, and arms, eliminating all internal joint seams.
- **Ground Helper**:
  - `groundY(scale, floorY = GROUND_Y)`: Returns exact hip `y` so the character's feet rest on `floorY`.
  - For 16:9 scenes: `const GY = groundY(SCALE, GROUND_Y);`
  - For 9:16 Reels scenes: `const GY = groundY(SCALE, V_GROUND_Y);`

### Pose Presets (`P.*`)
Spread into keyframes (`{ f: 20, p: { ...P.cheer, x: 740, y: GY } }`):
- `P.stand`: Neutral standing pose.
- `P.armsUp`: Both arms raised high (`la1: -140, ra1: 140`).
- `P.cheer`: Wide celebratory V-shape (`la1: -125, la2: -5, ra1: 125, ra2: -10, head: -6`) — keeps held props in `rHand` completely clear of the head.
- `P.shock`: Wide startled recoil (`la1: -115, la2: -5, ra1: 115, ra2: -5, head: -10, lean: -8`).
- `P.pointR` / `P.pointL`: Pointing toward stage/props.
- `P.hold`: Holding an item forward (`la1: -28, la2: -6, ra1: 45, ra2: 50`).
- `P.think`: Hand to chin (`ra1: 35, ra2: 125, head: 8`).
- `P.sad`: Slumped shoulders and bowed head (`lean: 12, head: 22`).
- `P.shrug`, `P.facepalm`, `P.handshake`, `P.salute`, `P.crouch`, `P.sit`, `P.punchR`, `P.kickR`, `P.carry`, `P.run`, `P.push`, `P.aimR`, `P.kneelAim`, `P.dead`.

### `<Actor />` Component Props
```tsx
<Actor
  f={f}
  keys={keys}
  color={COL.blue}
  scale={1.48}
  facing={1}
  hat="none" // or accessory="..."
  face={(t) => (t < bCue2 ? "happy" : "shock")}
  handProp={(t) => (t < bCue2 ? "cash" : "coin")}
  label="آرش"
  extra={idle(f, 1)}
/>
```
- **`hat` / `accessory`**:
  - `"none"`: Pure two-pass comic character (default male character).
  - `"ponytail"`: **Complete Female Character System** — includes sculpted espresso-brown front hair crown, parted bangs, temple side-lock, gold stud earring, S-curve flowing ponytail with golden scrunchie, feminine cartoon eyelashes, pupil catchlights, subtle rosy cheek blush, and a **seamless two-pass A-line comic dress/skirt** with an unbroken golden waist belt.
  - Historical & Role Accessories: `"crown"`, `"admiral"`, `"cap"`, `"scholar"`, `"bandana"`, `"feathers"`, `"glasses"`, `"scarf"`, `"tophat"`.
  - Military & Documentary Accessories: `"helmet_ir"`, `"helmet_iq"`, `"beret"`, `"pilot"`, `"un_helmet"`, `"keffiyeh"`.
- **`face` (`FaceExpr` or `(f: number) => FaceExpr`)**:
  - `"eyes"` | `"neutral"` | `"think"` | `"happy"` | `"sad"` | `"shock"` | `"smirk"` | `"confident"` | `"angry"` | `"dead"` | `"none"`.
- **`handProp` (`HandPropType` or `(f: number) => HandPropType`)**:
  - `"none"` | `"cash"` | `"coin"` | `"ice"` | `"phone_red"` | `"phone_green"`.
- **Procedural Motion Helpers**:
  - `idle(f, seed)`: Subtle breathing & arm sway.
  - `walkCycle(f, speedOrSeed, amp)`: Natural walking stride (note: `<Actor>` also automatically blends `walkCycle` whenever horizontal ground velocity `vx > 0.35`).
  - `runCycle(f, speed, amp)`: High-energy running stride.

---

## 2. `fx.tsx` — Typography, Paper Stage Themes, Slams & Bursts

### Palette (`COL`) & Fonts (`FONT`)
- `COL`: `paper (#fafaf7)`, `ink (#1a1a1a)`, `orange (#ff5c1a)`, `blue (#2b7de9)`, `green (#2fa84f)`, `red (#e5322d)`, `yellow (#ffd21e)`, `purple (#8a3ffc)`, `grey (#7a766e)`, `dollar (#3a8f4c)`, `gold (#f2b705)`.
- `FONT`:
  - `FONT.comic`: `'Lalezar', Bangers, sans-serif`
  - `FONT.title`: `'Vazirmatn', Barlow Condensed, sans-serif`
  - `FONT.body`: `'Vazirmatn', Inter, sans-serif`
  - `FONT.mono`: `'JetBrains Mono', 'Vazirmatn', monospace`
- `isRTL(text)`: Automatically detects Persian/Arabic/Hebrew script and applies `direction: "rtl"` and zero letter-spacing so cursive ligatures never break.

### Visual Effects & Text Components
- **`<Paper theme="..." ground={...} />`**:
  - Warm parchment background with soft horizon hills (`#ebe7dc`) and ground plane (`#e5e0d2`).
  - Themes: `"default"` | `"wealth"` | `"danger"` | `"airraid"` | `"liberation"` | `"gulf"` | `"peace"`.
- **`<Slam f at out x y size color font weight>`**:
  - Slams headline text onto screen with elastic overshoot.
  - **2-Tier Header Pattern**: Pair a primary `<Slam y={265} size={50}>` with a secondary `<Slam y={335} size={26}>` wrapping a colored pill `<span style={{ background: COL.ink, padding: "6px 22px", borderRadius: 12 }}>`.
- **`<Burst x y at f size color n>`**: Comic impact starburst.
- **`<Dust x y at f spread>`**: Landing dust clouds on the ground.
- **`<Wipe f dur>`**: Scene transition wipe.
- **`countUp(f, a, b, to, from)` & `fmt(n)`**: Animated number counter and thousands formatter.

---

## 3. `common.tsx` — Stage, Cards, Stamps, Captions & Watermarks

- **`<Stage hits power theme svg html cam />`**:
  - Combines `<Paper>`, camera shake (`hits`), SVG world layer, and HTML overlay layer.
- **`<Card f at out x y w n accent size>`**:
  - Numbered comic takeaway card (`n="۱"`, `n="۲"`, etc.) with hard `#1a1a1a` offset shadow.
- **`<Stamp f at x y text color size r>`**:
  - Angled rubber stamp badge with comic slam animation.
- **`<WordBlock x y r text bg color size s>`**:
  - SVG callout box with hard comic drop shadow.
- **`<Captions cues bottom size />`**:
  - Burned-in subtitles in a dark charcoal rounded box (`#333333`); defaults to `bottom = 480` on 9:16 vertical Reels and `bottom = 24` on 16:9 horizontal videos.
- **`<ReelBadge handle="@..." />`**:
  - Subtle, low-opacity (`opacity: 0.25`) channel watermark positioned safely at `left: 72, top: 1236`.
- **`<TitleCard>`, `<ChapterCard>`, `<EndCard>`, `<StatBar>`**:
  - Documentary title cards, chapter dividers, horizontal animated stat bars, and end credits.

---

## 4. `props.tsx` & `fomo-props.tsx` — Vector Prop Library

Position any prop with `<At x={...} y={...} s={...} r={...}>`:
- **Finance & Real Assets**:
  - `<SavingsBundleIcon amount="..." />`: Stacked banknotes with gold band.
  - `<Bank label="..." color="#e3f2fd" />`: Classical marble-column bank building.
  - `<SafeBox label="..." />`: Gleaming gold bullion bar and stacked gold coins on a vault tray.
  - `<HouseProp label="..." />`: 3-story modern apartment building with cypress trees.
  - `<InflationMeltIcon f={f} melt={iceMelt} />`: Animated melting ice cube holding cash over inflation flames.
  - `<FomoTrapChartIcon />`: Green pump / red crash chart with danger peak marker.
  - `<BreakingHypeIcon />`: Breaking news FOMO hype banner.
  - `<BubbleMeterIcon />`: Market emotion bubble gauge.
  - `<StepLadderIcon />`: 3-step staircase DCA buying chart (`30% - 30% - 40%`).
  - `<Bill />`, `<GoldBar />`, `<Coin />`, `<Printer f={f} />`, `<CarProp />`.
- **History & Age of Discovery**:
  - `<Ship name="..." />`, `<ScrollMap />`, `<Spyglass />`, `<Cutlass />`, `<Logbook />`.
- **Documentary & Military**:
  - `<Tank />`, `<FighterJet />`, `<Bunker />`, `<MosqueDome />`, `<RadarTower f={f} />`, `<PeaceDove f={f} />`, `<Podium />`, `<OilRig f={f} />`, `<Explosion f={f} at={...} />`, `<Missile />`, `<Shield />`, `<Flag />`.
