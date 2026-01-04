
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Phone } from "./Phone";

export const Scene: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      <ThreeCanvas
        width={width}
        height={height}
        frameloop="always"
        linear
        camera={{ fov: 40, position: [0, 0, 6] }}
      >
        {/* CINEMATIC LIGHTING */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <directionalLight position={[-5, -5, 5]} intensity={0.6} />

        <Phone />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
