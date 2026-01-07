
import { useFrame, useThree } from "@react-three/fiber";
import { interpolate, useCurrentFrame } from "remotion";
import * as THREE from "three";
import React from "react";

export const CameraRig: React.FC<{
  slideDirection?: "left" | "right";
}> = ({ slideDirection = "left" }) => {
  const camera = useThree((s) => s.camera);
  const frame = useCurrentFrame();

  useFrame(() => {
    // PHASES
    const push = interpolate(frame, [0, 90], [8, 6], {
      extrapolateRight: "clamp",
    });

    const pull = interpolate(frame, [90, 150], [6, 10], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const slide = interpolate(frame, [150, 210], [0, slideDirection === "left" ? -6 : 6], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    camera.position.set(slide, 1.2, pull);
    camera.lookAt(new THREE.Vector3(0, 1, 0));
  });

  return null;
};
