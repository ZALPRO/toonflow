import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Actor, P, idle, addPose } from "../stickman/stick";
import { Burst, COL, Caption, FONT, Paper, Slam, SpeedLines, Wipe, countUp } from "../stickman/fx";
import { Bubble, Stage } from "../stickman/common";
import { At, Cutlass, Logbook, Ship, Spyglass } from "../stickman/props";
import { beat } from "./cues";
import type { SceneProps } from "./Video";
import type { SfxCue } from "./sfx";

export const S03AtlanticVoyage: React.FC<SceneProps> = ({ from, dur }) => {
  const f = useCurrentFrame();

  const bFakeLog = beat(from, 6, 0.45);
  const bMutiny = beat(from, 7, 0.12);
  const bLandHo = beat(from, 7, 0.56);

  // Ships bobbing on ocean waves and moving right-to-left (East -> West)
  const shipX = interpolate(f, [0, dur], [1360, 780], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bob1 = Math.sin(f * 0.14) * 14;
  const bob2 = Math.sin(f * 0.14 + 1.5) * 12;
  const bob3 = Math.sin(f * 0.14 + 3.0) * 10;
  const days = countUp(f, 10, bLandHo, 70, 1);
  const faDays = String(days).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

  const landX = interpolate(f, [bLandHo - 12, bLandHo + 18], [-260, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logBubble = interpolate(f, [bFakeLog, bFakeLog + 10, bMutiny - 4, bMutiny + 2], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mutinyBubble = interpolate(f, [bMutiny, bMutiny + 10, bLandHo - 6, bLandHo], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage
      hits={[bMutiny, bLandHo]}
      power={22}
      bg={<Paper tint="#eaf4fc" ground={862} />}
      svg={
        <>
          <SpeedLines f={f} from={0} to={bLandHo} dir={-1} color="#cfe2f3" />

          {/* Background Caravel Ships: Pinta & Niña */}
          <At x={shipX + 380} y={735 + bob2} s={0.68} r={Math.sin(f * 0.12) * 3}>
            <Ship color="#7c5230" name="پینتا" />
          </At>
          <At x={shipX - 360} y={745 + bob3} s={0.64} r={Math.cos(f * 0.12) * 3}>
            <Ship color="#6d482a" name="نینیا" />
          </At>

          {/* Main Flagship: Santa Maria with Columbus, Mutinous Sailor & Lookout Rodrigo */}
          <g transform={`translate(${shipX}, ${765 + bob1}) rotate(${Math.sin(f * 0.1) * 3.2})`}>
            <At x={0} y={0} s={1.18}>
              <Ship color="#8b5a2b" name="سانتا ماریا" />
            </At>

            {/* Rodrigo de Triana up in the Crow's Nest with a Brass Spyglass! */}
            <Actor
              f={f}
              color={COL.yellow}
              scale={0.62}
              facing={-1}
              accessory="bandana"
              face={f >= bLandHo ? "happy" : "eyes"}
              label="رودریگو"
              base={{ x: -12, y: -315 }}
              mod={(t, p) => addPose(p, idle(t, 7))}
              keys={[
                { f: 0, p: { ...P.pointR } },
                { f: bLandHo, p: { ...P.cheer } },
              ]}
            >
              {(j) => (
                <At x={j.rHand[0] - 10} y={j.rHand[1]} s={0.85}>
                  <Spyglass dir={-1} />
                </At>
              )}
            </Actor>

            {/* Columbus on deck holding the Fake Logbook */}
            <Actor
              f={f}
              color={COL.orange}
              scale={0.88}
              facing={-1}
              accessory="admiral"
              face={f >= bLandHo ? "happy" : f >= bMutiny ? "shock" : "smirk"}
              label="کلمب"
              base={{ x: -115, y: -95 }}
              mod={(t, p) => addPose(p, idle(t, 1))}
              keys={[
                { f: 0, p: { ...P.hold } },
                { f: bMutiny, p: { ...P.shrug } },
                { f: bLandHo, p: { ...P.cheer } },
              ]}
            >
              {(j) =>
                f < bLandHo && (
                  <At x={j.rHand[0] - 22} y={j.rHand[1]} s={0.74} r={-8}>
                    <Logbook label="تقلبی" color={COL.green} />
                  </At>
                )
              }
            </Actor>

            {/* Mutinous Sailor on stern waving a Cutlass sword */}
            <Actor
              f={f}
              color={COL.red}
              scale={0.85}
              facing={-1}
              accessory="bandana"
              face={f >= bLandHo ? "happy" : "angry"}
              label="ملوان شاکی"
              base={{ x: 110, y: -95 }}
              mod={(t, p) => addPose(p, idle(t, 4))}
              keys={[
                { f: 0, p: { ...P.sad } },
                { f: bMutiny, p: { ...P.pointR } },
                { f: bLandHo, p: { ...P.cheer } },
              ]}
            >
              {(j) =>
                f < bLandHo && (
                  <At x={j.rHand[0] - 12} y={j.rHand[1] - 8} s={0.85} r={-15}>
                    <Cutlass dir={-1} />
                  </At>
                )
              }
            </Actor>
          </g>

          {/* Fake logbook speech bubble */}
          <Bubble x={shipX - 310} y={420} w={430} h={102} t={logBubble} tailX={shipX - 110} tailY={590}>
            <text y={12} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={31} fill={COL.green}>
              نترسید! خیلی از خانه دور نشدیم!
            </text>
          </Bubble>

          {/* Mutiny speech bubble */}
          <Bubble x={shipX + 240} y={420} w={390} h={102} t={mutinyBubble} tailX={shipX + 95} tailY={590}>
            <text y={12} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={33} fill={COL.red}>
              شورش! همین الان برگردیم!
            </text>
          </Bubble>

          {/* Green Bahamas Island appearing on the left horizon (West) */}
          {f >= bLandHo - 12 && (
            <g transform={`translate(${landX}, 830)`}>
              <path d="M-220,30 Q-60,-140 160,30 Z" fill={COL.green} stroke={COL.ink} strokeWidth={7} />
              <path d="M-20,-45 Q-10,-130 15,-185" fill="none" stroke="#8b5a2b" strokeWidth={10} strokeLinecap="round" />
              <path d="M15,-185 Q-45,-200 -65,-160" fill="none" stroke={COL.green} strokeWidth={9} strokeLinecap="round" />
              <path d="M15,-185 Q65,-205 80,-160" fill="none" stroke={COL.green} strokeWidth={9} strokeLinecap="round" />
              <path d="M15,-185 Q15,-230 -25,-220" fill="none" stroke={COL.green} strokeWidth={9} strokeLinecap="round" />
            </g>
          )}

          <Burst x={260} y={660} at={bLandHo} f={f} size={230} color={COL.green} />

          {/* Animated Ocean Waves across the bottom */}
          <path
            d={`M -100 840 Q 140 ${815 + bob1} 380 840 T 860 840 T 1340 840 T 1820 840 T 2100 840 L 2100 1100 L -100 1100 Z`}
            fill={COL.blue}
            opacity={0.85}
            stroke={COL.ink}
            strokeWidth={6}
          />
        </>
      }
      html={
        <>
          {/* Day counter badge */}
          <div
            style={{
              position: "absolute",
              right: 80,
              top: 70,
              background: "#fff",
              border: `6px solid ${COL.ink}`,
              borderRadius: 18,
              padding: "10px 26px",
              boxShadow: `8px 8px 0 ${COL.ink}`,
              direction: "rtl",
              fontFamily: FONT.title,
              fontWeight: 900,
              fontSize: 44,
              color: COL.ink,
            }}
          >
            روز سفر: <span style={{ color: COL.orange, fontFamily: FONT.comic, fontSize: 54 }}>{faDays}</span>
          </div>

          <Slam
            f={f}
            at={bLandHo}
            x={960}
            y={180}
            size={100}
            color={COL.green}
            stroke={`4px ${COL.ink}`}
            font={FONT.comic}
          >
            ۱۲ اکتبر ۱۴۹۲: خشکی دیده شد!
          </Slam>

          <Caption f={f} at={bLandHo + 8} y={300} size={33} bg={COL.ink}>
            رودریگو دِ تریانا در ساعت ۲ بامداد جزیره گواناهانی (باهاما) را دید!
          </Caption>

          <Wipe f={f} dur={dur} />
        </>
      }
    />
  );
};

export const buildS03Sfx = (from: number): SfxCue[] => {
  const bFakeLog = beat(from, 6, 0.45);
  const bMutiny = beat(from, 7, 0.12);
  const bLandHo = beat(from, 7, 0.56);
  return [
    [6, "whoosh_long", 0.65],
    [bFakeLog, "page", 0.7],
    [bMutiny, "buzz", 0.75],
    [bLandHo, "ding", 0.9],
    [bLandHo + 3, "slam", 0.95],
  ];
};
