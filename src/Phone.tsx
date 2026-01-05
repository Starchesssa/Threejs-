
import { useFrame, useThree } from "@react-three/fiber";
import { useCurrentFrame } from "remotion";
import React, { useRef } from "react";
import { Mesh, Vector3 } from "three";

export const Phone: React.FC = () => {
  const camera = useThree((s) => s.camera);
  const frame = useCurrentFrame();

  // references for layers
  const l1 = useRef<Mesh>(null);
  const l2 = useRef<Mesh>(null);
  const l3 = useRef<Mesh>(null);
  const l4 = useRef<Mesh>(null);

  /* ===============================
     MAGNETTES MEDIA CAMERA
     =============================== */
  useFrame(() => {
    const t = frame * 0.003;

    const camPos = new Vector3(
      Math.cos(t) * 6,
      Math.sin(frame * 0.002) * 0.6,
      Math.sin(t) * 6
    );

    camera.position.lerp(camPos, 0.04);
    camera.lookAt(0, 0, -3);
  });

  /* ===============================
     LAYER ANIMATIONS
     =============================== */
  useFrame(() => {
    if (!l1.current || !l2.current || !l3.current || !l4.current) return;

    l1.current.rotation.y = frame * 0.002;
    l1.current.position.y = Math.sin(frame * 0.01) * 0.4;

    l2.current.rotation.x = frame * 0.0015;
    l2.current.position.y = Math.sin(frame * 0.008) * 0.5;

    l3.current.rotation.y = frame * 0.001;
    l3.current.position.y = Math.sin(frame * 0.006) * 0.6;

    l4.current.rotation.x = frame * 0.0008;
    l4.current.position.y = Math.sin(frame * 0.004) * 0.7;
  });

  return (
    <>
      {/* LAYER 1 — FOREGROUND */}
      <mesh ref={l1} position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 3, 0.25]} />
        <meshStandardMaterial color="#ff7a18" metalness={0.6} roughness={0.25} />
      </mesh>

      {/* LAYER 2 */}
      <mesh ref={l2} position={[-2, 0, -2]}>
        <boxGeometry args={[1.2, 3, 0.25]} />
        <meshStandardMaterial color="#4cc9f0" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* LAYER 3 */}
      <mesh ref={l3} position={[2, 0, -4]}>
        <boxGeometry args={[1.2, 3, 0.25]} />
        <meshStandardMaterial color="#b5179e" metalness={0.6} roughness={0.35} />
      </mesh>

      {/* LAYER 4 — BACK */}
      <mesh ref={l4} position={[-1, 0, -6]}>
        <boxGeometry args={[1.2, 3, 0.25]} />
        <meshStandardMaterial color="#80ffdb" metalness={0.6} roughness={0.4} />
      </mesh>
    </>
  );
};
