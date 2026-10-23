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
  MissileArc,
  Fire,
  AirRaidSiren,
  RadarSweep,
  WarMap,
  ScreenFlash,
  SpeedLines,
  ease,
} from "../stickman/fx";
import { Stage, Stamp, TimelineHUD, WordBlock } from "../stickman/common";
import { Actor, P, SMOOTH, groundY, idle } from "../stickman/stick";
import { At, Podium, TreatyDoc, Tank, FighterJet, Rifle, Sandbags, BarbedWire, Flag } from "../stickman/props";
import { beat, cueEnd, cueStart } from "./beats";

const GY = groundY();

export const S01Invasion1980: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const f = useCurrentFrame();

  // Cue 0 (30..205): 26 Shahrivar 1359 (17 Sept 1980) — Saddam tears up the 1975 Algiers Agreement
  const bCue0 = cueStart(from, 0);
  const bTear = beat(from, 0, 0.42);
  const bCue0End = cueEnd(from, 0);

  // Cue 1 (212..398): 31 Shahrivar 1359 (22 Sept 1980) — Air blitz on 10 airfields + armored invasion of Khuzestan
  const bCue1 = cueStart(from, 1);
  const bAirStrike1 = beat(from, 1, 0.22);
  const bTankShot = beat(from, 1, 0.58);
  const bCue1End = cueEnd(from, 1);

  // Cue 2 (405..623): 34-day defense of Khorramshahr + Operation Kaman 99 (140 Iranian jets retaliate)
  const bCue2 = cueStart(from, 2);
  const bRifleBurst = beat(from, 2, 0.16);
  const bKaman99 = beat(from, 2, 0.46);
  const bKamanBomb1 = bKaman99 + 10;
  const bKamanBomb2 = bKaman99 + 18;

  // Treaty tear progress
  const tearT = ease(f, bTear, bTear + 14, 0, 1);
  const phase1Alpha = 1 - ease(f, bCue1 - 8, bCue1 + 4, 0, 1);
  const phase2Alpha = ease(f, bCue1 - 4, bCue1 + 8, 0, 1);

  // Iraqi jet flyby in Cue 1 (left -> right)
  const iqJetX = ease(f, bAirStrike1 - 10, bAirStrike1 + 52, -260, 2220, SMOOTH);
  // Iranian Kaman 99 F-4/F-14 jets in Cue 2 (right -> left)
  const irJet1X = ease(f, bKaman99 - 6, bKaman99 + 54, 2220, -280, SMOOTH);
  const irJet2X = ease(f, bKaman99 + 4, bKaman99 + 64, 2280, -240, SMOOTH);

  // Iraqi tank advance & recoil
  const tankX = ease(f, bCue1 + 10, bCue1 + 85, 160, 470, SMOOTH);
  const tankRecoil = f >= bTankShot && f < bTankShot + 10 ? (1 - (f - bTankShot) / 10) * 18 : 0;

  // Saddam in Cue 0
  const saddamKeys = [
    { f: 0, p: { ...P.pointR, x: 500, y: GY } },
    { f: bTear - 4, p: { ...P.hold, x: 500, y: GY } },
    { f: bTear + 2, p: { ...P.shock, x: 500, y: GY } },
    { f: bTear + 22, p: { ...P.cheer, x: 500, y: GY } },
  ];

  // Iranian Defender 1 (Khorramshahr trench)
  const irSoldier1Keys = [
    { f: 0, p: { ...P.stand, x: 1320, y: GY } },
    { f: bCue1, p: { ...P.kneelAim, x: 1180, y: 778 } },
    { f: bKaman99 + 28, p: { ...P.cheer, x: 1180, y: GY } },
  ];

  // Iranian Defender 2 (standing rifleman)
  const irSoldier2Keys = [
    { f: 0, p: { ...P.stand, x: 1480, y: GY } },
    { f: bCue1, p: { ...P.aimR, x: 1360, y: GY } },
    { f: bKaman99 + 28, p: { ...P.cheer, x: 1360, y: GY } },
  ];

  const hits = [bTear, bAirStrike1 + 22, bTankShot, bKamanBomb1 + 22, bKamanBomb2 + 22];

  // Subtle documentary camera zoom into the 1975 treaty tear in Cue 0, then pull back to wide battlefield
  const camZ =
    f < bCue1
      ? 1 + 0.045 * ease(f, bTear - 10, bTear + 10, 0, 1) * (1 - ease(f, bCue1 - 18, bCue1, 0, 1))
      : 1;

  return (
    <Stage
      hits={hits}
      power={20}
      theme={f < bCue1 ? "default" : "airraid"}
      cam={{ x: 0, y: 0, z: camZ }}
      svg={
        <>
          {/* Air-raid searchlights & siren alert during Cue 1 & early Cue 2 */}
          <AirRaidSiren f={f} from={bCue1} to={bKaman99} />
          <SpeedLines f={f} from={bKaman99} to={dur - 15} dir={-1} color="#cfe2f3" />

          {/* PHASE 1 (Cue 0): Baghdad Podium & Tearing up the 1975 Algiers Agreement */}
          {phase1Alpha > 0.01 && (
            <g opacity={phase1Alpha}>
              <Actor
                keys={saddamKeys}
                color={COL.olive}
                hat="beret"
                face={f >= bTear ? "angry" : "smirk"}
                facing={1}
                label="صدام حسین"
                f={f}
                extra={idle(f, 1)}
              />
              <At x={500} y={792}>
                <Podium label="بغداد ۱۹۸۰" />
              </At>
              {/* The 1975 Algiers Agreement document being torn in half directly above Arvand Rud */}
              <At x={940} y={445} s={1.15}>
                <TreatyDoc title="قرارداد ۱۹۷۵ الجزایر" sub="مرز اروندرود (خط تالوگ)" tear={tearT} />
              </At>
              <Burst x={940} y={445} at={bTear} f={f} color={COL.red} size={175} />

              {/* Arvand Rud border river & Iranian border post on the right */}
              <ellipse cx={940} cy={855} rx={135} ry={18} fill="#4fc3f7" stroke={COL.ink} strokeWidth={5} />
              <text x={940} y={862} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={22} fill={COL.ink}>
                اروندرود
              </text>
              <At x={1260} y={GY}>
                <Flag colors={[COL.green, "#ffffff", COL.red]} label="مرز ایران" />
              </At>
              {/* Strategic Map of the 1975 Border & Invasion Axes */}
              <WarMap x={1610} y={445} f={f} at={bCue0 + 16} phase="invasion" scale={0.95} />
            </g>
          )}

          {/* PHASE 2 (Cues 1 & 2): Invasion of Khuzestan, Khorramshahr Resistance & Operation Kaman 99 */}
          {phase2Alpha > 0.01 && (
            <g opacity={phase2Alpha}>
              {/* Tactical Radar HUD positioned below jet flight corridor */}
              <RadarSweep x={1790} y={485} r={70} f={f} label="رادار مرزی" />

              {/* Advancing Iraqi Tank */}
              <At x={tankX} y={818} s={1.08}>
                <Tank dir={1} color="#9e8656" label="تانک عراقی" recoil={tankRecoil} />
              </At>
              {/* Tank cannon muzzle flash & tracer shell */}
              <MuzzleFlash x={tankX + 205} y={768} at={bTankShot} f={f} dir={1} scale={1.35} />
              <Tracer x1={tankX + 210} y1={768} x2={980} y2={820} at={bTankShot} f={f} dur={7} />
              <Explosion x={980} y={825} at={bTankShot + 7} f={f} size={165} />

              {/* Khorramshahr Defensive Trench (Sandbags + Barbed Wire + Flag) */}
              <At x={880} y={832}>
                <BarbedWire w={150} />
              </At>
              <At x={1055} y={838} s={1.15}>
                <Sandbags />
              </At>
              <At x={1620} y={GY}>
                <Flag colors={[COL.green, "#ffffff", COL.red]} label="خرمشهر" />
              </At>

              {/* Continuous oil/city fire in background after air strike (separated from Flag!) */}
              {f >= bAirStrike1 + 22 && <Fire x={760} y={850} f={f} scale={1.0} />}

              {/* Iranian Defenders in Khorramshahr */}
              <Actor
                keys={irSoldier1Keys}
                color={COL.green}
                hat="helmet_ir"
                face="angry"
                facing={-1}
                label="مدافع خرمشهر"
                f={f}
                extra={idle(f, 2)}
              >
                {(j) =>
                  f < bKaman99 + 25 ? (
                    <At x={j.rHand[0]} y={j.rHand[1]}>
                      <Rifle dir={-1} />
                    </At>
                  ) : null
                }
              </Actor>

              <Actor
                keys={irSoldier2Keys}
                color={COL.teal}
                hat="helmet_ir"
                face={f >= bKaman99 + 28 ? "happy" : "angry"}
                facing={-1}
                label="تکاور ارتش"
                f={f}
                extra={idle(f, 5)}
              >
                {(j) =>
                  f < bKaman99 + 25 ? (
                    <At x={j.rHand[0]} y={j.rHand[1]}>
                      <Rifle dir={-1} />
                    </At>
                  ) : null
                }
              </Actor>

              {/* Defender rifle counter-fire */}
              <MuzzleFlash x={1055} y={732} at={bRifleBurst} f={f} dir={-1} scale={0.95} />
              <Tracer x1={1050} y1={732} x2={620} y2={795} at={bRifleBurst} f={f} dur={6} />
              <MuzzleFlash x={1235} y={706} at={bRifleBurst + 8} f={f} dir={-1} scale={0.95} />
              <Tracer x1={1230} y1={706} x2={580} y2={785} at={bRifleBurst + 8} f={f} dur={6} />

              {/* Cue 1: Iraqi Fighter Jet bombing Iranian airfields */}
              {f >= bAirStrike1 - 12 && f <= bAirStrike1 + 60 && (
                <At x={iqJetX} y={295} s={1.1}>
                  <FighterJet dir={1} color="#b0bec5" label="میگ عراقی" />
                </At>
              )}
              <MissileArc
                x1={520}
                y1={310}
                x2={760}
                y2={835}
                at={bAirStrike1 + 2}
                dur={20}
                f={f}
                arcH={60}
                explodeSize={185}
              />

              {/* Cue 2: Operation Kaman 99 — 140 Iranian F-4 / F-14 Fighter Jets retaliate */}
              {f >= bKaman99 - 8 && (
                <>
                  <At x={irJet1X} y={295} s={1.18}>
                    <FighterJet dir={-1} color="#455a64" label="فانتوم کمان ۹۹" />
                  </At>
                  <At x={irJet2X} y={380} s={1.05}>
                    <FighterJet dir={-1} color="#546e7a" label="تامکت ارتش" />
                  </At>
                </>
              )}
              <MissileArc
                x1={1150}
                y1={305}
                x2={340}
                y2={825}
                at={bKamanBomb1}
                dur={20}
                f={f}
                arcH={80}
                explodeSize={205}
              />
              <MissileArc
                x1={920}
                y1={385}
                x2={540}
                y2={825}
                at={bKamanBomb2}
                dur={20}
                f={f}
                arcH={75}
                explodeSize={190}
              />

              {f >= bCue2 && f < bKaman99 && (
                <At x={1180} y={560}>
                  <WordBlock text="مقاومت ۳۴ روزه خرمشهر" bg={COL.yellow} size={36} />
                </At>
              )}
            </g>
          )}

          {/* Subtle full-screen flash on heavy explosions */}
          <ScreenFlash f={f} hits={[bAirStrike1 + 22, bKamanBomb1 + 20, bKamanBomb2 + 20]} />
          <Wipe f={f} dur={dur} />
        </>
      }
      html={
        <>
          <TimelineHUD
            year="شهریور ۱۳۵۹ (۱۹۸۰)"
            phase={f < bCue1 ? "لغو قرارداد ۱۹۷۵" : f < bKaman99 ? "تهاجم سراسری" : "عملیات کمان ۹۹"}
            progress={0.12}
            color={f < bKaman99 ? COL.red : COL.blue}
          />
          {/* Cue 0 Headings */}
          <Slam f={f} at={bCue0} out={bCue0End} x={960} y={115} size={84} color={COL.ink} font={FONT.title} weight={900}>
            ۲۶ شهریور ۱۳۵۹: پاره کردن قرارداد الجزایر!
          </Slam>
          {f < bCue1 && (
            <Stamp f={f} at={bTear + 6} x={940} y={260} text="لغو یک‌طرفه عهدنامه ۱۹۷۵!" color={COL.red} size={52} r={-4} />
          )}

          {/* Cue 1 Headings */}
          <Slam f={f} at={bCue1} out={bCue1End} x={960} y={105} size={74} color={COL.red} font={FONT.title} weight={900}>
            ۳۱ شهریور ۱۳۵۹: حمله هوایی و زمینی عراق به ایران!
          </Slam>
          <Slam f={f} at={bCue1 + 14} out={bCue1End} x={960} y={195} size={36} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.ink, padding: "8px 26px", borderRadius: 12 }}>
              بمباران ۱۰ فرودگاه ایران و یورش ۱۲ لشکر زرهی در جبهه‌ای به طول ۶۵۰ کیلومتر
            </span>
          </Slam>

          {/* Cue 2 Headings: Khorramshahr & Operation Kaman 99 */}
          <Slam f={f} at={bCue2} out={bKaman99 - 4} x={960} y={105} size={74} color={COL.ink} font={FONT.title} weight={900}>
            نبرد خونین خرمشهر: ۳۴ روز مقاومت شهری!
          </Slam>
          <Slam f={f} at={bKaman99} out={dur - 12} x={960} y={105} size={74} color={COL.blue} font={FONT.title} weight={900}>
            ۱ مهر ۱۳۵۹: عملیات «کمان ۹۹» — پاسخ ۱۴۰ جنگنده ایرانی!
          </Slam>
          <Slam f={f} at={bKaman99 + 10} out={dur - 12} x={960} y={195} size={36} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.blue, padding: "8px 26px", borderRadius: 12 }}>
              بزرگ‌ترین عملیات تاریخ نیروی هوایی ایران در عمق خاک عراق!
            </span>
          </Slam>
        </>
      }
    />
  );
};
