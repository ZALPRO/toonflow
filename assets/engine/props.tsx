import React from "react";
import { COL, FONT, isRTL } from "./fx";

// SVG props centred on (0,0): position them with <At>
export const At: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; children: React.ReactNode }> = ({ x, y, s = 1, r = 0, o = 1, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
    {children}
  </g>
);

const K = { stroke: COL.ink, strokeWidth: 5.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

// Reusable ultra-clean minimalist single-line pill label below vector icons (no 2-line clutter!)
export const IconLabel: React.FC<{
  y: number;
  text: string;
  sub?: string;
  bg?: string;
  color?: string;
  accent?: string;
}> = ({ y, text, bg = COL.yellow, color = COL.ink, accent = COL.ink }) => {
  const w = Math.max(220, text.length * 21 + 64);
  const h = 56;
  return (
    <g transform={`translate(0, ${y})`}>
      <rect x={-w / 2 + 5} y={-h / 2 + 5} width={w} height={h} rx={14} fill={COL.ink} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={bg} stroke={accent} strokeWidth={4.5} />
      <text
        y={10}
        textAnchor="middle"
        direction={isRTL(text) ? "rtl" : "ltr"}
        fontFamily={FONT.title}
        fontWeight={900}
        fontSize={30}
        fill={color}
      >
        {text}
      </text>
    </g>
  );
};

export const Barrel: React.FC<{ label?: string }> = ({ label = "OIL" }) => (
  <g>
    <rect x={-50} y={-70} width={100} height={140} rx={14} fill="#2b2b2b" {...K} />
    <rect x={-50} y={-38} width={100} height={10} fill="#555" />
    <rect x={-50} y={28} width={100} height={10} fill="#555" />
    <ellipse cx={0} cy={-70} rx={50} ry={10} fill="#3b3b3b" {...K} />
    <text x={0} y={12} textAnchor="middle" direction="rtl" fontFamily={FONT.comic} fontSize={34} fill={COL.yellow}>
      {label}
    </text>
  </g>
);

export const Bill: React.FC<{ w?: number; sym?: string; color?: string }> = ({ w = 150, sym = "$", color = COL.dollar }) => (
  <g>
    <rect x={-w / 2} y={-w * 0.23} width={w} height={w * 0.46} rx={8} fill="#dcedc8" stroke={color} strokeWidth={5} />
    <rect x={-w / 2 + 10} y={-w * 0.23 + 10} width={w - 20} height={w * 0.46 - 20} rx={4} fill="none" stroke={color} strokeWidth={2.5} />
    <circle cx={0} cy={0} r={w * 0.14} fill={color} />
    <text x={0} y={w * 0.075} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={w * 0.22} fill="#fff">
      {sym}
    </text>
  </g>
);

export const GoldBar: React.FC<{ label?: string }> = ({ label }) => (
  <g>
    <polygon points="-70,30 70,30 50,-25 -50,-25" fill={COL.gold} {...K} />
    <polygon points="-50,-25 50,-25 40,-34 -40,-34" fill="#ffe27a" {...K} strokeWidth={4} />
    <line x1={-35} y1={-12} x2={-10} y2={-12} stroke="#fff6c8" strokeWidth={6} strokeLinecap="round" />
    {label && (
      <text x={0} y={18} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={26} fill={COL.ink}>
        {label}
      </text>
    )}
  </g>
);

export const Coin: React.FC<{ sym: string; color?: string; r?: number }> = ({ sym, color = COL.gold, r = 60 }) => (
  <g>
    <circle r={r} fill={color} {...K} />
    <circle r={r * 0.78} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth={4} />
    <text y={r * 0.33} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={r * 0.95} fill={COL.ink}>
      {sym}
    </text>
  </g>
);

export const Shield: React.FC<{ crack?: number; color?: string }> = ({ crack = 0, color = COL.blue }) => (
  <g>
    <path d="M0,-90 L75,-62 Q75,40 0,95 Q-75,40 -75,-62 Z" fill={color} {...K} />
    <path d="M0,-66 L52,-46 Q52,28 0,68 Q-52,28 -52,-46 Z" fill="none" stroke="#fff" strokeWidth={6} opacity={0.6} />
    <text y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={70} fill="#fff">
      ★
    </text>
    {crack > 0 && (
      <polyline
        points="-10,-90 6,-50 -14,-20 12,10 -6,40 8,95"
        fill="none"
        stroke={COL.ink}
        strokeWidth={7}
        strokeDasharray={260}
        strokeDashoffset={260 * (1 - crack)}
        strokeLinejoin="round"
      />
    )}
  </g>
);

export const Missile: React.FC = () => (
  <g>
    <path d="M-80,-14 L50,-14 Q90,0 50,14 L-80,14 Z" fill="#d9d9d9" {...K} />
    <polygon points="-80,-14 -110,-36 -96,0 -110,36 -80,14" fill={COL.red} {...K} />
    <circle cx={-118} cy={0} r={14} fill={COL.orange} opacity={0.9} />
    <circle cx={-140} cy={0} r={9} fill={COL.yellow} opacity={0.8} />
  </g>
);

export const Printer: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-110} y={-60} width={220} height={110} rx={16} fill="#e8e6df" {...K} />
    <rect x={-80} y={-95} width={160} height={40} rx={6} fill="#fff" {...K} />
    <rect x={-90} y={30} width={180} height={14} rx={7} fill={COL.ink} />
    <circle cx={80} cy={-25} r={10} fill={Math.floor(f / 6) % 2 ? COL.green : "#9ad59f"} />
    <text x={-30} y={0} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={34} fill={COL.ink}>
      FED
    </text>
  </g>
);

// ---------------------------------------------------------------------------
// STUDIO-GRADE VECTOR FINANCE ILLUSTRATIONS (ToonFlow v1.0.0)
// ---------------------------------------------------------------------------

