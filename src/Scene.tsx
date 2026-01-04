
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useVideoConfig } from "remotion";
import React from "react";
import { Phone } from "./Phone";

export const Scene: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* 🌈 Gradient Background */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at top, #ff4ecd, #2b1055, #000010)",
        }}
      />

      <ThreeCanvas width={width} height={height} frameloop="always">
        {/* Glow lights */}
        <ambientLight intensity={0.8} />

        <pointLight position={[3, 4, 6]} intensity={3} color="#ff66cc" />
        <pointLight position={[-3, -2, 4]} intensity={2.5} color="#00ffff" />
        <directionalLight position={[0, 5, 5]} intensity={1.5} />

        <Phone />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
