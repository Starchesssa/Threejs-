
// CameraRig.tsx
import { useFrame, useThree } from "@react-three/fiber";
import { interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import * as THREE from "three";
import React from "react";

interface CameraRigProps {
  slideDirection?: "left" | "right";
  timeline?: {
    pushIn: [number, number];
    pullBack: [number, number];
    slide: [number, number];
  };
}

export const CameraRig: React.FC<CameraRigProps> = ({
  slideDirection = "left",
  timeline = { pushIn: [0, 10], pullBack: [10, 25], slide: [25, 35] },
}) => {
  const camera = useThree((s) => s.camera);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const secToFrame = (sec: number) => sec * fps;

  useFrame(() => {
    const pushStart = secToFrame(timeline.pushIn[0]);
    const pushEnd = secToFrame(timeline.pushIn[1]);
    const pullStart = secToFrame(timeline.pullBack[0]);
    const pullEnd = secToFrame(timeline.pullBack[1]);
    const slideStart = secToFrame(timeline.slide[0]);
    const slideEnd = secToFrame(timeline.slide[1]);

    // Smooth push-in with spring
    const pushProgress = spring({ frame: frame - pushStart, fps, config: { damping: 50, stiffness: 40 } });
    const push = interpolate(pushProgress, [0, 1], [8, 6]);

    // Smooth pull-back
    const pullProgress = spring({ frame: frame - pullStart, fps, config: { damping: 50, stiffness: 30 } });
    const pull = interpolate(pullProgress, [0, 1], [6, 10]);

    // Smooth slide
    const slideProgress = spring({ frame: frame - slideStart, fps, config: { damping: 50, stiffness: 30 } });
    const slide = interpolate(slideProgress, [0, 1], [0, slideDirection === "left" ? -6 : 6]);

    camera.position.set(slide, 1.2, push + pull - 8); // combine push/pull for smooth motion
    camera.lookAt(new THREE.Vector3(0, 1, 0));
  });

  return null;
};
