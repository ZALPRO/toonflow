import React from "react";
import { Easing, interpolate } from "remotion";

// Stick-figure animation engine (ToonFlow v1.0.0 — Two-Pass Comic Character Engine + Vertical 9:16 Reels Support):
// 1. Grounded contact shadow under every character (scales with jump height)
// 2. Seamless two-pass comic outline (outer ink pass + inner color pass, zero joint seams — colored arms, legs & torso!)
// 3. Head with ink outline, top-left specular arc highlight, side-oriented oval cartoon eyes, eyebrows & automatic blinking
// 4. Smart poseAt: caps transition duration (default 9f snap, 26f smooth move) so characters NEVER drift in slow-motion
// 5. Automatic velocity-based walk-cycle blending when moving horizontally

export type Pose = {
  x: number; // hip position
  y: number;
  lean: number; // torso lean (>0 leans forward in facing direction)
  head: number; // head tilt
  la1: number; // back upper arm (shoulder)
  la2: number; // back forearm (elbow, relative to la1)
  ra1: number; // front upper arm (shoulder)
  ra2: number; // front forearm (elbow, relative to ra1)
  ll1: number; // left thigh (hip)
  ll2: number; // left shin (knee, relative to ll1)
  rl1: number; // right thigh (hip)
  rl2: number; // right shin (knee, relative to rl1)
  rot: number; // whole-body rotation around the hip (flips, falls)
};

export const GROUND_Y = 852;
export const V_GROUND_Y = 1220;
export const groundY = (s = 1, ground = GROUND_Y) => ground - 92.5 * s;

export const STAND: Pose = {
  x: 960,
  y: 760,
  lean: 0,
  head: 0,
  la1: -18,
  la2: 8,
  ra1: 18,
  ra2: -8,
  ll1: -12,
  ll2: -2,
  rl1: 12,
  rl2: -2,
  rot: 0,
};

const BODY_DEFAULT = {
  lean: 0,
  head: 0,
  la1: -18,
  la2: 8,
  ra1: 18,
  ra2: -8,
  ll1: -12,
  ll2: -2,
  rl1: 12,
  rl2: -2,
};

export const P = {
  stand: { ...BODY_DEFAULT },
  armsUp: { ...BODY_DEFAULT, la1: -140, la2: -5, ra1: 140, ra2: -5 },
  cheer: { ...BODY_DEFAULT, la1: -125, la2: -5, ra1: 125, ra2: -10, head: -6 },
  pointR: { ...BODY_DEFAULT, ra1: 85, ra2: 10, la1: -18, la2: 8 },
  pointL: { ...BODY_DEFAULT, la1: -85, la2: -10, ra1: 18, ra2: -8 },
  shrug: { ...BODY_DEFAULT, la1: -35, la2: -85, ra1: 35, ra2: 85, head: 6 },
  think: { ...BODY_DEFAULT, la1: -18, la2: 8, ra1: 35, ra2: 125, head: 8 },
  crouch: { ...BODY_DEFAULT, y: 780, ll1: 18, ll2: -62, rl1: 48, rl2: -58, lean: 14, la1: -28, la2: 52, ra1: 36, ra2: 52 },
  punchR: { ...BODY_DEFAULT, lean: 14, ra1: 90, ra2: 0, la1: -50, la2: 110, ll1: -24, ll2: -8, rl1: 30, rl2: -16 },
  kickR: { ...BODY_DEFAULT, lean: -24, rl1: 100, rl2: 0, ll1: -10, ll2: -4, la1: -70, la2: -20, ra1: 40, ra2: 40 },
  carry: { ...BODY_DEFAULT, la1: -150, la2: -25, ra1: 150, ra2: 25, lean: 0, ll1: -14, ll2: -6, rl1: 14, rl2: -6 },
  hold: { ...BODY_DEFAULT, la1: -28, la2: -6, ra1: 45, ra2: 50 },
  facepalm: { ...BODY_DEFAULT, la1: -18, la2: 8, ra1: 45, ra2: 115, head: 16, lean: 6 },
  sit: { ...BODY_DEFAULT, y: 800, ll1: 80, ll2: -80, rl1: 92, rl2: -85, lean: -5 },
  handshake: { ...BODY_DEFAULT, ra1: 55, ra2: 30, la1: -18, la2: 8 },
  sad: { ...BODY_DEFAULT, lean: 12, head: 22, la1: -8, la2: 4, ra1: 8, ra2: -4 },
  shock: { ...BODY_DEFAULT, la1: -115, la2: -5, ra1: 115, ra2: -5, head: -10, lean: -8 },
  salute: { ...BODY_DEFAULT, ra1: 118, ra2: 72, la1: -14, la2: 6 },
  aimR: { ...BODY_DEFAULT, lean: 6, la1: 22, la2: 96, ra1: 62, ra2: 38, ll1: -18, ll2: -4, rl1: 20, rl2: -8 },
  aimL: { ...BODY_DEFAULT, lean: 6, la1: 22, la2: 96, ra1: 62, ra2: 38, ll1: -18, ll2: -4, rl1: 20, rl2: -8 },
  kneelAim: { ...BODY_DEFAULT, y: 778, lean: 8, ll1: -14, ll2: -68, rl1: 50, rl2: -56, la1: 22, la2: 96, ra1: 62, ra2: 38 },
  run: { ...BODY_DEFAULT, lean: 14, la1: -45, la2: 55, ra1: 45, ra2: 55, ll1: -32, ll2: -18, rl1: 28, rl2: -12 },
  push: { ...BODY_DEFAULT, lean: 20, la1: 65, la2: 15, ra1: 75, ra2: 15, ll1: -25, ll2: -15, rl1: 30, rl2: -20 },
  dead: { ...BODY_DEFAULT, rot: 88, la1: -35, la2: 10, ra1: 35, ra2: -10 },
} satisfies Record<string, Partial<Pose>>;

const rad = (d: number) => (d * Math.PI) / 180;
const dir = (a: number) => [Math.sin(rad(a)), Math.cos(rad(a))] as const;

export type Joints = {
  hip: [number, number];
  shoulder: [number, number];
  neck: [number, number];
  headC: [number, number];
  lElbow: [number, number];
  lHand: [number, number];
  rElbow: [number, number];
  rHand: [number, number];
  lKnee: [number, number];
  lFoot: [number, number];
  rKnee: [number, number];
  rFoot: [number, number];
  headR: number;
};

