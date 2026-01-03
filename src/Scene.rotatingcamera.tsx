
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useVideoConfig } from "remotion";
import React from "react";
import { Phone } from "./Phone";

export const Scene: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "white" }}>
      <ThreeCanvas
        width={width}
        height={height}
        frameloop="always"   // REQUIRED
        linear
      >
        {/* Lights */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />

        {/* WORLD REFERENCES — DO NOT MOVE */}
        <axesHelper args={[5]} />
        <gridHelper args={[20, 20]} />

        {/* OBJECT */}
        <Phone />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
