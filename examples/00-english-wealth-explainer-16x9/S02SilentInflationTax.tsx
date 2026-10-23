import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Stage, Stamp, StatBar } from "../stickman/common";
import { Burst, COL, FONT, Slam, ease } from "../stickman/fx";
import { InflationMeltIcon } from "../stickman/props";
import { Actor, GROUND_Y, Key, P, SMOOTH, SNAP, groundY } from "../stickman/stick";

const SCALE = 1.42;
const GY = groundY(SCALE, GROUND_Y);

export const S02SilentInflationTax: React.FC = () => {
  const f = useCurrentFrame();
  const isMelt = f >= 245;

  const alexKeys: Key[] = [
    { f: 0, p: { x: -100, y: GY, ...P.stand } },
    { f: 24, p: { x: 265, y: GY, ...P.pointR }, e: SMOOTH, dur: 22 },
    { f: 245, p: { x: 245, y: GY - 22, ...P.shock }, e: SNAP, dur: 9 },
    { f: 262, p: { x: 245, y: GY, ...P.shock }, e: SNAP, dur: 9 },
    { f: 295, p: { x: 245, y: GY, ...P.sad }, e: SMOOTH, dur: 16 },
  ];

  const propScale = ease(f, 14, 28, 0, 0.96);
  const melt = interpolate(f, [245, 380], [1.0, 0.62], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage
      hits={[18, 246, 285]}
      power={15}
      theme={isMelt ? "danger" : "default"}
      svg={
        <>
          {propScale > 0.02 && (
            <g transform={`translate(640, 445) scale(${propScale})`}>
              <InflationMeltIcon
                f={f}
                melt={melt}
                note="$14,800"
                label="INFLATION MELTS REAL VALUE"
                sub="Purchasing Power Dropped by 54%"
              />
            </g>
          )}
          <Burst f={f} at={246} x={640} y={420} size={150} color={COL.red} n={14} />

          <Actor
            f={f}
            keys={alexKeys}
            color={COL.blue}
            scale={SCALE}
            facing={1}
            face={isMelt ? (f < 295 ? "shock" : "sad") : "smirk"}
            label="ALEX"
            handProp={isMelt ? "ice" : "cash"}
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
            color={isMelt ? COL.red : COL.ink}
            font={FONT.title}
            weight={900}
            spacing={0}
          >
            {isMelt ? "REAL PURCHASING POWER: -54%!" : "INFLATION: THE SILENT TAX"}
          </Slam>
          <Slam f={f} at={12} x={960} y={146} size={26} color="#fff" font={FONT.title} weight={900} spacing={0}>
            <span
              style={{
                background: isMelt ? COL.red : COL.blue,
                padding: "7px 26px",
                borderRadius: 12,
                border: `3px solid ${COL.ink}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
            >
              PAPER BALANCE GREW TO $14,800 — REAL VALUE SANK TO $4,600
            </span>
          </Slam>

          <StatBar
            f={f}
            at={24}
            x={1360}
            y={285}
            w={640}
            label="Nominal Bank Balance (On Paper)"
            value="$14,800"
            fill={0.78}
            color={COL.blue}
          />
          <StatBar
            f={f}
            at={248}
            x={1360}
            y={445}
            w={640}
            label="Real Purchasing Power (After Inflation)"
            value="$4,600 (-54%)"
            fill={0.32}
            color={COL.red}
          />

          <Stamp
            f={f}
            at={285}
            x={1360}
            y={645}
            text="SILENT INFLATION LOSS: -54%"
            color={COL.red}
            size={42}
            r={-3}
          />
        </>
      }
    />
  );
};
