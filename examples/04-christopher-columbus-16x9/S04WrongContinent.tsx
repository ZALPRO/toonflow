import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Actor, P, groundY, idle, addPose } from "../stickman/stick";
import { Burst, COL, Caption, Dust, FONT, Slam, Wipe } from "../stickman/fx";
import { Bubble, Stage, WordBlock, fall } from "../stickman/common";
import { At, Box, Flag, ScrollMap } from "../stickman/props";
import { beat } from "./cues";
import type { SceneProps } from "./Video";
import type { SfxCue } from "./sfx";

export const S04WrongContinent: React.FC<SceneProps> = ({ from, dur }) => {
  const f = useCurrentFrame();
  const S = 1.22;
  const GY = groundY(S);

  const bPlantFlag = beat(from, 8, 0.20);
  const bClaimIndia = beat(from, 8, 0.56);
  const bAmericaDrop = beat(from, 9, 0.28);
  const bAmericaHit = bAmericaDrop + 12;
  const bSlamVerdict = beat(from, 9, 0.52);

  const flagY = fall(f, bPlantFlag, -240, 852, 10);
  const blockY = fall(f, bAmericaDrop, -260, 795, 12);

  const columbusBubble = interpolate(
    f,
    [bClaimIndia, bClaimIndia + 8, bAmericaHit - 2, bAmericaHit + 3],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const tainoBubble = interpolate(
    f,
    [bClaimIndia + 14, bClaimIndia + 22, bAmericaHit - 2, bAmericaHit + 3],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <Stage
      hits={[bPlantFlag + 10, bAmericaHit, bSlamVerdict]}
      power={25}
      svg={
        <>
          {/* Spanish Flag planted in the island sand */}
          {f >= bPlantFlag && (
            <>
              <At x={960} y={flagY} s={1.25}>
                <Flag colors={[COL.red, COL.yellow, COL.red]} label={f < bAmericaHit ? "اسپانیا" : undefined} />
              </At>
              <Dust x={960} y={852} at={bPlantFlag + 10} f={f} spread={180} />
            </>
          )}

          {/* Columbus proudly claiming it's India */}
          <Actor
            f={f}
            color={COL.orange}
            scale={S}
            facing={-1}
            accessory="admiral"
            face={f >= bAmericaHit ? "shock" : "happy"}
            label="کریستف کلمب"
            base={{ x: 1320, y: GY }}
            mod={(t, p) => addPose(p, idle(t, 1))}
            keys={[
              { f: 0, p: { ...P.stand } },
              { f: bPlantFlag, p: { ...P.pointR } },
              { f: bClaimIndia, p: { ...P.pointR, head: -8 } },
              { f: bAmericaHit, p: { ...P.shock, head: -16 } },
            ]}
          >
            {(j) =>
              f < bAmericaHit && (
                <At x={j.lHand[0] + 22} y={j.lHand[1] + 8} s={0.85} r={12}>
                  <ScrollMap />
                </At>
              )
            }
          </Actor>

          {/* Spanish Crewman behind Columbus carrying a Spice Crate */}
          <Actor
            f={f}
            color={COL.blue}
            scale={1.08}
            facing={-1}
            accessory="bandana"
            face={f >= bAmericaHit ? "shock" : "eyes"}
            label="ملوان اسپانیایی"
            base={{ x: 1620, y: groundY(1.08) }}
            mod={(t, p) => addPose(p, idle(t, 6))}
            keys={[
              { f: 0, p: { ...P.hold } },
              { f: bAmericaHit, p: { ...P.shrug } },
            ]}
          >
            {(j) =>
              f < bAmericaHit && (
                <At x={j.rHand[0] - 28} y={j.rHand[1] + 4} s={0.72}>
                  <Box label="ادویه؟" />
                </At>
              )
            }
          </Actor>

          {/* Taíno Indigenous Chief with Feather Headdress */}
          <Actor
            f={f}
            color={COL.green}
            scale={S}
            facing={1}
            accessory="feathers"
            face="eyes"
            label="رئیس تائینو"
            base={{ x: 560, y: GY }}
            mod={(t, p) => addPose(p, idle(t, 2))}
            keys={[
              { f: 0, p: { ...P.stand } },
              { f: bClaimIndia, p: { ...P.shrug } },
              { f: bAmericaHit, p: { ...P.pointR } },
            ]}
          />

          {/* Second Taíno Villager */}
          <Actor
            f={f}
            color="#228b3b"
            scale={1.08}
            facing={1}
            accessory="feathers"
            face="eyes"
            label="بومی جزیره"
            base={{ x: 290, y: groundY(1.08) }}
            mod={(t, p) => addPose(p, idle(t, 8))}
            keys={[
              { f: 0, p: { ...P.stand } },
              { f: bClaimIndia + 10, p: { ...P.think } },
              { f: bAmericaHit, p: { ...P.shock } },
            ]}
          />

          {/* Columbus Speech Bubble: "We reached India!" */}
          <Bubble x={1320} y={430} w={370} h={108} t={columbusBubble} tailX={1320} tailY={560}>
            <text y={14} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={38} fill={COL.orange}>
              رسیدیم به جزایر هند!
            </text>
          </Bubble>

          {/* Taíno Chief Speech Bubble: "What is India?!" */}
          <Bubble x={560} y={430} w={330} h={102} t={tainoBubble} tailX={560} tailY={560}>
            <text y={14} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={36} fill={COL.green}>
              هند دیگه کجاست؟!
            </text>
          </Bubble>

          {/* Giant physical WordBlock "قاره آمریکا!" dropping onto the scene */}
          {f >= bAmericaDrop && (
            <>
              <WordBlock x={960} y={blockY} text="قاره آمریکا!" bg={COL.yellow} color={COL.ink} size={64} />
              <Burst x={960} y={780} at={bAmericaHit} f={f} size={270} color={COL.red} />
              <Dust x={960} y={852} at={bAmericaHit} f={f} spread={320} />
            </>
          )}
        </>
      }
      html={
        <>
          <Slam
            f={f}
            at={bSlamVerdict}
            x={960}
            y={200}
            size={90}
            color={COL.red}
            font={FONT.comic}
            rotate={-3}
          >
            ۴ سفر دریایی... و هنوز فکر می‌کرد آسیاست!
          </Slam>

          <Caption f={f} at={bAmericaHit + 8} y={330} size={34} bg={COL.ink}>
            کلمب بومیان تائینو را «ایندیوس» (هندی) نامید و تا سال ۱۵۰۶ بر این باور ماند!
          </Caption>

          <Wipe f={f} dur={dur} />
        </>
      }
    />
  );
};

export const buildS04Sfx = (from: number): SfxCue[] => {
  const bPlantFlag = beat(from, 8, 0.20);
  const bClaimIndia = beat(from, 8, 0.56);
  const bAmericaDrop = beat(from, 9, 0.28);
  const bAmericaHit = bAmericaDrop + 12;
  const bSlamVerdict = beat(from, 9, 0.52);
  return [
    [bPlantFlag + 10, "thud", 0.8],
    [bClaimIndia, "pop", 0.7],
    [bAmericaDrop, "missile", 0.5],
    [bAmericaHit, "shatter", 0.95],
    [bSlamVerdict, "slam", 0.9],
  ];
};
