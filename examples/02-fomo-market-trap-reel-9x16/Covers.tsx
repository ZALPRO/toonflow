import React from "react";
import { AbsoluteFill } from "remotion";
import { COL, FONT, Paper } from "../stickman/fx";
import { Actor, P, groundY } from "../stickman/stick";

const COVER_GROUND = 1380;
const SCALE = 1.58;
const GY = groundY(SCALE, COVER_GROUND);

// Pure Cover-Optimized Melting Bank Ice Graphic (No wide bottom callout bar)
const CoverMeltGraphic: React.FC = () => (
  <g transform="translate(282, 915)">
    <ellipse cx={0} cy={62} rx={155} ry={22} fill="#bae6fd" stroke={COL.ink} strokeWidth={4.5} />
    <g transform="translate(0, 50) scale(0.84)">
      <rect x={-95} y={-155} width={190} height={145} rx={22} fill="#e0f2fe" stroke={COL.ink} strokeWidth={5.5} />
      <rect x={-72} y={-110} width={144} height={54} rx={10} fill="#ffffff" stroke={COL.ink} strokeWidth={3.5} />
      <text x={0} y={-74} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={26} fill={COL.green}>
        ۶۰۰ میلیون
      </text>
    </g>
    {[-85, -42, 0, 42, 85].map((fx, i) => (
      <polygon
        key={i}
        points={`${fx - 22},58 ${fx},12 ${fx + 22},58`}
        fill={i % 2 === 0 ? COL.red : COL.orange}
        stroke={COL.ink}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    ))}
    <rect x={-135} y={-115} width={270} height={40} rx={12} fill={COL.red} stroke={COL.ink} strokeWidth={4} />
    <text x={0} y={-88} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={22} fill="#fff">
      ذوب شدن در تورم ۴۰٪!
    </text>
  </g>
);

// Pure Cover-Optimized Gold Bullion & Coins Graphic
const CoverGoldGraphic: React.FC = () => (
  <g transform="translate(798, 915)">
    <rect x={-135} y={-115} width={270} height={40} rx={12} fill={COL.green} stroke={COL.ink} strokeWidth={4} />
    <text x={0} y={-88} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={22} fill="#fff">
      ۱۰۰ سکه = ۵ میلیارد!
    </text>

    <g transform="translate(0, 12)">
      <rect x={-120} y={36} width={240} height={22} rx={10} fill="#334155" stroke={COL.ink} strokeWidth={5} />
      <polygon points="-98,36 -78,-6 24,-6 44,36" fill={COL.gold} stroke={COL.ink} strokeWidth={5} strokeLinejoin="round" />
      <polygon points="-74,-2 20,-2 12,-14 -66,-14" fill="#fef08a" stroke={COL.ink} strokeWidth={3.5} strokeLinejoin="round" />
      {[28, 16, 4, -8, -20].map((cy, idx) => (
        <ellipse key={idx} cx={58} cy={cy} rx={42} ry={11} fill={idx % 2 === 0 ? COL.gold : "#eab308"} stroke={COL.ink} strokeWidth={4} />
      ))}
      <circle cx={-12} cy={-16} r={46} fill={COL.gold} stroke={COL.ink} strokeWidth={5.5} />
      <circle cx={-12} cy={-16} r={34} fill="none" stroke="#fef08a" strokeWidth={3} strokeDasharray="7 5" />
      <polygon
        points="-12,-36 -6,-22 9,-22 -3,-13 2,2 -12,-7 -26,2 -21,-13 -33,-22 -18,-22"
        fill="#fef08a"
        stroke={COL.ink}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    </g>
  </g>
);

// Pure Cover-Optimized Peak FOMO Chart Graphic
const CoverFomoChartGraphic: React.FC = () => (
  <g transform="translate(282, 900)">
    <rect x={-185} y={-95} width={370} height={165} rx={20} fill="#ffffff" stroke={COL.ink} strokeWidth={5} />
    <line x1={-155} y1={-40} x2={155} y2={-40} stroke="#eceff4" strokeWidth={2.5} />
    <line x1={-155} y1={10} x2={155} y2={10} stroke="#eceff4" strokeWidth={2.5} />
    <path d="M-145,42 L-80,25 L-20,-10 L25,-65" fill="none" stroke={COL.green} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25,-65 L95,32 L145,46" fill="none" stroke={COL.red} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={25} cy={-65} r={18} fill="rgba(229, 50, 45, 0.22)" />
    <circle cx={25} cy={-65} r={9} fill={COL.red} stroke={COL.ink} strokeWidth={3.5} />
    <rect x={-95} y={-118} width={210} height={36} rx={10} fill={COL.red} stroke={COL.ink} strokeWidth={3.5} />
    <text x={10} y={-93} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={20} fill="#fff">
      خرید در قله هیجان!
    </text>
    <text x={112} y={8} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={20} fill={COL.red}>
      ریزش!
    </text>
  </g>
);

