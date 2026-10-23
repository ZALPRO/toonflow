import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadBangers } from "@remotion/google-fonts/Bangers";
import { loadFont as loadBarlow } from "@remotion/google-fonts/BarlowCondensed";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLalezar } from "@remotion/google-fonts/Lalezar";
import { loadFont as loadVazirmatn } from "@remotion/google-fonts/Vazirmatn";

loadBangers("normal", { weights: ["400"], subsets: ["latin"] });
loadBarlow("normal", { weights: ["600", "800", "900"], subsets: ["latin"] });
loadInter("normal", { weights: ["500", "700", "800"], subsets: ["latin"] });
loadLalezar("normal", { weights: ["400"], subsets: ["arabic", "latin"] });
loadVazirmatn("normal", { weights: ["500", "700", "800", "900"], subsets: ["arabic", "latin"] });

export const FONT = {
  comic: "'Lalezar', Bangers, sans-serif",
  title: "'Vazirmatn', 'Barlow Condensed', sans-serif",
  body: "'Vazirmatn', Inter, sans-serif",
};

export const isRTL = (s: string) => /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/.test(s);

export const nodeToString = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToString).join(" ");
  if (React.isValidElement(node) && (node.props as any)?.children) {
    return nodeToString((node.props as any).children);
  }
  return "";
};

export const dirOf = (node: React.ReactNode): "rtl" | "ltr" => (isRTL(nodeToString(node)) ? "rtl" : "ltr");

export const COL = {
  paper: "#fafaf7",
  ink: "#1a1a1a",
  orange: "#f7941d",
  blue: "#2b7de9",
  green: "#2fa84f",
  red: "#e5322d",
  yellow: "#f2c12e",
  purple: "#8e44ad",
  grey: "#8a8a8a",
  dollar: "#3a8f3e",
  gold: "#f2b705",
  olive: "#4b6043",
  khaki: "#b59b6d",
  crimson: "#b71c1c",
  teal: "#00897b",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const ease = (f: number, a: number, b: number, from = 0, to = 1, e = Easing.bezier(0.2, 0.9, 0.25, 1)) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing: e });

// camera shake: decays after each hit
export const shakeAt = (f: number, hits: number[], power = 18, len = 12) => {
  let x = 0,
    y = 0,
    r = 0;
  for (const h of hits) {
    const d = f - h;
    if (d >= 0 && d < len) {
      const k = (1 - d / len) ** 2 * power;
      x += (random(`sx${h}-${d}`) - 0.5) * 2 * k;
      y += (random(`sy${h}-${d}`) - 0.5) * 2 * k;
      r += (random(`sr${h}-${d}`) - 0.5) * k * 0.08;
    }
  }
  return { x, y, r };
};

