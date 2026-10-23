import React from "react";
import { COL, FONT } from "../stickman/fx";
import { IconLabel } from "../stickman/props";

// 1. Cue 0: IranIraqWar-Style Comic Peak Buying vs Drop Chart
export const FomoTrapChartIcon: React.FC = () => (
  <g>
    {/* Hard comic drop shadow */}
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
    <IconLabel y={120} text="خرید در قله = ضرر!" bg={COL.yellow} color={COL.ink} />
  </g>
);

// 2. Cue 1: IranIraqWar-Style Comic Breaking News Hype Banner
export const BreakingHypeIcon: React.FC = () => (
  <g>
    <rect x={-204} y={-79} width={420} height={145} rx={18} fill={COL.ink} />
    <rect x={-210} y={-85} width={420} height={145} rx={18} fill="#fffdf6" stroke={COL.ink} strokeWidth={5.5} />
    <rect x={-210} y={-85} width={420} height={46} rx={14} fill={COL.red} stroke={COL.ink} strokeWidth={5} />
    <text x={0} y={-54} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={24} fill="#fff">
      خبر فوری: پرواز طلا و دلار!
    </text>
    <text x={0} y={18} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={32} fill={COL.ink}>
      خرید با کل ۵۰۰ میلیون!
    </text>
    <IconLabel y={114} text="ورود هیجانی در اوج" bg={COL.yellow} color={COL.ink} />
  </g>
);

// 3. Cue 2: IranIraqWar-Style Comic Market Bubble Gauge
export const BubbleMeterIcon: React.FC = () => (
  <g>
    <rect x={-194} y={-84} width={400} height={155} rx={18} fill={COL.ink} />
    <rect x={-200} y={-90} width={400} height={155} rx={18} fill="#fffdf6" stroke={COL.ink} strokeWidth={5.5} />
    <path d="M-105,42 A105,105 0 0,1 -38,-55" fill="none" stroke={COL.green} strokeWidth={22} strokeLinecap="round" />
    <path d="M-38,-55 A105,105 0 0,1 38,-55" fill="none" stroke={COL.gold} strokeWidth={22} />
    <path d="M38,-55 A105,105 0 0,1 105,42" fill="none" stroke={COL.red} strokeWidth={22} strokeLinecap="round" />
    <line x1={0} y1={42} x2={72} y2={-24} stroke={COL.ink} strokeWidth={8} strokeLinecap="round" />
    <circle cx={0} cy={42} r={12} fill={COL.ink} />
    <IconLabel y={118} text="حباب هیجانی بازار!" bg={COL.yellow} color={COL.ink} />
  </g>
);

// 4. Cue 4: IranIraqWar-Style 3-Step Staircase Buying Strategy
export const StepLadderIcon: React.FC = () => (
  <g>
    <rect x={-209} y={-89} width={430} height={165} rx={18} fill={COL.ink} />
    <rect x={-215} y={-95} width={430} height={165} rx={18} fill="#fffdf6" stroke={COL.ink} strokeWidth={5.5} />
    <rect x={68} y={-15} width={112} height={62} rx={10} fill="#dcfce7" stroke={COL.ink} strokeWidth={4.5} />
    <text x={124} y={24} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={24} fill={COL.green}>
      پله ۱: ۳۰٪
    </text>

    <rect x={-56} y={-44} width={112} height={91} rx={10} fill="#bbf7d0" stroke={COL.ink} strokeWidth={4.5} />
    <text x={0} y={8} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={24} fill={COL.green}>
      پله ۲: ۳۰٪
    </text>

    <rect x={-180} y={-74} width={112} height={121} rx={10} fill={COL.gold} stroke={COL.ink} strokeWidth={4.5} />
    <text x={-124} y={-6} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={24} fill={COL.ink}>
      پله ۳: ۴۰٪
    </text>

    <IconLabel y={120} text="خرید هوشمند در ۳ پله" bg={COL.yellow} color={COL.ink} />
  </g>
);
