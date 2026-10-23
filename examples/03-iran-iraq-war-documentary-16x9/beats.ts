import { beat as rawBeat } from "./cues";

export const beat = (from: number, i: number, frac = 0) => rawBeat(from, i, frac);
export const cueStart = (from: number, i: number) => rawBeat(from, i, 0);
export const cueEnd = (from: number, i: number) => rawBeat(from, i, 1);
