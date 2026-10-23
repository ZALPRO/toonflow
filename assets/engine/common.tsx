import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COL, FONT, Paper, PaperTheme, Slam, dirOf, ease, isRTL, shakeAt } from "./fx";

// stage: paper + SVG layer (characters) + HTML layer (text), sharing one camera shake
export const Stage: React.FC<{
  hits?: number[];
  power?: number;
  svg: React.ReactNode;
  html?: React.ReactNode;
  under?: React.ReactNode;
  cam?: { x?: number; y?: number; z?: number };
  bg?: React.ReactNode;
  theme?: PaperTheme;
}> = ({ hits = [], power = 16, svg, html, under, cam, bg, theme = "default" }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const s = shakeAt(f, hits, power);
  const z = cam?.z ?? 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {bg ?? <Paper theme={theme} />}
      <AbsoluteFill
        style={{
          transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg) scale(${z}) translate(${-(cam?.x ?? 0)}px, ${-(cam?.y ?? 0)}px)`,
          transformOrigin: `${width / 2}px ${height / 2}px`,
        }}
      >
        {under}
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", overflow: "visible" }}>
          {svg}
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${s.x * 0.5}px, ${s.y * 0.5}px)` }}>{html}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// chapter card: black background, slamming number, sliding title
export const ChapterCard: React.FC<{ n: string; title: string; sub?: string; dur: number }> = ({ n, title, sub, dur }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cy = height / 2;
  const s = shakeAt(f, [6], 22);
  const bar = ease(f, 10, 26);
  const out = interpolate(f, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: COL.ink, transform: `translate(${s.x}px, ${s.y}px)`, opacity: out }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: cy - 20,
          height: 14,
          width: `${bar * 100}%`,
          background: COL.orange,
        }}
      />
      <Slam f={f} at={4} x={width / 2} y={cy - 140} size={70} color={COL.orange} font={FONT.title} weight={800} spacing={0}>
        {n}
      </Slam>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: cy + 20,
          textAlign: "center",
          fontFamily: FONT.title,
          fontWeight: 900,
          fontSize: Math.min(130, width / 11),
          color: "#fff",
          letterSpacing: 0,
          direction: isRTL(title) ? "rtl" : "ltr",
          transform: `translateX(${(1 - ease(f, 10, 24)) * -300}px)`,
          opacity: ease(f, 10, 18),
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>
      {sub && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: cy + 180,
            textAlign: "center",
            fontFamily: FONT.body,
            fontWeight: 500,
            fontSize: 38,
            color: "#bdbdbd",
            direction: isRTL(sub) ? "rtl" : "ltr",
            opacity: ease(f, 22, 32),
          }}
        >
          {sub}
        </div>
      )}
    </AbsoluteFill>
  );
};

// physical word block (falls, bounces, hits): text inside a box
export const WordBlock: React.FC<{ x?: number; y?: number; r?: number; text: string; bg?: string; color?: string; size?: number; s?: number }> = ({
  x = 0,
  y = 0,
  r = 0,
  text,
  bg = "#fff",
  color = COL.ink,
  size = 44,
  s = 1,
}) => {
  const w = Math.max(160, text.length * size * 0.56 + 60);
  const h = size + 38;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <rect x={-w / 2 + 6} y={-h / 2 + 6} width={w} height={h} rx={12} fill="rgba(0,0,0,0.14)" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill={bg} stroke={COL.ink} strokeWidth={5.5} />
      <text y={size * 0.34} textAnchor="middle" direction={isRTL(text) ? "rtl" : "ltr"} fontFamily={FONT.title} fontWeight={900} fontSize={size} fill={color} letterSpacing={0}>
        {text}
      </text>
    </g>
  );
};

