import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { COL } from "../stickman/fx";
import { Captions, ChapterCard } from "../stickman/common";
import { CARD, SfxCue } from "./sfx";
import { TIMELINE } from "./timeline";
import { cueStart } from "./cues";
import { beat } from "./beats";
import { S01Invasion1980 } from "./S01Invasion1980";
import { S02Khorramshahr1982 } from "./S02Khorramshahr1982";
import { S03TankerAndCities } from "./S03TankerAndCities";
import { S04Resolution598 } from "./S04Resolution598";
import { S05WarLegacy } from "./S05WarLegacy";

const ASSETS = "iran-iraq-war";

export type SceneProps = { from: number; dur: number };
type Scene = { c: React.FC<SceneProps>; from: number; sfx?: SfxCue[] };

const chapter = (n: string, title: string, sub: string, from: number): Scene => ({
  c: ({ dur }) => <ChapterCard n={n} title={title} sub={sub} dur={dur} />,
  from,
  sfx: CARD,
});

const ch1From = TIMELINE.chapters[0]?.startFrame ?? 649;
const s02From = cueStart(3);
const s03From = cueStart(6) - 13;
const ch2From = TIMELINE.chapters[1]?.startFrame ?? 1770;
const s04From = cueStart(8);
const s05From = cueStart(10) - 14;

// Scene 1 SFX: Treaty tear, stamp, air-raid siren, radar ping, MiG jet flyby, bomb explosion, tank cannon, rifle burst, Kaman 99 jets & twin explosions
const buildS01Sfx = (from: number): SfxCue[] => {
  const bCue0 = beat(from, 0, 0);
  const bTear = beat(from, 0, 0.42);
  const bCue1 = beat(from, 1, 0);
  const bAirStrike1 = beat(from, 1, 0.22);
  const bTankShot = beat(from, 1, 0.58);
  const bCue2 = beat(from, 2, 0);
  const bRifleBurst = beat(from, 2, 0.16);
  const bKaman99 = beat(from, 2, 0.46);
  return [
    [bCue0, "slam", 0.7],
    [bTear, "tear", 0.95],
    [bTear + 6, "stamp", 0.85],
    [bCue1, "siren", 0.65],
    [bCue1 + 8, "radar", 0.7],
    [bAirStrike1 - 6, "jet", 0.85],
    [bAirStrike1 + 2, "missile", 0.75],
    [bAirStrike1 + 22, "explosion", 0.95],
    [bTankShot, "cannon", 0.95],
    [bTankShot + 7, "explosion", 0.85],
    [bCue2, "slam", 0.7],
    [bRifleBurst, "gunfire", 0.9],
    [bRifleBurst + 8, "gunfire", 0.85],
    [bKaman99, "jet", 0.95],
    [bKaman99 + 10, "missile", 0.75],
    [bKaman99 + 30, "explosion", 0.95],
    [bKaman99 + 38, "explosion", 0.95],
  ];
};

// Scene 2 SFX: Tank cannon shot, explosion, Khorramshahr liberation fanfare, POW counter ticks, foreign aid cards & stamp
const buildS02Sfx = (from: number): SfxCue[] => {
  const bCue3 = beat(from, 3, 0);
  const bCounterShot = beat(from, 3, 0.45);
  const bCue4 = beat(from, 4, 0);
  const bLiberate = beat(from, 4, 0.25);
  const bPOWCount = beat(from, 4, 0.42);
  const bCue5 = beat(from, 5, 0);
  const bCard1 = beat(from, 5, 0.28);
  const bCard2 = beat(from, 5, 0.56);
  return [
    [bCue3, "slam", 0.7],
    [bCounterShot, "cannon", 0.95],
    [bCounterShot + 7, "explosion", 0.95],
    [bCue4, "slam", 0.75],
    [bLiberate, "gold", 0.9],
    [bPOWCount, "pop", 0.8],
    [bCue5, "slam", 0.7],
    [bCard1, "pop", 0.8],
    [bCard2, "kaching", 0.85],
    [bCard2 + 8, "stamp", 0.9],
  ];
};