// 1. Isometric/Flat Stack of Banknotes & Initial Savings Badge
export const SavingsBundleIcon: React.FC<{ amount?: string; sub?: string; strap?: string }> = ({
  amount = "۱۰۰ میلیون تومان",
  sub = "پس‌انداز اولیه هر نفر در سال ۱۳۹۵",
  strap = "۱۰۰M",
}) => (
  <g>
    {/* Soft drop shadow */}
    <ellipse cx={0} cy={62} rx={145} ry={18} fill="rgba(0,0,0,0.1)" />

    {/* Bottom bill layer */}
    <rect x={-130} y={-22} width={260} height={70} rx={12} fill="#2e7d32" {...K} />
    {/* Middle bill layer */}
    <rect x={-130} y={-40} width={260} height={70} rx={12} fill="#43a047" {...K} />
    {/* Top banknote face */}
    <rect x={-130} y={-62} width={260} height={78} rx={12} fill="#e8f5e9" {...K} />
    <rect x={-114} y={-48} width={228} height={50} rx={7} fill="#a5d6a7" stroke="#2e7d32" strokeWidth={3} />

    {/* Geometric guilloche circles on bill */}
    <circle cx={-68} cy={-23} r={14} fill="#2e7d32" opacity={0.25} />
    <circle cx={68} cy={-23} r={14} fill="#2e7d32" opacity={0.25} />
    <circle cx={0} cy={-23} r={20} fill="#2e7d32" />

    {/* Paper band strap around the bundle */}
    <rect x={-32} y={-66} width={64} height={118} rx={6} fill="#fff8e1" {...K} strokeWidth={4.5} />
    <rect x={-32} y={-42} width={64} height={40} fill={COL.gold} stroke={COL.ink} strokeWidth={3.5} />
    <text y={-14} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={24} fill={COL.ink}>
      {strap}
    </text>

    <IconLabel y={128} text={amount} sub={sub} bg="#ffffff" color="#1b5e20" accent={COL.ink} />
  </g>
);

// 2. Architectural Classical-Modern Bank Building Icon (with solid inner wall, capitals, steps & emblem)
export const Bank: React.FC<{ label: string; sub?: string; color?: string; w?: number }> = ({
  label,
  sub,
  color = "#e3f2fd",
  w = 240,
}) => (
  <g>
    {/* Ground shadow */}
    <ellipse cx={0} cy={88} rx={w * 0.62} ry={14} fill="rgba(0,0,0,0.1)" />

    {/* Recessed solid inner bank wall (eliminates hollow sky gap behind columns!) */}
    <rect x={-w * 0.44} y={-58} width={w * 0.88} height={120} fill="#90caf9" {...K} />
    {/* Central brass bank door */}
    <rect x={-24} y={2} width={48} height={60} rx={6} fill="#1565c0" {...K} strokeWidth={4} />
    <line x1={0} y1={4} x2={0} y2={60} stroke={COL.ink} strokeWidth={3.5} />

    {/* 4 Fluted Marble Columns with Capitals & Bases */}
    {[-0.35, -0.13, 0.13, 0.35].map((k, idx) => {
      const cx = w * k;
      return (
        <g key={idx}>
          <rect x={cx - 12} y={-54} width={24} height={112} fill="#ffffff" {...K} strokeWidth={4.5} />
          <rect x={cx - 16} y={-60} width={32} height={10} rx={3} fill={color} {...K} strokeWidth={3.5} />
          <rect x={cx - 16} y={52} width={32} height={10} rx={3} fill={color} {...K} strokeWidth={3.5} />
        </g>
      );
    })}

    {/* Architrave beam */}
    <rect x={-w / 2 - 6} y={-78} width={w + 12} height={20} rx={4} fill={color} {...K} />

    {/* Triangular Pediment Roof + Inner Tympanum */}
    <polygon points={`${-w / 2 - 18},-78 0,-152 ${w / 2 + 18},-78`} fill={color} {...K} />
    <polygon points={`${-w * 0.34},-86 0,-134 ${w * 0.34},-86`} fill="#bbdefb" stroke={COL.ink} strokeWidth={3.5} strokeLinejoin="round" />

    {/* Percent / Interest Emblem in Pediment */}
    <circle cx={0} cy={-104} r={14} fill={COL.blue} stroke={COL.ink} strokeWidth={3.5} />
    <text y={-97} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={18} fill="#fff">
      ٪
    </text>

    {/* 2-Step Marble Plinth Base */}
    <rect x={-w / 2 - 10} y={60} width={w + 20} height={14} rx={4} fill={color} {...K} strokeWidth={4.5} />
    <rect x={-w / 2 - 22} y={72} width={w + 44} height={16} rx={5} fill="#bbdefb" {...K} strokeWidth={4.5} />

    <IconLabel y={142} text={label} sub={sub} bg="#ffffff" color={COL.blue} accent={COL.ink} />
  </g>
);

