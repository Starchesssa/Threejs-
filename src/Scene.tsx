
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { CameraRig } from "./CameraRig";
import { useTexture } from "@react-three/drei";
import React from "react";

/* ---------- SIMPLE PNG PLANE ---------- */
const ImagePlane = ({
  src,
  position,
  scale,
}: {
  src: string;
  position: [number, number, number];
  scale: [number, number, number];
}) => {
  const texture = useTexture(src);
  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        map={texture}
        transparent
        toneMapped={false}
      />
    </mesh>
  );
};

/* ---------- OPTIONAL DUST ---------- */
const Dust = () => {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={new Float32Array(
            Array.from({ length: 600 }, () => (Math.random() - 0.5) * 20)
          )}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="white" transparent opacity={0.3} />
    </points>
  );
};

/* ---------- MAIN SCENE ---------- */
export const Scene: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0c0c0c" }}>
      <ThreeCanvas
        width={width}
        height={height}
        frameloop="always"
        linear
      >
        {/* MAGNATES LIGHTING */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <directionalLight position={[-5, 4, -5]} intensity={0.4} />

        {/* CAMERA */}
        <CameraRig slideDirection="left" />

        {/* FOREGROUND POLE (TRANSITION WIPE) */}
        <ImagePlane
          src="/Pole2.png"
          position={[1.8, 1, -2]}
          scale={[3, 5, 1]}
        />

        {/* PERSON (MID) */}
        <ImagePlane
          src="/P7.png"
          position={[0, 0.8, -6]}
          scale={[1.2, 2.2, 1]}
        />

        {/* TOWER (BACKGROUND) */}
        <ImagePlane
          src="/T3.png"
          position={[0, 1.5, -12]}
          scale={[6, 8, 1]}
        />

        {/* ATMOSPHERE */}
        <Dust />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