// Scene 3 SFX: Jet chemical drop, chemical burst, stamp, siren, Exocet missile + tanker explosion, Scud missile arcs + explosions
const buildS03Sfx = (from: number): SfxCue[] => {
  const bCue6 = beat(from, 6, 0);
  const bChemDrop = beat(from, 6, 0.35);
  const bChemHit = bChemDrop + 20;
  const bCue7 = beat(from, 7, 0);
  const bExocet = beat(from, 7, 0.18);
  const bScud1 = beat(from, 7, 0.42);
  const bScud2 = beat(from, 7, 0.62);
  return [
    [bCue6, "slam", 0.7],
    [bChemDrop - 6, "jet", 0.85],
    [bChemHit, "explosion", 0.85],
    [bChemHit + 4, "stamp", 0.9],
    [bCue7, "siren", 0.65],
    [bExocet, "missile", 0.85],
    [bExocet + 20, "explosion", 0.95],
    [bScud1, "missile", 0.85],
    [bScud1 + 24, "explosion", 0.95],
    [bScud2, "missile", 0.85],
    [bScud2 + 24, "explosion", 0.95],
  ];
};

// Scene 4 SFX: Resolution 598 reveal, reassembly of 1975 Algiers Agreement, final border stamp
const buildS04Sfx = (from: number): SfxCue[] => {
  const bCue8 = beat(from, 8, 0);
  const bRes598 = beat(from, 8, 0.42);
  const bCue9 = beat(from, 9, 0);
  const bRestore1975 = beat(from, 9, 0.38);
  return [
    [bCue8, "slam", 0.7],
    [bRes598, "ding", 0.85],
    [bCue9, "slam", 0.7],
    [bRestore1975, "whoosh", 0.8],
    [bRestore1975 + 16, "gold", 0.9],
    [bRestore1975 + 18, "stamp", 0.9],
  ];
};

// Scene 5 SFX: Final summary cards & stamp
const buildS05Sfx = (from: number): SfxCue[] => {
  const bCue10 = beat(from, 10, 0);
  const bCard1 = beat(from, 10, 0.22);
  const bCard2 = beat(from, 10, 0.48);
  const bFinalStamp = beat(from, 10, 0.72);
  return [
    [bCue10, "slam", 0.75],
    [bCard1, "pop", 0.85],
    [bCard2, "pop", 0.85],
    [bFinalStamp, "stamp", 0.95],
    [bFinalStamp + 10, "ding", 0.8],
  ];
};

export const SCENES: Scene[] = [
  { c: S01Invasion1980, from: 0, sfx: buildS01Sfx(0) },
  chapter("فصل اول", "چرخش بزرگ جنگ", "اتحاد ارتش، سپاه و مردم — فتح خرمشهر!", ch1From),
  { c: S02Khorramshahr1982, from: s02From, sfx: buildS02Sfx(s02From) },
  { c: S03TankerAndCities, from: s03From, sfx: buildS03Sfx(s03From) },
  chapter("فصل دوم", "پایان جنگ هشت‌ساله", "قطعنامه ۵۹۸ شورای امنیت و کارنامه جنگ", ch2From),
  { c: S04Resolution598, from: s04From, sfx: buildS04Sfx(s04From) },
  { c: S05WarLegacy, from: s05From, sfx: buildS05Sfx(s05From) },
];

export const DURATION = TIMELINE.durationInFrames;

export type VideoProps = {
  music: number;
  sfx: number;
  voice: string;
  captions: boolean;
};

const duck = (f: number) => {
  let g = 1;
  for (const c of TIMELINE.cues) {
    if (f < c.startFrame - 10) break;
    g = Math.min(
      g,
      interpolate(f, [c.startFrame - 8, c.startFrame, c.endFrame, c.endFrame + 10], [1, 0.4, 0.4, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    );
  }
  return g;
};

export const Video: React.FC<VideoProps> = ({ music, sfx, voice, captions }) => {
  return (
    <AbsoluteFill style={{ background: COL.paper }}>
      <Audio
        src={staticFile(`${ASSETS}/music.wav`)}
        volume={(f) =>
          music *
          (voice ? duck(f) : 1) *
          interpolate(f, [0, 10, DURATION - 45, DURATION], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        }
      />
      {voice && <Audio src={staticFile(`${ASSETS}/${voice}`)} />}
      {SCENES.map(({ c: C, from, sfx: cues }, i) => {
        const dur = (SCENES[i + 1]?.from ?? DURATION) - from;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <C from={from} dur={dur} />
            {cues?.map(([f, name, v = 1], k) => (
              <Sequence key={k} from={Math.max(0, f)} layout="none">
                {/* eslint-disable-next-line @remotion/volume-callback -- constant per-effect volume */}
                <Audio src={staticFile(`${ASSETS}/sfx/${name}.wav`)} volume={v * sfx} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      {captions && <Captions cues={TIMELINE.cues} />}
    </AbsoluteFill>
  );
};
