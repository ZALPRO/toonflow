import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COL, FONT, Slam, Burst, Wipe, ease } from "../stickman/fx";
import { Stage, Card, ReelBadge } from "../stickman/common";
import { Actor, P, SMOOTH, V_GROUND_Y, groundY, idle } from "../stickman/stick";
import { beat, cueEnd, cueStart } from "./beats";

const SCALE = 1.48;
const GY = groundY(SCALE, V_GROUND_Y);

export const S04GoldenRules: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const f = useCurrentFrame();

  // Cue 6: Golden Rule 1: Never buy on emotional green days; buy when the market is quiet & red!
  const bCue6 = cueStart(from, 6);
  const bCard1 = beat(from, 6, 0.14);
  const bCue6End = cueEnd(from, 6);

  // Cue 7: Golden Rule 2: Always divide capital into 3–4 steps + Follow @ghimatrooz CTA
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
            قانون اول ورود به بازار:
          </Slam>
          <Slam f={f} at={bCue6 + 4} out={bCue6End} x={525} y={335} size={26} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.ink, padding: "6px 22px", borderRadius: 12 }}>
              پرهیز از خرید در روزهای سبز و پرهیجان
            </span>
          </Slam>

          <Slam f={f} at={bCue7} out={dur - 8} x={525} y={265} size={50} color={COL.green} font={FONT.title} weight={900}>
            قانون دوم: مدیریت پله‌ای سرمایه
          </Slam>
          <Slam f={f} at={bCue7 + 4} out={dur - 8} x={525} y={335} size={26} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.green, padding: "6px 22px", borderRadius: 12 }}>
              ورود در ۳ تا ۴ پله در اصلاح‌های بازار
            </span>
          </Slam>

          <Card f={f} at={bCard1} out={bCue7 - 6} x={515} y={485} n="۱" w={820} accent={COL.orange} size={32}>
            در روزهای سبز و پرهیجان نخرید؛ زمان خرید در روزهای آرام و اصلاحی بازار است!
          </Card>

          <Card f={f} at={bCard2} x={515} y={435} n="۲" w={820} accent={COL.green} size={32}>
            سرمایه را به ۳ یا ۴ پله تقسیم کنید تا هیچ ریزشی شما را غافلگیر نکند!
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
              <span>این پست را ذخیره کنید و</span>
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