// gravity fall with damped bounce: returns y
export const fall = (f: number, at: number, y0: number, y1: number, dur = 12) => {
  if (f < at) return y0;
  const t = (f - at) / dur;
  if (t < 1) return y0 + (y1 - y0) * t * t;
  const b = f - at - dur;
  const h = Math.abs(Math.sin(b * 0.45)) * 40 * Math.exp(-b * 0.25);
  return y1 - h;
};

// speech/thought bubble
export const Bubble: React.FC<{ x: number; y: number; w: number; h: number; t: number; tailX?: number; tailY?: number; children?: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  t,
  tailX,
  tailY,
  children,
}) => {
  if (t <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${t})`}>
      {tailX !== undefined && tailY !== undefined && (
        <>
          <circle cx={(tailX - x) * 0.55} cy={(tailY - y) * 0.55 + h * 0.2} r={12} fill="#fff" stroke={COL.ink} strokeWidth={5} />
          <circle cx={(tailX - x) * 0.8} cy={(tailY - y) * 0.8 + h * 0.1} r={7} fill="#fff" stroke={COL.ink} strokeWidth={4} />
        </>
      )}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.4} fill="#fff" stroke={COL.ink} strokeWidth={6} />
      {children}
    </g>
  );
};

// numbered card that pops in with a bounce (Fixed RTL Flexbox: flexDirection "row" inside direction "rtl" places badge on the RIGHT!)
export const Card: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  n?: string;
  w?: number;
  children: React.ReactNode;
  accent?: string;
  out?: number;
  size?: number;
}> = ({ f, at, x, y, n, w = 540, children, accent = COL.orange, out, size = 36 }) => {
  if (f < at) return null;
  const t = ease(f, at, at + 12, 0, 1);
  const s = interpolate(f - at, [0, 6, 10, 14], [0.3, 1.08, 0.97, 1], { extrapolateRight: "clamp" });
  let o = t;
  if (out !== undefined) o *= interpolate(f, [out, out + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y,
        width: w,
        transform: `scale(${s}) rotate(${(1 - t) * -4}deg)`,
        opacity: o,
        background: "#fff",
        border: `5px solid ${COL.ink}`,
        borderRadius: 20,
        boxShadow: `8px 8px 0 ${COL.ink}`,
        padding: "20px 26px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        fontFamily: FONT.body,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.35,
        direction: dirOf(children),
        textAlign: dirOf(children) === "rtl" ? "right" : "left",
        color: COL.ink,
      }}
    >
      {n && (
        <div
          style={{
            flex: "0 0 auto",
            width: 64,
            height: 64,
            borderRadius: 32,
            background: accent,
            color: "#fff",
            fontFamily: FONT.title,
            fontWeight: 900,
            fontSize: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `4.5px solid ${COL.ink}`,
          }}
        >
          {n}
        </div>
      )}
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};

// rubber stamp
export const Stamp: React.FC<{ f: number; at: number; x: number; y: number; text: string; color?: string; size?: number; r?: number }> = ({
  f,
  at,
  x,
  y,
  text,
  color = COL.red,
  size = 110,
  r = -12,
}) => {
  if (f < at) return null;
  const s = interpolate(f - at, [0, 5, 8, 11], [2.6, 0.9, 1.04, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${r}deg) scale(${s})`,
        border: `8px solid ${color}`,
        borderRadius: 16,
        padding: "10px 32px",
        color,
        fontFamily: FONT.title,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 0,
        direction: isRTL(text) ? "rtl" : "ltr",
        whiteSpace: "nowrap",
        background: "rgba(255,255,255,0.92)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        opacity: interpolate(f - at, [0, 3], [0, 1], { extrapolateRight: "clamp" }),
      }}
    >
      {text}
    </div>
  );
};

