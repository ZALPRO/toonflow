import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Actor, P, SMOOTH, groundY, idle, addPose, solve, STAND, walkCycle } from "../stickman/stick";
import { Burst, COL, Caption, Cursor, FONT, Slam, Wipe } from "../stickman/fx";
import { Card, Stage, Stamp } from "../stickman/common";
import { At, ScrollMap } from "../stickman/props";
import { beat } from "./cues";
import type { SceneProps } from "./Video";
import type { SfxCue } from "./sfx";

export const S05LegacyEnding: React.FC<SceneProps> = ({ from, dur }) => {
  const f = useCurrentFrame();
  const S = 1.24;
  const GY = groundY(S);

  const bVespucciEnter = 8;
  const bPunch1 = beat(from, 10, 0.30);
  const bPunch2 = beat(from, 10, 0.68);
  const bCursorGrab = beat(from, 11, 0.26);
  const bCursorThrow = bCursorGrab + 12;
  const bFinalSlam = beat(from, 11, 0.58);

  const jHero = solve({ ...STAND, x: 580, y: GY }, S, 1);

  const cursorX = interpolate(
    f,
    [bCursorGrab - 24, bCursorGrab, bCursorThrow, bCursorThrow + 20],
    [1880, jHero.rHand[0] + 40, jHero.rHand[0] + 90, 2300],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SMOOTH },
  );
  const cursorY = interpolate(
    f,
    [bCursorGrab - 24, bCursorGrab, bCursorThrow, bCursorThrow + 20],
    [120, jHero.rHand[1] - 40, jHero.rHand[1] - 90, -400],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SMOOTH },
  );

  return (
    <Stage
      hits={[bPunch1, bPunch2, bCursorThrow, bFinalSlam]}
      power={22}
      svg={
        <>
          {/* Amerigo Vespucci walking in with the "New World" map */}
          <Actor
            f={f}
            color={COL.purple}
            scale={1.15}
            facing={1}
            accessory="scholar"
            face="happy"
            label="آمریگو وسپوچی"
            base={{ x: -120, y: groundY(1.15) }}
            mod={(t, p) =>
              t < bVespucciEnter + 26 ? addPose(p, walkCycle(t, 0.35)) : addPose(p, idle(t, 4))
            }
            keys={[
              { f: 0, p: { x: -120, y: groundY(1.15) } },
              { f: bVespucciEnter + 26, p: { ...P.pointR, x: 260, y: groundY(1.15) }, e: SMOOTH },
              { f: bFinalSlam, p: { ...P.cheer, x: 260, y: groundY(1.15) } },
            ]}
          >
            {(j) =>
              f < bFinalSlam - 8 && (
                <At x={j.lHand[0] - 22} y={j.lHand[1] + 8} s={0.88} r={-14}>
                  <ScrollMap label="دنیای جدید" />
                </At>
              )
            }
          </Actor>

          {/* Christopher Columbus punching takeaway cards & throwing the animator's cursor */}
          <Actor
            f={f}
            color={COL.orange}
            scale={S}
            facing={1}
            accessory="admiral"
            face="happy"
            label="کریستف کلمب"
            base={{ x: 580, y: GY }}
            mod={(t, p) => addPose(p, idle(t, 1))}
            keys={[
              { f: 0, p: { ...P.stand } },
              { f: bPunch1 - 7, p: { ...P.crouch, y: GY + 24 } },
              { f: bPunch1, p: { ...P.punchR, y: GY } },
              { f: bPunch1 + 14, p: { ...P.stand, y: GY } },
              { f: bPunch2 - 7, p: { ...P.crouch, y: GY + 24 } },
              { f: bPunch2, p: { ...P.punchR, y: GY } },
              { f: bPunch2 + 14, p: { ...P.stand, y: GY } },
              { f: bCursorGrab, p: { ...P.armsUp, y: GY - 45 } },
              { f: bCursorThrow, p: { ...P.pointR, y: GY } },
              { f: bFinalSlam, p: { ...P.cheer, y: GY } },
            ]}
          />

          <Burst x={700} y={670} at={bPunch1} f={f} size={190} color={COL.orange} />
          <Burst x={700} y={670} at={bPunch2} f={f} size={190} color={COL.blue} />
          <Burst x={700} y={620} at={bCursorThrow} f={f} size={220} color={COL.gold} />

          {f >= bCursorGrab - 24 && f <= bCursorThrow + 22 && (
            <Cursor x={cursorX} y={cursorY} scale={1.9} pressed={f >= bCursorGrab && f <= bCursorThrow} />
          )}
        </>
      }
      html={
        <>
          <Card f={f} at={bPunch1} x={1320} y={240} w={920} n="۱" accent={COL.purple} size={36}>
            آمریگو وسپوچی ثابت کرد قاره‌ای جدید است و «آمریکا» نام گرفت!
          </Card>

          <Card f={f} at={bPunch2} x={1320} y={400} w={920} n="۲" accent={COL.orange} size={36}>
            آغاز «مبادله بزرگ کلمبی» و تغییر همیشگی نقشه و تاریخ جهان!
          </Card>

          <Stamp f={f} at={bPunch1 + 12} x={1320} y={590} text="ثبت به نام: AMERICA" color={COL.blue} size={62} r={-4} />

          <Slam
            f={f}
            at={bFinalSlam}
            x={960}
            y={125}
            size={82}
            color={COL.ink}
            font={FONT.comic}
          >
            دنبال ادویه رفت... دنیای جدید پیدا کرد!
          </Slam>

          <Caption f={f} at={bFinalSlam + 8} x={1320} y={720} size={32} bg={COL.orange}>
            ساخته‌شده با موتور انیمیشن Stickman Video • آماده صداگذاری
          </Caption>

          <Wipe f={f} dur={dur} />
        </>
      }
    />
  );
};

export const buildS05Sfx = (from: number): SfxCue[] => {
  const bPunch1 = beat(from, 10, 0.30);
  const bPunch2 = beat(from, 10, 0.68);
  const bCursorGrab = beat(from, 11, 0.26);
  const bCursorThrow = bCursorGrab + 12;
  const bFinalSlam = beat(from, 11, 0.58);
  return [
    [8, "whoosh", 0.6],
    [bPunch1, "punch", 0.85],
    [bPunch1 + 3, "pop", 0.75],
    [bPunch1 + 12, "stamp", 0.75],
    [bPunch2, "punch", 0.85],
    [bPunch2 + 3, "pop", 0.75],
    [bCursorGrab - 10, "whoosh", 0.6],
    [bCursorThrow, "boing", 0.85],
    [bFinalSlam, "slam", 0.95],
  ];
};
