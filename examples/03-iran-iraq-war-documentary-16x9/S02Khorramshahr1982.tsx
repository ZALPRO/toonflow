import React from "react";
import { useCurrentFrame } from "remotion";
import {
  COL,
  FONT,
  Slam,
  Wipe,
  Burst,
  Explosion,
  MuzzleFlash,
  Tracer,
  WarMap,
  ScreenFlash,
  countUp,
  fmt,
  ease,
} from "../stickman/fx";
import { Stage, Card, Stamp, TimelineHUD, WordBlock } from "../stickman/common";
import { Actor, P, SMOOTH, groundY, idle } from "../stickman/stick";
import { At, Tank, Rifle, Flag, Bill, GoldBar, FighterJet } from "../stickman/props";
import { beat, cueEnd, cueStart } from "./beats";

const GY = groundY();

export const S02Khorramshahr1982: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const f = useCurrentFrame();

  // Cue 3 (715..911): 1360 — Unity of Artesh, IRGC & Basij breaks Siege of Abadan
  const bCue3 = cueStart(from, 3);
  const bCounterShot = beat(from, 3, 0.45);
  const bCue3End = cueEnd(from, 3);

  // Cue 4 (919..1104): 3 Khordad 1361 — Operation Beit ol-Moqaddas liberates Khorramshahr + 19,000 POWs
  const bCue4 = cueStart(from, 4);
  const bLiberate = beat(from, 4, 0.25);
  const bPOWCount = beat(from, 4, 0.42);
  const bCue4End = cueEnd(from, 4);

  // Cue 5 (1112..1308): Iran enters Iraqi territory; superpowers & Gulf states back Baghdad
  const bCue5 = cueStart(from, 5);
  const bCard1 = beat(from, 5, 0.28);
  const bCard2 = beat(from, 5, 0.56);

  // Iranian Tank advance
  const irTankX = ease(f, bCue3, bCue4, 240, 480, SMOOTH);
  const irRecoil = f >= bCounterShot && f < bCounterShot + 10 ? (1 - (f - bCounterShot) / 10) * 18 : 0;

  // Artesh Commander (Sayyad Shirazi)
  const sayyadKeys = [
    { f: 0, p: { ...P.stand, x: 560, y: GY } },
    { f: bCue3 + 8, p: { ...P.pointR, x: 740, y: GY }, e: SMOOTH },
    { f: bCounterShot, p: { ...P.salute, x: 740, y: GY } },
    { f: bLiberate, p: { ...P.cheer, x: 740, y: GY } },
    { f: bCue5, p: { ...P.pointR, x: 640, y: GY }, e: SMOOTH },
  ];

  // Basij / IRGC Fighter
  const basijKeys = [
    { f: 0, p: { ...P.stand, x: 420, y: GY } },
    { f: bCue3 + 12, p: { ...P.aimR, x: 900, y: GY }, e: SMOOTH },
    { f: bLiberate, p: { ...P.cheer, x: 900, y: GY } },
    { f: bCue5, p: { ...P.aimR, x: 800, y: GY }, e: SMOOTH },
  ];

  // Iraqi Soldier 1 (retreats -> surrenders at Khorramshahr)
  const iqPOW1Keys = [
    { f: 0, p: { ...P.aimR, x: 1340, y: GY } },
    { f: bCounterShot + 8, p: { ...P.shock, x: 1380, y: GY } },
    { f: bLiberate, p: { ...P.armsUp, x: 1340, y: GY } },
    { f: bCue5, p: { ...P.stand, x: 1260, y: GY }, e: SMOOTH },
  ];

  // Iraqi Soldier 2 / Saddam in Cue 5
  const iqPOW2Keys = [
    { f: 0, p: { ...P.aimR, x: 1520, y: GY } },
    { f: bCounterShot + 8, p: { ...P.shock, x: 1550, y: GY } },
    { f: bLiberate, p: { ...P.armsUp, x: 1520, y: GY } },
    { f: bCue5, p: { ...P.cheer, x: 1480, y: GY }, e: SMOOTH },
  ];

  const powNumber = countUp(f, bPOWCount, bPOWCount + 45, 19000, 0);
  const flagScale = ease(f, bLiberate, bLiberate + 16, 0, 1);

  const hits = [bCounterShot + 7, bLiberate, bCard1, bCard2];

  // Subtle camera zoom into Khorramshahr flag-raising in Cue 4
  const libZoom =
    f >= bCue4 && f < bCue5
      ? 1 + 0.055 * ease(f, bLiberate, bLiberate + 16, 0, 1) * (1 - ease(f, bCue5 - 16, bCue5, 0, 1))
      : 1;

  return (
    <Stage
      hits={hits}
      power={18}
      theme="liberation"
      cam={{ x: 0, y: 0, z: libZoom }}
      svg={
        <>
          {/* Strategic War Map showing Khorramshahr Liberation Counter-Offensives (Cues 3 & 4) */}
          {f < bCue5 && (
            <g opacity={1 - ease(f, bCue5 - 10, bCue5, 0, 1)}>
              <WarMap x={275} y={445} f={f} at={bCue3 + 12} phase="liberation" scale={0.92} />
            </g>
          )}

          {/* Iranian Chieftain Tank advancing */}
          <At x={irTankX} y={818} s={1.08}>
            <Tank dir={1} color={COL.olive} label="لشکر زرهی ایران" recoil={irRecoil} />
          </At>
          <MuzzleFlash x={irTankX + 205} y={768} at={bCounterShot} f={f} dir={1} scale={1.35} />
          <Tracer x1={irTankX + 210} y1={768} x2={1240} y2={815} at={bCounterShot} f={f} dur={7} />
          <Explosion x={1240} y={825} at={bCounterShot + 7} f={f} size={185} />

          {/* Artesh Commander */}
          <Actor
            keys={sayyadKeys}
            color={COL.blue}
            hat="beret"
            face={f >= bLiberate && f < bCue5 ? "happy" : "eyes"}
            facing={1}
            label="فرمانده ارتش"
            f={f}
            extra={idle(f, 1)}
          />

          {/* IRGC / Basij Fighter */}
          <Actor
            keys={basijKeys}
            color={COL.green}
            hat="helmet_ir"
            face={f >= bLiberate && f < bCue5 ? "happy" : "angry"}
            facing={1}
            label="سپاه و بسیج"
            f={f}
            extra={idle(f, 3)}
          >
            {(j) =>
              f < bLiberate || f >= bCue5 ? (
                <At x={j.rHand[0]} y={j.rHand[1]}>
                  <Rifle dir={1} />
                </At>
              ) : null
            }
          </Actor>

          {/* Liberated Khorramshahr Iranian Flag */}
          {flagScale > 0.01 && (
            <At x={1080} y={GY} s={flagScale * 1.25}>
              <Flag colors={[COL.green, "#ffffff", COL.red]} label="خرمشهر آزاد" />
            </At>
          )}
          <Burst x={1080} y={660} at={bLiberate} f={f} color={COL.green} size={190} />

          {/* Iraqi Troops surrendering in Cue 4 / Regrouping with foreign aid in Cue 5 */}
          <Actor
            keys={iqPOW1Keys}
            color={COL.khaki}
            hat="helmet_iq"
            face={f >= bCounterShot + 8 && f < bCue5 ? "sad" : "angry"}
            facing={-1}
            label={f < bCue5 ? "اسیر عراقی" : "ارتش عراق"}
            f={f}
            extra={idle(f, 5)}
          />
          <Actor
            keys={iqPOW2Keys}
            color={COL.olive}
            hat={f >= bCue5 ? "beret" : "helmet_iq"}
            face={f >= bCue5 ? "smirk" : "shock"}
            facing={-1}
            label={f >= bCue5 ? "صدام حسین" : "سرباز عراقی"}
            f={f}
            extra={idle(f, 7)}
          />

          {/* Cue 4: POW & Area Liberated Badge */}
          {f >= bPOWCount && f < bCue5 && (
            <At x={1430} y={500} s={ease(f, bPOWCount, bPOWCount + 12)}>
              <WordBlock text={`${fmt(powNumber)} اسیر عراقی`} bg={COL.yellow} size={42} />
            </At>
          )}

          {/* Cue 5: Global Aid pouring into Iraq (Mirage Jet + Petrodollars + Gold) */}
          {f >= bCue5 && (
            <g opacity={ease(f, bCue5, bCue5 + 14)}>
              <At x={1690} y={580} s={0.95}>
                <FighterJet dir={-1} color="#90a4ae" label="میراژ فرانسه" afterburner={false} />
              </At>
              <At x={1660} y={820} s={0.95}>
                <GoldBar label="وام عربی" />
              </At>
              <At x={1780} y={730} s={0.85} r={-12}>
                <Bill sym="$" />
              </At>
            </g>
          )}

          <ScreenFlash f={f} hits={[bCounterShot + 7]} />
          <Wipe f={f} dur={dur} />
        </>
      }
      html={
        <>
          <TimelineHUD
            year={f < bCue4 ? "۱۳۶۰ (۱۹۸۱)" : "خرداد ۱۳۶۱ (۱۹۸۲)"}
            phase={f < bCue4 ? "شکست حصر آبادان" : f < bCue5 ? "آزادسازی خرمشهر" : "جنگ فرسایشی"}
            progress={0.35}
            color={f < bCue5 ? COL.green : COL.orange}
          />
          {/* Cue 3 Headings */}
          <Slam f={f} at={bCue3} out={bCue3End} x={960} y={115} size={82} color={COL.ink} font={FONT.title} weight={900}>
            ۱۳۶۰: شکست حصر آبادان و عملیات فتح‌المبین!
          </Slam>
          <Slam f={f} at={bCue3 + 12} out={bCue3End} x={960} y={210} size={38} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.green, padding: "8px 26px", borderRadius: 12 }}>
              هم‌افزایی ارتش، سپاه و نیروهای مردمی، ارتش عراق را به عقب راند
            </span>
          </Slam>

          {/* Cue 4 Headings */}
          <Slam f={f} at={bCue4} out={bCue4End} x={960} y={110} size={86} color={COL.green} font={FONT.title} weight={900}>
            ۳ خرداد ۱۳۶۱: فتح خرمشهر در عملیات «بیت‌المقدس»!
          </Slam>
          <Slam f={f} at={bCue4 + 12} out={bCue4End} x={960} y={205} size={38} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.ink, padding: "8px 26px", borderRadius: 12 }}>
              آزادسازی ۵,۰۳۸ کیلومتر مربع خاک ایران و اسارت ۱۹,۰۰۰ نظامی عراقی!
            </span>
          </Slam>

          {/* Cue 5 Headings & Cards */}
          <Slam f={f} at={bCue5} out={dur - 12} x={960} y={105} size={78} color={COL.red} font={FONT.title} weight={900}>
            تیر ۱۳۶۱: ورود ایران به خاک عراق و حمایت جهانی از صدام!
          </Slam>
          <Card f={f} at={bCard1} out={dur - 12} x={430} y={250} n="۱" w={720} accent={COL.blue} size={32}>
            تجهیز ارتش عراق به جنگنده‌های میراژ فرانسه، تانک و موشک‌های شوروی
          </Card>
          <Card f={f} at={bCard2} out={dur - 12} x={1460} y={250} n="۲" w={760} accent={COL.orange} size={32}>
            اطلاعات ماهواره‌ای آمریکا و بیش از ۴۰ میلیارد دلار کمک مالی کشورهای عربی
          </Card>
          {f >= bCard2 + 8 && (
            <Stamp f={f} at={bCard2 + 8} x={960} y={440} text="جنگ فرسایشی ۶ ساله!" color={COL.red} size={58} r={-5} />
          )}
        </>
      }
    />
  );
};
