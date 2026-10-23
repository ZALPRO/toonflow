import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { COL } from "../stickman/fx";
import { Captions, ChapterCard } from "../stickman/common";
import { CARD, SfxCue } from "./sfx";
import { TIMELINE, DURATION } from "./timeline";
import { cueStart } from "./cues";
import { beat } from "./beats";
import { S01FomoHook } from "./S01FomoHook";
import { S02PeakCrash } from "./S02PeakCrash";
import { S03StepBuying } from "./S03StepBuying";
import { S04GoldenRules } from "./S04GoldenRules";

export { DURATION };
const ASSETS = "ghimatrooz-fomo";

export type SceneProps = { from: number; dur: number };
type Scene = { c: React.FC<SceneProps>; from: number; sfx?: SfxCue[] };

const chapter = (n: string, title: string, sub: string, from: number): Scene => ({
  c: ({ dur }) => <ChapterCard n={n} title={title} sub={sub} dur={dur} />,
  from,
  sfx: CARD,
});

const ch1From = TIMELINE.chapters[0]?.startFrame ?? 620;
const s02From = cueStart(3) - 6;
const s03From = cueStart(4) - 6;
const ch2From = TIMELINE.chapters[1]?.startFrame ?? 1380;
const s04From = cueStart(6) - 6;

const buildS01Sfx = (from: number): SfxCue[] => [
  [beat(from, 0, 0), "slam", 0.7],
  [beat(from, 1, 0), "pop", 0.8],
  [beat(from, 1, 0.38), "slam", 0.75],
  [beat(from, 2, 0), "pop", 0.85],
];

const buildS02Sfx = (from: number): SfxCue[] => [
  [beat(from, 3, 0), "slam", 0.75],
  [beat(from, 3, 0.22), "swirl", 0.8],
];

const buildS03Sfx = (from: number): SfxCue[] => [
  [beat(from, 4, 0), "pop", 0.8],
  [beat(from, 5, 0), "slam", 0.75],
  [beat(from, 5, 0.25), "gold", 0.9],
  [beat(from, 5, 0.65), "kaching", 0.95],
];

const buildS04Sfx = (from: number): SfxCue[] => [
  [beat(from, 6, 0.18), "pop", 0.85],
  [beat(from, 7, 0.15), "pop", 0.85],
  [beat(from, 7, 0.52), "stamp", 0.95],
  [beat(from, 7, 0.6), "ding", 0.85],
];

export const SCENES: Scene[] = [
  { c: S01FomoHook, from: 0, sfx: buildS01Sfx(0) },
  chapter("فصل اول", "چند روز بعد...", "سرنوشت خرید هیجانی در قله قیمت", ch1From),
  { c: S02PeakCrash, from: s02From, sfx: buildS02Sfx(s02From) },
  { c: S03StepBuying, from: s03From, sfx: buildS03Sfx(s03From) },
  chapter("فصل دوم", "فرمول طلایی", "چطور در حباب بازار گیر نکنیم؟", ch2From),
  { c: S04GoldenRules, from: s04From, sfx: buildS04Sfx(s04From) },
];

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
      interpolate(f, [c.startFrame - 8, c.startFrame, c.endFrame, c.endFrame + 10], [1, 0.18, 0.18, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    );
  }
  return g;
};

export const Video: React.FC<VideoProps> = ({ music = 0.12, sfx = 0.38, voice = "voice.wav", captions = true }) => {
  return (
    <AbsoluteFill style={{ background: COL.paper }}>
      <Audio
        src={staticFile(`${ASSETS}/music.wav`)}
        volume={(f) =>
          music *
          (voice ? duck(f) : 1) *
          interpolate(f, [0, 10, DURATION - 35, DURATION], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        }
      />
      {voice && <Audio src={staticFile(`${ASSETS}/${voice}`)} volume={1.0} />}
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