// 3. Gleaming Stacked Gold Coins & Bullion Treasure Icon (replaces the dark stove-like SafeBox!)
export const SafeBox: React.FC<{ label?: string; sub?: string }> = ({ label = "۱۰۰ سکه طلا", sub }) => (
  <g>
    {/* Soft golden glow & ground shadow */}
    <circle cx={0} cy={-18} r={115} fill="rgba(242, 183, 5, 0.14)" />
    <ellipse cx={0} cy={86} rx={140} ry={15} fill="rgba(0,0,0,0.1)" />

    {/* Sleek Vault Pedestal Tray */}
    <rect x={-118} y={48} width={236} height={28} rx={10} fill="#334155" {...K} />
    <rect x={-102} y={36} width={204} height={16} rx={6} fill="#475569" {...K} strokeWidth={4} />

    {/* Back Gold Bullion Ingot Bar */}
    <g transform="translate(-44, 8)">
      <polygon points="-58,28 58,28 44,-18 -44,-18" fill="#f59e0b" {...K} strokeWidth={4.5} />
      <polygon points="-44,-18 44,-18 34,-28 -34,-28" fill="#fde68a" {...K} strokeWidth={3.5} />
      <line x1={-28} y1={-4} x2={12} y2={-4} stroke="#fffbeb" strokeWidth={5} strokeLinecap="round" />
    </g>

    {/* Stacked 3D Gold Coins (Right stack) */}
    {[22, 8, -6, -20].map((cy, i) => (
      <g key={i} transform={`translate(52, ${cy})`}>
        <ellipse cx={0} cy={6} rx={42} ry={13} fill="#d97706" {...K} strokeWidth={4} />
        <ellipse cx={0} cy={0} rx={42} ry={13} fill="#fbbf24" {...K} strokeWidth={4} />
      </g>
    ))}

    {/* Hero Front Bahar Azadi Gold Coin */}
    <g transform="translate(-8, -32)">
      {/* 3D Rim shadow */}
      <circle cx={4} cy={5} r={54} fill="#b45309" {...K} />
      {/* Main gold disc */}
      <circle cx={0} cy={0} r={54} fill="#fbbf24" {...K} />
      {/* Inner milled coin ring */}
      <circle cx={0} cy={0} r={41} fill="#f59e0b" stroke="#78350f" strokeWidth={3} strokeDasharray="6 4" />
      {/* Specular diagonal shine */}
      <path d="M-28,-28 L-8,-42 M-36,-12 L-12,-36" stroke="#fffbeb" strokeWidth={5} strokeLinecap="round" />
      {/* Central Star / Sunburst Emblem */}
      <polygon
        points="0,-24 6,-7 24,-7 10,4 15,21 0,11 -15,21 -10,4 -24,-7 -6,-7"
        fill="#fef08a"
        stroke="#78350f"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    </g>

    <IconLabel y={142} text={label} sub={sub} bg="#fffbeb" color="#b45309" accent={COL.ink} />
  </g>
);

// 4. Modern Multi-Story Apartment Building Illustration (for 1395 Real Purchasing Power)
export const HouseProp: React.FC<{ label?: string; sub?: string; color?: string }> = ({
  label = "۱ آپارتمان نوساز",
  sub = "یا معادل ۱۰۰ سکه بهار آزادی در سال ۱۳۹۵",
  color = "#fff8ee",
}) => (
  <g>
    {/* Ground shadow */}
    <ellipse cx={0} cy={92} rx={155} ry={15} fill="rgba(0,0,0,0.1)" />

    {/* Side Cypress Trees */}
    {[-112, 112].map((tx, i) => (
      <g key={i} transform={`translate(${tx}, 42)`}>
        <line x1={0} y1={12} x2={0} y2={42} stroke={COL.ink} strokeWidth={6} strokeLinecap="round" />
        <ellipse cx={0} cy={-6} rx={22} ry={34} fill="#4caf50" {...K} strokeWidth={4.5} />
        <path d="M-8,-22 Q0,-30 8,-18" fill="none" stroke="#a5d6a7" strokeWidth={4} strokeLinecap="round" />
      </g>
    ))}

    {/* Main 3-Story Apartment Facade */}
    <rect x={-88} y={-105} width={176} height={188} rx={8} fill={color} {...K} />
    {/* Accent brick/stone side column */}
    <rect x={-88} y={-105} width={34} height={188} rx={4} fill="#fed7aa" {...K} strokeWidth={4.5} />

    {/* Modern Sloped Terracotta Roof + Cornice */}
    <polygon points="-104,-102 0,-158 104,-102" fill={COL.red} {...K} />
    <rect x={-96} y={-108} width={192} height={14} rx={5} fill="#e2e8f0" {...K} strokeWidth={4.5} />

    {/* 2 Floors of Modern Lit Windows with Balconies */}
    {[-68, -8].map((wy, row) => (
      <g key={row}>
        {[-42, 26].map((wx, col) => (
          <g key={col} transform={`translate(${wx}, ${wy})`}>
            <rect x={-22} y={-20} width={44} height={38} rx={5} fill="#bae6fd" {...K} strokeWidth={4} />
            <line x1={-12} y1={-10} x2={-2} y2={-18} stroke="#ffffff" strokeWidth={4} strokeLinecap="round" />
            <rect x={-26} y={16} width={52} height={8} rx={3} fill="#94a3b8" stroke={COL.ink} strokeWidth={3.5} />
          </g>
        ))}
      </g>
    ))}

    {/* Ground Floor Entrance Canopy & Double Lobby Door */}
    <rect x={-32} y={32} width={64} height={51} rx={6} fill="#78350f" {...K} strokeWidth={4.5} />
    <line x1={0} y1={34} x2={0} y2={82} stroke={COL.ink} strokeWidth={3.5} />
    <rect x={-42} y={22} width={84} height={12} rx={4} fill={COL.orange} {...K} strokeWidth={4} />

    {/* Base sidewalk */}
    <rect x={-130} y={82} width={260} height={12} rx={6} fill="#cbd5e1" {...K} strokeWidth={4.5} />

    <IconLabel y={150} text={label} sub={sub} bg="#ffffff" color={COL.green} accent={COL.ink} />
  </g>
);

