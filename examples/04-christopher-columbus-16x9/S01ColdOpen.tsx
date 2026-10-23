import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Actor, P, SMOOTH, groundY, idle, addPose, solve, STAND } from "../stickman/stick";
import { Burst, COL, Caption, Cursor, Dust, FONT, Slam, Wipe } from "../stickman/fx";
import { Bubble, Stage, Stamp, fall } from "../stickman/common";
import { At, ScrollMap } from "../stickman/props";
import { beat } from "./cues";
import type { SceneProps } from "./Video";
import type { SfxCue } from "./sfx";

export const S01ColdOpen: React.FC<SceneProps> = ({ from, dur }) => {
  const f = useCurrentFrame();
  const S = 1.25;
  const GY = groundY(S);

  const bDrawDone = Math.max(55, beat(from, 0, 0.35));
  const bYearDrop = beat(from, 0, 0.62);
  const bUnitMix = beat(from, 1, 0.15);
  const bSmallEarth = beat(from, 1, 0.52);
  const bGlobeFall = beat(from, 2, 0.25);
  const bGlobeHit = bGlobeFall + 12;
  const bWrongStamp = beat(from, 2, 0.62);

  const draw = interpolate(f, [10, bDrawDone], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const j0 = solve({ ...STAND, x: 780, y: GY }, S, 1);
  const cx = interpolate(f, [0, 10, Math.round(bDrawDone * 0.6), bDrawDone, bDrawDone + 20], [1760, j0.headC[0], j0.hip[0], j0.rFoot[0], 1860], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SMOOTH,
  });
  const cy = interpolate(f, [0, 10, Math.round(bDrawDone * 0.6), bDrawDone, bDrawDone + 20], [1020, j0.headC[1] - 25, j0.hip[1], j0.rFoot[1], 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SMOOTH,
  });

  const yearY = fall(f, bYearDrop, -220, 185, 12);
  const smallGlobeScale = interpolate(f, [bSmallEarth, bSmallEarth + 10, bGlobeHit, bGlobeHit + 3], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const globeY = fall(f, bGlobeFall, -340, 690, 12);

  const scholarBubble = interpolate(f, [bDrawDone + 8, bDrawDone + 18, bUnitMix - 4, bUnitMix + 4], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage
      hits={[bYearDrop + 12, bGlobeHit, bWrongStamp]}
      power={25}
      svg={
        <>
          {/* Year 1492 falling from the top */}
          {f >= bYearDrop && (
            <text
              x={960}
              y={yearY}
              textAnchor="middle"
              fontFamily={FONT.comic}
              fontSize={145}
              fill={COL.ink}
              opacity={f >= bGlobeFall ? 0.16 : 1}
            >
              ۱۴۹۲
            </text>
          )}

          {/* 15th-century Scholar / Geographer on the right */}
          {f >= bDrawDone && (
            <Actor
              f={f}
              color={COL.blue}
              scale={1.15}
              facing={-1}
              accessory="scholar"
              face={f >= bGlobeHit ? "shock" : "eyes"}
              label="دانشمند جغرافیا"
              base={{ x: 1460, y: groundY(1.15) }}
              mod={(t, p) => addPose(p, idle(t, 3))}
              keys={[
                { f: bDrawDone, p: { ...P.think } },
                { f: bUnitMix, p: { ...P.shrug } },
                { f: bGlobeHit, p: { ...P.shock, x: 1580, head: -20 } },
                { f: bWrongStamp, p: { ...P.facepalm, x: 1580 } },
              ]}
            />
          )}

          <Bubble x={1460} y={415} w={415} h={98} t={scholarBubble} tailX={1460} tailY={540}>
            <text y={12} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={31} fill={COL.blue}>
              زمین گرده، ولی خیلی بزرگه!
            </text>
          </Bubble>

          {/* Columbus's Tiny Shrunk Earth (4,400 km estimate) */}
          {f >= bSmallEarth && f < bGlobeHit + 3 && (
            <g transform={`translate(1060, 740) scale(${smallGlobeScale})`}>
              <circle cx={0} cy={0} r={58} fill={COL.blue} stroke={COL.ink} strokeWidth={6} />
              <path d="M-28,-20 Q0,-40 22,-10 Q30,20 -10,32 Z" fill={COL.green} stroke={COL.ink} strokeWidth={4} />
              <text x={0} y={92} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={28} fill={COL.blue}>
                زمینِ کلمب: ۴,۴۰۰ کیلومتر!
              </text>
            </g>
          )}

          {/* Giant Real Earth (19,600 km) dropping and crushing the tiny estimate */}
          {f >= bGlobeFall && (
            <g transform={`translate(1020, ${globeY})`}>
              <circle cx={0} cy={0} r={155} fill={COL.blue} stroke={COL.ink} strokeWidth={8} />
              <path
                d="M-85,-65 Q-20,-105 40,-45 Q85,0 25,75 Q-45,95 -90,25 Z"
                fill={COL.green}
                stroke={COL.ink}
                strokeWidth={5}
              />
              <path d="M60,-85 Q110,-45 95,25 Q60,45 50,-25 Z" fill={COL.green} stroke={COL.ink} strokeWidth={5} />
              <text
                x={0}
                y={-8}
                textAnchor="middle"
                direction="rtl"
                fontFamily={FONT.title}
                fontWeight={900}
                fontSize={36}
                fill="#fff"
                stroke={COL.ink}
                strokeWidth={6}
                paintOrder="stroke"
              >
                کره زمین واقعی
              </text>
              <text
                x={0}
                y={38}
                textAnchor="middle"
                direction="rtl"
                fontFamily={FONT.comic}
                fontSize={42}
                fill={COL.yellow}
                stroke={COL.ink}
                strokeWidth={6}
                paintOrder="stroke"
              >
                ۱۹,۶۰۰ کیلومتر!
              </text>
            </g>
          )}

          <Burst x={1020} y={760} at={bGlobeHit} f={f} size={280} color={COL.orange} />
          <Dust x={1020} y={852} at={bGlobeHit} f={f} spread={340} />

          {/* Christopher Columbus hero with Admiral Hat & Held Toscanelli Map */}
          <Actor
            f={f}
            color={COL.orange}
            scale={S}
            draw={draw}
            accessory="admiral"
            face={f >= bGlobeFall - 6 ? "shock" : f >= bUnitMix ? "smirk" : "happy"}
            label={f >= bDrawDone ? "کریستف کلمب" : undefined}
            base={{ x: 780, y: GY }}
            mod={(t, p) => addPose(p, idle(t, 1))}
            keys={[
              { f: 0, p: {} },
              { f: bDrawDone, p: {} },
              { f: bDrawDone + 10, p: { ...P.pointR } },
              { f: bUnitMix, p: { ...P.pointR, head: -8 } },
              { f: bSmallEarth, p: { ...P.hold, x: 820, y: GY } },
              { f: bGlobeFall - 6, p: { ...P.shock, x: 820, y: GY, head: -16 } },
              { f: bGlobeFall, p: { ...P.crouch, x: 820, y: GY + 24 } },
              {
                f: bGlobeHit,
                p: { x: 440, y: GY - 200, rot: -180, la1: -65, la2: 35, ra1: 65, ra2: 35, ll1: -35, ll2: 65, rl1: 35, rl2: -65 },
                e: SMOOTH,
              },
              { f: bGlobeHit + 11, p: { ...P.crouch, x: 320, y: GY + 24, rot: -360 }, e: SMOOTH },
              { f: bGlobeHit + 22, p: { ...P.stand, x: 320, y: GY, rot: -360 } },
              { f: bWrongStamp, p: { ...P.shrug, x: 320, y: GY, rot: -360 } },
            ]}
          >
            {(j) =>
              f >= bDrawDone && f < bGlobeFall - 6 && (
                <At x={j.lHand[0] - 24} y={j.lHand[1] + 6} s={0.88} r={-12}>
                  <ScrollMap label="نقشه توسکانلی" />
                </At>
              )
            }
          </Actor>

          {f < bDrawDone + 20 && <Cursor x={cx} y={cy} pressed={f >= 10 && f <= bDrawDone} />}
        </>
      }
      html={
        <>
          <Slam
            f={f}
            at={bUnitMix}
            out={bGlobeFall - 4}
            x={540}
            y={290}
            size={74}
            color={COL.blue}
            font={FONT.comic}
            rotate={-3}
          >
            مایل عربی ≠ مایل رومی (۲۵٪ خطا!)
          </Slam>

          <Stamp f={f} at={bWrongStamp} x={1360} y={260} text="۱۵,۰۰۰ کیلومتر اشتباه!" color={COL.red} size={72} r={-10} />

          <Caption f={f} at={bGlobeHit + 6} x={960} y={410} size={34} bg={COL.ink}>
            نقشه پائولو توسکانلی قاره آسیا را خیلی نزدیک‌تر از واقعیت نشان می‌داد!
          </Caption>

          <Wipe f={f} dur={dur} />
        </>
      }
    />
  );
};

export const buildS01Sfx = (from: number): SfxCue[] => {
  const bYearDrop = beat(from, 0, 0.62);
  const bUnitMix = beat(from, 1, 0.15);
  const bSmallEarth = beat(from, 1, 0.52);
  const bGlobeFall = beat(from, 2, 0.25);
  const bGlobeHit = bGlobeFall + 12;
  const bWrongStamp = beat(from, 2, 0.62);
  return [
    [10, "scribble", 0.55],
    [bYearDrop + 12, "thud", 0.7],
    [bUnitMix, "slam", 0.75],
    [bSmallEarth, "pop", 0.65],
    [bGlobeFall, "missile", 0.5],
    [bGlobeHit, "impact", 1.0],
    [bWrongStamp, "stamp", 0.85],
  ];
};
