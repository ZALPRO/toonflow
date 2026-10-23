import React from "react";
import { useCurrentFrame } from "remotion";
import { COL, FONT, Slam, Burst, Wipe, ease } from "../stickman/fx";
import { Stage, ReelBadge } from "../stickman/common";
import { Actor, P, SMOOTH, V_GROUND_Y, groundY, idle } from "../stickman/stick";
import { At, Bank, SafeBox, HouseProp, SavingsBundleIcon } from "../stickman/props";
import { beat, cueEnd, cueStart } from "./beats";

const SCALE = 1.48;
const GY = groundY(SCALE, V_GROUND_Y);

export const S01TwoFriends: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const f = useCurrentFrame();

  // Cue 0: 10 years ago, Arash and Sara each had 100M Toman savings
  const bCue0 = cueStart(from, 0);
  const bCue0End = cueEnd(from, 0);

  // Cue 1: Arash -> Bank deposit, Sara -> 100 Gold coins
  const bCue1 = cueStart(from, 1);
  const bSaraPick = beat(from, 1, 0.22);
  const bCue1End = cueEnd(from, 1);

  // Cue 2: Back then 100M could buy 100 gold coins or an apartment!
  const bCue2 = cueStart(from, 2);
  const bHouse = beat(from, 2, 0.15);

  const showCue0 = f < bCue1 - 4;
  const showCue1 = f >= bCue1 - 4 && f < bCue2 - 4;
  const showCue2 = f >= bCue2 - 4;

  // Dynamic walking entrance, stepping toward choices, and celebratory jump!
  const arashKeys = [
    { f: 0, p: { ...P.stand, x: 140, y: GY } },
    { f: 22, p: { ...P.hold, x: 275, y: GY }, e: SMOOTH, dur: 22 },
    { f: bCue1, p: { ...P.pointR, x: 295, y: GY }, e: SMOOTH, dur: 14 },
    { f: bCue2, p: { ...P.think, x: 270, y: GY }, e: SMOOTH, dur: 14 },
  ];

  const saraKeys = [
    { f: 0, p: { ...P.stand, x: 900, y: GY } },
    { f: 22, p: { ...P.hold, x: 755, y: GY }, e: SMOOTH, dur: 22 },
    { f: bSaraPick, p: { ...P.cheer, x: 740, y: GY - 28 }, dur: 7 },
    { f: bSaraPick + 9, p: { ...P.cheer, x: 740, y: GY }, dur: 8 },
    { f: bCue2, p: { ...P.pointR, x: 755, y: GY }, e: SMOOTH, dur: 14 },
  ];

  const hits = [bCue0, bCue1, bSaraPick, bCue2];

  return (
    <Stage
      hits={hits}
      power={11}
      theme="default"
      svg={
        <>
          <Burst x={520} y={510} at={bCue0 + 2} f={f} color={COL.gold} size={180} />
          <Burst x={745} y={510} at={bSaraPick} f={f} color={COL.gold} size={170} />
          <Burst x={520} y={510} at={bHouse} f={f} color={COL.green} size={180} />

          {/* CUE 0: Studio-grade Banknote Bundle in the Golden Eye-Tracking Zone */}
          {showCue0 && (
            <g opacity={ease(f, bCue0, bCue0 + 12, 0, 1)}>
              <At x={520} y={535} s={ease(f, bCue0, bCue0 + 14, 0.75, 1.02, SMOOTH)}>
                <SavingsBundleIcon amount="پس‌انداز: ۱۰۰ میلیون تومان" sub="سرمایه اولیه هر نفر در سال ۱۳۹۵" />
              </At>
            </g>
          )}

          {/* CUE 1: Classical Bank Facade vs Gleaming Gold Coins Stack */}
          {showCue1 && (
            <g opacity={ease(f, bCue1 - 4, bCue1 + 8, 0, 1)}>
              <At x={285} y={540} s={ease(f, bCue1, bCue1 + 14, 0.7, 0.86, SMOOTH)}>
                <Bank label="سپرده بانکی" sub="انتخاب آرش" color="#e3f2fd" />
              </At>
              <At x={745} y={540} s={ease(f, bSaraPick, bSaraPick + 14, 0, 0.86, SMOOTH)}>
                <SafeBox label="۱۰۰ سکه طلا" sub="انتخاب سارا" />
              </At>
            </g>
          )}

          {/* CUE 2: Modern 3-Story Apartment Building Illustration */}
          {showCue2 && (
            <g opacity={ease(f, bCue2 - 4, bCue2 + 8, 0, 1)}>
              <At x={520} y={540} s={ease(f, bHouse, bHouse + 14, 0.75, 0.98, SMOOTH)}>
                <HouseProp label="معادل ۱ آپارتمان نوساز" sub="یا ۱۰۰ سکه بهار آزادی در سال ۱۳۹۵" />
              </At>
            </g>
          )}

          {/* IranIraqWar v5 Pro Two-Pass Colored Characters */}
          <Actor
            keys={arashKeys}
            color={COL.blue}
            scale={SCALE}
            face={(t) => (t >= bCue2 ? "think" : t >= bCue1 ? "smirk" : "happy")}
            handProp={(t) => (t < bCue2 ? "cash" : "none")}
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
            face={(t) => (t >= bSaraPick ? "happy" : "smirk")}
            handProp={(t) => (t >= bSaraPick ? "coin" : "cash")}
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

          {/* Exact IranIraqWar 2-Tier Header: Main Slam + Colored Pill Sub-Banner */}
          <Slam f={f} at={bCue0} out={bCue0End} x={525} y={265} size={52} color={COL.ink} font={FONT.title} weight={900}>
            ۱۰ سال پیش (سال ۱۳۹۵)
          </Slam>
          <Slam f={f} at={bCue0 + 4} out={bCue0End} x={525} y={335} size={26} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.ink, padding: "6px 22px", borderRadius: 12 }}>
              سرمایه اولیه هر نفر: ۱۰۰ میلیون تومان
            </span>
          </Slam>

          <Slam f={f} at={bCue1} out={bCue1End} x={525} y={265} size={52} color={COL.blue} font={FONT.title} weight={900}>
            دو تصمیم کاملاً متفاوت!
          </Slam>
          <Slam f={f} at={bCue1 + 4} out={bCue1End} x={525} y={335} size={26} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.blue, padding: "6px 22px", borderRadius: 12 }}>
              سپرده بانکی در برابر سکه طلا
            </span>
          </Slam>

          <Slam f={f} at={bCue2} out={dur - 8} x={525} y={265} size={50} color={COL.green} font={FONT.title} weight={900}>
            قدرت خرید ۱۰۰ میلیون در سال ۹۵
          </Slam>
          <Slam f={f} at={bCue2 + 4} out={dur - 8} x={525} y={335} size={26} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.green, padding: "6px 22px", borderRadius: 12 }}>
              معادل ۱۰۰ سکه طلا یا ۱ آپارتمان!
            </span>
          </Slam>
        </>
      }
    />
  );
};