// 5. Self-Contained Melting Ice Purchasing Power Illustration (Fixes the Ice+Fire+Smoke overlap!)
export const InflationMeltIcon: React.FC<{ f: number; melt: number; note?: string; label?: string; sub?: string }> = ({
  f,
  melt,
  note = "۶۰۰ میلیون",
  label = "آب شدن قدرت خرید در تورم ۴۰٪",
  sub = "ارزش واقعیِ ۶۰۰ میلیون، کمتر از یک‌پنجمِ سال ۹۵ شد!",
}) => {
  // melt goes from 1.0 (full ice cube) down to ~0.62 (visibly shrunk but still large & crisp)
  const iceS = Math.max(0.62, Math.min(1.05, 0.35 + melt * 0.65));
  const puddleW = 115 + (1 - iceS) * 165;
  const dropY1 = (f * 3.2) % 52;
  const dropY2 = ((f + 18) * 3.2) % 52;
  const dropY3 = ((f + 35) * 3.2) % 52;

  return (
    <g>
      {/* Ground puddle of melted purchasing power */}
      <ellipse cx={0} cy={66} rx={puddleW} ry={18} fill="#7dd3fc" stroke="#0284c7" strokeWidth={4.5} />

      {/* Dripping water droplets */}
      <circle cx={-56} cy={4 + dropY1} r={7} fill="#38bdf8" stroke="#0284c7" strokeWidth={2.5} />
      <circle cx={56} cy={4 + dropY2} r={7} fill="#38bdf8" stroke="#0284c7" strokeWidth={2.5} />
      <circle cx={0} cy={8 + dropY3} r={6} fill="#38bdf8" stroke="#0284c7" strokeWidth={2.5} />

      {/* Translucent Glossy Ice Block holding shrinking value (positioned cleanly above flames!) */}
      <g transform={`translate(0, ${-48 + (1 - iceS) * 26}) scale(${iceS})`}>
        <rect
          x={-115}
          y={-95}
          width={230}
          height={175}
          rx={28}
          fill="rgba(186, 230, 253, 0.85)"
          stroke="#0284c7"
          strokeWidth={5.5}
        />
        {/* Banknote frozen inside the melting ice */}
        <rect x={-78} y={-42} width={156} height={68} rx={10} fill="#dcfce7" stroke="#15803d" strokeWidth={4.5} />
        <text y={8} textAnchor="middle" direction={isRTL(note) ? "rtl" : "ltr"} fontFamily={FONT.title} fontWeight={900} fontSize={30} fill="#15803d">
          {note}
        </text>
        {/* Crisp white specular ice highlights */}
        <line x1={-86} y1={-70} x2={-36} y2={-70} stroke="#ffffff" strokeWidth={8} strokeLinecap="round" />
        <line x1={-86} y1={-70} x2={-86} y2={-32} stroke="#ffffff" strokeWidth={8} strokeLinecap="round" />
        <line x1={48} y1={52} x2={84} y2={52} stroke="#ffffff" strokeWidth={7} strokeLinecap="round" />
      </g>

      {/* Clean Inflation Flames along the bottom rim (NO black smoke balls covering the ice!) */}
      {[-76, -38, 0, 38, 76].map((ox, i) => {
        const sway = Math.sin(f * 0.28 + i * 1.3) * 6;
        const fh = (i === 2 ? 56 : i % 2 === 1 ? 46 : 38) + Math.cos(f * 0.35 + i) * 5;
        return (
          <g key={i} transform={`translate(${ox}, 66)`}>
            <path
              d={`M-20,0 Q-13,${-fh * 0.55} ${sway},${-fh} Q13,${-fh * 0.55} 20,0 Z`}
              fill={i % 2 === 0 ? COL.red : COL.orange}
              stroke={COL.ink}
              strokeWidth={4}
              strokeLinejoin="round"
            />
            <path
              d={`M-10,-2 Q0,${-fh * 0.4} ${sway * 0.5},${-fh * 0.65} Q0,${-fh * 0.4} 10,-2 Z`}
              fill="#fef08a"
            />
          </g>
        );
      })}

      <IconLabel
        y={142}
        text={label}
        sub={sub}
        bg="#fef2f2"
        color={COL.red}
        accent={COL.ink}
      />
    </g>
  );
};

export const Box: React.FC<{ label?: string; color?: string }> = ({ label, color = "#d9a066" }) => (
  <g>
    <rect x={-48} y={-42} width={96} height={84} rx={4} fill={color} {...K} />
    <line x1={-48} y1={-14} x2={48} y2={-14} stroke={COL.ink} strokeWidth={4} />
    {label && (
      <text y={24} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={COL.ink}>
        {label}
      </text>
    )}
  </g>
);

export const Ship: React.FC<{ color?: string; name?: string }> = ({ color = "#7c4d25", name }) => (
  <g>
    <path d="M-175,-15 L-135,0 L120,0 L165,-35 L145,52 L-135,52 Z" fill={color} {...K} />
    <line x1={-145} y1={22} x2={145} y2={22} stroke="#4e2f14" strokeWidth={5} />
    <line x1={-155} y1={-5} x2={-215} y2={-42} stroke={COL.ink} strokeWidth={6} strokeLinecap="round" />
    <line x1={-10} y1={0} x2={-10} y2={-225} stroke={COL.ink} strokeWidth={8} strokeLinecap="round" />
    <rect x={-32} y={-235} width={44} height={18} rx={4} fill="#5c3818" {...K} strokeWidth={4} />
    <path d="M-10,-205 Q-115,-125 -10,-35 Q25,-120 -10,-205 Z" fill="#faf8f2" {...K} />
    <line x1={-62} y1={-120} x2={-20} y2={-120} stroke={COL.red} strokeWidth={9} strokeLinecap="round" />
    <line x1={-41} y1={-142} x2={-41} y2={-98} stroke={COL.red} strokeWidth={9} strokeLinecap="round" />
    <line x1={-105} y1={0} x2={-105} y2={-145} stroke={COL.ink} strokeWidth={6} strokeLinecap="round" />
    <path d="M-105,-135 Q-165,-85 -105,-30 Z" fill="#faf8f2" {...K} strokeWidth={5} />
    <polygon points="-10,-235 -65,-222 -10,-212" fill={COL.red} stroke={COL.ink} strokeWidth={3} />
    {name && (
      <text x={15} y={40} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={26} fill="#fff">
        {name}
      </text>
    )}
  </g>
);