// Pure Cover-Optimized 3-Step Smart Buying Ladder Graphic
const CoverStepLadderGraphic: React.FC = () => (
  <g transform="translate(798, 900)">
    <rect x={-185} y={-95} width={370} height={165} rx={20} fill="#ffffff" stroke={COL.ink} strokeWidth={5} />
    <rect x={-105} y={-118} width={210} height={36} rx={10} fill={COL.green} stroke={COL.ink} strokeWidth={3.5} />
    <text x={0} y={-93} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={20} fill="#fff">
      فرمول خرید ۳ پله‌ای!
    </text>

    <rect x={60} y={-10} width={98} height={62} rx={10} fill="#dcfce7" stroke={COL.ink} strokeWidth={4} />
    <text x={109} y={28} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={20} fill={COL.green}>
      پله ۱: ۳۰٪
    </text>

    <rect x={-49} y={-36} width={98} height={88} rx={10} fill="#bbf7d0" stroke={COL.ink} strokeWidth={4} />
    <text x={0} y={15} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={20} fill={COL.green}>
      پله ۲: ۳۰٪
    </text>

    <rect x={-158} y={-64} width={98} height={116} rx={10} fill={COL.gold} stroke={COL.ink} strokeWidth={4} />
    <text x={-109} y={0} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={20} fill={COL.ink}>
      پله ۳: ۴۰٪
    </text>
  </g>
);

