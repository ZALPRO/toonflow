import React from "react";
import { useCurrentFrame } from "remotion";
import { COL, FONT, Slam, Burst, Wipe, countUp, fmt, ease } from "../stickman/fx";
import { Stage, Stamp, ReelBadge } from "../stickman/common";
import { Actor, P, SMOOTH, V_GROUND_Y, groundY, idle } from "../stickman/stick";
import { At, SafeBox } from "../stickman/props";
import { beat, cueStart } from "./beats";

const SCALE = 1.52;
const GY = groundY(SCALE, V_GROUND_Y);

export const S03GoldShield: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const f = useCurrentFrame();

  // Cue 5: Meanwhile, Sara's 100 gold coins are worth over 5 Billion Toman today!
  const bCue5 = cueStart(from, 5);
  const bCount = beat(from, 5, 0.2);

  const saraVal = countUp(f, bCount, bCount + 55, 5000, 100);

  const saraKeys = [
    { f: 0, p: { ...P.stand, x: 880, y: GY } },
    { f: 18, p: { ...P.pointR, x: 755, y: GY }, e: SMOOTH, dur: 18 },
    { f: bCount + 22, p: { ...P.cheer, x: 740, y: GY - 24 }, dur: 7 },
    { f: bCount + 30, p: { ...P.cheer, x: 740, y: GY }, dur: 8 },
  ];

  const hits = [bCue5, bCount + 50];

  return (
    <Stage
      hits={hits}
      power={12}
      theme="wealth"
      svg={
        <>
          <Burst x={475} y={530} at={bCue5 + 4} f={f} color={COL.gold} size={200} />

          <At x={475} y={540} s={ease(f, bCue5, bCue5 + 16, 0.78, 0.96, SMOOTH)}>
            <SafeBox label={`${fmt(saraVal)} میلیون (۵ میلیارد تومان!)`} />
          </At>

          <Actor
            keys={saraKeys}
            color={COL.purple}
            hat="ponytail"
            scale={SCALE}
            face="happy"
            handProp="coin"
            facing={-1}
            label="سارا"
            f={f}
            extra={idle(f, 4)}
          />

          <Wipe f={f} dur={dur} />
        </>
      }
      html={
        <>
          <ReelBadge handle="@ghimatrooz" />

          <Slam f={f} at={bCue5} out={dur - 8} x={525} y={265} size={50} color={COL.green} font={FONT.title} weight={900}>
            ارزش ۱۰۰ سکه سارا امروز:
          </Slam>
          <Slam f={f} at={bCue5 + 4} out={dur - 8} x={525} y={335} size={26} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.green, padding: "6px 22px", borderRadius: 12 }}>
              رشد ۵۰ برابری سرمایه و حفظ قدرت خرید!
            </span>
          </Slam>

          <Stamp f={f} at={bCount + 38} x={385} y={845} text="۵۰ برابر رشد سرمایه!" color={COL.green} size={34} r={-4} />
        </>
      }
    />
  );
};
