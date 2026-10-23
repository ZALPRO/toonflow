import React from "react";
import { useCurrentFrame } from "remotion";
import { Stage, Stamp } from "../stickman/common";
import { Burst, COL, FONT, Slam, countUp, ease } from "../stickman/fx";
import { FomoTrapChartIcon, StepLadderIcon } from "../stickman/props";
import { Actor, GROUND_Y, Key, P, SMOOTH, SNAP, groundY } from "../stickman/stick";

const SCALE = 1.42;
const GY = groundY(SCALE, GROUND_Y);

export const S03FomoVsSmartDCA: React.FC = () => {
  const f = useCurrentFrame();
  const isSmart = f >= 158;

  const alexKeys: Key[] = [
    { f: 0, p: { x: 245, y: GY, ...P.pointR } },
    { f: 22, p: { x: 235, y: GY - 18, ...P.shock }, e: SNAP, dur: 9 },
    { f: 38, p: { x: 235, y: GY, ...P.sad }, e: SMOOTH, dur: 14 },
  ];

  const mayaKeys: Key[] = [
    { f: 0, p: { x: 1685, y: GY, ...P.stand } },
    { f: 158, p: { x: 1665, y: GY, ...P.pointR }, e: SNAP, dur: 11 },
    { f: 185, p: { x: 1665, y: GY - 22, ...P.cheer }, e: SNAP, dur: 10 },
    { f: 202, p: { x: 1665, y: GY, ...P.cheer }, e: SNAP, dur: 10 },
  ];

  const fomoScale = ease(f, 14, 28, 0, 0.92);
  const dcaScale = isSmart ? ease(f, 158, 174, 0, 0.92) : 0;
  const portfolioVal = countUp(f, 168, 235, 10000, 42500);

  return (
    <Stage
      hits={[22, 162, 220]}
      power={14}
      theme={isSmart ? "wealth" : "default"}
      svg={
        <>
          {fomoScale > 0.02 && (
            <g transform={`translate(640, 420) scale(${fomoScale})`}>
              <FomoTrapChartIcon label="BUYING THE PEAK = -40% TRAP" />
            </g>
          )}
          <Burst f={f} at={24} x={640} y={390} size={130} color={COL.red} n={12} />

          {dcaScale > 0.02 && (
            <g transform={`translate(1260, 420) scale(${dcaScale})`}>
              <StepLadderIcon
                s1="STEP 1: 30%"
                s2="STEP 2: 30%"
                s3="STEP 3: 40%"
                label="MAYA'S 3-STEP DCA STRATEGY"
              />
            </g>
          )}
          <Burst f={f} at={186} x={1260} y={390} size={145} color={COL.gold} n={14} />

          <Actor
            f={f}
            keys={alexKeys}
            color={COL.blue}
            scale={SCALE}
            facing={1}
            face="sad"
            label="ALEX"
            handProp="phone_red"
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
          <Slam
            f={f}
            at={6}
            x={960}
            y={76}
            size={56}
            color={isSmart ? COL.green : COL.ink}
            font={FONT.title}
            weight={900}
            spacing={0}
          >
            {isSmart ? "SMART 3-STEP DCA: +325% REAL WEALTH" : "FOMO PEAK TRAP VS. SMART DCA"}
          </Slam>
          <Slam f={f} at={12} x={960} y={146} size={26} color="#fff" font={FONT.title} weight={900} spacing={0}>
            <span
              style={{
                background: isSmart ? COL.green : COL.ink,
                padding: "7px 26px",
                borderRadius: 12,
                border: `3px solid ${COL.gold}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
            >
              NEVER CHASE HYPE AT THE TOP — ACCUMULATE IN 3 CALM STEPS
            </span>
          </Slam>

          {isSmart && (
            <Stamp
              f={f}
              at={175}
              x={1260}
              y={665}
              text={`MAYA'S PORTFOLIO: $${portfolioVal.toLocaleString()}`}
              color={COL.green}
              size={42}
              r={-3}
            />
          )}
        </>
      }
    />
  );
};
