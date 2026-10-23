import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Captions } from "../stickman/common";
import { COL, Wipe } from "../stickman/fx";
import { S01TenThousandTest } from "./S01TenThousandTest";
import { S02SilentInflationTax } from "./S02SilentInflationTax";
import { S03FomoVsSmartDCA } from "./S03FomoVsSmartDCA";
import { S04ThreeWealthRules } from "./S04ThreeWealthRules";
import {
  CUES,
  S01_LEN,
  S01_START,
  S02_LEN,
  S02_START,
  S03_LEN,
  S03_START,
  S04_LEN,
  S04_START,
} from "./cues";
import { ALL_SFX } from "./sfx";
import { DURATION } from "./timeline";

export { DURATION };

export type VideoProps = {
  music?: number;
  sfx?: number;
  voice?: string;
  captions?: boolean;
};

export const Video: React.FC<VideoProps> = ({
  music = 0.22,
  sfx = 0.75,
  voice = "toonflow-showcase-en/voice.wav",
  captions = true,
}) => {
  const f = useCurrentFrame();
  const speaking = CUES.some((c) => f >= c.startFrame - 4 && f <= c.endFrame + 6);
  const fadeOut = interpolate(f, [DURATION - 35, DURATION], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bgmVol = music * (speaking ? 0.34 : 0.85) * fadeOut;

  return (
    <AbsoluteFill style={{ background: COL.paper }}>
      <Sequence from={S01_START} durationInFrames={S01_LEN}>
        <S01TenThousandTest />
      </Sequence>
      <Sequence from={S02_START} durationInFrames={S02_LEN}>
        <S02SilentInflationTax />
      </Sequence>
      <Sequence from={S03_START} durationInFrames={S03_LEN}>
        <S03FomoVsSmartDCA />
      </Sequence>
      <Sequence from={S04_START} durationInFrames={S04_LEN}>
        <S04ThreeWealthRules />
      </Sequence>

      <Wipe f={f - (S02_START - 6)} dur={12} color={COL.ink} />
      <Wipe f={f - (S03_START - 6)} dur={12} color={COL.red} />
      <Wipe f={f - (S04_START - 6)} dur={12} color={COL.green} />

      {captions && <Captions cues={CUES} bottom={32} size={36} />}

      {music > 0 && <Audio src={staticFile("toonflow-showcase-en/music.wav")} volume={bgmVol} />}
      {voice && <Audio src={staticFile(voice)} volume={1.0} />}
      {sfx > 0 &&
        ALL_SFX.map((cue, idx) => (
          <Sequence key={idx} from={cue.f} durationInFrames={45}>
            <Audio src={staticFile(`toonflow-showcase-en/sfx/${cue.id}.wav`)} volume={(cue.v ?? 0.7) * sfx} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};
