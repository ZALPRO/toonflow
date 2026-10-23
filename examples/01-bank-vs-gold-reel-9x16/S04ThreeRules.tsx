import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COL, FONT, Slam, Burst, Wipe, ease } from "../stickman/fx";
import { Stage, Card, ReelBadge } from "../stickman/common";
import { Actor, P, SMOOTH, V_GROUND_Y, groundY, idle } from "../stickman/stick";
import { beat, cueEnd, cueStart } from "./beats";

const SCALE = 1.48;
const GY = groundY(SCALE, V_GROUND_Y);

export const S04ThreeRules: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const f = useCurrentFrame();

  // Cue 6: Rule 1: Don't look only at nominal bank interest; the real metric is purchasing power
  const bCue6 = cueStart(from, 6);
  const bCard1 = beat(from, 6, 0.15);
  const bCue6End = cueEnd(from, 6);

  // Cue 7: Rule 2: Convert savings into real assets + Follow CTA
  const bCue7 = cueStart(from, 7);
  const bCard2 = beat(from, 7, 0.12);
  const bFollowCTA = beat(from, 7, 0.32);

  const arashKeys = [
    { f: 0, p: { ...P.think, x: 265, y: GY } },
    { f: bCue7, p: { ...P.pointR, x: 285, y: GY }, e: SMOOTH, dur: 14 },
    { f: bFollowCTA, p: { ...P.cheer, x: 295, y: GY - 24 }, dur: 7 },
    { f: bFollowCTA + 8, p: { ...P.cheer, x: 295, y: GY }, dur: 8 },
  ];

  const saraKeys = [
    { f: 0, p: { ...P.pointR, x: 755, y: GY } },
    { f: bFollowCTA, p: { ...P.cheer, x: 735, y: GY - 24 }, dur: 7 },
    { f: bFollowCTA + 8, p: { ...P.cheer, x: 735, y: GY }, dur: 8 },
  ];

  const hits = [bCard1, bCard2, bFollowCTA];
  const ctaScale = interpolate(f - bFollowCTA, [0, 6, 10, 14], [0.5, 1.06, 0.98, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaOp = ease(f, bFollowCTA, bFollowCTA + 8, 0, 1);

  return (
    <Stage
      hits={hits}
      power={11}
      theme="default"
      svg={
        <>
          <Burst x={515} y={530} at={bCard1} f={f} color={COL.orange} size={170} />
          <Burst x={515} y={480} at={bCard2} f={f} color={COL.green} size={170} />

          <Actor
            keys={arashKeys}
            color={COL.blue}
            scale={SCALE}
            face={(t) => (t < bCue7 ? "think" : "happy")}
            handProp={(t) => (t >= bCue7 ? "coin" : "none")}
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
            face={(t) => (t >= bFollowCTA ? "happy" : "smirk")}
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

          <Slam f={f} at={bCue6} out={bCue6End} x={525} y={265} size={50} color={COL.ink} font={FONT.title} weight={900}>
            قانون اول حفظ سرمایه:
          </Slam>
          <Slam f={f} at={bCue6 + 4} out={bCue6End} x={525} y={335} size={26} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.ink, padding: "6px 22px", borderRadius: 12 }}>
              تفاوت سود اسمی بانکی با قدرت خرید واقعی
            </span>
          </Slam>

          <Slam f={f} at={bCue7} out={dur - 8} x={525} y={265} size={50} color={COL.green} font={FONT.title} weight={900}>
            فرمول برنده در تورم:
          </Slam>
          <Slam f={f} at={bCue7 + 4} out={dur - 8} x={525} y={335} size={26} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.green, padding: "6px 22px", borderRadius: 12 }}>
              تبدیل پول نقد به دارایی‌های واقعی
            </span>
          </Slam>

          <Card f={f} at={bCard1} out={bCue7 - 6} x={515} y={485} n="۱" w={820} accent={COL.orange} size={33}>
            فقط به عدد سود بانکی نگاه نکنید؛ معیار واقعی «قدرت خرید» است!
          </Card>

          <Card f={f} at={bCard2} x={515} y={435} n="۲" w={820} accent={COL.green} size={33}>
            پس‌انداز خود را به دارایی واقعی (طلا، مسکن و سهام) تبدیل کنید!
          </Card>

          {f >= bFollowCTA && (
            <div
              style={{
                position: "absolute",
                left: 515,
                top: 685,
                transform: `translate(-50%, -50%) scale(${ctaScale})`,
                opacity: ctaOp,
                background: COL.blue,
                color: "#fff",
                border: `4.5px solid ${COL.ink}`,
                borderRadius: 44,
                boxShadow: `6px 6px 0 ${COL.ink}`,
                padding: "14px 34px",
                fontFamily: FONT.title,
                fontWeight: 900,
                fontSize: 33,
                direction: "rtl",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span>برای تحلیل‌های روزانه،</span>
              <bdi dir="ltr" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, color: "#fff" }}>
                @ghimatrooz
              </bdi>
              <span>را دنبال کنید</span>
            </div>
          )}
        </>
      }
    />
  );
};
