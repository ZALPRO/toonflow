import React from "react";
import { useCurrentFrame } from "remotion";
import { COL, FONT, Slam, Wipe, Burst } from "../stickman/fx";
import { Stage, Card, Stamp, StatBar, TimelineHUD } from "../stickman/common";
import { Actor, P, SMOOTH, groundY, idle } from "../stickman/stick";
import { At, Flag, TreatyDoc } from "../stickman/props";
import { beat, cueStart } from "./beats";

const GY = groundY();

export const S05WarLegacy: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const f = useCurrentFrame();

  // Cue 10 (2284..2524): Final balance sheet of the 8-year war
  const bCue10 = cueStart(from, 10);
  const bCard1 = beat(from, 10, 0.22);
  const bCard2 = beat(from, 10, 0.48);
  const bFinalStamp = beat(from, 10, 0.72);

  const irVeteranKeys = [
    { f: 0, p: { ...P.stand, x: 240, y: GY } },
    { f: 24, p: { ...P.salute, x: 420, y: GY }, e: SMOOTH },
    { f: bFinalStamp, p: { ...P.cheer, x: 420, y: GY } },
  ];

  const unObserverKeys = [
    { f: 0, p: { ...P.stand, x: 840, y: GY } },
    { f: 24, p: { ...P.pointR, x: 700, y: GY }, e: SMOOTH },
    { f: bFinalStamp, p: { ...P.stand, x: 700, y: GY } },
  ];

  const hits = [bCard1, bCard2, bFinalStamp];

  return (
    <Stage
      hits={hits}
      power={16}
      theme="peace"
      svg={
        <>
          <At x={230} y={GY}>
            <Flag colors={[COL.green, "#ffffff", COL.red]} label="مرز پایدار ایران" />
          </At>

          <Actor
            keys={irVeteranKeys}
            color={COL.green}
            hat="helmet_ir"
            face="eyes"
            facing={1}
            label="مدافع وطن"
            f={f}
            extra={idle(f, 1)}
          />

          <Actor
            keys={unObserverKeys}
            color={COL.blue}
            hat="un_helmet"
            face="eyes"
            facing={1}
            label="ناظر صلح"
            f={f}
            extra={idle(f, 4)}
          />

          <At x={560} y={410} s={0.92}>
            <TreatyDoc title="قطعنامه ۵۹۸" sub="مرز ۱۹۷۵" tear={0} color="#e3f2fd" />
          </At>

          <Burst x={420} y={580} at={bFinalStamp} f={f} color={COL.gold} size={170} />
          <Wipe f={f} dur={dur} />
        </>
      }
      html={
        <>
          <TimelineHUD year="۱۳۵۹ تا ۱۳۶۷ (۸ سال)" phase="کارنامه نهایی جنگ" progress={1.0} color={COL.ink} />
          <Slam f={f} at={bCue10} x={960} y={115} size={82} color={COL.ink} font={FONT.title} weight={900}>
            کارنامه ۸ سال جنگ ایران و عراق (۱۳۵۹ تا ۱۳۶۷)
          </Slam>

          <Card f={f} at={bCard1} x={1350} y={225} n="۱" w={920} accent={COL.red} size={33}>
            بیش از ۵۰۰,۰۰۰ کشته و صدها هزار جانباز و مصدوم شیمیایی در دو کشور
          </Card>

          <Card f={f} at={bCard2} x={1350} y={375} n="۲" w={920} accent={COL.orange} size={33}>
            بیش از ۱,۰۰۰ میلیارد دلار خسارت اقتصادی ⟵ تغییر مرزی: صفر کیلومتر!
          </Card>

          <StatBar
            f={f}
            at={bCard2 + 12}
            x={1350}
            y={525}
            w={920}
            label="تغییر مرزهای ایران پس از ۸ سال تهاجم تمام‌عیار:"
            value="۰ کیلومتر (بدون تغییر!)"
            fill={0.04}
            color={COL.green}
          />

          <Stamp
            f={f}
            at={bFinalStamp}
            x={1350}
            y={715}
            text="۸ سال دفاع و ایستادگی ⟵ حفظ کامل تمامیت ارضی!"
            color={COL.blue}
            size={44}
            r={-2}
          />
        </>
      }
    />
  );
};
