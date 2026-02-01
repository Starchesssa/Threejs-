import React, { useMemo, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Ball = {
  position: THREE.Vector3;
  color: string;
  radius: number;
  velocity: THREE.Vector3;
};

const SceneContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const heroRef = useRef<THREE.Mesh>(null);

  // ---------------- MAIN BALL ----------------
  const hero = useMemo(() => ({
    position: new THREE.Vector3(0, 1, 0),
    radius: 0.6,
    color: "#ffffff",
    velocity: new THREE.Vector3(),
  }), []);

  // ---------------- COLORED BALLS ----------------
  const balls = useMemo(() => {
    const colors = ["#ff6b6b", "#6bff95", "#6bc3ff", "#f3ff6b"];
    const count = 40;
    const arr: Ball[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          0.5,
          (Math.random() - 0.5) * 20
        ),
        color: colors[i % colors.length],
        radius: 0.5,
        velocity: new THREE.Vector3(),
      });
    }
    return arr;
  }, []);

  // ---------------- PHYSICS ----------------
  useFrame(() => {
    const dt = 0.1;

    // Random tiny movement for hero
    const randomAccel = new THREE.Vector3(
      (Math.random() - 0.5) * 0.5,
      0,
      (Math.random() - 0.5) * 0.5
    );
    hero.velocity.add(randomAccel.multiplyScalar(dt));

    // Clamp speed
    if (hero.velocity.length() > 0.8) hero.velocity.setLength(0.8);

    // Move hero
    hero.position.add(hero.velocity.clone().multiplyScalar(dt));

    // Repel colored balls if too close
    balls.forEach((b) => {
      const dir = new THREE.Vector3().subVectors(b.position, hero.position);
      const dist = dir.length();
      if (dist < hero.radius + b.radius + 1) {
        dir.normalize();
        b.position.add(dir.multiplyScalar(0.1)); // push away
      }
    });

    // Dampen hero velocity
    hero.velocity.multiplyScalar(0.95);
  });

  return (
    <>
      {/* FLOOR */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#fdf6ec" roughness={1} />
      </mesh>

      {/* COLORED BALLS */}
      {balls.map((b, i) => (
        <mesh key={i} position={b.position}>
          <sphereGeometry args={[b.radius, 32, 32]} />
          <meshStandardMaterial color={b.color} />
        </mesh>
      ))}

      {/* HERO BALL */}
      <mesh ref={heroRef} position={hero.position}>
        <sphereGeometry args={[hero.radius, 32, 32]} />
        <meshStandardMaterial
          color={hero.color}
          emissive={hero.color}
          emissiveIntensity={1.8}
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
  const heroRef = useRef<THREE.Mesh>(null);

  return (
    <AbsoluteFill style={{ backgroundColor: "#fdf6ec" }}>
      <ThreeCanvas camera={{ position: [0, 5, 10], fov: 50 }} width={width} height={height}>
        <SceneContent />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

export default Scene;