export const ScrollMap: React.FC<{ label?: string }> = ({ label }) => (
  <g>
    <rect x={-34} y={-24} width={68} height={48} rx={6} fill="#f5e1b8" stroke={COL.ink} strokeWidth={4.5} />
    <ellipse cx={-34} cy={0} rx={6} ry={26} fill="#e2c48e" stroke={COL.ink} strokeWidth={4} />
    <ellipse cx={34} cy={0} rx={6} ry={26} fill="#e2c48e" stroke={COL.ink} strokeWidth={4} />
    <path d="M-18,-6 Q0,-16 18,4" fill="none" stroke={COL.red} strokeWidth={3.5} strokeDasharray="5 4" strokeLinecap="round" />
    <circle cx={18} cy={4} r={4} fill={COL.red} />
    {label && (
      <text y={44} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={22} fill={COL.ink}>
        {label}
      </text>
    )}
  </g>
);

export const Spyglass: React.FC<{ dir?: number }> = ({ dir = 1 }) => (
  <g transform={`scale(${dir} 1)`}>
    <polygon points="0,-6 52,-12 52,12 0,6" fill={COL.gold} stroke={COL.ink} strokeWidth={4.5} strokeLinejoin="round" />
    <rect x={50} y={-14} width={12} height={28} rx={3} fill="#4aa3d8" stroke={COL.ink} strokeWidth={4} />
    <line x1={24} y1={-9} x2={24} y2={9} stroke={COL.ink} strokeWidth={4} />
  </g>
);

export const Cutlass: React.FC<{ dir?: number }> = ({ dir = 1 }) => (
  <g transform={`scale(${dir} 1)`}>
    <path d="M0,0 Q38,-12 72,-42 Q52,-6 8,8 Z" fill="#dcdcdc" stroke={COL.ink} strokeWidth={4.5} strokeLinejoin="round" />
    <rect x={-14} y={-6} width={16} height={12} rx={4} fill={COL.gold} stroke={COL.ink} strokeWidth={4} />
  </g>
);

export const Logbook: React.FC<{ label?: string; color?: string }> = ({ label = "دفتر", color = COL.red }) => (
  <g>
    <rect x={-32} y={-38} width={64} height={76} rx={6} fill={color} stroke={COL.ink} strokeWidth={5} />
    <rect x={-22} y={-28} width={44} height={26} rx={3} fill="#fff" stroke={COL.ink} strokeWidth={3} />
    <text y={-9} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={19} fill={COL.ink}>
      {label}
    </text>
  </g>
);

export const Ice: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <g>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill="rgba(160,215,245,0.6)" stroke="#4aa3d8" strokeWidth={6} />
    <polyline points={`${-w / 2 + 20},${-h / 2 + 30} ${-w / 2 + 60},${-h / 2 + 15}`} stroke="#fff" strokeWidth={8} strokeLinecap="round" />
    <polyline points={`${w / 2 - 50},${h / 2 - 20} ${w / 2 - 20},${h / 2 - 40}`} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
  </g>
);

export const Chain: React.FC<{ x1: number; y1: number; x2: number; y2: number; t: number; color?: string }> = ({ x1, y1, x2, y2, t, color = COL.blue }) => {
  const n = 9;
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const shown = Math.floor(n * t);
  return (
    <g>
      {Array.from({ length: shown }).map((_, i) => {
        const k = (i + 0.5) / n;
        return (
          <rect
            key={i}
            x={-22}
            y={-11}
            width={44}
            height={22}
            rx={11}
            fill="none"
            stroke={color}
            strokeWidth={7}
            transform={`translate(${x1 + (x2 - x1) * k} ${y1 + (y2 - y1) * k}) rotate(${ang})`}
          />
        );
      })}
    </g>
  );
};

export const Flag: React.FC<{ colors: string[]; label?: string; vertical?: boolean }> = ({ colors, label, vertical }) => (
  <g>
    <line x1={0} y1={92} x2={0} y2={-155} stroke={COL.ink} strokeWidth={7} strokeLinecap="round" />
    <circle cx={0} cy={-160} r={7} fill={COL.gold} stroke={COL.ink} strokeWidth={3.5} />
    <rect x={-24} y={82} width={48} height={12} rx={4} fill="#6e6a63" stroke={COL.ink} strokeWidth={4} />
    {colors.map((c, i) =>
      vertical ? (
        <rect key={i} x={(i * 96) / colors.length} y={-152} width={96 / colors.length} height={62} fill={c} />
      ) : (
        <rect key={i} x={0} y={-152 + (i * 62) / colors.length} width={96} height={62 / colors.length} fill={c} />
      ),
    )}
    <rect x={0} y={-152} width={96} height={62} fill="none" stroke={COL.ink} strokeWidth={4.5} />
    {label && (
      <g transform="translate(48, -62)">
        <rect x={-72} y={-18} width={144} height={34} rx={8} fill="#fff" stroke={COL.ink} strokeWidth={3.5} />
        <text y={7} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={22} fill={COL.ink}>
          {label}
        </text>
      </g>
    )}
  </g>
);

