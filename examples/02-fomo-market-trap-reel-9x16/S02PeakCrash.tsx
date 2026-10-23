import React from "react";
import { useCurrentFrame } from "remotion";
import { COL, FONT, Slam, Burst, Wipe, ease } from "../stickman/fx";
import { Stage, Stamp, ReelBadge } from "../stickman/common";
import { Actor, P, SMOOTH, V_GROUND_Y, groundY, idle } from "../stickman/stick";
import { At } from "../stickman/props";
import { FomoTrapChartIcon } from "./FomoProps";
import { beat, cueStart } from "./beats";

const SCALE = 1.52;
const GY = groundY(SCALE, V_GROUND_Y);

export const S02PeakCrash: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const f = useCurrentFrame();

  // Cue 3: A week later the price bubble bursts (-20% crash) and Arash sells in panic at the bottom!
  const bCue3 = cueStart(from, 3);
  const bCrash = beat(from, 3, 0.22);

  const arashKeys = [
    { f: 0, p: { ...P.stand, x: 160, y: GY } },
    { f: 14, p: { ...P.shock, x: 245, y: GY - 24 }, dur: 7 },
    { f: 22, p: { ...P.shock, x: 245, y: GY }, dur: 7 },
    { f: bCrash + 30, p: { ...P.sad, x: 250, y: GY }, e: SMOOTH, dur: 18 },
  ];

  const hits = [bCue3, bCrash];

  return (
    <Stage
      hits={hits}
      power={13}
      theme="danger"
      svg={
        <>
          <Burst x={560} y={530} at={bCrash} f={f} color={COL.red} size={190} />

          {/* CUE 3: Bubble Burst & -20% Drop */}
          <g opacity={ease(f, bCue3 - 2, bCue3 + 10, 0, 1)}>
            <At x={560} y={540} s={ease(f, bCue3, bCue3 + 14, 0.78, 0.96, SMOOTH)}>
              <FomoTrapChartIcon />
            </At>
          </g>

          <Actor
            keys={arashKeys}
            color={COL.blue}
            scale={SCALE}
            face={(t) => (t < bCrash + 30 ? "shock" : "sad")}
            handProp="phone_red"
            facing={1}
            label="آرش"
            f={f}
            extra={idle(f, 2)}
          />

          <Wipe f={f} dur={dur} />
        </>
      }
      html={
        <>
          <ReelBadge handle="@ghimatrooz" />

          <Slam f={f} at={bCue3} out={dur - 8} x={525} y={265} size={48} color={COL.red} font={FONT.title} weight={900}>
            یک هفته بعد: ترکیدن حباب و ۲۰٪ ضرر!
          </Slam>
          <Slam f={f} at={bCue3 + 4} out={dur - 8} x={525} y={335} size={26} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.red, padding: "6px 22px", borderRadius: 12 }}>
              فروش از روی ترس در کف قیمت!
            </span>
          </Slam>

          <Stamp f={f} at={bCrash + 24} x={685} y={845} text="۲۰٪ ضرر سنگین!" color={COL.red} size={34} r={-4} />
        </>
      }
    />
  );
};
