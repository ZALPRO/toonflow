import React from "react";
import { useCurrentFrame } from "remotion";
import { COL, FONT, Slam, Burst, Wipe, ease } from "../stickman/fx";
import { Stage, Stamp, ReelBadge } from "../stickman/common";
import { Actor, P, SMOOTH, V_GROUND_Y, groundY, idle } from "../stickman/stick";
import { At, SafeBox } from "../stickman/props";
import { StepLadderIcon } from "./FomoProps";
import { beat, cueEnd, cueStart } from "./beats";

const SCALE = 1.52;
const GY = groundY(SCALE, V_GROUND_Y);

export const S03StepBuying: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const f = useCurrentFrame();

  // Cue 4: Sara uses the 3-step DCA formula (30% first dip, 30% cooling, 40% support floor)
  const bCue4 = cueStart(from, 4);
  const bCue4End = cueEnd(from, 4);

  // Cue 5: Result: 6 months later, Arash barely broke even while Sara made +45% net profit!
  const bCue5 = cueStart(from, 5);
  const bProfit = beat(from, 5, 0.22);

  const showCue4 = f < bCue5 - 4;
  const showCue5 = f >= bCue5 - 4;

  const saraKeys = [
    { f: 0, p: { ...P.stand, x: 890, y: GY } },
    { f: 18, p: { ...P.pointR, x: 755, y: GY }, e: SMOOTH, dur: 18 },
    { f: bCue5, p: { ...P.cheer, x: 740, y: GY - 28 }, dur: 7 },
    { f: bCue5 + 9, p: { ...P.cheer, x: 740, y: GY }, dur: 8 },
  ];

  const hits = [bCue4, bCue5, bProfit + 35];

  return (
    <Stage
      hits={hits}
      power={12}
      theme="wealth"
      svg={
        <>
          <Burst x={475} y={530} at={bCue4 + 2} f={f} color={COL.blue} size={180} />
          <Burst x={475} y={540} at={bProfit} f={f} color={COL.gold} size={190} />

          {/* CUE 4: 3-Step Staircase Buying Strategy (30% - 30% - 40%) */}
          {showCue4 && (
            <g opacity={ease(f, bCue4, bCue4 + 10, 0, 1)}>
              <At x={475} y={540} s={ease(f, bCue4, bCue4 + 14, 0.8, 0.96, SMOOTH)}>
                <StepLadderIcon />
              </At>
            </g>
          )}

          {/* CUE 5: +45% Net Profit Shield */}
          {showCue5 && (
            <g opacity={ease(f, bCue5 - 4, bCue5 + 8, 0, 1)}>
              <At x={475} y={540} s={ease(f, bProfit, bProfit + 14, 0.78, 0.96, SMOOTH)}>
                <SafeBox
                  label="۴۵٪ سود خالص سارا پس از ۶ ماه!"
                  sub="ورود در قیمت میانگین پایین‌تر بدون استرس ریزش"
                />
              </At>
            </g>
          )}

          <Actor
            keys={saraKeys}
            color={COL.purple}
            hat="ponytail"
            scale={SCALE}
            face={(t) => (t >= bCue5 ? "happy" : "smirk")}
            handProp={(t) => (t < bCue5 ? "phone_green" : "coin")}
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

          <Slam f={f} at={bCue4} out={bCue4End} x={525} y={265} size={48} color={COL.blue} font={FONT.title} weight={900}>
            استراتژی هوشمند سارا: خرید ۳ پله‌ای!
          </Slam>
          <Slam f={f} at={bCue4 + 4} out={bCue4End} x={525} y={335} size={26} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.blue, padding: "6px 22px", borderRadius: 12 }}>
              تقسیم سرمایه: ۳۰٪ اصلاح اول، ۳۰٪ آرامش، ۴۰٪ کف
            </span>
          </Slam>

          <Slam f={f} at={bCue5} out={dur - 8} x={525} y={265} size={50} color={COL.green} font={FONT.title} weight={900}>
            نتیجه ۶ ماه بعد: ۴۵٪ سود خالص!
          </Slam>
          <Slam f={f} at={bCue5 + 4} out={dur - 8} x={525} y={335} size={26} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.green, padding: "6px 22px", borderRadius: 12 }}>
              آرامش کامل روانی و میانگین خرید پایین‌تر!
            </span>
          </Slam>

          {showCue5 && (
            <Stamp f={f} at={bProfit + 28} x={385} y={845} text="۴۵٪ سود خالص!" color={COL.green} size={34} r={-4} />
          )}
        </>
      }
    />
  );
};
