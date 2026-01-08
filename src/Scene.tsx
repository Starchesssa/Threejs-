
// Scene.tsx
import { AbsoluteFill, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { CameraRig } from "./CameraRig";

export const Scene: React.FC<{
  sceneIndex: number;
}> = ({ sceneIndex }) => {

  // Rotate assets
  const person = `p${(sceneIndex % 12) + 1}.png`;
  const pole = `Pole${(sceneIndex % 3) + 1}.png`;
  const tower = `T${(sceneIndex % 4) + 1}.png`;

  const personTex = useLoader(THREE.TextureLoader, staticFile(person));
  const poleTex = useLoader(THREE.TextureLoader, staticFile(pole));
  const towerTex = useLoader(THREE.TextureLoader, staticFile(tower));

  personTex.colorSpace = poleTex.colorSpace = towerTex.colorSpace =
    THREE.SRGBColorSpace;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0b" }}>
      <ThreeCanvas frameloop="always" linear>

        {/* Lighting */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 8, 4]} intensity={1.3} />
        <directionalLight position={[-4, 3, -6]} intensity={0.5} />

        {/* Camera */}
        <CameraRig sceneIndex={sceneIndex} />

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
