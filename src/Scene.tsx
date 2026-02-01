
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ================= HERO DOT + PARTICLES + SHAPES ================= */
const SceneContent: React.FC = () => {
  const camera = useThree((s) => s.camera);
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = frame / durationInFrames;
  const bounce = Math.abs(Math.sin(progress * Math.PI * 2)) * 1.2;

  // Hero dot Z moves forward in space
  const heroZ = progress * 200;

  // Camera follows hero dot
  useFrame(() => {
    camera.position.set(0, 3 + bounce, heroZ + 10);
    camera.lookAt(0, bounce, heroZ);
  });

  // ---------------- PARTICLES ----------------
  const particles = useMemo(() => {
    const count = 2000; // more particles
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 20 - 5;
      positions[i * 3 + 2] = Math.random() * -500;
    }

    return positions;
  }, []);

  // ---------------- RANDOM SHAPES ----------------
  const shapes = useMemo(() => {
    const count = 200;
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        position: [
          (Math.random() - 0.5) * 50,
          Math.random() * 10,
          Math.random() * -500,
        ],
        scale: Math.random() * 2 + 0.5,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        color: new THREE.Color(
          Math.random() * 0.5 + 0.5,
          Math.random() * 0.5 + 0.5,
          Math.random() * 0.5 + 0.5
        ),
      });
    }
    return data;
  }, []);

  return (
    <>
      {/* PARTICLE FIELD */}
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
          color="#f0e6d2"
          size={0.15}
          sizeAttenuation
          transparent
          opacity={0.9}
        />
      </points>

      {/* RANDOM SHAPES */}
      {shapes.map((s, i) => (
        <mesh
          key={i}
          position={s.position}
          rotation={s.rotation}
          scale={[s.scale, s.scale, s.scale]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={s.color} roughness={0.6} />
        </mesh>
      ))}

      {/* HERO DOT */}
      <mesh position={[0, bounce, heroZ]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color="#ff6f61"
          emissive="#ffd699"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* FLOOR */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, heroZ / 2]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#fff8e7" roughness={1} />
      </mesh>

      {/* LIGHTS */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} />
      <pointLight position={[-10, 10, 50]} intensity={1} />
    </>
  );
};

/* ================= REMOTION SCENE ================= */
const Scene: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#fdf6ec" }}>
      <ThreeCanvas camera={{ position: [0, 3, 10], fov: 60 }} width={width} height={height}>
        <SceneContent />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

export default Scene;
