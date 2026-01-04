
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
        {/* CINEMATIC LIGHTING */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        <pointLight position={[-5, 2, 5]} intensity={0.5} color="#4f8cff" />

        {/* IMAGE + VIDEO CONTENT */}
        <Phone />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
