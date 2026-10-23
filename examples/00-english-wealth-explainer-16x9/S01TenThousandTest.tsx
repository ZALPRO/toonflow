import React from "react";
import { useCurrentFrame } from "remotion";
import { Stage, Stamp } from "../stickman/common";
import { Burst, COL, Dust, FONT, Slam, ease } from "../stickman/fx";
import { Bank, SafeBox, SavingsBundleIcon } from "../stickman/props";
import { Actor, GROUND_Y, Key, P, SMOOTH, SNAP, groundY } from "../stickman/stick";

const SCALE = 1.42;
const GY = groundY(SCALE, GROUND_Y);

export const S01TenThousandTest: React.FC = () => {
  const f = useCurrentFrame();

  const alexKeys: Key[] = [
    { f: 0, p: { x: -120, y: GY, ...P.stand } },
    { f: 28, p: { x: 350, y: GY, ...P.pointR }, e: SMOOTH, dur: 26 },
    { f: 170, p: { x: 350, y: GY, ...P.think }, e: SNAP, dur: 12 },
    { f: 220, p: { x: 350, y: GY, ...P.pointR }, e: SNAP, dur: 12 },
  ];

  const mayaKeys: Key[] = [
    { f: 0, p: { x: 2040, y: GY, ...P.stand } },
    { f: 30, p: { x: 1570, y: GY, ...P.pointR }, e: SMOOTH, dur: 26 },
    { f: 175, p: { x: 1570, y: GY - 18, ...P.cheer }, e: SNAP, dur: 10 },
    { f: 192, p: { x: 1570, y: GY, ...P.cheer }, e: SNAP, dur: 10 },
  ];

  const showBundle = f >= 14 && f < 172;
  const bundleScale = showBundle ? ease(f, 14, 28, 0, 1.05) * (1 - ease(f, 160, 172, 0, 1)) : 0;

  const showSplit = f >= 172;
  const bankScale = showSplit ? ease(f, 172, 188, 0, 0.95) : 0;
  const goldScale = showSplit ? ease(f, 184, 200, 0, 0.95) : 0;

  return (
    <Stage
      hits={[18, 174, 225]}
      power={13}
      theme="default"
      svg={
        <>
          <Dust f={f} at={26} x={350} y={GROUND_Y} />
          <Dust f={f} at={28} x={1570} y={GROUND_Y} />

          {bundleScale > 0.02 && (
            <g transform={`translate(960, 430) scale(${bundleScale})`}>
              <SavingsBundleIcon
                amount="$10,000 INITIAL SAVINGS"
                sub="Alex & Maya Each Start With $10,000"
                strap="$10K"
              />
            </g>
          )}
          <Burst f={f} at={20} x={960} y={410} size={140} color={COL.green} n={12} />

          {bankScale > 0.02 && (
            <g transform={`translate(690, 455) scale(${bankScale})`}>
              <Bank label="BANK ACCOUNT (4% APY)" />
            </g>
          )}
          {goldScale > 0.02 && (
            <g transform={`translate(1230, 455) scale(${goldScale})`}>
              <SafeBox label="GOLD & REAL ASSETS" />
            </g>
          )}
          <Burst f={f} at={188} x={1220} y={405} size={130} color={COL.gold} n={12} />

          <Actor
            f={f}
            keys={alexKeys}
            color={COL.blue}
            scale={SCALE}
            facing={1}
            face={f < 170 ? "happy" : "smirk"}
            label="ALEX"
            handProp="cash"
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
            handProp={f < 172 ? "cash" : "coin"}
          />
        </>
      }
      html={
        <>
          <Slam f={f} at={6} x={960} y={76} size={58} color={COL.ink} font={FONT.title} weight={900} spacing={0}>
            THE $10,000 INFLATION TEST
          </Slam>
          <Slam f={f} at={12} x={960} y={146} size={26} color="#fff" font={FONT.title} weight={900} spacing={0}>
            <span
              style={{
                background: COL.ink,
                padding: "7px 26px",
                borderRadius: 12,
                border: `3px solid ${COL.gold}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
            >
              BANK DEPOSIT VS. GOLD &amp; REAL ASSETS (10-YEAR STUDY)
            </span>
          </Slam>

          <Stamp
            f={f}
            at={225}
            x={960}
            y={222}
            text="10-YEAR WEALTH CHALLENGE"
            color={COL.orange}
            size={32}
            r={-2}
          />
        </>
      }
    />
  );
};
