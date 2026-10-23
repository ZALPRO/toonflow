import React from "react";
import { useCurrentFrame } from "remotion";
import { COL, FONT, Slam, Burst, Wipe, countUp, fmt, ease } from "../stickman/fx";
import { Stage, Stamp, ReelBadge } from "../stickman/common";
import { Actor, P, SMOOTH, V_GROUND_Y, groundY, idle } from "../stickman/stick";
import { At, IconLabel, InflationMeltIcon } from "../stickman/props";
import { beat, cueEnd, cueStart } from "./beats";

const SCALE = 1.52;
const GY = groundY(SCALE, V_GROUND_Y);

export const S02BankTrap: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const f = useCurrentFrame();

  // Cue 3: After 10 years, Arash's 100M became 600M with bank interest
  const bCue3 = cueStart(from, 3);
  const bCount = beat(from, 3, 0.18);
  const bCue3End = cueEnd(from, 3);

  // Cue 4: But 40% inflation melted his purchasing power like an ice cube!
  const bCue4 = cueStart(from, 4);
  const bMelt = beat(from, 4, 0.16);

  const showCue3 = f < bCue4 - 4;
  const showCue4 = f >= bCue4 - 4;

  const nominalVal = countUp(f, bCount, bCount + 50, 600, 100);
  const iceMelt = 1 - 0.52 * ease(f, bMelt, bMelt + 110, 0, 1);

  const arashKeys = [
    { f: 0, p: { ...P.stand, x: 150, y: GY } },
    { f: 18, p: { ...P.cheer, x: 255, y: GY }, e: SMOOTH, dur: 18 },
    { f: bCue4, p: { ...P.shock, x: 225, y: GY - 20 }, dur: 7 },
    { f: bCue4 + 8, p: { ...P.shock, x: 225, y: GY }, dur: 7 },
    { f: bMelt + 45, p: { ...P.sad, x: 235, y: GY }, e: SMOOTH, dur: 16 },
  ];

  const hits = [bCue3, bCue4];

  return (
    <Stage
      hits={hits}
      power={12}
      theme={showCue3 ? "default" : "danger"}
      svg={
        <>
          <Burst x={575} y={530} at={bCount} f={f} color={COL.green} size={180} />
          <Burst x={585} y={530} at={bCue4 + 2} f={f} color={COL.red} size={190} />

          {/* CUE 3: Comic Bank Passbook / Balance Screen in the Golden Safe Zone */}
          {showCue3 && (
            <g opacity={ease(f, bCue3, bCue3 + 10, 0, 1)}>
              <At x={575} y={540} s={ease(f, bCount, bCount + 14, 0.78, 0.94, SMOOTH)}>
                <g>
                  <rect x={-252} y={-88} width={520} height={168} rx={20} fill={COL.ink} />
                  <rect x={-260} y={-96} width={520} height={168} rx={20} fill="#fffdf6" stroke={COL.ink} strokeWidth={5.5} />
                  <rect x={-260} y={-96} width={520} height={46} rx={16} fill={COL.blue} stroke={COL.ink} strokeWidth={5} />
                  <text y={-65} textAnchor="middle" direction="rtl" fontFamily={FONT.body} fontWeight={800} fontSize={23} fill="#fff">
                    موجودی حساب بانکی آرش پس از ۱۰ سال
                  </text>
                  <text y={22} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={54} fill={COL.green}>
                    {`${fmt(nominalVal)} میلیون تومان`}
                  </text>
                  <IconLabel y={136} text="۶ برابر شدنِ عددِ پول در بانک" bg={COL.yellow} color={COL.ink} />
                </g>
              </At>
            </g>
          )}

          {/* CUE 4: Clean Self-Contained Melting Ice Purchasing Power Illustration */}
          {showCue4 && (
            <g opacity={ease(f, bCue4 - 4, bCue4 + 8, 0, 1)}>
              <At x={585} y={545} s={0.95}>
                <InflationMeltIcon f={f} melt={iceMelt} />
              </At>
            </g>
          )}

          <Actor
            keys={arashKeys}
            color={COL.blue}
            scale={SCALE}
            face={(t) => (t < bCue4 ? "happy" : t < bMelt + 45 ? "shock" : "sad")}
            handProp={(t) => (t < bCue4 ? "cash" : "ice")}
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

          <Slam f={f} at={bCue3} out={bCue3End} x={525} y={265} size={50} color={COL.green} font={FONT.title} weight={900}>
            پس از ۱۰ سال سود بانکی:
          </Slam>
          <Slam f={f} at={bCue3 + 4} out={bCue3End} x={525} y={335} size={26} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.green, padding: "6px 22px", borderRadius: 12 }}>
              ظاهراً ۵۰۰ میلیون تومان سود خالص!
            </span>
          </Slam>

          <Slam f={f} at={bCue4} out={dur - 8} x={525} y={265} size={52} color={COL.red} font={FONT.title} weight={900}>
            تله تورم ۴۰ درصدی!
          </Slam>
          <Slam f={f} at={bCue4 + 4} out={dur - 8} x={525} y={335} size={26} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.red, padding: "6px 22px", borderRadius: 12 }}>
              آب شدن قدرت خرید پول مثل تکه یخ!
            </span>
          </Slam>

          <Stamp f={f} at={bMelt + 24} x={685} y={845} text="سقوط قدرت خرید!" color={COL.red} size={34} r={-4} />
        </>
      }
    />
  );
};