// Cover 1: Cash in Bank vs Gold Over 10 Years
export const CoverReel1: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Paper theme="wealth" ground={COVER_GROUND} />

      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", overflow: "visible" }}>
        <rect x={55} y={760} width={455} height={620} rx={28} fill="rgba(229, 50, 45, 0.07)" stroke={COL.red} strokeWidth={3.5} strokeDasharray="10 8" />
        <rect x={570} y={760} width={455} height={620} rx={28} fill="rgba(47, 168, 79, 0.08)" stroke={COL.green} strokeWidth={3.5} strokeDasharray="10 8" />

        <CoverMeltGraphic />
        <CoverGoldGraphic />

        <circle cx={540} cy={1060} r={46} fill={COL.ink} stroke="#fff" strokeWidth={6} />
        <text x={540} y={1074} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={36} fill={COL.gold}>
          VS
        </text>

        <Actor
          keys={[{ f: 0, p: { ...P.shock, x: 280, y: GY } }]}
          color={COL.blue}
          scale={SCALE}
          face="shock"
          handProp="ice"
          facing={1}
          f={0}
        />
        <Actor
          keys={[{ f: 0, p: { ...P.cheer, x: 800, y: GY } }]}
          color={COL.purple}
          hat="ponytail"
          scale={SCALE}
          face="happy"
          handProp="coin"
          facing={-1}
          f={0}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          top: 375,
          left: 540,
          transform: "translateX(-50%)",
          background: COL.red,
          color: "#fff",
          fontFamily: FONT.title,
          fontWeight: 900,
          fontSize: 36,
          padding: "10px 36px",
          borderRadius: 40,
          border: `4.5px solid ${COL.ink}`,
          boxShadow: `6px 6px 0 ${COL.ink}`,
          direction: "rtl",
          whiteSpace: "nowrap",
        }}
      >
        مقایسه واقعی ۱۰ ساله (۱۳۹۵ تا امروز)
      </div>

      <div
        style={{
          position: "absolute",
          top: 475,
          left: 540,
          transform: "translateX(-50%)",
          width: 960,
          background: "#fff",
          border: `6px solid ${COL.ink}`,
          borderRadius: 28,
          boxShadow: `10px 10px 0 ${COL.ink}`,
          padding: "22px 30px",
          textAlign: "center",
          direction: "rtl",
        }}
      >
        <div style={{ fontFamily: FONT.title, fontWeight: 900, fontSize: 68, color: COL.ink, lineHeight: 1.2 }}>
          سود بانکی یا طلا؟!
        </div>
        <div
          style={{
            marginTop: 10,
            display: "inline-block",
            background: COL.gold,
            padding: "6px 26px",
            borderRadius: 14,
            border: `3.5px solid ${COL.ink}`,
            fontFamily: FONT.title,
            fontWeight: 900,
            fontSize: 46,
            color: COL.ink,
          }}
        >
          ۱۰۰ میلیون چطور شد ۵ میلیارد؟!
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1420,
          left: 540,
          transform: "translateX(-50%)",
          width: 960,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          direction: "ltr",
        }}
      >
        <div
          style={{
            background: "#fff5f5",
            border: `4px solid ${COL.ink}`,
            borderRadius: 16,
            padding: "10px 24px",
            fontFamily: FONT.title,
            fontWeight: 900,
            fontSize: 32,
            color: COL.red,
            direction: "rtl",
          }}
        >
          بانک: آب شدن سرمایه!
        </div>

        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: 24,
            color: COL.ink,
            opacity: 0.35,
          }}
        >
          @ghimatrooz
        </div>

        <div
          style={{
            background: "#f0fdf4",
            border: `4px solid ${COL.ink}`,
            borderRadius: 16,
            padding: "10px 24px",
            fontFamily: FONT.title,
            fontWeight: 900,
            fontSize: 32,
            color: COL.green,
            direction: "rtl",
          }}
        >
          طلا: ۵۰ برابر رشد!
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Cover 2: FOMO Peak Buying Trap vs Smart 3-Step Buying
export const CoverReel2: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Paper theme="studio" ground={COVER_GROUND} />

      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", overflow: "visible" }}>
        <rect x={55} y={760} width={455} height={620} rx={28} fill="rgba(229, 50, 45, 0.07)" stroke={COL.red} strokeWidth={3.5} strokeDasharray="10 8" />
        <rect x={570} y={760} width={455} height={620} rx={28} fill="rgba(47, 168, 79, 0.08)" stroke={COL.green} strokeWidth={3.5} strokeDasharray="10 8" />

        <CoverFomoChartGraphic />
        <CoverStepLadderGraphic />

        <circle cx={540} cy={1060} r={46} fill={COL.ink} stroke="#fff" strokeWidth={6} />
        <text x={540} y={1074} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={36} fill={COL.gold}>
          VS
        </text>

        <Actor
          keys={[{ f: 0, p: { ...P.shock, x: 280, y: GY } }]}
          color={COL.blue}
          scale={SCALE}
          face="shock"
          handProp="phone_red"
          facing={1}
          f={0}
        />
        <Actor
          keys={[{ f: 0, p: { ...P.cheer, x: 800, y: GY } }]}
          color={COL.purple}
          hat="ponytail"
          scale={SCALE}
          face="happy"
          handProp="coin"
          facing={-1}
          f={0}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          top: 375,
          left: 540,
          transform: "translateX(-50%)",
          background: COL.orange,
          color: "#fff",
          fontFamily: FONT.title,
          fontWeight: 900,
          fontSize: 36,
          padding: "10px 36px",
          borderRadius: 40,
          border: `4.5px solid ${COL.ink}`,
          boxShadow: `6px 6px 0 ${COL.ink}`,
          direction: "rtl",
          whiteSpace: "nowrap",
        }}
      >
        روانشناسی بازار طلا و دلار
      </div>

      <div
        style={{
          position: "absolute",
          top: 475,
          left: 540,
          transform: "translateX(-50%)",
          width: 960,
          background: "#fff",
          border: `6px solid ${COL.ink}`,
          borderRadius: 28,
          boxShadow: `10px 10px 0 ${COL.ink}`,
          padding: "22px 30px",
          textAlign: "center",
          direction: "rtl",
        }}
      >
        <div style={{ fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: COL.red, lineHeight: 1.2 }}>
          تله خرید در قله هیجان!
        </div>
        <div
          style={{
            marginTop: 10,
            display: "inline-block",
            background: COL.gold,
            padding: "6px 26px",
            borderRadius: 14,
            border: `3.5px solid ${COL.ink}`,
            fontFamily: FONT.title,
            fontWeight: 900,
            fontSize: 44,
            color: COL.ink,
          }}
        >
          کی بخریم که در حباب گیر نکنیم؟!
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1420,
          left: 540,
          transform: "translateX(-50%)",
          width: 960,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          direction: "ltr",
        }}
      >
        <div
          style={{
            background: "#fff5f5",
            border: `4px solid ${COL.ink}`,
            borderRadius: 16,
            padding: "10px 24px",
            fontFamily: FONT.title,
            fontWeight: 900,
            fontSize: 30,
            color: COL.red,
            direction: "rtl",
          }}
        >
          خرید هیجانی: ۲۰٪ ضرر!
        </div>

        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: 24,
            color: COL.ink,
            opacity: 0.35,
          }}
        >
          @ghimatrooz
        </div>

        <div
          style={{
            background: "#f0fdf4",
            border: `4px solid ${COL.ink}`,
            borderRadius: 16,
            padding: "10px 24px",
            fontFamily: FONT.title,
            fontWeight: 900,
            fontSize: 30,
            color: COL.green,
            direction: "rtl",
          }}
        >
          خرید ۳ پله‌ای: ۴۵٪ سود!
        </div>
      </div>
    </AbsoluteFill>
  );
};
