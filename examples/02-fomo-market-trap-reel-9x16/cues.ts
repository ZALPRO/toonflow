import { TIMELINE } from "./timeline";

export const cueStart = (i: number) => TIMELINE.cues[Math.min(i, TIMELINE.cues.length - 1)]?.startFrame ?? 0;
export const cueEnd = (i: number) => TIMELINE.cues[Math.min(i, TIMELINE.cues.length - 1)]?.endFrame ?? 0;

export const beat = (from: number, i: number, frac = 0) => {
  const a = cueStart(i);
  return Math.round(a + (cueEnd(i) - a) * frac) - from;
};

export const cueLen = (i: number) => cueEnd(i) - cueStart(i);
