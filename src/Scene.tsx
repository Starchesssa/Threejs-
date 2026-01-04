
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useVideoConfig } from "remotion";
import React from "react";
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
        camera={{ fov: 38, position: [0, 0, 6] }} // 35mm lens equivalent
      >
        {/* Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} />
        <directionalLight position={[-5, -5, 5]} intensity={0.8} />

        {/* Phone / Media */}
        <Phone />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
