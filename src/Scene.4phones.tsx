
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useVideoConfig } from "remotion";
import React from "react";
import { Phone } from "./Phone";

export const Scene: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0f" }}>
      <ThreeCanvas
        width={width}
        height={height}
        frameloop="always"
        linear
      >
        {/* MODERN DARK LIGHTING */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 0, 6]} intensity={0.6} />

        {/* OBJECTS */}
        <Phone />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