export const Shake: React.FC<{ hits: number[]; power?: number; children: React.ReactNode }> = ({ hits, power, children }) => {
  const f = useCurrentFrame();
  const s = shakeAt(f, hits, power);
  return <AbsoluteFill style={{ transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)` }}>{children}</AbsoluteFill>;
};

export type PaperTheme = "default" | "airraid" | "liberation" | "gulf" | "peace" | "studio" | "wealth" | "danger";

// paper background with soft vignette and grounded floor (852 for 16:9, 1460 for 9:16).
// On 9:16 vertical studio Reels (or studio/wealth/danger themes), renders a clean minimalist studio backdrop
// without war-specific desert dunes, palm trees, or bombed building silhouettes!
export const Paper: React.FC<{ tint?: string; ground?: number; theme?: PaperTheme }> = ({
  tint,
  ground,
  theme = "default",
}) => {
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  const g = ground ?? (isVertical ? 1220 : 852);

  const bgCenter =
    tint ??
    (theme === "danger" || theme === "airraid"
      ? "#f6efe4"
      : theme === "wealth" || theme === "liberation"
        ? "#fcf8ee"
        : theme === "gulf"
          ? "#f0f6fa"
          : theme === "peace"
            ? "#f5f8fc"
            : COL.paper);

  const bgEdge =
    theme === "danger" || theme === "airraid"
      ? "#dfd2c0"
      : theme === "wealth" || theme === "liberation"
        ? "#e7dec8"
        : theme === "gulf"
          ? "#d4e3ee"
          : theme === "peace"
            ? "#dde6f0"
            : "#e6e2d6";

  const floorCol =
    theme === "danger" || theme === "airraid"
      ? "#d8ccb8"
      : theme === "wealth" || theme === "liberation"
        ? "#e2d8c3"
        : theme === "peace"
          ? "#e1e7ef"
          : "#e5e0d2";

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 42%, ${bgCenter} 52%, ${bgEdge} 100%)`,
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute" }}>
        {/* Subtle tactical grid on peace/diplomacy theme */}
        {theme === "peace" &&
          Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1={i * 160}
              y1={0}
              x2={i * 160}
              y2={g}
              stroke="rgba(43, 125, 233, 0.06)"
              strokeWidth={2}
            />
          ))}

        {/* Distant horizon hills/mountains silhouette (exact IranIraqWar style!) */}
        <path
          d={`M0,${g} L0,${g - 65} Q${width * 0.2},${g - 135} ${width * 0.45},${g - 55} T${width * 0.8},${g - 80} L${width},${g - 75} L${width},${g} Z`}
          fill={theme === "airraid" || theme === "danger" ? "#e2d6c5" : theme === "gulf" ? "#dce8f0" : "#ebe7dc"}
          opacity={0.8}
        />

        {/* Theme-specific distant silhouettes (16:9 historical videos only) */}
        {!isVertical &&
          theme === "liberation" &&
          [180, 310, 1580, 1740].map((px, i) => (
            <g key={i} transform={`translate(${px}, ${g})`} opacity={0.28}>
              <path d="M-4,0 Q-2,-48 4,-92" fill="none" stroke="#6d5e46" strokeWidth={7} strokeLinecap="round" />
              <path
                d="M4,-92 Q-28,-102 -42,-78 M4,-92 Q-18,-116 -32,-104 M4,-92 Q28,-112 42,-92 M4,-92 Q32,-96 46,-74"
                fill="none"
                stroke="#4b6043"
                strokeWidth={5}
                strokeLinecap="round"
              />
            </g>
          ))}

        {!isVertical && theme === "airraid" && (
          <g opacity={0.22} fill="#7a6e60">
            <rect x={120} y={g - 110} width={45} height={110} />
            <rect x={175} y={g - 80} width={60} height={80} />
            <rect x={1650} y={g - 125} width={55} height={125} />
            <rect x={1715} y={g - 90} width={50} height={90} />
          </g>
        )}

        {/* Ground plane fill below g */}
        <rect x={0} y={g} width={width} height={height - g} fill={floorCol} />
        <line x1={0} y1={g} x2={width} y2={g} stroke="#b5afa0" strokeWidth={4} />
      </svg>
    </AbsoluteFill>
  );
};

