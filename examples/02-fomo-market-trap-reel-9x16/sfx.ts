export type SfxCue = [number, string, number?];

export const range = (from: number, n: number, step: number, name: string, vol = 1): SfxCue[] =>
  Array.from({ length: n }, (_, i) => [from + i * step, name, vol] as SfxCue);

export const CARD: SfxCue[] = [
  [0, "stinger", 0.8],
  [8, "whoosh", 0.5],
];
