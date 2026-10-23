import React from "react";
import { useCurrentFrame } from "remotion";
import { COL, FONT, Slam, Wipe, Burst, WarMap, ease } from "../stickman/fx";
import { Stage, Stamp, TimelineHUD, WordBlock } from "../stickman/common";
import { Actor, P, SMOOTH, groundY, idle } from "../stickman/stick";
import { At, Podium, TreatyDoc, Flag } from "../stickman/props";
import { beat, cueEnd, cueStart } from "./beats";

const GY = groundY();

export const S04Resolution598: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const f = useCurrentFrame();

  // Cue 8 (1836..2065): Tir 1367 (July 1988) — Iran Air 655 tragedy + Acceptance of UN Resolution 598
  const bCue8 = cueStart(from, 8);
  const bRes598 = beat(from, 8, 0.42);
  const bCue8End = cueEnd(from, 8);

  // Cue 9 (2073..2258): 29 Mordad 1367 (20 Aug 1988) — Ceasefire & return to exact 1975 Algiers borders
  const bCue9 = cueStart(from, 9);
  const bRestore1975 = beat(from, 9, 0.38);

  // Reassembling the torn 1975 Algiers Agreement (1 -> 0!)
  const restoreTear = 1 - ease(f, bRestore1975, bRestore1975 + 18, 0, 1);

  const unEnvoyKeys = [
    { f: 0, p: { ...P.stand, x: 960, y: GY } },
    { f: bRes598, p: { ...P.armsUp, x: 960, y: GY } },
    { f: bCue9, p: { ...P.pointR, x: 960, y: GY } },
    { f: bRestore1975 + 16, p: { ...P.cheer, x: 960, y: GY } },
  ];

  const irRepKeys = [
    { f: 0, p: { ...P.stand, x: 1520, y: GY } },
    { f: bRes598, p: { ...P.handshake, x: 1320, y: GY }, e: SMOOTH },
    { f: bRestore1975 + 16, p: { ...P.salute, x: 1320, y: GY } },
  ];

  const iqRepKeys = [
    { f: 0, p: { ...P.stand, x: 400, y: GY } },
    { f: bRes598, p: { ...P.handshake, x: 600, y: GY }, e: SMOOTH },
    { f: bRestore1975 + 16, p: { ...P.stand, x: 600, y: GY } },
  ];

  const hits = [bRes598, bRestore1975 + 16];
  const peaceZoom = f >= bCue9 ? 1 + 0.05 * ease(f, bRestore1975, bRestore1975 + 20, 0, 1) : 1;

  return (
    <Stage
      hits={hits}
      power={16}
      theme="peace"
      cam={{ x: 0, y: 0, z: peaceZoom }}
      svg={
        <>
          {/* Border Flags on Left (Iraq) & Right (Iran) */}
          <At x={310} y={GY}>
            <Flag colors={[COL.red, "#ffffff", COL.ink]} label="مرز عراق" />
          </At>
          <At x={1610} y={GY}>
            <Flag colors={[COL.green, "#ffffff", COL.red]} label="مرز ایران" />
          </At>

          {/* UN Peacekeeper Mediator in Center */}
          <Actor
            keys={unEnvoyKeys}
            color={COL.blue}
            hat="un_helmet"
            face="eyes"
            facing={1}
            label="ناظر سازمان ملل"
            f={f}
            extra={idle(f, 1)}
          />
          <At x={960} y={792}>
            <Podium label="سازمان ملل" color={COL.blue} />
          </At>

          {/* Iraqi Representative */}
          <Actor
            keys={iqRepKeys}
            color={COL.khaki}
            hat="helmet_iq"
            face="eyes"
            facing={1}
            label="نماینده عراق"
            f={f}
            extra={idle(f, 3)}
          />

          {/* Iranian Representative */}
          <Actor
            keys={irRepKeys}
            color={COL.green}
            hat="helmet_ir"
            face="eyes"
            facing={-1}
            label="نماینده ایران"
            f={f}
            extra={idle(f, 5)}
          />

          {/* Cue 8: UN Security Council Resolution 598 Document */}
          {f >= bRes598 && f < bCue9 && (
            <g opacity={ease(f, bRes598, bRes598 + 10)}>
              <At x={960} y={405} s={1.15}>
                <TreatyDoc title="قطعنامه ۵۹۸ شورای امنیت" sub="آتش‌بس و بازگشت به مرزها" tear={0} color="#e3f2fd" />
              </At>
              <Burst x={960} y={405} at={bRes598} f={f} color={COL.blue} size={175} />
            </g>
          )}

          {/* Cue 9: The Torn 1975 Algiers Agreement Reassembles Back Together! */}
          {f >= bCue9 && (
            <g opacity={ease(f, bCue9, bCue9 + 10)}>
              <At x={960} y={415} s={1.15}>
                <TreatyDoc title="قرارداد ۱۹۷۵ الجزایر" sub="اعتبار دوباره پس از ۸ سال!" tear={restoreTear} color="#fff8e7" />
              </At>
              <Burst x={960} y={415} at={bRestore1975 + 16} f={f} color={COL.gold} size={190} />
              <At x={480} y={440} s={ease(f, bRestore1975 + 12, bRestore1975 + 24)}>
                <WordBlock text="مرز اروندرود: همان خط ۱۹۷۵!" bg={COL.yellow} size={34} />
              </At>
              <WarMap x={1520} y={435} f={f} at={bCue9 + 10} phase="peace" scale={0.84} />
            </g>
          )}

          <Wipe f={f} dur={dur} />
        </>
      }
      html={
        <>
          <TimelineHUD
            year="تیر و مرداد ۱۳۶۷ (۱۹۸۸)"
            phase={f < bCue9 ? "پذیرش قطعنامه ۵۹۸" : "آتش‌بس و مرز ۱۹۷۵"}
            progress={0.95}
            color={f < bCue9 ? COL.blue : COL.green}
          />
          {/* Cue 8 Headings */}
          <Slam f={f} at={bCue8} out={bCue8End} x={960} y={110} size={80} color={COL.blue} font={FONT.title} weight={900}>
            ۲۷ تیر ۱۳۶۷: پذیرش «قطعنامه ۵۹۸» شورای امنیت!
          </Slam>
          <Slam f={f} at={bCue8 + 12} out={bCue8End} x={960} y={205} size={36} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.ink, padding: "8px 26px", borderRadius: 12 }}>
              پس از ۸ سال جنگ فرسایشی و فاجعه شلیک ناو وینسنس به پرواز ۶۵۵ ایران‌ایر (۲۹۰ مسافر)
            </span>
          </Slam>

          {/* Cue 9 Headings */}
          <Slam f={f} at={bCue9} out={dur - 12} x={960} y={110} size={82} color={COL.green} font={FONT.title} weight={900}>
            ۲۹ مرداد ۱۳۶۷: آتش‌بس رسمی و بازگشت به مرز ۱۹۷۵!
          </Slam>
          <Slam f={f} at={bCue9 + 12} out={dur - 12} x={960} y={205} size={38} color="#fff" font={FONT.body} weight={800}>
            <span style={{ background: COL.ink, padding: "8px 26px", borderRadius: 12 }}>
              صدام پس از ۸ سال جنگ، دوباره همان قرارداد ۱۹۷۵ الجزایر را که پاره کرده بود پذیرفت!
            </span>
          </Slam>
          {f >= bRestore1975 + 18 && (
            <Stamp f={f} at={bRestore1975 + 18} x={480} y={320} text="مرزها: بدون تغییر!" color={COL.green} size={52} r={-5} />
          )}
        </>
      }
    />
  );
};
