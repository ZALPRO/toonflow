import React from "react";
import { useCurrentFrame } from "remotion";
import {
  COL,
  FONT,
  Slam,
  Wipe,
  MissileArc,
  Fire,
  AirRaidSiren,
  WarMap,
  ScreenFlash,
  ease,
} from "../stickman/fx";
import { Stage, Stamp, TimelineHUD, WordBlock } from "../stickman/common";
import { Actor, P, SMOOTH, groundY, idle } from "../stickman/stick";
import { At, OilTanker, Barrel, FighterJet, Flag, Rifle } from "../stickman/props";
import { beat, cueEnd, cueStart } from "./beats";

const GY = groundY();

export const S03TankerAndCities: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const f = useCurrentFrame();

  // Cue 6 (1333..1530): Majnoon Islands (Kheibar) & Al-Faw (Valfajr-8) + Iraqi Chemical Weapons
  const bCue6 = cueStart(from, 6);
  const bChemDrop = beat(from, 6, 0.35);
  const bChemHit = bChemDrop + 20;
  const bCue6End = cueEnd(from, 6);

  // Cue 7 (1537..1744): Tanker War in Persian Gulf (400+ ships) + War of the Cities (Scud missiles)
  const bCue7 = cueStart(from, 7);
  const bExocet = beat(from, 7, 0.18);
  const bScud1 = beat(from, 7, 0.42);
  const bScud2 = beat(from, 7, 0.62);

  const phase1Alpha = 1 - ease(f, bCue7 - 8, bCue7 + 4, 0, 1);
  const phase2Alpha = ease(f, bCue7 - 4, bCue7 + 8, 0, 1);

  const chemT = ease(f, bChemHit, bChemHit + 42, 0, 1);
  const jetChemX = ease(f, bChemDrop - 8, bChemDrop + 34, -240, 2320, SMOOTH);

  // Tanker rocking on Persian Gulf waves
  const waveY = Math.sin(f * 0.1) * 7;
  const waveRot = Math.sin(f * 0.08) * 2;

  const irFao1Keys = [
    { f: 0, p: { ...P.aimR, x: 480, y: GY } },
    { f: bChemHit, p: { ...P.crouch, x: 480, y: 780 } },
  ];
  const irFao2Keys = [
    { f: 0, p: { ...P.cheer, x: 740, y: GY } },
    { f: bChemHit, p: { ...P.sad, x: 740, y: GY } },
  ];

  const hits = [bChemHit, bExocet + 20, bScud1 + 24, bScud2 + 24];

  return (
    <Stage
      hits={hits}
      power={20}
      theme="gulf"
      svg={
        <>
          <AirRaidSiren f={f} from={bCue7} to={dur - 10} />

          {/* Water / Persian Gulf & Arvand Waterway across bottom */}
          <rect x={0} y={850} width={1920} height={230} fill="#1565c0" opacity={0.88} />
          <path
            d={`M0,850 Q240,${836 + waveY} 480,850 T960,850 T1440,850 T1920,850`}
            fill="none"
            stroke="#90caf9"
            strokeWidth={7}
          />

          {/* PHASE 1 (Cue 6): Majnoon & Al-Faw + Chemical Weapons */}
          {phase1Alpha > 0.01 && (
            <g opacity={phase1Alpha}>
              {/* Strategic Map of Al-Faw Peninsula & Persian Gulf */}
              <WarMap x={1620} y={455} f={f} at={bCue6 + 12} phase="faw" scale={0.9} />

              {/* Al-Faw & Majnoon Island Embankments */}
              <path d="M180,860 Q640,795 1120,860 Z" fill="#8d6e63" stroke={COL.ink} strokeWidth={5} />
              <At x={250} y={755}>
                <Flag colors={[COL.green, "#ffffff", COL.red]} label="فاو (والفجر ۸)" />
              </At>

              <Actor
                keys={irFao1Keys}
                color={COL.green}
                hat="helmet_ir"
                face={f >= bChemHit ? "sad" : "angry"}
                facing={1}
                label="غواص خط‌شکن"
                f={f}
                extra={idle(f, 1)}
              >
                {(j) => (
                  <At x={j.rHand[0]} y={j.rHand[1]}>
                    <Rifle dir={1} />
                  </At>
                )}
              </Actor>

              <Actor
                keys={irFao2Keys}
                color={COL.teal}
                hat="helmet_ir"
                face={f >= bChemHit ? "shock" : "happy"}
                facing={1}
                label="رزمنده در فاو"
                f={f}
                extra={idle(f, 3)}
              />

              {/* Iraqi Aircraft dropping Chemical Bomb */}
              {f >= bChemDrop - 10 && f <= bChemDrop + 50 && (
                <At x={jetChemX} y={255} s={1.12}>
                  <FighterJet dir={1} color="#9e8656" label="بمب‌افکن شیمیایی عراق" />
                </At>
              )}
              <MissileArc
                x1={520}
                y1={275}
                x2={1060}
                y2={815}
                at={bChemDrop}
                dur={20}
                f={f}
                arcH={70}
                color="#cddc39"
                explodeSize={155}
              />

              {/* Expanding Yellow-Green Toxic Chemical Gas Cloud */}
              {f >= bChemHit && (
                <g opacity={ease(f, bChemHit, bChemHit + 10, 0, 0.88)}>
                  {[
                    [-140, -10, 72],
                    [-60, -35, 92],
                    [20, -15, 86],
                    [105, -40, 80],
                    [180, -10, 68],
                    [-20, -85, 76],
                    [70, -90, 70],
                  ].map(([ox, oy, r], i) => (
                    <circle
                      key={i}
                      cx={1060 + ox * (0.4 + chemT * 0.9)}
                      cy={815 + oy * (0.4 + chemT * 0.8) - chemT * 35}
                      r={r * (0.45 + chemT * 0.75)}
                      fill={i % 2 === 0 ? "#c0ca33" : "#9e9d24"}
                      stroke="#33691e"
                      strokeWidth={4}
                      opacity={0.78}
                    />
                  ))}
                  <At x={1060} y={640}>
                    <WordBlock text="گاز خردل و اعصاب (فاو و حلبچه)" bg="#cddc39" size={34} />
                  </At>
                </g>
              )}
            </g>
          )}

          {/* PHASE 2 (Cue 7): Tanker War in Persian Gulf & War of the Cities (Scud Missiles) */}
          {phase2Alpha > 0.01 && (
            <g opacity={phase2Alpha}>
              {/* Left & Right City Silhouettes (War of the Cities: Baghdad & Tehran/Dezful) */}
              <g transform="translate(220, 850)">
                <rect x={-110} y={-180} width={65} height={180} fill="#455a64" stroke={COL.ink} strokeWidth={5} />
                <rect x={-35} y={-230} width={75} height={230} fill="#37474f" stroke={COL.ink} strokeWidth={5} />
                <rect x={50} y={-150} width={60} height={150} fill="#546e7a" stroke={COL.ink} strokeWidth={5} />
                <text x={0} y={-250} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={COL.ink}>
                  بغداد
                </text>
              </g>

              <g transform="translate(1680, 850)">
                <rect x={-110} y={-165} width={65} height={165} fill="#546e7a" stroke={COL.ink} strokeWidth={5} />
                <rect x={-35} y={-240} width={80} height={240} fill="#37474f" stroke={COL.ink} strokeWidth={5} />
                <rect x={55} y={-185} width={65} height={185} fill="#455a64" stroke={COL.ink} strokeWidth={5} />
                <text x={0} y={-260} textAnchor="middle" direction="rtl" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={COL.ink}>
                  تهران و دزفول
                </text>
              </g>

              {/* Giant Supertanker in Persian Gulf */}
              <At x={960} y={825 + waveY} r={waveRot} s={1.25}>
                <OilTanker name="نفت‌کش خلیج فارس (۴۰۰+ کشتی)" />
              </At>
              <At x={580} y={825 - waveY} s={0.78}>
                <Barrel label="نفت" />
              </At>
              <At x={1340} y={825 + waveY} s={0.78}>
                <Barrel label="نفت" />
              </At>

              {/* Exocet Missile hitting the Oil Tanker */}
              <MissileArc
                x1={320}
                y1={420}
                x2={980}
                y2={800}
                at={bExocet}
                dur={20}
                f={f}
                arcH={110}
                color={COL.red}
                explodeSize={200}
              />
              {f >= bExocet + 20 && (
                <>
                  <Fire x={920} y={800 + waveY} f={f} scale={1.15} />
                  <Fire x={1040} y={805 + waveY} f={f + 15} scale={0.95} />
                </>
              )}

              {/* War of the Cities: Scud Ballistic Missile Arcs across the sky */}
              <MissileArc
                x1={250}
                y1={640}
                x2={1660}
                y2={660}
                at={bScud1}
                dur={24}
                f={f}
                arcH={310}
                color="#cfd8dc"
                explodeSize={195}
              />
              <MissileArc
                x1={1650}
                y1={640}
                x2={240}
                y2={660}
                at={bScud2}
                dur={24}
                f={f}
                arcH={290}
                color="#ffe082"
                explodeSize={195}
              />
              {f >= bScud1 + 24 && <Fire x={1660} y={670} f={f} scale={0.9} />}
              {f >= bScud2 + 24 && <Fire x={240} y={670} f={f + 9} scale={0.9} />}
            </g>
          )}

          <ScreenFlash f={f} hits={[bChemHit, bExocet + 20, bScud1 + 24, bScud2 + 24]} />
          <Wipe f={f} dur={dur} />
        </>
      }
      html={
        <>
          <TimelineHUD
            year={f < bCue7 ? "۱۳۶۲–۱۳۶۵ (۱۹۸۶)" : "۱۳۶۵–۱۳۶۶ (۱۹۸۷)"}
            phase={f < bCue7 ? "فتح فاو و جنگ شیمیایی" : "جنگ نفت‌کش‌ها و شهرها"}
            progress={f < bCue7 ? 0.62 : 0.78}
            color={COL.red}
          />
          {/* Cue 6 Headings */}
          <Slam f={f} at={bCue6} out={bCue6End} x={960} y={110} size={80} color={COL.ink} font={FONT.title} weight={900}>
            ۱۳۶۲ تا ۱۳۶۵: نبرد در هور، فتح فاو و جنگ شیمیایی!
          </Slam>
          <Slam f={f} at={bCue6 + 12} out={bCue6End} x={960} y={205} size={38} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.ink, padding: "8px 26px", borderRadius: 12 }}>
              عبور غواصان از اروندرود در عملیات والفجر ۸ و پاسخ صدام با بمباران شیمیایی!
            </span>
          </Slam>
          {f >= bChemHit + 4 && f < bCue7 && (
            <Stamp f={f} at={bChemHit + 4} x={830} y={395} text="بیش از ۱۰۰,۰۰۰ جانباز شیمیایی!" color={COL.red} size={52} r={-5} />
          )}

          {/* Cue 7 Headings */}
          <Slam f={f} at={bCue7} out={dur - 12} x={960} y={105} size={82} color={COL.red} font={FONT.title} weight={900}>
            «جنگ نفت‌کش‌ها» در خلیج فارس و «جنگ شهرها»!
          </Slam>
          <Slam f={f} at={bCue7 + 12} out={dur - 12} x={960} y={200} size={38} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.ink, padding: "8px 26px", borderRadius: 12 }}>
              حمله به بیش از ۴۰۰ نفت‌کش در خلیج فارس و شلیک صدها موشک اسکاد به شهرها!
            </span>
          </Slam>
        </>
      }
    />
  );
};
