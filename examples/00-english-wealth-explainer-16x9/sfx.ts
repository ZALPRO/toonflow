import { S01_START, S02_START, S03_START, S04_START } from "./cues";

export type SfxCue = { f: number; id: string; v?: number };

export const ALL_SFX: SfxCue[] = [
  // Scene 1: The $10,000 Savings Test
  { f: S01_START + 6, id: "whoosh", v: 0.6 },
  { f: S01_START + 18, id: "slam", v: 0.75 },
  { f: S01_START + 32, id: "kaching", v: 0.8 },
  { f: S01_START + 172, id: "pop", v: 0.7 },
  { f: S01_START + 196, id: "kaching", v: 0.8 },
  { f: S01_START + 225, id: "stamp", v: 0.75 },

  // Scene 2: Inflation: The Silent Tax
  { f: S02_START + 6, id: "whoosh", v: 0.6 },
  { f: S02_START + 22, id: "pop", v: 0.7 },
  { f: S02_START + 246, id: "shatter", v: 0.85 },
  { f: S02_START + 260, id: "siren", v: 0.65 },
  { f: S02_START + 285, id: "stamp", v: 0.85 },

  // Scene 3: FOMO Peak Trap vs. Smart DCA
  { f: S03_START + 6, id: "whoosh", v: 0.6 },
  { f: S03_START + 24, id: "impact", v: 0.8 },
  { f: S03_START + 162, id: "riser", v: 0.75 },
  { f: S03_START + 188, id: "kaching", v: 0.9 },
  { f: S03_START + 220, id: "stamp", v: 0.8 },

  // Scene 4: Three Golden Rules of Real Wealth
  { f: S04_START + 6, id: "whoosh", v: 0.6 },
  { f: S04_START + 14, id: "pop", v: 0.75 },
  { f: S04_START + 76, id: "pop", v: 0.75 },
  { f: S04_START + 146, id: "pop", v: 0.75 },
  { f: S04_START + 236, id: "stinger", v: 0.85 },
];