export const Tank: React.FC<{ dir?: number; color?: string; label?: string; recoil?: number }> = ({
  dir = 1,
  color = "#6e7f52",
  label,
  recoil = 0,
}) => (
  <g transform={`scale(${dir} 1)`}>
    <rect x={-125} y={10} width={250} height={44} rx={22} fill="#2e2e2e" {...K} />
    {[-90, -45, 0, 45, 90].map((wx, i) => (
      <g key={i}>
        <circle cx={wx} cy={32} r={15} fill="#555" stroke={COL.ink} strokeWidth={4} />
        <circle cx={wx} cy={32} r={5} fill="#222" />
      </g>
    ))}
    <polygon points="-135,14 -105,-22 105,-22 140,14" fill={color} {...K} />
    <line x1={-100} y1={-4} x2={105} y2={-4} stroke="rgba(0,0,0,0.28)" strokeWidth={5} />
    <g transform={`translate(${-recoil} 0)`}>
      <rect x={55} y={-48} width={125} height={14} rx={4} fill={color} {...K} />
      <rect x={165} y={-52} width={22} height={22} rx={4} fill="#3e4730" {...K} />
    </g>
    <path d="M-65,-22 L-45,-62 L52,-62 L75,-22 Z" fill={color} {...K} />
    <rect x={-28} y={-74} width={38} height={12} rx={4} fill="#3e4730" {...K} />
    {label && (
      <g transform={`scale(${dir} 1)`}>
        <text x={0} y={2} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={24} fill="#fff">
          {label}
        </text>
      </g>
    )}
  </g>
);

export const FighterJet: React.FC<{ dir?: number; color?: string; label?: string; afterburner?: boolean }> = ({
  dir = 1,
  color = "#cfd8dc",
  label,
  afterburner = true,
}) => (
  <g transform={`scale(${dir} 1)`}>
    {afterburner && (
      <g>
        <polygon points="-115,-4 -185,-16 -160,0 -185,16 -115,4" fill={COL.orange} />
        <polygon points="-115,-2 -152,-8 -140,0 -152,8 -115,2" fill="#fff9c4" />
      </g>
    )}
    <polygon points="-108,-8 -130,-52 -92,-52 -74,-8" fill={color} {...K} strokeWidth={5} />
    <path d="M-118,-10 L65,-12 L145,2 L65,14 L-118,12 Z" fill={color} {...K} strokeWidth={5} />
    <path d="M12,-12 Q52,-32 88,-8 Z" fill="#29b6f6" {...K} strokeWidth={4.5} />
    <polygon points="-45,2 -85,36 -18,36 32,4" fill="#90a4ae" {...K} strokeWidth={5} />
    <rect x={-52} y={32} width={54} height={7} rx={3} fill={COL.red} stroke={COL.ink} strokeWidth={3} />
    {label && (
      <g transform={`scale(${dir} 1)`}>
        <text x={-10} y={-24} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={22} fill={COL.ink}>
          {label}
        </text>
      </g>
    )}
  </g>
);

export const OilTanker: React.FC<{ color?: string; name?: string }> = ({ color = "#263238", name = "نفت‌کش" }) => (
  <g>
    <rect x={-155} y={-88} width={68} height={68} rx={4} fill="#eceff1" {...K} />
    <rect x={-145} y={-74} width={48} height={14} rx={2} fill="#29b6f6" stroke={COL.ink} strokeWidth={3.5} />
    <line x1={-120} y1={-88} x2={-120} y2={-122} stroke={COL.ink} strokeWidth={6} strokeLinecap="round" />
    <rect x={-75} y={-32} width={210} height={12} rx={4} fill={COL.orange} {...K} strokeWidth={4} />
    <polygon points="-190,-20 185,-20 215,-34 190,46 -175,46" fill={color} {...K} />
    <polygon points="-179,18 199,18 190,46 -175,46" fill={COL.red} {...K} strokeWidth={4} />
    {name && (
      <text x={15} y={8} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={28} fill="#fff">
        {name}
      </text>
    )}
  </g>
);

export const Rifle: React.FC<{ dir?: number }> = ({ dir = 1 }) => (
  <g transform={`scale(${dir} 1)`}>
    <polygon points="-54,10 -26,-4 -26,5 -48,18" fill="#6d4c41" stroke={COL.ink} strokeWidth={4} strokeLinejoin="round" />
    <polygon points="-24,4 -16,4 -20,17 -27,17" fill="#4e342e" stroke={COL.ink} strokeWidth={3.5} strokeLinejoin="round" />
    <rect x={-28} y={-6} width={44} height={11} rx={2} fill="#37474f" stroke={COL.ink} strokeWidth={4} />
    <line x1={16} y1={-2} x2={56} y2={-2} stroke={COL.ink} strokeWidth={6} strokeLinecap="round" />
    <line x1={48} y1={-2} x2={48} y2={-9} stroke={COL.ink} strokeWidth={4} strokeLinecap="round" />
    <path d="M-10,5 Q-6,23 4,25 L10,21 Q1,15 0,5 Z" fill="#263238" stroke={COL.ink} strokeWidth={3.5} />
  </g>
);

export const Sandbags: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <g transform={`scale(${scale})`}>
    {[
      [-52, 0],
      [0, 0],
      [52, 0],
      [-26, -24],
      [26, -24],
      [0, -48],
    ].map(([bx, by], i) => (
      <rect
        key={i}
        x={bx - 28}
        y={by - 14}
        width={56}
        height={26}
        rx={12}
        fill="#c8b282"
        stroke={COL.ink}
        strokeWidth={4.5}
      />
    ))}
  </g>
);

