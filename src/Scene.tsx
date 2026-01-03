
import { ThreeCanvas, useFrame, useThree } from "@remotion/three";
import { AbsoluteFill, useVideoConfig } from "remotion";
import React from "react";
import { Phone } from "./Phone";
import { Spherical } from "three";

const CameraRig: React.FC = () => {
  const camera = useThree((s) => s.camera);
  const { fps } = useVideoConfig();
  const frame = useThree((s) => s.clock.elapsedTime * fps);

  useFrame(() => {
    const radius = 7 + Math.sin(frame * 0.02) * 0.4;
    const theta = frame * 0.015;

    const spherical = new Spherical(
      radius,
      Math.PI / 2.3,
      theta
    );

    camera.position.setFromSpherical(spherical);
    camera.lookAt(0, 0, -2);
  });

  return null;
};

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
        {/* CAMERA */}
        <CameraRig />

        {/* LIGHTING — soft + modern */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 0, 5]} intensity={0.6} />

        {/* PHONES — layered for depth */}
        <Phone position={[0, 0, 0]} color="#ff8c00" />
        <Phone position={[1.2, -0.3, -1.5]} color="#4f8cff" />
        <Phone position={[-1.1, 0.4, -3]} color="#ff4fd8" />
        <Phone position={[0.6, -0.6, -4.5]} color="#32d296" />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
