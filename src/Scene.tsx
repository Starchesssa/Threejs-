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
        <ambientLight intensity={0.15} />

        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
        />

        <pointLight position={[-4, 2, 6]} intensity={0.8} />
        <pointLight
          position={[3, -2, 4]}
          intensity={0.4}
          color="#4f8cff"
        />

        {/* SCENE CONTENT */}
        <Phone />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