// Documentary Chronology & War Phase HUD
export const TimelineHUD: React.FC<{
  year: string;
  phase: string;
  progress: number;
  color?: string;
}> = ({ year, phase, progress, color = COL.red }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 28,
        bottom: 36,
        background: "rgba(255, 255, 255, 0.95)",
        border: `4px solid ${COL.ink}`,
        borderRadius: 14,
        boxShadow: `5px 5px 0 ${COL.ink}`,
        padding: "10px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: 265,
        direction: "rtl",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: FONT.title, fontWeight: 900, fontSize: 23, color }}>{year}</span>
        <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 18, color: COL.ink }}>{phase}</span>
      </div>
      <div style={{ position: "relative", height: 10, background: "#e0dcd0", borderRadius: 6, border: `2px solid ${COL.ink}`, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${Math.max(6, Math.min(100, progress * 100))}%`,
            background: color,
            borderRadius: 4,
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.body, fontWeight: 700, fontSize: 13, color: COL.grey }}>
        <span>۱۳۵۹ (۱۹۸۰)</span>
        <span>۱۳۶۷ (۱۹۸۸)</span>
      </div>
    </div>
  );
};

// Animated Comparative Data Bar
export const StatBar: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  w?: number;
  label: string;
  value: string;
  fill: number;
  color?: string;
}> = ({ f, at, x, y, w = 520, label, value, fill, color = COL.red }) => {
  if (f < at) return null;
  const t = ease(f, at, at + 22, 0, 1);
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y,
        width: w,
        background: "#fff",
        border: `5px solid ${COL.ink}`,
        borderRadius: 16,
        boxShadow: `7px 7px 0 ${COL.ink}`,
        padding: "14px 22px",
        opacity: ease(f, at, at + 10, 0, 1),
        transform: `translateY(${(1 - t) * 16}px)`,
        direction: isRTL(label) ? "rtl" : "ltr",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 28, color: COL.ink }}>{label}</span>
        <span style={{ fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color }}>{value}</span>
      </div>
      <div style={{ height: 18, background: "#ece8dc", borderRadius: 9, border: `3px solid ${COL.ink}`, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${t * fill * 100}%`,
            background: color,
            borderRadius: 6,
          }}
        />
      </div>
    </div>
  );
};

// Subtle, low-opacity page ID watermark in the safe zone (ONLY @ghimatrooz, no gold box, no "قیمت روز"!)
export const ReelBadge: React.FC<{
  handle?: string;
  title?: string;
  accent?: string;
}> = ({ handle = "@ghimatrooz" }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        top: 1236,
        fontFamily: "'Inter', 'Vazirmatn', sans-serif",
        fontWeight: 700,
        fontSize: 24,
        color: COL.ink,
        opacity: 0.25,
        letterSpacing: 0.6,
        direction: "ltr",
        userSelect: "none",
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      {handle}
    </div>
  );
};

// Clean, minimalist burned-in subtitles positioned inside the Instagram Reels Safe Zone
export const Captions: React.FC<{
  cues: readonly { startFrame: number; endFrame: number; text: string }[];
  bottom?: number;
  size?: number;
}> = ({ cues, bottom, size }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  const effBottom = bottom ?? (isVertical ? 480 : 60);
  const effSize = size ?? (isVertical ? 38 : 40);
  const c = cues.find((q) => f >= q.startFrame && f < q.endFrame);
  if (!c) return null;
  const o = interpolate(f, [c.startFrame, c.startFrame + 4, c.endFrame - 4, c.endFrame], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", pointerEvents: "none" }}>
      <div
        style={{
          marginBottom: effBottom,
          maxWidth: isVertical ? 880 : width * 0.68,
          textAlign: "center",
          direction: isRTL(c.text) ? "rtl" : "ltr",
          background: isVertical ? "rgba(20, 24, 31, 0.90)" : "rgba(20, 20, 20, 0.85)",
          color: "#fff",
          fontFamily: FONT.body,
          fontWeight: 700,
          fontSize: effSize,
          lineHeight: 1.45,
          padding: isVertical ? "14px 28px" : "10px 26px",
          borderRadius: 18,
          opacity: o,
        }}
      >
        {c.text}
      </div>
    </AbsoluteFill>
  );
};