// comic-style impact starburst
export const Burst: React.FC<{ x: number; y: number; at: number; f: number; color?: string; size?: number; n?: number }> = ({
  x,
  y,
  at,
  f,
  color = COL.ink,
  size = 160,
  n = 14,
}) => {
  const d = f - at;
  if (d < 0 || d > 14) return null;
  const t = d / 14;
  const r0 = size * (0.25 + t * 0.9);
  const r1 = size * (0.45 + t * 1.25);
  return (
    <g opacity={1 - t}>
      {d < 3 && <circle cx={x} cy={y} r={size * 0.55} fill="#fff" stroke={color} strokeWidth={8} />}
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + random(`b${at}${i}`) * 0.3;
        const k = 0.7 + random(`bl${at}${i}`) * 0.6;
        return (
          <line
            key={i}
            x1={x + Math.cos(a) * r0}
            y1={y + Math.sin(a) * r0}
            x2={x + Math.cos(a) * r1 * k}
            y2={y + Math.sin(a) * r1 * k}
            stroke={color}
            strokeWidth={10 * (1 - t) + 2}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

// dust puffs when something lands
export const Dust: React.FC<{ x: number; y: number; at: number; f: number; spread?: number }> = ({ x, y, at, f, spread = 120 }) => {
  const d = f - at;
  if (d < 0 || d > 22) return null;
  const t = d / 22;
  return (
    <g opacity={1 - t}>
      {Array.from({ length: 8 }).map((_, i) => {
        const side = i % 2 === 0 ? 1 : -1;
        const k = 0.4 + random(`d${at}${i}`) * 0.8;
        return (
          <circle
            key={i}
            cx={x + side * spread * k * Math.sqrt(t)}
            cy={y - 30 * k * t - 6}
            r={(10 + 18 * k) * (0.6 + t)}
            fill="none"
            stroke="#b9b5aa"
            strokeWidth={5}
          />
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------
// PROFESSIONAL 5-LAYER PROCEDURAL EXPLOSION VFX
// ---------------------------------------------------------------------------
export const Explosion: React.FC<{
  x: number;
  y: number;
  at: number;
  f: number;
  size?: number;
  dur?: number;
}> = ({ x, y, at, f, size = 180, dur = 34 }) => {
  const d = f - at;
  if (d < 0 || d > dur) return null;
  const t = d / dur;
  const tShock = Math.min(1, d / (dur * 0.55));
  const tFire = Math.min(1, d / (dur * 0.62));
  const tSec = d / 30;
  const g = 680;

  return (
    <g>
      <ellipse
        cx={x}
        cy={y + 4}
        rx={size * 0.52 * Math.min(1, t * 3)}
        ry={size * 0.1 * Math.min(1, t * 3)}
        fill="rgba(30,25,20,0.32)"
        opacity={1 - t * 0.65}
      />

      {Array.from({ length: 9 }).map((_, i) => {
        const seed = `smk-${at}-${i}`;
        const ang = (random(seed + "a") - 0.5) * 2.2 - Math.PI / 2;
        const dist = (0.25 + random(seed + "d") * 0.75) * size * 0.72;
        const sx = x + Math.cos(ang) * dist * Math.pow(t, 0.65);
        const sy = y + Math.sin(ang) * dist * 0.45 * Math.pow(t, 0.5) - 135 * Math.pow(t, 1.15);
        const sr = size * (0.16 + random(seed + "r") * 0.16) * (0.55 + t * 1.15);
        const shade = i % 3 === 0 ? "#2e2b29" : i % 3 === 1 ? "#4a4642" : "#69645e";
        const op = interpolate(t, [0, 0.12, 0.65, 1], [0, 0.85, 0.65, 0], clamp);
        return <circle key={`s${i}`} cx={sx} cy={sy} r={sr} fill={shade} opacity={op} />;
      })}

      {tShock < 1 && (
        <g opacity={1 - tShock}>
          <ellipse
            cx={x}
            cy={y + 10}
            rx={size * (0.25 + 1.45 * Math.pow(tShock, 0.55))}
            ry={size * (0.06 + 0.28 * Math.pow(tShock, 0.55))}
            fill="none"
            stroke="#fff7d6"
            strokeWidth={Math.max(2, 10 * (1 - tShock))}
          />
          <circle
            cx={x}
            cy={y - 12}
            r={size * (0.2 + 1.4 * Math.pow(tShock, 0.5))}
            fill="none"
            stroke={d < 4 ? "#ffffff" : COL.orange}
            strokeWidth={Math.max(2, 12 * (1 - tShock))}
          />
        </g>
      )}

      {tFire < 1 && (
        <g opacity={interpolate(tFire, [0, 0.7, 1], [1, 0.92, 0], clamp)}>
          {Array.from({ length: 7 }).map((_, i) => {
            const a = (i / 7) * Math.PI * 2 + 0.3;
            const rad = i === 0 ? 0 : size * (0.22 + (i % 2) * 0.1) * Math.pow(tFire, 0.45);
            const lx = x + Math.cos(a) * rad;
            const ly = y - 10 + Math.sin(a) * rad * 0.8 - 38 * tFire;
            const lr = size * (i === 0 ? 0.42 : 0.28) * (0.5 + 0.65 * Math.sin(Math.min(1, tFire * 1.35) * Math.PI));
            const outerCol = tFire < 0.25 ? "#ff9800" : tFire < 0.65 ? COL.red : "#4a2520";
            const innerCol = tFire < 0.25 ? "#fff9c4" : tFire < 0.55 ? "#ffeb3b" : COL.orange;
            return (
              <g key={`f${i}`}>
                <circle cx={lx} cy={ly} r={lr} fill={outerCol} stroke={COL.ink} strokeWidth={5} />
                <circle cx={lx - lr * 0.1} cy={ly - lr * 0.1} r={lr * 0.62} fill={innerCol} />
              </g>
            );
          })}
        </g>
      )}

      {d < 4 && (
        <g opacity={1 - d / 4}>
          <circle cx={x} cy={y - 10} r={size * 0.95} fill="rgba(255, 248, 196, 0.45)" />
          <circle cx={x} cy={y - 10} r={size * 0.52} fill="#ffffff" stroke={COL.yellow} strokeWidth={8} />
        </g>
      )}

      {Array.from({ length: 14 }).map((_, i) => {
        const seed = `deb-${at}-${i}`;
        const launchAngle = -Math.PI * (0.12 + random(seed + "la") * 0.76);
        const speed = (260 + random(seed + "sp") * 420) * (size / 180);
        const vx = Math.cos(launchAngle) * speed;
        const vy = Math.sin(launchAngle) * speed;
        const px = x + vx * tSec;
        const py = y + vy * tSec + 0.5 * g * tSec * tSec;
        const fade = interpolate(t, [0, 0.75, 1], [1, 0.9, 0], clamp);
        if (i % 2 === 0) {
          const curVy = vy + g * tSec;
          const vLen = Math.hypot(vx, curVy) || 1;
          const tail = 18 * (1 - t * 0.5);
          return (
            <line
              key={`p${i}`}
              x1={px}
              y1={py}
              x2={px - (vx / vLen) * tail}
              y2={py - (curVy / vLen) * tail}
              stroke={i % 4 === 0 ? "#fff59d" : COL.orange}
              strokeWidth={5 * (1 - t * 0.5)}
              strokeLinecap="round"
              opacity={fade}
            />
          );
        } else {
          const rot = d * (18 + i * 3);
          const s = 6 + (i % 3) * 3;
          return (
            <polygon
              key={`p${i}`}
              points={`${-s},${-s * 0.7} ${s},0 ${-s * 0.4},${s}`}
              fill="#2b2b2b"
              stroke={COL.ink}
              strokeWidth={2}
              transform={`translate(${px} ${py}) rotate(${rot})`}
              opacity={fade}
            />
          );
        }
      })}
    </g>
  );
};

// Directional 3-Lobe Weapon / Tank Muzzle Flash + Smoke Puff
export const MuzzleFlash: React.FC<{
  x: number;
  y: number;
  at: number;
  f: number;
  dir?: number;
  scale?: number;
}> = ({ x, y, at, f, dir = 1, scale = 1 }) => {
  const d = f - at;
  if (d < 0 || d > 7) return null;
  const t = d / 7;
  return (
    <g transform={`translate(${x} ${y}) scale(${dir * scale} ${scale})`}>
      <circle
        cx={28 + d * 12}
        cy={-d * 4}
        r={12 + d * 4.5}
        fill="none"
        stroke="#8d8980"
        strokeWidth={4 * (1 - t)}
        opacity={1 - t}
      />
      {d < 3 && (
        <g opacity={1 - d * 0.28}>
          <polygon
            points="0,0 58,-22 42,-6 78,0 42,6 58,22"
            fill={COL.orange}
            stroke={COL.ink}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <polygon points="4,0 46,-10 34,0 46,10" fill="#fff9c4" />
        </g>
      )}
    </g>
  );
};

// High-speed Ballistic Bullet / Shell Tracer Streak
export const Tracer: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  at: number;
  f: number;
  dur?: number;
  color?: string;
}> = ({ x1, y1, x2, y2, at, f, dur = 6, color = "#ffeb3b" }) => {
  const d = f - at;
  if (d < 0 || d > dur + 4) return null;
  const u = Math.min(1, d / dur);
  const uTail = Math.max(0, (d - 1.8) / dur);
  const hx = x1 + (x2 - x1) * u;
  const hy = y1 + (y2 - y1) * u;
  const tx = x1 + (x2 - x1) * uTail;
  const ty = y1 + (y2 - y1) * uTail;
  return (
    <g>
      {d <= dur && (
        <>
          <line x1={tx} y1={ty} x2={hx} y2={hy} stroke={COL.orange} strokeWidth={7} strokeLinecap="round" opacity={0.85} />
          <line x1={(tx + hx) / 2} y1={(ty + hy) / 2} x2={hx} y2={hy} stroke={color} strokeWidth={4} strokeLinecap="round" />
        </>
      )}
      {d >= dur && (
        <circle cx={x2} cy={y2} r={(d - dur + 1) * 9} fill="none" stroke={COL.orange} strokeWidth={4} opacity={1 - (d - dur) / 5} />
      )}
    </g>
  );
};

// Parabolic Ballistic Missile / Artillery Shell Arc + Continuous Contrail Ribbon + Impact Explosion
export const MissileArc: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  at: number;
  dur?: number;
  f: number;
  arcH?: number;
  color?: string;
  explodeSize?: number;
}> = ({ x1, y1, x2, y2, at, dur = 26, f, arcH = 240, color = "#e0e0e0", explodeSize = 185 }) => {
  const d = f - at;
  if (d < 0) return null;
  const u = Math.min(1, d / dur);
  const posAt = (k: number) => ({
    x: x1 + (x2 - x1) * k,
    y: y1 + (y2 - y1) * k - 4 * arcH * k * (1 - k),
  });
  const cur = posAt(u);
  const dx = x2 - x1;
  const dy = y2 - y1 - 4 * arcH * (1 - 2 * u);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const trailFade = interpolate(d, [dur - 2, dur + 12], [1, 0], clamp);
  const uStart = Math.max(0, u - 0.42);
  const trailPts = Array.from({ length: 16 })
    .map((_, i) => {
      const k = uStart + (u - uStart) * (i / 15);
      const p = posAt(k);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <g>
      {trailFade > 0.01 && u > 0.02 && (
        <g opacity={trailFade}>
          <polyline
            points={trailPts}
            fill="none"
            stroke="rgba(180, 176, 168, 0.45)"
            strokeWidth={16}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={trailPts}
            fill="none"
            stroke="rgba(245, 243, 238, 0.85)"
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      {d < dur && (
        <g transform={`translate(${cur.x} ${cur.y}) rotate(${ang})`}>
          <polygon points="-32,-5 -62,-13 -50,0 -62,13 -32,5" fill={COL.orange} />
          <polygon points="-30,-3 -48,-7 -42,0 -48,7 -30,3" fill="#fff9c4" />
          <path d="M-30,-8 L18,-8 Q38,0 18,8 L-30,8 Z" fill={color} stroke={COL.ink} strokeWidth={4} />
          <polygon points="-30,-8 -40,-18 -34,0 -40,18 -30,8" fill={COL.red} stroke={COL.ink} strokeWidth={3.5} />
        </g>
      )}

      <Explosion x={x2} y={y2} at={at + dur} f={f} size={explodeSize} />
    </g>
  );
};

// Continuous Procedural Multi-Tongue Oil/Refinery Fire + Rising Black Smoke
export const Fire: React.FC<{
  x: number;
  y: number;
  f: number;
  scale?: number;
  smoke?: boolean;
}> = ({ x, y, f, scale = 1, smoke = true }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {smoke &&
      Array.from({ length: 6 }).map((_, i) => {
        const cycle = ((f * 0.04 + i / 6) % 1 + 1) % 1;
        const sx = Math.sin(f * 0.08 + i * 1.7) * 18 * cycle;
        const sy = -45 - cycle * 150;
        const sr = 14 + cycle * 34;
        const op = interpolate(cycle, [0, 0.15, 0.8, 1], [0, 0.65, 0.45, 0], clamp);
        return <circle key={`sm${i}`} cx={sx} cy={sy} r={sr} fill="#2e2c2a" opacity={op} />;
      })}
    {[-22, -10, 0, 11, 22].map((ox, i) => {
      const sway = Math.sin(f * 0.32 + i * 1.4) * 8;
      const h = (i === 2 ? 74 : i % 2 === 1 ? 58 : 44) + Math.cos(f * 0.4 + i) * 7;
      const w = i === 2 ? 26 : 20;
      return (
        <g key={`fl${i}`}>
          <path
            d={`M${ox - w},${0} Q${ox - w * 0.6},${-h * 0.55} ${ox + sway},${-h} Q${ox + w * 0.6},${-h * 0.55} ${ox + w},${0} Z`}
            fill={i % 2 === 0 ? COL.red : COL.orange}
            stroke={COL.ink}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <path
            d={`M${ox - w * 0.5},${-2} Q${ox},${-h * 0.45} ${ox + sway * 0.6},${-h * 0.68} Q${ox},${-h * 0.45} ${ox + w * 0.5},${-2} Z`}
            fill="#ffeb3b"
          />
        </g>
      );
    })}
  </g>
);

// Air-Raid Siren Red Pulse + Sweeping Sky Searchlights
export const AirRaidSiren: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  if (f < from || f > to) return null;
  const pulse = 0.5 + 0.5 * Math.sin((f - from) * 0.28);
  const envOp = interpolate(f, [from, from + 10, to - 10, to], [0, 1, 1, 0], clamp);
  const ang1 = Math.sin(f * 0.045) * 28;
  const ang2 = Math.cos(f * 0.038) * 32;
  return (
    <g opacity={envOp}>
      <g transform={`translate(380, 862) rotate(${ang1})`} opacity={0.22}>
        <polygon points="-18,0 -190,-950 190,-950 18,0" fill="#fff9c4" />
      </g>
      <g transform={`translate(1520, 862) rotate(${ang2})`} opacity={0.22}>
        <polygon points="-18,0 -190,-950 190,-950 18,0" fill="#fff9c4" />
      </g>
      <rect x={0} y={0} width={1920} height={90} fill={COL.red} opacity={0.18 * pulse} />
    </g>
  );
};

// Tactical Military Radar HUD Widget
export const RadarSweep: React.FC<{
  x: number;
  y: number;
  r?: number;
  f: number;
  label?: string;
  targets?: { dx: number; dy: number }[];
}> = ({
  x,
  y,
  r = 88,
  f,
  label = "رادار مرزی",
  targets = [
    { dx: -0.35, dy: -0.25 },
    { dx: 0.28, dy: -0.42 },
    { dx: -0.15, dy: 0.35 },
  ],
}) => {
  const ang = (f * 6) % 360;
  const rad = (ang * Math.PI) / 180;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#102418" stroke={COL.ink} strokeWidth={6} />
      <circle r={r * 0.68} fill="none" stroke="#2fa84f" strokeWidth={2} opacity={0.45} />
      <circle r={r * 0.35} fill="none" stroke="#2fa84f" strokeWidth={2} opacity={0.45} />
      <line x1={-r} y1={0} x2={r} y2={0} stroke="#2fa84f" strokeWidth={2} opacity={0.4} />
      <line x1={0} y1={-r} x2={0} y2={r} stroke="#2fa84f" strokeWidth={2} opacity={0.4} />
      <path
        d={`M0,0 L${Math.cos(rad - 0.45) * r},${Math.sin(rad - 0.45) * r} A${r},${r} 0 0,1 ${Math.cos(rad) * r},${Math.sin(rad) * r} Z`}
        fill="rgba(47, 168, 79, 0.38)"
      />
      <line x1={0} y1={0} x2={Math.cos(rad) * r} y2={Math.sin(rad) * r} stroke="#69f0ae" strokeWidth={3.5} />
      {targets.map((t, i) => {
        const blink = 0.45 + 0.55 * Math.abs(Math.sin(f * 0.2 + i * 1.5));
        return <circle key={i} cx={t.dx * r} cy={t.dy * r} r={6} fill={COL.red} stroke="#fff" strokeWidth={2} opacity={blink} />;
      })}
      {label && (
        <text y={r + 32} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={800} fontSize={24} fill={COL.ink}>
          {label}
        </text>
      )}
    </g>
  );
};

// Kings-and-Generals / Vox Style Animated Strategic War Map Widget
export const WarMap: React.FC<{
  x: number;
  y: number;
  f: number;
  at?: number;
  phase: "invasion" | "liberation" | "faw" | "peace";
  scale?: number;
}> = ({ x, y, f, at = 0, phase, scale = 1 }) => {
  const pop = ease(f, at, at + 12, 0, 1);
  if (pop <= 0.01) return null;
  const arrowT = ease(f, at + 8, at + 34, 0, 1);
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.22);

  return (
    <g transform={`translate(${x} ${y}) scale(${scale * pop})`}>
      <rect x={-175} y={-125} width={350} height={250} rx={16} fill="#f8f4e8" stroke={COL.ink} strokeWidth={6} />
      <path d="M-169,-119 L-15,-119 L-5,-25 L-25,65 L-169,65 Z" fill="#f3e5ab" />
      <path d="M-15,-119 L169,-119 L169,85 L45,85 L-25,65 L-5,-25 Z" fill="#dcedc8" />
      <path d="M-169,65 L-25,65 L45,85 L169,85 L169,119 L-169,119 Z" fill="#81d4fa" />

      <polyline
        points="-15,-115 -8,-55 -5,-25 -15,25 -25,65"
        fill="none"
        stroke={phase === "peace" ? COL.blue : COL.ink}
        strokeWidth={phase === "peace" ? 6 : 4}
        strokeDasharray={phase === "peace" ? undefined : "7 5"}
      />

      <text x={-105} y={-82} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={22} fill="#6d4c41">
        عراق
      </text>
      <text x={95} y={-82} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={22} fill="#2e7d32">
        ایران
      </text>
      <text x={0} y={108} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={19} fill="#01579b">
        خلیج فارس
      </text>

      <circle cx={-85} cy={-25} r={6} fill={COL.ink} />
      <text x={-85} y={-36} textAnchor="middle" direction="rtl" fontFamily={FONT.body} fontWeight={800} fontSize={16} fill={COL.ink}>
        بغداد
      </text>

      <circle cx={8} cy={35} r={7 + pulse * 3} fill={phase === "invasion" ? COL.red : COL.green} stroke={COL.ink} strokeWidth={2.5} />
      <text x={45} y={39} textAnchor="middle" direction="rtl" fontFamily={FONT.body} fontWeight={900} fontSize={17} fill={COL.ink}>
        خرمشهر
      </text>

      {phase === "invasion" && (
        <g opacity={arrowT}>
          <path d="M-65,-30 Q-25,-20 12,-5" fill="none" stroke={COL.red} strokeWidth={7} strokeLinecap="round" />
          <polygon points="18,-3 4,-14 6,4" fill={COL.red} />
          <path d="M-55,15 Q-20,25 6,32" fill="none" stroke={COL.red} strokeWidth={7} strokeLinecap="round" />
          <polygon points="12,34 -2,24 0,41" fill={COL.red} />
        </g>
      )}

      {phase === "liberation" && (
        <g opacity={arrowT}>
          <path d="M55,10 Q25,20 -8,28" fill="none" stroke={COL.green} strokeWidth={8} strokeLinecap="round" />
          <polygon points="-15,30 -1,19 1,37" fill={COL.green} />
          <path d="M60,-20 Q25,-12 -6,-5" fill="none" stroke={COL.green} strokeWidth={7} strokeLinecap="round" />
          <polygon points="-13,-4 1,-14 3,4" fill={COL.green} />
        </g>
      )}

      {phase === "faw" && (
        <g opacity={arrowT}>
          <circle cx={-22} cy={62} r={8 + pulse * 3} fill={COL.orange} stroke={COL.ink} strokeWidth={2.5} />
          <text x={-62} y={58} textAnchor="middle" direction="rtl" fontFamily={FONT.body} fontWeight={900} fontSize={17} fill={COL.red}>
            فاو
          </text>
          <path d="M22,52 Q0,58 -18,62" fill="none" stroke={COL.green} strokeWidth={7} strokeLinecap="round" />
        </g>
      )}

      <rect x={-110} y={-144} width={220} height={32} rx={8} fill={COL.ink} />
      <text y={-122} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={800} fontSize={19} fill="#fff">
        {phase === "invasion"
          ? "نقشه جبهه: شهریور ۱۳۵۹"
          : phase === "liberation"
            ? "عملیات بیت‌المقدس: ۱۳۶۱"
            : phase === "faw"
              ? "جبهه فاو و خلیج فارس"
              : "مرز رسمی ۱۹۷۵ = ۱۹۸۸"}
      </text>
    </g>
  );
};

// Full-screen subtle impact flash synced to major hit frames
export const ScreenFlash: React.FC<{ f: number; hits: number[]; color?: string; maxOpacity?: number }> = ({
  f,
  hits,
  color = "#fff8e1",
  maxOpacity = 0.36,
}) => {
  let op = 0;
  for (const h of hits) {
    const d = f - h;
    if (d >= 0 && d < 4) {
      op = Math.max(op, (1 - d / 4) * maxOpacity);
    }
  }
  if (op <= 0.01) return null;
  return <rect x={0} y={0} width={1920} height={1920} fill={color} opacity={op} style={{ pointerEvents: "none" }} />;
};

// horizontal speed lines
export const SpeedLines: React.FC<{ f: number; from: number; to: number; dir?: number; color?: string }> = ({ f, from, to, dir = 1, color = "#d8d4c8" }) => {
  if (f < from || f > to) return null;
  const o = interpolate(f, [from, from + 4, to - 4, to], [0, 1, 1, 0], clamp);
  return (
    <g opacity={o}>
      {Array.from({ length: 18 }).map((_, i) => {
        const y = 80 + random(`sl${i}`) * 920;
        const len = 200 + random(`sll${i}`) * 500;
        const x = ((random(`slx${i}`) * 2400 - f * 90 * dir) % 2400 + 2400) % 2400 - 240;
        return <line key={i} x1={x} y1={y} x2={x + len} y2={y} stroke={color} strokeWidth={4 + random(`slw${i}`) * 6} strokeLinecap="round" />;
      })}
    </g>
  );
};

// text that slams onto the screen with overshoot
export const Slam: React.FC<{
  f: number;
  at: number;
  children: React.ReactNode;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  font?: string;
  rotate?: number;
  out?: number;
  stroke?: string;
  weight?: number;
  spacing?: number;
}> = ({ f, at, children, x = 960, y = 540, size = 120, color = COL.ink, font = FONT.comic, rotate = 0, out, stroke, weight = 400, spacing = 0 }) => {
  const d = f - at;
  if (d < 0) return null;
  const s = interpolate(d, [0, 5, 9, 13], [3.2, 0.92, 1.05, 1], clamp);
  let o = interpolate(d, [0, 3], [0, 1], clamp);
  if (out !== undefined) o *= interpolate(f, [out, out + 8], [1, 0], clamp);
  const blur = interpolate(d, [0, 5], [8, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s}) rotate(${rotate}deg)`,
        opacity: o,
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        fontFamily: font,
        fontSize: size,
        fontWeight: weight,
        color,
        whiteSpace: "nowrap",
        letterSpacing: spacing,
        direction: dirOf(children),
        lineHeight: 1.15,
        WebkitTextStroke: stroke,
        paintOrder: "stroke fill",
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};

// pill-shaped caption that slides in
export const Caption: React.FC<{
  f: number;
  at: number;
  out?: number;
  x?: number;
  y?: number;
  children: React.ReactNode;
  bg?: string;
  color?: string;
  size?: number;
  align?: "left" | "center";
}> = ({ f, at, out, x = 960, y = 980, children, bg = COL.ink, color = "#fff", size = 40, align = "center" }) => {
  const d = f - at;
  if (d < 0) return null;
  const t = ease(f, at, at + 10);
  let o = t;
  if (out !== undefined) o *= interpolate(f, [out, out + 8], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${align === "center" ? "-50%" : "0"}, -50%) translateY(${(1 - t) * 40}px)`,
        opacity: o,
        background: bg,
        color,
        fontFamily: FONT.body,
        fontWeight: 700,
        fontSize: size,
        direction: dirOf(children),
        padding: "14px 30px",
        borderRadius: 14,
        whiteSpace: "nowrap",
        boxShadow: "0 8px 0 rgba(0,0,0,0.12)",
      }}
    >
      {children}
    </div>
  );
};

// typewriter
export const Type: React.FC<{ f: number; at: number; text: string; cps?: number; style?: React.CSSProperties; caret?: boolean }> = ({
  f,
  at,
  text,
  cps = 1.4,
  style,
  caret = true,
}) => {
  const n = Math.max(0, Math.floor((f - at) * cps));
  if (f < at) return null;
  const shown = text.slice(0, n);
  const blink = caret && n < text.length + 10 && Math.floor(f / 8) % 2 === 0;
  return (
    <span style={style}>
      {shown}
      <span style={{ opacity: blink ? 1 : 0 }}>▌</span>
    </span>
  );
};

// mouse cursor (the animator's hand: draw characters, get grabbed, get thrown)
export const Cursor: React.FC<{ x: number; y: number; scale?: number; pressed?: boolean }> = ({ x, y, scale = 1.6, pressed }) => (
  <g transform={`translate(${x} ${y}) scale(${scale * (pressed ? 0.88 : 1)})`}>
    <path d="M0,0 L0,34 L8,26 L14,40 L20,37 L14,24 L25,24 Z" fill="#fff" stroke="#000" strokeWidth={2.4} strokeLinejoin="round" />
  </g>
);

// counting number
export const countUp = (f: number, a: number, b: number, to: number, from = 0) =>
  Math.round(interpolate(f, [a, b], [from, to], { ...clamp, easing: Easing.out(Easing.cubic) }));

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
export const toFaDigits = (s: string | number) =>
  String(s).replace(/\d/g, (d) => FA_DIGITS[Number(d)] ?? d);

// Formats numbers with Persian digits and Persian thousand separator (e.g. ۶۰۰ or ۵٬۰۰۰)
export const fmt = (n: number) =>
  toFaDigits(String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "٬"));

// diagonal black wipe transition (covers both 1920x1080 and 1080x1920 canvases completely!)
export const Wipe: React.FC<{ f: number; dur: number; color?: string }> = ({ f, dur, color = COL.ink }) => {
  if (f < 0 || f > dur) return null;
  const inT = interpolate(f, [0, 10], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const outT = interpolate(f, [dur - 10, dur], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const showIn = f < 10;
  const showOut = f > dur - 10;
  if (!showIn && !showOut) return null;
  const x = showIn ? inT * 2800 : -2800 + outT * 2800;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: x - 400,
          top: -300,
          width: 3200,
          height: 2600,
          background: color,
          transform: "skewX(-14deg)",
        }}
      />
    </AbsoluteFill>
  );
};