export const solve = (p: Pose, s = 1, facing = 1): Joints => {
  const T = 76 * s,
    SH_H = 64 * s,
    UA = 36 * s,
    FA = 34 * s,
    TH = 48 * s,
    SH = 46 * s,
    R = 24 * s;

  const body = -p.lean;
  const up = dir(180 - p.lean);
  const neck = [up[0] * T, up[1] * T];
  const sh = [up[0] * SH_H, up[1] * SH_H];
  const hd = dir(180 - p.lean + p.head);
  const headC = [neck[0] + hd[0] * (R + 3 * s), neck[1] + hd[1] * (R + 3 * s)];

  const limb = (o: number[], a1: number, a2: number, L1: number, L2: number, ref = body) => {
    const d1 = dir(ref + a1);
    const e = [o[0] + d1[0] * L1, o[1] + d1[1] * L1];
    const d2 = dir(ref + a1 + a2);
    return [e, [e[0] + d2[0] * L2, e[1] + d2[1] * L2]];
  };

  const [lE, lH] = limb(sh, p.la1, p.la2, UA, FA);
  const [rE, rH] = limb(sh, p.ra1, p.ra2, UA, FA);
  const [lK, lF] = limb([0, 0], p.ll1, p.ll2, TH, SH, 0);
  const [rK, rF] = limb([0, 0], p.rl1, p.rl2, TH, SH, 0);

  const c = Math.cos(rad(p.rot)),
    sn = Math.sin(rad(p.rot));
  const xr = [c, sn],
    yr = [-sn, c];
  const rawTr = (v: number[]): [number, number] => [
    p.x + xr[0] * (v[0] * facing) + yr[0] * v[1],
    p.y + xr[1] * (v[0] * facing) + yr[1] * v[1],
  ];

  // Active floor detection (works for 16:9 at 852, 9:16 Reels at 1220, and Covers at 1380!)
  const activeFloor = p.y > 1180 ? 1380 : p.y > 950 ? V_GROUND_Y : GROUND_Y;
  const rawLF = rawTr(lF);
  const rawRF = rawTr(rF);
  const maxFootY = Math.max(rawLF[1], rawRF[1]);
  const groundLift =
    Math.abs(p.rot) < 5 && p.y >= activeFloor - 125 * s && maxFootY > activeFloor && maxFootY < activeFloor + 32 * s
      ? maxFootY - activeFloor
      : 0;

  const tr = (v: number[]): [number, number] => {
    const pt = rawTr(v);
    return [pt[0], pt[1] - groundLift];
  };

  return {
    hip: tr([0, 0]),
    shoulder: tr(sh),
    neck: tr(neck),
    headC: tr(headC),
    lElbow: tr(lE),
    lHand: tr(lH),
    rElbow: tr(rE),
    rHand: tr(rH),
    lKnee: tr(lK),
    lFoot: tr(lF),
    rKnee: tr(rK),
    rFoot: tr(rF),
    headR: R,
  };
};

export type Accessory =
  | "tie"
  | "ponytail"
  | "scarf"
  | "tophat"
  | "crown"
  | "cap"
  | "admiral"
  | "scholar"
  | "bandana"
  | "feathers"
  | "glasses"
  | "helmet_ir"
  | "helmet_iq"
  | "beret"
  | "pilot"
  | "un_helmet"
  | "keffiyeh"
  | "none";

export type HatType = Accessory;
export type FaceExpr = "none" | "eyes" | "neutral" | "angry" | "sad" | "happy" | "shock" | "smirk" | "think" | "confident" | "dead";
export type Face = FaceExpr;
export type HandPropType = "none" | "cash" | "coin" | "phone_red" | "phone_green" | "ice";

const pts = (...a: [number, number][]) => a.map((v) => v.join(",")).join(" ");

