import { AbsoluteFill, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import React from "react";
import { Phone } from "./Phone";

export const Scene: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#050507" }}>
      <ThreeCanvas
        width={width}
        height={height}
        frameloop="always"
        camera={{
          fov: 48,
          near: 0.1,
          far: 50,
          position: [0, 0, 8],
        }}
      >
        {/* ATMOSPHERE */}
        <fog attach="fog" args={["#050507", 4, 18]} />

        {/* LIGHTING — MAGNETTES STYLE */}
        <ambientLight intensity={0.15} />

        {/* Cyan rim */}
        <directionalLight
          position={[5, 3, -6]}
          intensity={1.4}
          color="#4cc9f0"
        />

        {/* Magenta glow */}
        <directionalLight
          position={[-4, -2, 4]}
          intensity={0.8}
          color="#f72585"
        />

        {/* CONTENT */}
        <Phone />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
