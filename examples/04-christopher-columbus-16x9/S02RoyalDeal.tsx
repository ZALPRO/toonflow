import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Actor, P, SMOOTH, groundY, idle, addPose, walkCycle } from "../stickman/stick";
import { Burst, COL, Dust, FONT, Slam, Wipe } from "../stickman/fx";
import { Card, Stage, Stamp, fall } from "../stickman/common";
import { At, Bank, Coin, GoldBar, ScrollMap, Ship } from "../stickman/props";
import { beat } from "./cues";
import type { SceneProps } from "./Video";
import type { SfxCue } from "./sfx";

export const S02RoyalDeal: React.FC<SceneProps> = ({ from, dur }) => {
  const f = useCurrentFrame();
  const S = 1.18;
  const GY = groundY(S);

  const bRejectStamp = beat(from, 3, 0.38);
  const bKickOut = beat(from, 3, 0.68);
  const bSpainEnter = beat(from, 4, 0.08);
  const bGoldDrop = beat(from, 4, 0.48);
  const bHandshake = beat(from, 4, 0.78);
  const bCard1 = beat(from, 5, 0.12);
  const bCard2 = beat(from, 5, 0.42);
  const bCard3 = beat(from, 5, 0.70);

  const goldY = fall(f, bGoldDrop, -200, 825, 11);
  const portugalOpacity = interpolate(f, [bSpainEnter, bSpainEnter + 14], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage
      hits={[bRejectStamp, bKickOut + 4, bGoldDrop + 11, bHandshake]}
      power={22}
      svg={
        <>
          {/* Palace Backdrop */}
          <At x={1520} y={760} s={0.95} o={0.35}>
            <Bank label={f < bSpainEnter + 8 ? "دربار لیسبون" : "دربار گرانادا"} />
          </At>

          {/* King John II of Portugal + Royal Mathematician (exit when Spain enters) */}
          {f < bSpainEnter + 15 && (
            <>
              <Actor
                f={f}
                color={COL.purple}
                scale={S}
                facing={-1}
                accessory="crown"
                face="angry"
                label="پادشاه پرتغال"
                base={{ x: 1260, y: GY }}
                mod={(t, p) => addPose(p, idle(t, 2))}
                opacity={portugalOpacity}
                keys={[
                  { f: 0, p: { ...P.think } },
                  { f: bRejectStamp, p: { ...P.pointR } },
                  { f: bKickOut - 5, p: { ...P.crouch, y: GY + 18 } },
                  { f: bKickOut, p: { ...P.kickR, y: GY } },
                  { f: bKickOut + 14, p: { ...P.stand, y: GY } },
                ]}
              />
              <Actor
                f={f}
                color={COL.grey}
                scale={1.08}
                facing={-1}
                accessory="scholar"
                face="smirk"
                label="ریاضی‌دان دربار"
                base={{ x: 1540, y: groundY(1.08) }}
                mod={(t, p) => addPose(p, idle(t, 5))}
                opacity={portugalOpacity}
                keys={[
                  { f: 0, p: { ...P.pointR } },
                  { f: bRejectStamp, p: { ...P.facepalm } },
                ]}
              />
            </>
          )}

          {/* Queen Isabella of Spain enters from the right */}
          {f >= bSpainEnter && (
            <Actor
              f={f}
              color={COL.blue}
              scale={S}
              facing={-1}
              accessory="crown"
              face="happy"
              label="ملکه ایزابلا (اسپانیا)"
              base={{ x: 1950, y: GY }}
              mod={(t, p) =>
                t < bSpainEnter + 24 ? addPose(p, walkCycle(t, 0.35)) : addPose(p, idle(t, 3))
              }
              keys={[
                { f: bSpainEnter, p: { x: 1950, y: GY } },
                { f: bSpainEnter + 24, p: { x: 1140, y: GY }, e: SMOOTH },
                { f: bGoldDrop, p: { ...P.pointR, x: 1140, y: GY } },
                { f: bHandshake, p: { ...P.handshake, x: 1060, y: GY } },
                { f: bCard2, p: { ...P.cheer, x: 1120, y: GY } },
              ]}
            />
          )}

          {/* Christopher Columbus holding his map scroll */}
          <Actor
            f={f}
            color={COL.orange}
            scale={S}
            facing={1}
            accessory="admiral"
            face={f >= bKickOut && f < bSpainEnter + 20 ? "sad" : "happy"}
            label="کریستف کلمب"
            base={{ x: 780, y: GY }}
            mod={(t, p) => addPose(p, idle(t, 1))}
            keys={[
              { f: 0, p: { ...P.hold, x: 780, y: GY } },
              { f: bRejectStamp, p: { ...P.shock, x: 760, y: GY } },
              { f: bKickOut, p: { ...P.shock, x: 760, y: GY } },
              { f: bKickOut + 10, p: { x: 420, y: GY - 70, rot: -22, ll1: -25, ll2: 45, rl1: 25, rl2: -45 }, e: SMOOTH },
              { f: bKickOut + 20, p: { ...P.sad, x: 440, y: GY, rot: 0 }, e: SMOOTH },
              { f: bSpainEnter + 24, p: { ...P.stand, x: 780, y: GY, rot: 0 }, e: SMOOTH },
              { f: bHandshake, p: { ...P.handshake, x: 860, y: GY } },
              { f: bCard1, p: { ...P.cheer, x: 800, y: GY } },
            ]}
          >
            {(j) =>
              f < bKickOut && (
                <At x={j.rHand[0] + 18} y={j.rHand[1]} s={0.85} r={8}>
                  <ScrollMap />
                </At>
              )
            }
          </Actor>

          <Burst x={960} y={710} at={bKickOut + 4} f={f} size={190} color={COL.red} />
          <Burst x={960} y={700} at={bHandshake} f={f} size={220} color={COL.gold} />

          {/* Gold bars and coins dropping in front of them */}
          {f >= bGoldDrop && (
            <>
              <At x={960} y={goldY} s={0.95}>
                <GoldBar label="طلا" />
              </At>
              <At x={850} y={goldY - 5} s={0.55}>
                <Coin sym="★" />
              </At>
              <Dust x={960} y={852} at={bGoldDrop + 11} f={f} spread={200} />
            </>
          )}

          {/* Detailed Caravel ship prop appearing with Card 1 */}
          {f >= bCard1 && (
            <At x={330} y={fall(f, bCard1, 200, 815, 10)} s={0.75}>
              <Ship name="سانتا ماریا" />
            </At>
          )}
        </>
      }
      html={
        <>
          {f < bSpainEnter + 10 && (
            <Stamp f={f} at={bRejectStamp} x={920} y={300} text="پرتغال: محاسبه غلطه، رد شد!" color={COL.red} size={74} r={-10} />
          )}

          <Slam
            f={f}
            at={bHandshake}
            out={bCard1 + 10}
            x={960}
            y={400}
            size={90}
            color={COL.gold}
            stroke={`4px ${COL.ink}`}
            font={FONT.comic}
          >
            قرارداد سانتافه (۱۴۹۲)!
          </Slam>

          {/* 3 Clauses of the Capitulations of Santa Fe */}
          <Card f={f} at={bCard1} x={1590} y={145} w={530} n="۱" accent={COL.orange} size={34}>
            تحویل سه کشتی کاراول
          </Card>
          <Card f={f} at={bCard2} x={960} y={145} w={530} n="۲" accent={COL.blue} size={34}>
            لقب «دریاسالار اقیانوس»
          </Card>
          <Card f={f} at={bCard3} x={330} y={145} w={530} n="۳" accent={COL.gold} size={34}>
            سهم ۱۰٪ از کل طلا و ادویه
          </Card>

          <Wipe f={f} dur={dur} />
        </>
      }
    />
  );
};

export const buildS02Sfx = (from: number): SfxCue[] => {
  const bRejectStamp = beat(from, 3, 0.38);
  const bKickOut = beat(from, 3, 0.68);
  const bSpainEnter = beat(from, 4, 0.08);
  const bGoldDrop = beat(from, 4, 0.48);
  const bHandshake = beat(from, 4, 0.78);
  const bCard1 = beat(from, 5, 0.12);
  const bCard2 = beat(from, 5, 0.42);
  const bCard3 = beat(from, 5, 0.70);
  return [
    [bRejectStamp, "stamp", 0.85],
    [bKickOut + 4, "punch", 0.85],
    [bSpainEnter, "whoosh", 0.6],
    [bGoldDrop + 11, "gold", 0.85],
    [bHandshake, "slam", 0.85],
    [bCard1, "pop", 0.75],
    [bCard2, "pop", 0.75],
    [bCard3, "kaching", 0.85],
  ];
};
