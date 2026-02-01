import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ================== DOT SCENE ================== */
const DotScene: React.FC = () => {
  const camera = useThree((s) => s.camera);
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = frame / durationInFrames;
  const cameraZ = THREE.MathUtils.lerp(0, 60, progress);
  const bounce = Math.abs(Math.sin(progress * Math.PI * 6)) * 1.2;

  useFrame(() => {
    camera.position.set(0, bounce, cameraZ);
    camera.lookAt(0, bounce, cameraZ - 10);
  });

  const particles = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 2] = -i * 1.2;
    }
    return positions;
  }, []);

  return (
    <>
      {/* DOT FIELD */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particles}
            itemSize={3}
            count={particles.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#7b6cff"
          size={0.12}
          sizeAttenuation
          transparent
          opacity={0.9}
        />
      </points>

      {/* HERO DOT */}
      <mesh position={[0, bounce, -cameraZ]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#7b6cff"
          emissiveIntensity={2}
        />
      </mesh>

      {/* LIGHTS */}
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 4, 5]} intensity={2} />
    </>
  );
};

/* ================== SCENE WRAPPER ================== */
const Scene: React.FC = () => {
  const { width, height } = useVideoConfig(); // <- automatically matches Root.tsx

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <ThreeCanvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        width={width}   // <- REQUIRED
        height={height} // <- REQUIRED
      >
        <DotScene />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

export default Scene;
