import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { COL } from "../stickman/fx";
import { Captions, ChapterCard } from "../stickman/common";
import { CARD, SfxCue } from "./sfx";
import { TIMELINE } from "./timeline";
import { cueStart } from "./cues";
import { S01ColdOpen, buildS01Sfx } from "./S01ColdOpen";
import { S02RoyalDeal, buildS02Sfx } from "./S02RoyalDeal";
import { S03AtlanticVoyage, buildS03Sfx } from "./S03AtlanticVoyage";
import { S04WrongContinent, buildS04Sfx } from "./S04WrongContinent";
import { S05LegacyEnding, buildS05Sfx } from "./S05LegacyEnding";

const ASSETS = "columbus";

export type SceneProps = { from: number; dur: number };
type Scene = { c: React.FC<SceneProps>; from: number; sfx?: SfxCue[] };

const chapter = (n: string, title: string, sub: string, from: number): Scene => ({
  c: ({ dur }) => <ChapterCard n={n} title={title} sub={sub} dur={dur} />,
  from,
  sfx: CARD,
});

const ch1From = TIMELINE.chapters[0]?.startFrame ?? 590;
const s02From = cueStart(3);
const s03From = cueStart(6);
const ch2From = TIMELINE.chapters[1]?.startFrame ?? 1595;
const s04From = cueStart(8);
const s05From = cueStart(10);

export const SCENES: Scene[] = [
  { c: S01ColdOpen, from: 0, sfx: buildS01Sfx(0) },
  chapter("فصل اول", "معامله بزرگ دربار", "پرتغال رد کرد، ملکه ایزابلا ریسک کرد!", ch1From),
  { c: S02RoyalDeal, from: s02From, sfx: buildS02Sfx(s02From) },
  { c: S03AtlanticVoyage, from: s03From, sfx: buildS03Sfx(s03From) },
  chapter("فصل دوم", "اشتباه بزرگ تاریخی", "چهار سفر به قاره جدید به نام هند!", ch2From),
  { c: S04WrongContinent, from: s04From, sfx: buildS04Sfx(s04From) },
  { c: S05LegacyEnding, from: s05From, sfx: buildS05Sfx(s05From) },
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
        src={staticFile(`${ASSETS}/music.mp3`)}
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
              <Sequence key={k} from={f} layout="none">
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
