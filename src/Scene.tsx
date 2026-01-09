
// Scene.tsx
import React from "react";
import {
  AbsoluteFill,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { CameraRig } from "./CameraRig";

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const SCENE_FRAMES = 120;
  const sceneIndex = Math.floor(frame / SCENE_FRAMES);
  const localFrame = frame % SCENE_FRAMES;

  // 🔁 Asset cycling
  const personIndex = (sceneIndex % 12) + 1;
  const poleIndex = (sceneIndex % 3) + 1;
  const towerIndex = (sceneIndex % 4) + 1;

  const personTex = useLoader(
    THREE.TextureLoader,
    staticFile(`P${personIndex}.png`)
  );
  const poleTex = useLoader(
    THREE.TextureLoader,
    staticFile(`Pole${poleIndex}.png`)
  );
  const towerTex = useLoader(
    THREE.TextureLoader,
    staticFile(`T${towerIndex}.png`)
  );

  personTex.colorSpace =
    poleTex.colorSpace =
    towerTex.colorSpace =
      THREE.SRGBColorSpace;

  // 🧠 Reveal timing (Magnates-style)
  const fgOpacity = interpolate(localFrame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
  });

  const mgOpacity = interpolate(localFrame, [40, 65], [0, 1], {
    extrapolateLeft: "clamp",
  });

  const bgOpacity = interpolate(localFrame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
  });

  // 🚧 Pole wipe (scene transition)
  const poleZ = interpolate(localFrame, [0, 30, 60], [-2, -5, -10], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0b" }}>
      <ThreeCanvas
        width={width}
        height={height}
        frameloop="always"
        linear
        camera={{ position: [0, 1.6, 10], near: 0.1, far: 100 }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 8, 4]} intensity={1.2} />
        <directionalLight position={[-4, 3, -6]} intensity={0.6} />

        {/* Camera */}
        <CameraRig sceneIndex={sceneIndex} />

        {/* 🚧 TRANSITION POLE (foreground occluder) */}
        <mesh position={[0, 1.5, poleZ]} scale={[4.2, 7, 1]}>
          <planeGeometry />
          <meshStandardMaterial
            map={poleTex}
            transparent
            opacity={1}
          />
        </mesh>

        {/* FOREGROUND */}
        <mesh position={[2.2, 1.1, -4]} scale={[3.2, 5.4, 1]}>
          <planeGeometry />
          <meshStandardMaterial
            map={personTex}
            transparent
            opacity={fgOpacity}
          />
        </mesh>

        {/* MIDGROUND */}
        <mesh position={[0, 1.2, -8]} scale={[1.6, 2.8, 1]}>
          <planeGeometry />
          <meshStandardMaterial
            map={personTex}
            transparent
            opacity={mgOpacity}
          />
        </mesh>

        {/* BACKGROUND */}
        <mesh position={[0, 2.6, -18]} scale={[9, 14, 1]}>
          <planeGeometry />
          <meshStandardMaterial
            map={towerTex}
            transparent
            opacity={bgOpacity}
          />
        </mesh>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