export const BarbedWire: React.FC<{ w?: number }> = ({ w = 160 }) => (
  <g>
    {[-w * 0.35, w * 0.35].map((px, i) => (
      <g key={i}>
        <line x1={px - 22} y1={20} x2={px + 22} y2={-36} stroke="#5d4037" strokeWidth={7} strokeLinecap="round" />
        <line x1={px + 22} y1={20} x2={px - 22} y2={-36} stroke="#5d4037" strokeWidth={7} strokeLinecap="round" />
      </g>
    ))}
    <line x1={-w / 2} y1={-18} x2={w / 2} y2={-18} stroke={COL.ink} strokeWidth={4} />
    <line x1={-w / 2} y1={2} x2={w / 2} y2={2} stroke={COL.ink} strokeWidth={4} />
    {[-0.38, -0.18, 0, 0.18, 0.38].map((k, i) => (
      <g key={i} transform={`translate(${w * k} -18)`}>
        <line x1={-6} y1={-6} x2={6} y2={6} stroke={COL.ink} strokeWidth={3.5} />
        <line x1={6} y1={-6} x2={-6} y2={6} stroke={COL.ink} strokeWidth={3.5} />
      </g>
    ))}
  </g>
);

export const TreatyDoc: React.FC<{ title: string; sub?: string; tear?: number; color?: string }> = ({
  title,
  sub,
  tear = 0,
  color = "#fff8e7",
}) => {
  const sep = tear * 42;
  const rot = tear * 22;
  return (
    <g>
      <g transform={`translate(${-sep} ${tear * 10}) rotate(${-rot})`}>
        <polygon points="-75,-55 2,-55 -4,-20 5,10 -3,35 2,55 -75,55" fill={color} {...K} strokeWidth={5} />
        <line x1={-58} y1={-25} x2={-12} y2={-25} stroke={COL.ink} strokeWidth={4} strokeLinecap="round" />
        <line x1={-58} y1={-5} x2={-14} y2={-5} stroke={COL.ink} strokeWidth={4} strokeLinecap="round" />
        <circle cx={-42} cy={26} r={12} fill={COL.red} stroke={COL.ink} strokeWidth={3.5} />
      </g>
      <g transform={`translate(${sep} ${tear * 10}) rotate(${rot})`}>
        <polygon points="2,-55 75,-55 75,55 2,55 -3,35 5,10 -4,-20" fill={color} {...K} strokeWidth={5} />
        <line x1={12} y1={-25} x2={58} y2={-25} stroke={COL.ink} strokeWidth={4} strokeLinecap="round" />
        <line x1={14} y1={-5} x2={58} y2={-5} stroke={COL.ink} strokeWidth={4} strokeLinecap="round" />
        <line x1={14} y1={15} x2={52} y2={15} stroke={COL.ink} strokeWidth={4} strokeLinecap="round" />
      </g>
      {tear > 0.15 && (
        <polyline
          points="0,-48 -6,-18 6,8 -4,32 0,52"
          fill="none"
          stroke={COL.red}
          strokeWidth={4}
          strokeDasharray="6 4"
          opacity={Math.min(1, tear * 1.4)}
        />
      )}
      <text
        y={-68}
        textAnchor="middle"
        direction="rtl"
        fontFamily={FONT.title}
        fontWeight={900}
        fontSize={26}
        fill={COL.ink}
        stroke="#fafaf7"
        strokeWidth={6}
        paintOrder="stroke"
      >
        {title}
      </text>
      {sub && (
        <text
          y={88 + tear * 18}
          textAnchor="middle"
          direction="rtl"
          fontFamily={FONT.title}
          fontWeight={800}
          fontSize={22}
          fill={COL.red}
          stroke="#fafaf7"
          strokeWidth={5}
          paintOrder="stroke"
        >
          {sub}
        </text>
      )}
    </g>
  );
};

export const Podium: React.FC<{ label?: string; color?: string }> = ({ label = "بغداد", color = "#6d4c41" }) => (
  <g>
    <polygon points="-64,-56 64,-56 50,60 -50,60" fill={color} {...K} />
    <rect x={-74} y={-70} width={148} height={16} rx={5} fill="#3e2723" {...K} />
    <path d="M-22,-70 Q-30,-94 -12,-96" fill="none" stroke={COL.ink} strokeWidth={4.5} strokeLinecap="round" />
    <circle cx={-10} cy={-96} r={5} fill={COL.ink} />
    <path d="M22,-70 Q30,-94 12,-96" fill="none" stroke={COL.ink} strokeWidth={4.5} strokeLinecap="round" />
    <circle cx={10} cy={-96} r={5} fill={COL.ink} />
    <circle cx={0} cy={-26} r={16} fill={COL.gold} stroke={COL.ink} strokeWidth={4} />
    {label && (
      <g transform="translate(0, 26)">
        <rect x={-48} y={-16} width={96} height={30} rx={6} fill="rgba(0,0,0,0.35)" />
        <text y={6} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={21} fill="#fff">
          {label}
        </text>
      </g>
    )}
  </g>
);

export const CarProp: React.FC<{ label?: string; color?: string; crossed?: boolean }> = ({
  label = "خودرو",
  color = "#90a4ae",
  crossed = false,
}) => (
  <g>
    <path d="M-85,10 L-55,-34 L35,-34 L68,10 L92,14 L92,42 L-92,42 L-92,14 Z" fill={color} {...K} />
    <polygon points="-46,-26 -6,-26 -6,8 -68,8" fill="#b3e5fc" stroke={COL.ink} strokeWidth={4} />
    <polygon points="2,-26 30,-26 56,8 2,8" fill="#b3e5fc" stroke={COL.ink} strokeWidth={4} />
    <circle cx={-52} cy={42} r={20} fill="#263238" {...K} />
    <circle cx={-52} cy={42} r={8} fill="#cfd8dc" />
    <circle cx={52} cy={42} r={20} fill="#263238" {...K} />
    <circle cx={52} cy={42} r={8} fill="#cfd8dc" />
    {crossed && (
      <g>
        <line x1={-85} y1={-40} x2={85} y2={55} stroke={COL.red} strokeWidth={12} strokeLinecap="round" />
        <line x1={85} y1={-40} x2={-85} y2={55} stroke={COL.red} strokeWidth={12} strokeLinecap="round" />
      </g>
    )}
    {label && (
      <text y={92} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={28} fill={crossed ? COL.red : COL.ink}>
        {label}
      </text>
    )}
  </g>
);

