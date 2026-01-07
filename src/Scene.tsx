
// Scene.tsx
import { AbsoluteFill, useVideoConfig, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { CameraRig } from "./CameraRig";
import { useTexture } from "@react-three/drei";
import React from "react";

// Simple plane for PNGs
const ImagePlane: React.FC<{ src: string; position: [number, number, number]; scale: [number, number, number] }> = ({
  src,
  position,
  scale,
}) => {
  const texture = useTexture(src);
  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
};

// Dust / particles for atmosphere
const Dust = () => (
  <points>
    <bufferGeometry>
      <bufferAttribute
        attach="attributes-position"
        count={200}
        array={new Float32Array(Array.from({ length: 600 }, () => (Math.random() - 0.5) * 20))}
        itemSize={3}
      />
    </bufferGeometry>
    <pointsMaterial size={0.03} color="white" transparent opacity={0.3} />
  </points>
);

interface SceneProps {
  person?: string;
  tower?: string;
  pole?: string;
  slideDirection?: "left" | "right";
  timeline?: {
    pushIn: [number, number];
    pullBack: [number, number];
    slide: [number, number];
  };
}

export const Scene: React.FC<SceneProps> = ({
  person = "P7.png",
  tower = "T3.png",
  pole = "Pole2.png",
  slideDirection = "left",
  timeline,
}) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0c0c0c" }}>
      <ThreeCanvas width={width} height={height} frameloop="always" linear>
        {/* Magnates-style lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <directionalLight position={[-5, 4, -5]} intensity={0.4} />

        {/* Camera */}
        <CameraRig slideDirection={slideDirection} timeline={timeline} />

        {/* Foreground Pole */}
        <ImagePlane src={staticFile(pole)} position={[1.8, 1, -2]} scale={[3, 5, 1]} />

        {/* Person / Midground */}
        <ImagePlane src={staticFile(person)} position={[0, 0.8, -6]} scale={[1.2, 2.2, 1]} />

        {/* Tower / Background */}
        <ImagePlane src={staticFile(tower)} position={[0, 1.5, -12]} scale={[6, 8, 1]} />

        {/* Atmosphere / Dust */}
        <Dust />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
