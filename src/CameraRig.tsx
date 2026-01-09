
// CameraRig.tsx
import { useThree } from "@react-three/fiber";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import React from "react";

export const CameraRig: React.FC<{ sceneIndex: number }> = ({ sceneIndex }) => {
  const { camera } = useThree();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const SCENE_FRAMES = 120;
  const localFrame = frame % SCENE_FRAMES;

  // 🎥 Cinematic compression (long lens)
  camera.fov = 26;
  camera.updateProjectionMatrix();

  const t = spring({
    frame: localFrame,
    fps,
    config: {
      damping: 32,
      stiffness: 55,
      mass: 1,
    },
  });

  // 🚶 Forward dolly
  const z = THREE.MathUtils.lerp(10, 4.5, t);

  // ↔ Subtle lateral drift
  const x =
    Math.sin((sceneIndex + t) * Math.PI) * 1.2 +
    Math.sin(frame * 0.015) * 0.05;

  // 🎞 Micro handheld luxury drift
  const y = 1.6 + Math.cos(frame * 0.01) * 0.04;

  camera.position.set(x, y, z);
  camera.lookAt(0, 1.4, z - 6);

  return null;
};
