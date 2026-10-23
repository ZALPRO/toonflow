import React from "react";
import { useCurrentFrame } from "remotion";
import { Card, Stage, Stamp } from "../stickman/common";
import { Burst, COL, FONT, Slam, ease } from "../stickman/fx";
import { HouseProp } from "../stickman/props";
import { Actor, GROUND_Y, Key, P, SMOOTH, SNAP, groundY } from "../stickman/stick";

const SCALE = 1.4;
const GY = groundY(SCALE, GROUND_Y);

export const S04ThreeWealthRules: React.FC = () => {
  const f = useCurrentFrame();

  const alexKeys: Key[] = [
    { f: 0, p: { x: 1180, y: GY, ...P.stand } },
    { f: 22, p: { x: 1180, y: GY, ...P.pointR }, e: SMOOTH, dur: 16 },
    { f: 235, p: { x: 1180, y: GY - 18, ...P.cheer }, e: SNAP, dur: 10 },
    { f: 252, p: { x: 1180, y: GY, ...P.cheer }, e: SNAP, dur: 10 },
  ];

  const mayaKeys: Key[] = [
    { f: 0, p: { x: 1690, y: GY, ...P.stand } },
    { f: 24, p: { x: 1690, y: GY, ...P.cheer }, e: SMOOTH, dur: 16 },
    { f: 235, p: { x: 1690, y: GY - 20, ...P.cheer }, e: SNAP, dur: 10 },
    { f: 252, p: { x: 1690, y: GY, ...P.cheer }, e: SNAP, dur: 10 },
  ];

  const houseScale = ease(f, 18, 34, 0, 0.84);

  return (
    <Stage
      hits={[14, 76, 146, 236]}
      power={13}
      theme="wealth"
      svg={
        <>
          {houseScale > 0.02 && (
            <g transform={`translate(1435, 330) scale(${houseScale})`}>
              <HouseProp label="REAL WEALTH FORTRESS" sub="Gold + Real Estate + Productive Assets" />
            </g>
          )}
          <Burst f={f} at={236} x={1435} y={380} size={160} color={COL.gold} n={14} />

          <Actor
            f={f}
            keys={alexKeys}
            color={COL.blue}
            scale={SCALE}
            facing={1}
            face="happy"
            label="ALEX"
            handProp="coin"
          />

          <Actor
            f={f}
            keys={mayaKeys}
            color={COL.purple}
            scale={SCALE}
            facing={-1}
            hat="ponytail"
            face="happy"
            label="MAYA"
            handProp="coin"
          />
        </>
      }
      html={
        <>
          <Slam f={f} at={6} x={960} y={76} size={56} color={COL.ink} font={FONT.title} weight={900} spacing={0}>
            3 GOLDEN RULES OF REAL WEALTH
          </Slam>
          <Slam f={f} at={12} x={960} y={146} size={26} color="#fff" font={FONT.title} weight={900} spacing={0}>
            <span
              style={{
                background: COL.blue,
                padding: "7px 26px",
                borderRadius: 12,
                border: `3px solid ${COL.ink}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
            >
              BUILT WITH TOONFLOW v1.0.0 — OPEN-SOURCE 2D COMIC ANIMATION ENGINE
            </span>
          </Slam>

          <Card f={f} at={14} x={530} y={235} w={820} n="1" accent={COL.blue} size={30}>
            Keep 6 Months of Liquid Emergency Cash in the Bank
          </Card>
          <Card f={f} at={76} x={530} y={395} w={820} n="2" accent={COL.gold} size={30}>
            Convert Long-Term Savings into Gold &amp; Scarce Real Assets
          </Card>
          <Card f={f} at={146} x={530} y={555} w={820} n="3" accent={COL.green} size={30}>
            Never Buy Market Euphoria — Enter in 3 Calm DCA Steps
          </Card>

          <Stamp
            f={f}
            at={236}
            x={1435}
            y={665}
            text="TOONFLOW v1.0.0 · OPEN SOURCE"
            color={COL.blue}
            size={38}
            r={-3}
          />
        </>
      }
    />
  );
};
