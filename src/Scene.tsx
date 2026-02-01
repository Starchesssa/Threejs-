
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";

type Ball = {
  initialPos: THREE.Vector3;
  color: string;
  radius: number;
  phase: number; // for deterministic motion
};

const SceneContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const heroRadius = 0.6;

  // ---------------- COLORED BALLS ----------------
  const balls = useMemo(() => {
    const colors = ["#ff6b6b", "#6bff95", "#6bc3ff", "#f3ff6b"];
    const count = 40;
    const arr: Ball[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        initialPos: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          0.5,
          (Math.random() - 0.5) * 20
        ),
        color: colors[i % colors.length],
        radius: 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  // ---------------- HERO BALL ----------------
  const heroPos = useMemo(() => {
    const x = Math.sin(frame * 0.05) * 5;
    const z = Math.cos(frame * 0.03) * 5;
    const y = 1 + Math.sin(frame * 0.07) * 0.5;
    return new THREE.Vector3(x, y, z);
  }, [frame]);

  // ---------------- BALL POSITIONS ----------------
  const coloredPositions = balls.map((b) => {
    // simple repelling effect
    const dir = new THREE.Vector3().subVectors(b.initialPos, heroPos);
    const dist = dir.length();
    const offset = dist < heroRadius + b.radius + 1 ? (heroRadius + b.radius + 1 - dist) * 0.3 : 0;
    dir.normalize();
    return b.initialPos.clone().add(dir.multiplyScalar(offset));
  });

  return (
    <>
      {/* FLOOR */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#fdf6ec" roughness={1} />
      </mesh>

      {/* COLORED BALLS */}
      {coloredPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[balls[i].radius, 32, 32]} />
          <meshStandardMaterial color={balls[i].color} />
        </mesh>
      ))}

      {/* HERO BALL */}
      <mesh position={heroPos}>
        <sphereGeometry args={[heroRadius, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* LIGHTS */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />
    </>
  );
};

const Scene: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#fdf6ec" }}>
      <ThreeCanvas camera={{ position: [0, 5, 10], fov: 50 }} width={width} height={height}>
        <SceneContent />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

export default Scene;
