
// Scene.tsx
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { CameraRig } from "./CameraRig";

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();

  // Each scene duration
  const SCENE_FRAMES = 120;
  const sceneIndex = Math.floor(frame / SCENE_FRAMES);

  // ✅ Hard safety: never NaN, never 0
  const personIndex = Math.max(1, (sceneIndex % 12) + 1);
  const poleIndex = Math.max(1, (sceneIndex % 3) + 1);
  const towerIndex = Math.max(1, (sceneIndex % 4) + 1);

  // Load textures
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

  // Correct color space
  personTex.colorSpace =
    poleTex.colorSpace =
    towerTex.colorSpace =
      THREE.SRGBColorSpace;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0b" }}>
      <ThreeCanvas frameloop="always" linear>

        {/* Lighting */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 8, 4]} intensity={1.3} />
        <directionalLight position={[-4, 3, -6]} intensity={0.5} />

        {/* Camera */}
        <CameraRig />

        {/* FOREGROUND — Pole */}
        <mesh position={[2.2, 1.1, -3]} scale={[3.4, 5.6, 1]}>
          <planeGeometry />
          <meshStandardMaterial map={poleTex} transparent />
        </mesh>

        {/* MIDGROUND — Person */}
        <mesh position={[0, 1.1, -6]} scale={[1.6, 2.8, 1]}>
          <planeGeometry />
          <meshStandardMaterial map={personTex} transparent />
        </mesh>

        {/* BACKGROUND — Tower */}
        <mesh position={[0, 2.2, -14]} scale={[8, 12, 1]}>
          <planeGeometry />
          <meshStandardMaterial map={towerTex} transparent />
        </mesh>

      </ThreeCanvas>
    </AbsoluteFill>
  );
};