// ---------------------------------------------------------------------------
// MARKET PSYCHOLOGY, FOMO PEAK & DCA STAIRCASE PROPS (ToonFlow v1.0.0)
// ---------------------------------------------------------------------------

export const FomoTrapChartIcon: React.FC<{ label?: string }> = ({ label = "خرید در قله = ضرر!" }) => (
  <g>
    <rect x={-204} y={-89} width={420} height={165} rx={18} fill={COL.ink} />
    <rect x={-210} y={-95} width={420} height={165} rx={18} fill="#fffdf6" stroke={COL.ink} strokeWidth={5.5} />
    <path
      d="M-165,38 L-85,18 L-15,-18 L35,-68"
      fill="none"
      stroke={COL.green}
      strokeWidth={9}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M35,-68 L115,28 L165,42"
      fill="none"
      stroke={COL.red}
      strokeWidth={9}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx={35} cy={-68} r={20} fill="rgba(229, 50, 45, 0.22)" />
    <circle cx={35} cy={-68} r={11} fill={COL.red} stroke={COL.ink} strokeWidth={4} />
    <IconLabel y={120} text={label} bg={COL.yellow} color={COL.ink} />
  </g>
);

export const BreakingHypeIcon: React.FC<{ header?: string; body?: string; label?: string }> = ({
  header = "خبر فوری: پرواز طلا و دلار!",
  body = "خرید با کل ۵۰۰ میلیون!",
  label = "ورود هیجانی در اوج",
}) => (
  <g>
    <rect x={-204} y={-79} width={420} height={145} rx={18} fill={COL.ink} />
    <rect x={-210} y={-85} width={420} height={145} rx={18} fill="#fffdf6" stroke={COL.ink} strokeWidth={5.5} />
    <rect x={-210} y={-85} width={420} height={46} rx={14} fill={COL.red} stroke={COL.ink} strokeWidth={5} />
    <text x={0} y={-54} textAnchor="middle" direction={isRTL(header) ? "rtl" : "ltr"} fontFamily={FONT.title} fontWeight={900} fontSize={24} fill="#fff">
      {header}
    </text>
    <text x={0} y={18} textAnchor="middle" direction={isRTL(body) ? "rtl" : "ltr"} fontFamily={FONT.title} fontWeight={900} fontSize={32} fill={COL.ink}>
      {body}
    </text>
    <IconLabel y={114} text={label} bg={COL.yellow} color={COL.ink} />
  </g>
);

export const BubbleMeterIcon: React.FC<{ label?: string }> = ({ label = "حباب هیجانی بازار!" }) => (
  <g>
    <rect x={-194} y={-84} width={400} height={155} rx={18} fill={COL.ink} />
    <rect x={-200} y={-90} width={400} height={155} rx={18} fill="#fffdf6" stroke={COL.ink} strokeWidth={5.5} />
    <path d="M-105,42 A105,105 0 0,1 -38,-55" fill="none" stroke={COL.green} strokeWidth={22} strokeLinecap="round" />
    <path d="M-38,-55 A105,105 0 0,1 38,-55" fill="none" stroke={COL.gold} strokeWidth={22} />
    <path d="M38,-55 A105,105 0 0,1 105,42" fill="none" stroke={COL.red} strokeWidth={22} strokeLinecap="round" />
    <line x1={0} y1={42} x2={72} y2={-24} stroke={COL.ink} strokeWidth={8} strokeLinecap="round" />
    <circle cx={0} cy={42} r={12} fill={COL.ink} />
    <IconLabel y={118} text={label} bg={COL.yellow} color={COL.ink} />
  </g>
);

export const StepLadderIcon: React.FC<{ s1?: string; s2?: string; s3?: string; label?: string }> = ({
  s1 = "پله ۱: ۳۰٪",
  s2 = "پله ۲: ۳۰٪",
  s3 = "پله ۳: ۴۰٪",
  label = "خرید هوشمند در ۳ پله",
}) => (
  <g>
    <rect x={-209} y={-89} width={430} height={165} rx={18} fill={COL.ink} />
    <rect x={-215} y={-95} width={430} height={165} rx={18} fill="#fffdf6" stroke={COL.ink} strokeWidth={5.5} />
    <rect x={68} y={-15} width={112} height={62} rx={10} fill="#dcfce7" stroke={COL.ink} strokeWidth={4.5} />
    <text x={124} y={22} textAnchor="middle" direction={isRTL(s1) ? "rtl" : "ltr"} fontFamily={FONT.title} fontWeight={900} fontSize={isRTL(s1) ? 23 : 18} fill={COL.green}>
      {s1}
    </text>
    <rect x={-56} y={-44} width={112} height={91} rx={10} fill="#bbf7d0" stroke={COL.ink} strokeWidth={4.5} />
    <text x={0} y={8} textAnchor="middle" direction={isRTL(s2) ? "rtl" : "ltr"} fontFamily={FONT.title} fontWeight={900} fontSize={isRTL(s2) ? 23 : 18} fill={COL.green}>
      {s2}
    </text>
    <rect x={-180} y={-74} width={112} height={121} rx={10} fill={COL.gold} stroke={COL.ink} strokeWidth={4.5} />
    <text x={-124} y={-6} textAnchor="middle" direction={isRTL(s3) ? "rtl" : "ltr"} fontFamily={FONT.title} fontWeight={900} fontSize={isRTL(s3) ? 23 : 18} fill={COL.ink}>
      {s3}
    </text>
    <IconLabel y={120} text={label} bg={COL.yellow} color={COL.ink} />
  </g>
);
