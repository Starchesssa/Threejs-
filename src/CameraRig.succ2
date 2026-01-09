
// CameraRig.tsx
import { useFrame, useThree } from "@react-three/fiber";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import React from "react";

export const CameraRig: React.FC<{
  sceneIndex: number;
}> = ({ sceneIndex }) => {
  const { camera } = useThree();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 🔍 Cinematic FOV (tight, Magnates-style)
  camera.fov = 32;
  camera.updateProjectionMatrix();

  // Each scene lasts 120 frames
  const SCENE = 120;
  const localFrame = frame % SCENE;

  // Smooth scene transition
  const t = spring({
    frame: localFrame,
    fps,
    config: { damping: 40, stiffness: 60 },
  });

  // Camera choreography
  const z = interpolate(t, [0, 1], [7.5, 5.2]);   // push-in
  const x = interpolate(
    t,
    [0, 1],
    [0, sceneIndex % 2 === 0 ? -2.5 : 2.5]        // slide
  );

  camera.position.set(x, 1.5, z);
  camera.lookAt(new THREE.Vector3(0, 1.4, -6));

  return null;
};
