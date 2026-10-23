import { TIMELINE } from "./timeline";

export const CUES = TIMELINE.cues;
export const CHAPTERS = TIMELINE.chapters;

export const S01_START = 0;
export const S01_END = 378;
export const S01_LEN = S01_END - S01_START;

export const S02_START = 378;
export const S02_END = 802;
export const S02_LEN = S02_END - S02_START;

export const S03_START = 802;
export const S03_END = 1194;
export const S03_LEN = S03_END - S03_START;

export const S04_START = 1194;
export const S04_END = TIMELINE.durationInFrames;
export const S04_LEN = S04_END - S04_START;