export const Figure: React.FC<{
  pose: Pose;
  color: string;
  scale?: number;
  facing?: number;
  accessory?: Accessory;
  opacity?: number;
  face?: FaceExpr;
  blink?: boolean;
  label?: string;
  labelColor?: string;
  draw?: number;
  isGhost?: boolean;
  children?: (j: Joints) => React.ReactNode;
  behind?: (j: Joints) => React.ReactNode;
}> = ({
  pose,
  color,
  scale = 1,
  facing = 1,
  accessory = "none",
  opacity = 1,
  face = "eyes",
  blink = false,
  label,
  labelColor,
  draw = 1,
  isGhost = false,
  children,
  behind,
}) => {
  const j = solve(pose, scale, facing);
  const wInner = 11 * scale;
  const wOuter = 16 * scale;
  const ink = "#1a1a1a";

  const stOuter = {
    stroke: ink,
    strokeWidth: wOuter,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  const stInner = {
    stroke: color,
    strokeWidth: wInner,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };

  const R = j.headR;
  const [hx, hy] = j.headC;
  const seg = (a: number, b: number) => Math.max(0, Math.min(1, (draw - a) / (b - a)));
  const dash = (t: number) =>
    draw >= 1 ? {} : { pathLength: 1, strokeDasharray: `${t} 2`, opacity: t > 0 ? 1 : 0 };
  const dHead = seg(0, 0.3),
    dTorso = seg(0.3, 0.45),
    dArms = seg(0.45, 0.72),
    dLegs = seg(0.72, 1);

  const ux = (hx - j.neck[0]) / (R + 3 * scale);
  const uy = (hy - j.neck[1]) / (R + 3 * scale);
  const ang = (Math.atan2(uy, ux) * 180) / Math.PI + 90;

  const topOffset =
    accessory === "tophat"
      ? 56
      : accessory === "admiral" ||
          accessory === "cap" ||
          accessory === "feathers" ||
          accessory === "helmet_ir" ||
          accessory === "helmet_iq" ||
          accessory === "beret" ||
          accessory === "pilot" ||
          accessory === "un_helmet"
        ? 46
        : accessory === "scarf" || accessory === "crown"
          ? 42
          : accessory === "ponytail"
            ? 30
            : 22;

  const activeFloor = pose.y > 1180 ? 1380 : pose.y > 950 ? V_GROUND_Y : GROUND_Y;
  const lowestFootY = Math.max(j.lFoot[1], j.rFoot[1]);
  const airGap = Math.max(0, activeFloor - lowestFootY);
  const shadowScale = Math.max(0.25, 1 - airGap / 220) * scale;

  const effFace = face === "neutral" || face === "think" ? "eyes" : face === "confident" ? "smirk" : face;

  return (
    <g opacity={opacity}>
      {/* Ground Contact Shadow */}
      {!isGhost && draw >= 1 && lowestFootY <= activeFloor + 45 && (
        <ellipse
          cx={pose.x}
          cy={Math.max(activeFloor, lowestFootY + 2)}
          rx={34 * shadowScale}
          ry={7 * shadowScale}
          fill="rgba(0,0,0,0.16)"
        />
      )}

      {behind?.(j)}

      {/* Royal cape behind torso from shoulders */}
      {!isGhost && accessory === "crown" && draw >= 1 && (
        <path
          d={`M${j.shoulder[0]},${j.shoulder[1]} Q${j.hip[0] - facing * 42 * scale},${j.hip[1] - 10 * scale} ${j.hip[0] - facing * 52 * scale},${j.hip[1] + 50 * scale} L${j.hip[0] - facing * 12 * scale},${j.hip[1] + 38 * scale} Z`}
          fill="#d6263b"
          stroke={ink}
          strokeWidth={3.8 * scale}
          strokeLinejoin="round"
        />
      )}

      {/* PASS 1A: Legs, Back Arm & Torso Outer Ink Outline */}
      {!isGhost && (
        <>
          <polyline points={pts(j.lFoot, j.lKnee, j.hip, j.rKnee, j.rFoot)} {...stOuter} {...dash(dLegs)} />
          <polyline points={pts(j.lHand, j.lElbow, j.shoulder)} {...stOuter} {...dash(dArms)} />
          <line x1={j.neck[0]} y1={j.neck[1]} x2={j.hip[0]} y2={j.hip[1]} {...stOuter} {...dash(dTorso)} />
        </>
      )}

      {/* PASS 2A: Legs, Back Arm & Torso Inner Color Fill */}
      <polyline points={pts(j.lFoot, j.lKnee, j.hip, j.rKnee, j.rFoot)} {...stInner} {...dash(dLegs)} />
      <polyline points={pts(j.lHand, j.lElbow, j.shoulder)} {...stInner} {...dash(dArms)} />
      <line x1={j.neck[0]} y1={j.neck[1]} x2={j.hip[0]} y2={j.hip[1]} {...stInner} {...dash(dTorso)} />

      {/* Seamless Two-Pass Female A-Line Dress / Skirt Tunic (for Sara / ponytail) */}
      {!isGhost && accessory === "ponytail" && draw >= 1 && (() => {
        const tx = j.hip[0] - j.shoulder[0];
        const ty = j.hip[1] - j.shoulder[1];
        const tLen = Math.hypot(tx, ty) || 1;
        const ux = tx / tLen;
        const uy = ty / tLen;
        const nx = -uy;
        const ny = ux;
        // Waist point (44% down from shoulder to hip) & Hem center (11*scale below hip)
        const wx = j.shoulder[0] + ux * tLen * 0.44;
        const wy = j.shoulder[1] + uy * tLen * 0.44;
        const hxHem = j.hip[0] + ux * 11 * scale;
        const hyHem = j.hip[1] + uy * 11 * scale;
        const wTop = 5.6 * scale;
        const wBot = 19.5 * scale;
        const p1x = wx - nx * wTop;
        const p1y = wy - ny * wTop;
        const p2x = wx + nx * wTop;
        const p2y = wy + ny * wTop;
        const p3x = hxHem + nx * wBot;
        const p3y = hyHem + ny * wBot;
        const p4x = hxHem - nx * wBot;
        const p4y = hyHem - ny * wBot;
        const midHemX = hxHem + ux * 3 * scale;
        const midHemY = hyHem + uy * 3 * scale;
        const skirtPath = `M${p1x},${p1y} L${p2x},${p2y} L${p3x},${p3y} Q${midHemX},${midHemY} ${p4x},${p4y} Z`;
        return (
          <g>
            {/* PASS 1 Skirt Outer Ink Silhouette */}
            <path
              d={skirtPath}
              fill={ink}
              stroke={ink}
              strokeWidth={7 * scale}
              strokeLinejoin="round"
            />
            {/* PASS 2 Skirt Inner Color Fill (merges seamlessly with upper torso!) */}
            <path
              d={skirtPath}
              fill={color}
              stroke={color}
              strokeWidth={1.8 * scale}
              strokeLinejoin="round"
            />
            {/* Upper-to-lower torso color bridge so zero black line appears at the waist */}
            <line
              x1={j.neck[0]}
              y1={j.neck[1]}
              x2={j.hip[0]}
              y2={j.hip[1]}
              {...stInner}
            />
            {/* Subtle dress pleat highlight */}
            <line
              x1={wx + nx * 2 * scale + ux * 6 * scale}
              y1={wy + ny * 2 * scale + uy * 6 * scale}
              x2={hxHem + nx * 6 * scale - ux * 2 * scale}
              y2={hyHem + ny * 6 * scale - uy * 2 * scale}
              stroke="rgba(255,255,255,0.28)"
              strokeWidth={2.2 * scale}
              strokeLinecap="round"
            />
            {/* Crisp unbroken golden waist belt with ink outline */}
            <line
              x1={wx - nx * (wTop + 1 * scale)}
              y1={wy - ny * (wTop + 1 * scale)}
              x2={wx + nx * (wTop + 1 * scale)}
              y2={wy + ny * (wTop + 1 * scale)}
              stroke={ink}
              strokeWidth={5.6 * scale}
              strokeLinecap="round"
            />
            <line
              x1={wx - nx * (wTop + 0.5 * scale)}
              y1={wy - ny * (wTop + 0.5 * scale)}
              x2={wx + nx * (wTop + 0.5 * scale)}
              y2={wy + ny * (wTop + 0.5 * scale)}
              stroke="#fbbf24"
              strokeWidth={3.2 * scale}
              strokeLinecap="round"
            />
          </g>
        );
      })()}

      {/* PASS 1B: Front Arm Outer Ink Outline */}
      {!isGhost && (
        <polyline points={pts(j.shoulder, j.rElbow, j.rHand)} {...stOuter} {...dash(dArms)} />
      )}

      {/* PASS 2B: Front Arm Inner Color Fill + Shoulder-Only Seamless Bridge (stops well above waist!) */}
      <polyline points={pts(j.shoulder, j.rElbow, j.rHand)} {...stInner} {...dash(dArms)} />
      <line
        x1={j.neck[0]}
        y1={j.neck[1]}
        x2={j.shoulder[0] * 0.78 + j.hip[0] * 0.22}
        y2={j.shoulder[1] * 0.78 + j.hip[1] * 0.22}
        {...stInner}
        {...dash(dTorso)}
      />

      {/* Necktie */}
      {accessory === "tie" && (
        <polygon
          points={pts(
            [j.shoulder[0] - 5.5 * scale, j.shoulder[1]],
            [j.shoulder[0] + 5.5 * scale, j.shoulder[1]],
            [j.shoulder[0] * 0.45 + j.hip[0] * 0.55, j.shoulder[1] * 0.45 + j.hip[1] * 0.55],
          )}
          fill="#d6263b"
          stroke={ink}
          strokeWidth={2.5 * scale}
          strokeLinejoin="round"
        />
      )}

      {/* Tactical Military Belt & Cross-Strap for Soldiers/Commanders */}
      {!isGhost &&
        draw >= 1 &&
        (accessory === "helmet_ir" || accessory === "helmet_iq" || accessory === "beret" || accessory === "un_helmet") && (
          <g>
            <line
              x1={j.shoulder[0] - facing * 4 * scale}
              y1={j.shoulder[1] + 2 * scale}
              x2={j.hip[0] + facing * 4 * scale}
              y2={j.hip[1] - 4 * scale}
              stroke="#2b2b2b"
              strokeWidth={4 * scale}
              strokeLinecap="round"
            />
            <line
              x1={j.hip[0] - 8 * scale}
              y1={j.hip[1] - 4 * scale}
              x2={j.hip[0] + 8 * scale}
              y2={j.hip[1] - 4 * scale}
              stroke={ink}
              strokeWidth={6 * scale}
              strokeLinecap="round"
            />
            <rect
              x={j.hip[0] - 3.5 * scale}
              y={j.hip[1] - 7.5 * scale}
              width={7 * scale}
              height={7 * scale}
              rx={1.5 * scale}
              fill="#f2c12e"
              stroke={ink}
              strokeWidth={1.8 * scale}
            />
          </g>
        )}

      {/* Ponytail behind head (for Sara) */}
      {!isGhost && accessory === "ponytail" && draw >= 1 && (
        <g transform={`translate(${hx} ${hy}) rotate(${ang}) scale(${facing} 1)`}>
          {/* Lush S-curve flowing ponytail */}
          <path
            d={`M${-R * 0.78},${-R * 0.48} Q${-R - 17 * scale},${-R * 0.85} ${-R - 23 * scale},${-2 * scale} Q${-R - 27 * scale},${13 * scale} ${-R - 16 * scale},${20 * scale} Q${-R - 9 * scale},${12 * scale} ${-R - 10 * scale},${3 * scale} Q${-R - 10 * scale},${-5 * scale} ${-R * 0.75},${-2 * scale} Z`}
            fill="#2d1b14"
            stroke={ink}
            strokeWidth={3.2 * scale}
            strokeLinejoin="round"
          />
          {/* Warm hair highlight strand inside ponytail */}
          <path
            d={`M${-R - 3 * scale},${-R * 0.45} Q${-R - 15 * scale},${-R * 0.48} ${-R - 18 * scale},${6 * scale}`}
            fill="none"
            stroke="#6d4c41"
            strokeWidth={2.4 * scale}
            strokeLinecap="round"
          />
          {/* Golden hair tie / scrunchie */}
          <ellipse
            cx={-R * 0.92}
            cy={-R * 0.26}
            rx={3.6 * scale}
            ry={5.2 * scale}
            transform={`rotate(-22 ${-R * 0.92} ${-R * 0.26})`}
            fill="#fbbf24"
            stroke={ink}
            strokeWidth={2.4 * scale}
          />
        </g>
      )}

      {/* Head with Ink Outline & Top-Left Specular Arc Highlight */}
      {draw >= 1 ? (
        <>
          <circle cx={hx} cy={hy} r={R} fill={color} stroke={isGhost ? "none" : ink} strokeWidth={4 * scale} />
          {!isGhost && accessory !== "ponytail" && (
            <path
              d={`M${hx - R * 0.55},${hy - R * 0.35} A${R * 0.65},${R * 0.65} 0 0 1 ${hx + R * 0.45},${hy - R * 0.5}`}
              fill="none"
              stroke="rgba(255,255,255,0.26)"
              strokeWidth={3.2 * scale}
              strokeLinecap="round"
            />
          )}
        </>
      ) : (
        <circle cx={hx} cy={hy} r={R - wInner / 2} {...stInner} fill={dHead >= 1 ? color : "none"} {...dash(dHead)} />
      )}

      {/* Facial Expressions & Head Accessories */}
      <g transform={`translate(${hx} ${hy}) rotate(${ang}) scale(${facing} 1)`}>
        {/* Styled Front Hair Crown, Parted Bangs & Temple Side-Lock (for Sara) */}
        {!isGhost && accessory === "ponytail" && draw >= 1 && (
          <>
            <path
              d={`M${-R * 0.98},${R * 0.16} Q${-R * 1.08},${-R * 0.45} ${-R * 0.55},${-R * 0.88} A${R * 1.05},${R * 1.05} 0 0 1 ${R * 0.92},${-R * 0.48} Q${R * 0.45},${-R * 0.54} ${R * 0.05},${-R * 0.72} Q${-R * 0.35},${-R * 0.48} ${-R * 0.62},${-R * 0.18} Q${-R * 0.72},${R * 0.08} ${-R * 0.98},${R * 0.16} Z`}
              fill="#2d1b14"
              stroke={ink}
              strokeWidth={3 * scale}
              strokeLinejoin="round"
            />
            {/* Glossy hair crown highlight */}
            <path
              d={`M${-R * 0.58},${-R * 0.66} Q${-R * 0.08},${-R * 0.94} ${R * 0.44},${-R * 0.72}`}
              fill="none"
              stroke="#6d4c41"
              strokeWidth={2.5 * scale}
              strokeLinecap="round"
            />
            {/* Cute pearl/gold stud earring on the temple side */}
            <circle cx={-R * 0.66} cy={R * 0.14} r={2.4 * scale} fill="#fbbf24" stroke={ink} strokeWidth={1.5 * scale} />
          </>
        )}

        {!isGhost && effFace !== "none" && draw >= 1 && (
          <>
            {effFace === "shock" ? (
              <>
                <ellipse cx={6 * scale} cy={-1.5 * scale} rx={4.2 * scale} ry={5.5 * scale} fill="#fff" stroke={ink} strokeWidth={1.6 * scale} />
                <ellipse cx={15.2 * scale} cy={-1.5 * scale} rx={4.2 * scale} ry={5.5 * scale} fill="#fff" stroke={ink} strokeWidth={1.6 * scale} />
                <circle cx={6.5 * scale} cy={-1.5 * scale} r={1.7 * scale} fill={ink} />
                <circle cx={14.8 * scale} cy={-1.5 * scale} r={1.7 * scale} fill={ink} />
                <ellipse cx={11 * scale} cy={10 * scale} rx={3.8 * scale} ry={4.8 * scale} fill={ink} stroke="#fff" strokeWidth={1.6 * scale} />
              </>
            ) : blink ? (
              <>
                <line x1={3 * scale} y1={-1 * scale} x2={9.5 * scale} y2={-1 * scale} stroke="#fff" strokeWidth={2.6 * scale} strokeLinecap="round" />
                <line x1={11.8 * scale} y1={-1 * scale} x2={18.2 * scale} y2={-1 * scale} stroke="#fff" strokeWidth={2.6 * scale} strokeLinecap="round" />
              </>
            ) : (
              <>
                {/* Feminine eyelashes for ponytail character */}
                {accessory === "ponytail" && (
                  <>
                    <path
                      d={`M${3.1 * scale},${-3.8 * scale} L${1.2 * scale},${-5.8 * scale} M${4.2 * scale},${-5 * scale} L${2.8 * scale},${-7 * scale}`}
                      stroke={ink}
                      strokeWidth={1.8 * scale}
                      strokeLinecap="round"
                    />
                    <path
                      d={`M${17.8 * scale},${-3.8 * scale} L${19.8 * scale},${-5.8 * scale} M${16.6 * scale},${-5 * scale} L${18.2 * scale},${-7 * scale}`}
                      stroke={ink}
                      strokeWidth={1.8 * scale}
                      strokeLinecap="round"
                    />
                  </>
                )}
                <ellipse cx={6.2 * scale} cy={-1 * scale} rx={3.6 * scale} ry={4.6 * scale} fill="#fff" stroke={ink} strokeWidth={1.2 * scale} />
                <ellipse cx={14.8 * scale} cy={-1 * scale} rx={3.6 * scale} ry={4.6 * scale} fill="#fff" stroke={ink} strokeWidth={1.2 * scale} />
                <circle cx={7.3 * scale} cy={-0.8 * scale} r={1.8 * scale} fill={ink} />
                <circle cx={15.8 * scale} cy={-0.8 * scale} r={1.8 * scale} fill={ink} />
                {accessory === "ponytail" && (
                  <>
                    <circle cx={6.7 * scale} cy={-1.6 * scale} r={0.75 * scale} fill="#fff" />
                    <circle cx={15.2 * scale} cy={-1.6 * scale} r={0.75 * scale} fill="#fff" />
                    {/* Subtle rosy cheeks */}
                    <ellipse cx={2.8 * scale} cy={4.2 * scale} rx={2.6 * scale} ry={1.5 * scale} fill="rgba(255, 120, 165, 0.45)" />
                    <ellipse cx={17.8 * scale} cy={4.2 * scale} rx={2.6 * scale} ry={1.5 * scale} fill="rgba(255, 120, 165, 0.45)" />
                  </>
                )}
              </>
            )}

            {effFace === "angry" && (
              <>
                <path d={`M${2 * scale},${-8.5 * scale} L${10.5 * scale},${-4.5 * scale}`} stroke="#fff" strokeWidth={2.8 * scale} strokeLinecap="round" />
                <path d={`M${19 * scale},${-8 * scale} L${11.5 * scale},${-4.5 * scale}`} stroke="#fff" strokeWidth={2.8 * scale} strokeLinecap="round" />
                <path d={`M${6 * scale},${11.5 * scale} Q${11 * scale},${7.5 * scale} ${16 * scale},${11.5 * scale}`} stroke="#fff" strokeWidth={2.4 * scale} fill="none" strokeLinecap="round" />
              </>
            )}

            {effFace === "sad" && (
              <>
                <path d={`M${2 * scale},${-4.5 * scale} L${10 * scale},${-8.5 * scale}`} stroke="#fff" strokeWidth={2.5 * scale} strokeLinecap="round" />
                <path d={`M${12.5 * scale},${-8.5 * scale} L${19 * scale},${-4.5 * scale}`} stroke="#fff" strokeWidth={2.5 * scale} strokeLinecap="round" />
                <path d={`M${6 * scale},${12 * scale} Q${11 * scale},${8 * scale} ${15.5 * scale},${12 * scale}`} stroke="#fff" strokeWidth={2.4 * scale} fill="none" strokeLinecap="round" />
              </>
            )}

            {effFace === "happy" && (
              <path d={`M${5 * scale},${7 * scale} Q${11 * scale},${14.5 * scale} ${17 * scale},${7 * scale} Z`} fill="#fff" stroke={ink} strokeWidth={1.2 * scale} />
            )}

            {effFace === "smirk" && (
              <>
                <path d={`M${2 * scale},${-8.5 * scale} Q${6 * scale},${-11.5 * scale} ${10 * scale},${-7.5 * scale}`} stroke="#fff" strokeWidth={2.4 * scale} fill="none" strokeLinecap="round" />
                <path d={`M${6 * scale},${9.5 * scale} Q${12.5 * scale},${13 * scale} ${17 * scale},${7 * scale}`} stroke="#fff" strokeWidth={2.5 * scale} fill="none" strokeLinecap="round" />
              </>
            )}
          </>
        )}

        {/* Scarf */}
        {accessory === "scarf" && (
          <>
            <path
              d={`M${R + 3 * scale},${-9 * scale} Q${R + 3 * scale},${-R - 7 * scale} 0,${-R - 7 * scale} Q${-R - 4 * scale},${-R - 7 * scale} ${-R - 5 * scale},${-2 * scale} L${-R - 12 * scale},${R + 24 * scale} L${-R + 8 * scale},${R + 16 * scale} L${-R + 6 * scale},${-9 * scale} Z`}
              fill="#ffffff"
              stroke={ink}
              strokeWidth={3 * scale}
              strokeLinejoin="round"
            />
            <rect x={-R - 3 * scale} y={-R * 0.62} width={2 * R + 6 * scale} height={6 * scale} rx={3 * scale} fill={ink} />
          </>
        )}

        {/* Tophat */}
        {accessory === "tophat" && (
          <>
            <rect x={-R - 8 * scale} y={-R - 2 * scale} width={2 * R + 16 * scale} height={7 * scale} rx={3 * scale} fill={ink} />
            <rect x={-R + 2 * scale} y={-R - 34 * scale} width={2 * R - 4 * scale} height={34 * scale} rx={3 * scale} fill={ink} />
            <rect x={-R + 2 * scale} y={-R - 10 * scale} width={2 * R - 4 * scale} height={6 * scale} fill="#d6263b" />
          </>
        )}

        {/* Royal Crown with Gems */}
        {accessory === "crown" && (
          <>
            <polygon
              points={`${-R},${-R + 5 * scale} ${-R - 3 * scale},${-R - 19 * scale} ${-R / 2},${-R - 6 * scale} 0,${-R - 24 * scale} ${R / 2},${-R - 6 * scale} ${R + 3 * scale},${-R - 19 * scale} ${R},${-R + 5 * scale}`}
              fill="#f2c12e"
              stroke={ink}
              strokeWidth={3 * scale}
              strokeLinejoin="round"
            />
            <circle cx={0} cy={-R - 6 * scale} r={3.2 * scale} fill="#e5322d" />
            <circle cx={-R * 0.55} cy={-R - 2 * scale} r={2.5 * scale} fill="#2b7de9" />
            <circle cx={R * 0.55} cy={-R - 2 * scale} r={2.5 * scale} fill="#2b7de9" />
          </>
        )}

        {/* Navigator / Admiral Hat with Plume */}
        {(accessory === "cap" || accessory === "admiral") && (
          <>
            <path
              d={`M${-8 * scale},${-R - 12 * scale} Q${-26 * scale},${-R - 32 * scale} ${-34 * scale},${-R - 10 * scale} Q${-20 * scale},${-R - 8 * scale} ${-8 * scale},${-R - 12 * scale} Z`}
              fill="#fff"
              stroke={ink}
              strokeWidth={2.6 * scale}
            />
            <path
              d={`M${-R - 11 * scale},${-R + 5 * scale} Q0,${-R - 26 * scale} ${R + 13 * scale},${-R + 5 * scale} Z`}
              fill="#2c3e50"
              stroke={ink}
              strokeWidth={3 * scale}
              strokeLinejoin="round"
            />
            <path
              d={`M${-R - 13 * scale},${-R + 6 * scale} Q0,${-R - 5 * scale} ${R + 15 * scale},${-R + 6 * scale}`}
              fill="none"
              stroke="#f2c12e"
              strokeWidth={3.8 * scale}
              strokeLinecap="round"
            />
          </>
        )}

        {/* Sailor Bandana */}
        {accessory === "bandana" && (
          <>
            <path
              d={`M${-R},${-R + 7 * scale} Q0,${-R - 13 * scale} ${R},${-R + 7 * scale} Z`}
              fill="#e5322d"
              stroke={ink}
              strokeWidth={2.8 * scale}
            />
            <path
              d={`M${-R},${-R + 5 * scale} L${-R - 15 * scale},${-R + 1 * scale} M${-R},${-R + 7 * scale} L${-R - 13 * scale},${-R + 13 * scale}`}
              stroke="#e5322d"
              strokeWidth={3.8 * scale}
              strokeLinecap="round"
            />
          </>
        )}

        {/* Taíno Feather Headdress */}
        {accessory === "feathers" && (
          <>
            <path
              d={`M${-6 * scale},${-R + 2 * scale} Q${-17 * scale},${-R - 26 * scale} ${-7 * scale},${-R - 30 * scale} Q${2 * scale},${-R - 14 * scale} ${-2 * scale},${-R + 2 * scale} Z`}
              fill="#e5322d"
              stroke={ink}
              strokeWidth={2.4 * scale}
            />
            <path
              d={`M${2 * scale},${-R + 2 * scale} Q${0 * scale},${-R - 32 * scale} ${9 * scale},${-R - 32 * scale} Q${13 * scale},${-R - 14 * scale} ${6 * scale},${-R + 2 * scale} Z`}
              fill="#f2c12e"
              stroke={ink}
              strokeWidth={2.4 * scale}
            />
            <rect
              x={-R}
              y={-R + 2 * scale}
              width={2 * R}
              height={6 * scale}
              rx={3 * scale}
              fill="#f7941d"
              stroke={ink}
              strokeWidth={2.4 * scale}
            />
          </>
        )}

        {/* Scholar Glasses + Beard */}
        {(accessory === "glasses" || accessory === "scholar") && (
          <>
            <circle cx={5.8 * scale} cy={-1 * scale} r={5.8 * scale} fill="rgba(255,255,255,0.25)" stroke={ink} strokeWidth={2.4 * scale} />
            <circle cx={15.8 * scale} cy={-1 * scale} r={5.8 * scale} fill="rgba(255,255,255,0.25)" stroke={ink} strokeWidth={2.4 * scale} />
            <line x1={11.5 * scale} y1={-1 * scale} x2={10 * scale} y2={-1 * scale} stroke={ink} strokeWidth={2.4 * scale} />
            {accessory === "scholar" && (
              <polygon
                points={`${4 * scale},${13 * scale} ${17 * scale},${13 * scale} ${11.5 * scale},${26 * scale}`}
                fill={ink}
              />
            )}
          </>
        )}

        {/* Iranian Soldier Helmet with Red Headband */}
        {accessory === "helmet_ir" && (
          <>
            <path
              d={`M${-R - 4 * scale},${-R * 0.42} A${R + 5 * scale},${R + 4 * scale} 0 0 1 ${R + 5 * scale},${-R * 0.42} Z`}
              fill="#3e5c38"
              stroke={ink}
              strokeWidth={3 * scale}
              strokeLinejoin="round"
            />
            <rect
              x={-R - 4 * scale}
              y={-R * 0.56}
              width={2 * R + 9 * scale}
              height={5.2 * scale}
              rx={2 * scale}
              fill="#e5322d"
              stroke={ink}
              strokeWidth={2 * scale}
            />
          </>
        )}

        {/* Iraqi Soldier Sand/Khaki Helmet */}
        {accessory === "helmet_iq" && (
          <>
            <path
              d={`M${-R - 5 * scale},${-R * 0.42} A${R + 5 * scale},${R + 5 * scale} 0 0 1 ${R + 5 * scale},${-R * 0.42} L${R + 8 * scale},${-R * 0.32} L${-R - 7 * scale},${-R * 0.32} Z`}
              fill="#9e8656"
              stroke={ink}
              strokeWidth={3 * scale}
              strokeLinejoin="round"
            />
          </>
        )}

        {/* Military Commander Beret + Mustache */}
        {accessory === "beret" && (
          <>
            <path
              d={`M${-R - 4 * scale},${-R * 0.52} Q${-R - 10 * scale},${-R - 18 * scale} ${R * 0.45},${-R - 12 * scale} Q${R + 10 * scale},${-R - 8 * scale} ${R + 4 * scale},${-R * 0.52} Z`}
              fill="#222222"
              stroke={ink}
              strokeWidth={3 * scale}
              strokeLinejoin="round"
            />
            <circle cx={6 * scale} cy={-R * 0.8} r={3.5 * scale} fill="#f2c12e" />
            <path
              d={`M${4 * scale},${5.5 * scale} Q${11 * scale},${2.8 * scale} ${18 * scale},${5.5 * scale}`}
              stroke={ink}
              strokeWidth={3.8 * scale}
              strokeLinecap="round"
            />
          </>
        )}

        {/* Fighter Pilot Flight Helmet + Visor */}
        {accessory === "pilot" && (
          <>
            <path
              d={`M${-R - 4 * scale},${R * 0.15} A${R + 5 * scale},${R + 5 * scale} 0 1 1 ${R + 4 * scale},${-R * 0.35}`}
              fill="#eceff1"
              stroke={ink}
              strokeWidth={3 * scale}
            />
            <path
              d={`M${2 * scale},${-R * 0.45} Q${R + 8 * scale},${-R * 0.35} ${R + 5 * scale},${R * 0.05} L${2 * scale},${R * 0.05} Z`}
              fill="#1a237e"
              stroke={ink}
              strokeWidth={2.5 * scale}
            />
          </>
        )}

        {/* UN Peacekeeper Blue Helmet */}
        {accessory === "un_helmet" && (
          <>
            <path
              d={`M${-R - 4 * scale},${-R * 0.42} A${R + 5 * scale},${R + 4 * scale} 0 0 1 ${R + 5 * scale},${-R * 0.42} Z`}
              fill="#29b6f6"
              stroke={ink}
              strokeWidth={3 * scale}
              strokeLinejoin="round"
            />
            <rect x={-R - 3 * scale} y={-R * 0.55} width={2 * R + 7 * scale} height={4.5 * scale} fill="#ffffff" />
          </>
        )}
      </g>

      {label && !isGhost && (
        <text
          x={hx}
          y={hy - R - topOffset * scale}
          textAnchor="middle"
          direction={/[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/.test(label) ? "rtl" : "ltr"}
          fontFamily="'Lalezar', Bangers, sans-serif"
          fontSize={30 * scale}
          letterSpacing={/[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/.test(label) ? 0 : 1}
          fill={labelColor ?? color}
          stroke="#fafaf7"
          strokeWidth={7}
          paintOrder="stroke"
        >
          {label}
        </text>
      )}
      {children?.(j)}
    </g>
  );
};

// ---------- pose animation -----------

export type Key = { f: number; p: Partial<Pose>; e?: (t: number) => number; dur?: number };

export const SNAP = Easing.bezier(0.2, 0.9, 0.25, 1.15);
export const SMOOTH = Easing.bezier(0.45, 0, 0.55, 1);
export const HOLD = () => 0;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const poseAt = (f: number, keys: Key[], base: Pose = STAND): Pose => {
  const full: Pose[] = [];
  let acc = { ...base };
  for (const k of keys) {
    acc = { ...acc, ...k.p };
    full.push(acc);
  }
  if (keys.length === 0) return base;
  if (f <= keys[0].f) return full[0];
  for (let i = 1; i < keys.length; i++) {
    if (f <= keys[i].f) {
      const b = keys[i].f;
      const span = keys[i].dur ?? (keys[i].e ? 26 : 9);
      const a = Math.max(keys[i - 1].f, b - span);
      const raw = interpolate(f, [a, b], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const t = (keys[i].e ?? SNAP)(raw);
      const A = full[i - 1];
      const B = full[i];
      const out = {} as Pose;
      (Object.keys(A) as (keyof Pose)[]).forEach((n) => {
        out[n] = lerp(A[n], B[n], t);
      });
      return out;
    }
  }
  return full[full.length - 1];
};

export const runCycle = (f: number, speed = 0.45, amp = 1): Partial<Pose> => {
  const s = Math.sin(f * speed);
  const c = Math.cos(f * speed);
  return {
    lean: 14 * amp,
    ll1: -42 * s * amp,
    ll2: (-25 - 40 * Math.max(0, c)) * amp,
    rl1: 42 * s * amp,
    rl2: (-25 - 40 * Math.max(0, -c)) * amp,
    la1: 45 * s * amp,
    la2: 65 * amp,
    ra1: -45 * s * amp,
    ra2: 65 * amp,
  };
};

export const walkCycle = (f: number, speedOrSeed = 0.26, amp = 1): Partial<Pose> => {
  const isSeed = speedOrSeed >= 0.8;
  const speed = isSeed ? 0.26 : speedOrSeed;
  const phase = isSeed ? speedOrSeed * 1.7 : 0;
  const s = Math.sin(f * speed + phase);
  const c = Math.cos(f * speed + phase);
  return {
    ll1: -26 * s * amp,
    ll2: (-8 - 22 * Math.max(0, c)) * amp,
    rl1: 26 * s * amp,
    rl2: (-8 - 22 * Math.max(0, -c)) * amp,
    la1: 18 * s * amp,
    la2: (10 + 14 * Math.max(0, s)) * amp,
    ra1: -18 * s * amp,
    ra2: (10 + 14 * Math.max(0, -s)) * amp,
  };
};

export const idle = (f: number, seed = 0): Partial<Pose> => ({
  y: Math.sin(f * 0.12 + seed) * 1.5,
  la1: Math.sin(f * 0.1 + seed) * 2,
  ra1: -Math.sin(f * 0.1 + seed) * 2,
});

export const addPose = <T extends Partial<Pose>>(p: T, d: Partial<Pose>, replace = false): T => {
  const o = { ...p };
  (Object.keys(d) as (keyof Pose)[]).forEach((k) => {
    o[k] = replace ? (d[k] as number) : ((o[k] ?? 0) as number) + (d[k] as number);
  });
  return o;
};

export const Stick = Figure;

export const Actor: React.FC<{
  f: number;
  keys: Key[];
  color: string;
  base?: Partial<Pose>;
  scale?: number;
  facing?: number | ((f: number) => number);
  accessory?: Accessory;
  hat?: Accessory;
  handProp?: HandPropType | ((f: number) => HandPropType);
  extra?: Partial<Pose>;
  face?: FaceExpr | ((f: number) => FaceExpr);
  label?: string;
  mod?: (f: number, p: Pose) => Pose;
  trails?: boolean;
  opacity?: number;
  draw?: number;
  children?: (j: Joints) => React.ReactNode;
  behind?: (j: Joints) => React.ReactNode;
}> = ({
  f,
  keys,
  color,
  base,
  scale = 1,
  facing = 1,
  accessory,
  hat,
  handProp = "none",
  extra,
  face = "eyes",
  label,
  mod,
  trails = true,
  opacity = 1,
  draw,
  children,
  behind,
}) => {
  const acc = accessory ?? hat;
  const curFace = typeof face === "function" ? face(f) : face;
  const curHandProp = typeof handProp === "function" ? handProp(f) : handProp;
  const b = { ...STAND, ...(keys[0]?.p?.y !== undefined ? { y: keys[0].p.y } : {}), ...base };
  const get = (t: number) => {
    let p = poseAt(t, keys, b);
    // Automatic velocity-driven walk stride when moving horizontally on the ground
    const prev = poseAt(t - 1, keys, b);
    const next = poseAt(t + 1, keys, b);
    const vx = Math.abs(next.x - prev.x) * 0.5;
    const onGround = Math.abs(p.y - b.y) < 12;
    if (vx > 0.35 && onGround) {
      const strideAmp = Math.min(1, vx / 4.2);
      const w = walkCycle(t, 0.3, strideAmp);
      const bob = -Math.abs(Math.sin(t * 0.3)) * 2.5 * strideAmp;
      p = {
        ...p,
        y: p.y + bob,
        ll1: p.ll1 * (1 - strideAmp) + (w.ll1 ?? 0),
        ll2: w.ll2 ?? p.ll2,
        rl1: p.rl1 * (1 - strideAmp) + (w.rl1 ?? 0),
        rl2: w.rl2 ?? p.rl2,
      };
    }
    if (extra && t === f) p = addPose(p, extra);
    return mod ? mod(t, p) : p;
  };
  const fc = (t: number) => (typeof facing === "function" ? facing(t) : facing);
  const now = get(f);
  const ghosts: React.ReactNode[] = [];
  if (trails) {
    [3, 2, 1].forEach((d) => {
      const g = get(f - d);
      const dist = Math.hypot(g.x - now.x, g.y - now.y) + Math.abs(g.rot - now.rot) * 1.5;
      if (dist > 26) {
        ghosts.push(
          <Figure key={d} pose={g} color={color} scale={scale} facing={fc(f - d)} opacity={(0.28 - d * 0.07) * opacity} isGhost />,
        );
      }
    });
  }
  const isBlink = Math.floor((f + Math.round((keys[0]?.p.x ?? 500) * 0.37)) % 94) < 3;
  return (
    <>
      {ghosts}
      <Figure
        pose={now}
        color={color}
        scale={scale}
        facing={fc(f)}
        accessory={acc}
        face={curFace}
        blink={isBlink}
        label={label}
        opacity={opacity}
        draw={draw}
        behind={behind}
      >
        {(j) => (
          <>
            {curHandProp !== "none" && (
              <g transform={`translate(${j.rHand[0]} ${j.rHand[1]}) scale(${scale * 0.88})`}>
                {curHandProp === "cash" && (
                  <g transform="rotate(-14)">
                    <rect x={-24} y={-13} width={48} height={26} rx={5} fill="#43a047" stroke="#1a1a1a" strokeWidth={3.5} />
                    <rect x={-18} y={-8} width={36} height={16} rx={3} fill="#c8e6c9" stroke="#1b5e20" strokeWidth={2} />
                    <rect x={-5} y={-14} width={10} height={28} rx={2} fill="#f2b705" stroke="#1a1a1a" strokeWidth={2.5} />
                  </g>
                )}
                {curHandProp === "coin" && (
                  <g>
                    <circle cx={2} cy={3} r={19} fill="#b45309" stroke="#1a1a1a" strokeWidth={3.5} />
                    <circle cx={0} cy={0} r={19} fill="#fbbf24" stroke="#1a1a1a" strokeWidth={3.5} />
                    <circle cx={0} cy={0} r={13} fill="none" stroke="#fef08a" strokeWidth={2.2} strokeDasharray="4 3" />
                  </g>
                )}
                {curHandProp === "ice" && (
                  <g>
                    <rect x={-17} y={-17} width={34} height={32} rx={8} fill="#bae6fd" stroke="#1a1a1a" strokeWidth={3.5} />
                    <line x1={-10} y1={-9} x2={-2} y2={-9} stroke="#fff" strokeWidth={3.5} strokeLinecap="round" />
                    <circle cx={-6} cy={23} r={3.5} fill="#38bdf8" stroke="#1a1a1a" strokeWidth={2} />
                    <circle cx={7} cy={27} r={3} fill="#38bdf8" stroke="#1a1a1a" strokeWidth={2} />
                  </g>
                )}
                {(curHandProp === "phone_red" || curHandProp === "phone_green") && (
                  <g transform={`rotate(${fc(f) * -12})`}>
                    <rect x={-13} y={-22} width={26} height={44} rx={6} fill="#1e293b" stroke="#1a1a1a" strokeWidth={3.5} />
                    <rect
                      x={-9}
                      y={-16}
                      width={18}
                      height={32}
                      rx={3}
                      fill={curHandProp === "phone_red" ? "#fee2e2" : "#dcfce7"}
                    />
                    <polyline
                      points={curHandProp === "phone_red" ? "-7,-8 0,-2 7,10" : "-7,8 0,0 7,-10"}
                      fill="none"
                      stroke={curHandProp === "phone_red" ? "#e5322d" : "#2fa84f"}
                      strokeWidth={3.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}
              </g>
            )}
            {children?.(j)}
          </>
        )}
      </Figure>
    </>
  );
};
