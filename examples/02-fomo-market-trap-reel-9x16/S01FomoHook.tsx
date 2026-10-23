import React from "react";
import { useCurrentFrame } from "remotion";
import { COL, FONT, Slam, Burst, Wipe, ease } from "../stickman/fx";
import { Stage, ReelBadge } from "../stickman/common";
import { Actor, P, SMOOTH, V_GROUND_Y, groundY, idle } from "../stickman/stick";
import { At } from "../stickman/props";
import { FomoTrapChartIcon, BreakingHypeIcon, BubbleMeterIcon } from "./FomoProps";
import { beat, cueEnd, cueStart } from "./beats";

const SCALE = 1.48;
const GY = groundY(SCALE, V_GROUND_Y);

export const S01FomoHook: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const f = useCurrentFrame();

  // Cue 0: Have you ever noticed the moment you buy gold or dollars, the price drops the next day?
  const bCue0 = cueStart(from, 0);
  const bCue0End = cueEnd(from, 0);

  // Cue 1: Last year when news shouted "Gold is flying!", Arash panicked and bought with 100% of his money at the peak!
  const bCue1 = cueStart(from, 1);
  const bArashBuy = beat(from, 1, 0.35);
  const bCue1End = cueEnd(from, 1);

  // Cue 2: But Sara knows when everyone is in the buying queue, the market has entered an emotional bubble!
  const bCue2 = cueStart(from, 2);

  const showCue0 = f < bCue1 - 4;
  const showCue1 = f >= bCue1 - 4 && f < bCue2 - 4;
  const showCue2 = f >= bCue2 - 4;

  // Expressive entrance, panic recoil on market hype, Arash rushing in with cash, Sara pointing out the bubble!
  const arashKeys = [
    { f: 0, p: { ...P.stand, x: 140, y: GY } },
    { f: 18, p: { ...P.shock, x: 270, y: GY - 24 }, dur: 7 },
    { f: 26, p: { ...P.shock, x: 270, y: GY }, dur: 8 },
    { f: bCue1, p: { ...P.run, x: 285, y: GY }, e: SMOOTH, dur: 14 },
    { f: bArashBuy, p: { ...P.cheer, x: 290, y: GY - 22 }, dur: 7 },
    { f: bArashBuy + 8, p: { ...P.cheer, x: 290, y: GY }, dur: 8 },
    { f: bCue2, p: { ...P.think, x: 275, y: GY }, e: SMOOTH, dur: 14 },
  ];

  const saraKeys = [
    { f: 0, p: { ...P.stand, x: 900, y: GY } },
    { f: 18, p: { ...P.think, x: 755, y: GY }, e: SMOOTH, dur: 18 },
    { f: bCue1, p: { ...P.think, x: 750, y: GY }, e: SMOOTH, dur: 14 },
    { f: bCue2, p: { ...P.pointR, x: 740, y: GY - 20 }, dur: 7 },
    { f: bCue2 + 8, p: { ...P.pointR, x: 740, y: GY }, dur: 8 },
  ];

  const hits = [bCue0, bCue1, bArashBuy, bCue2];

  return (
    <Stage
      hits={hits}
      power={11}
      theme={showCue0 ? "danger" : "default"}
      svg={
        <>
          <Burst x={520} y={530} at={bCue0 + 2} f={f} color={COL.red} size={180} />
          <Burst x={520} y={530} at={bArashBuy} f={f} color={COL.orange} size={180} />
          <Burst x={520} y={530} at={bCue2 + 2} f={f} color={COL.gold} size={180} />

          {/* CUE 0: Emotional FOMO Peak Chart with Danger Peak Marker */}
          {showCue0 && (
            <g opacity={ease(f, bCue0, bCue0 + 10, 0, 1)}>
              <At x={520} y={540} s={ease(f, bCue0, bCue0 + 14, 0.78, 0.96, SMOOTH)}>
                <FomoTrapChartIcon />
              </At>
            </g>
          )}

          {/* CUE 1: Breaking News Hype & All-In Queue Trap */}
          {showCue1 && (
            <g opacity={ease(f, bCue1 - 4, bCue1 + 8, 0, 1)}>
              <At x={520} y={540} s={ease(f, bCue1, bCue1 + 14, 0.78, 0.96, SMOOTH)}>
                <BreakingHypeIcon />
              </At>
            </g>
          )}

          {/* CUE 2: Sara's Bubble Thermometer / Gauge */}
          {showCue2 && (
            <g opacity={ease(f, bCue2 - 4, bCue2 + 8, 0, 1)}>
              <At x={520} y={540} s={ease(f, bCue2, bCue2 + 14, 0.78, 0.96, SMOOTH)}>
                <BubbleMeterIcon />
              </At>
            </g>
          )}

          <Actor
            keys={arashKeys}
            color={COL.blue}
            scale={SCALE}
            face={(t) => (t < bCue1 ? "shock" : t < bCue2 ? "happy" : "think")}
            handProp={(t) => (t < bCue1 ? "phone_red" : "cash")}
            facing={1}
            label="آرش"
            f={f}
            extra={idle(f, 1)}
          />

          <Actor
            keys={saraKeys}
            color={COL.purple}
            hat="ponytail"
            scale={SCALE}
            face={(t) => (t < bCue2 ? "think" : "smirk")}
            handProp="phone_green"
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

          <Slam f={f} at={bCue0} out={bCue0End} x={525} y={265} size={48} color={COL.red} font={FONT.title} weight={900}>
            چرا به محض خریدِ ما، قیمت می‌ریزد؟!
          </Slam>
          <Slam f={f} at={bCue0 + 4} out={bCue0End} x={525} y={335} size={26} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.red, padding: "6px 22px", borderRadius: 12 }}>
              تله بزرگ بازار طلا و دلار!
            </span>
          </Slam>

          <Slam f={f} at={bCue1} out={bCue1End} x={525} y={265} size={50} color={COL.orange} font={FONT.title} weight={900}>
            تله خرید هیجانی (FOMO) در اوج!
          </Slam>
          <Slam f={f} at={bCue1 + 4} out={bCue1End} x={525} y={335} size={26} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.ink, padding: "6px 22px", borderRadius: 12 }}>
              ورود با کل سرمایه در قله قیمت!
            </span>
          </Slam>

          <Slam f={f} at={bCue2} out={dur - 8} x={525} y={265} size={50} color={COL.green} font={FONT.title} weight={900}>
            تشخیص هوشمند سارا: حباب بازار!
          </Slam>
          <Slam f={f} at={bCue2 + 4} out={dur - 8} x={525} y={335} size={26} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.green, padding: "6px 22px", borderRadius: 12 }}>
              وقتی همه در صف خریدند، بازار در حباب است!
            </span>
          </Slam>
        </>
      }
    />
  );
};
