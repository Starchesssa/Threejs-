
import { useFrame, useThree } from "@react-three/fiber";
import React from "react";
import { useCurrentFrame } from "remotion";
import { Spherical } from "three";

const COLORS = ["#ff8c00", "#4f8cff", "#ff4fd8", "#32d296"];

export const Phone: React.FC = () => {
  const camera = useThree((s) => s.camera);
  const frame = useCurrentFrame();

  /* CAMERA — FRAME-BASED (CORRECT FOR REMOTION) */
  useFrame(() => {
    const radius = 7 + Math.sin(frame * 0.02) * 0.4;
    const theta = frame * 0.015;

    const spherical = new Spherical(
      radius,
      Math.PI / 2.3,
      theta
    );

    camera.position.setFromSpherical(spherical);
    camera.lookAt(0, 0, -2);
  });

  /* MULTIPLE PHONES = DEPTH FEEL */
  return (
    <>
      {COLORS.map((color, i) => (
        <mesh
          key={i}
          position={[
            i * 0.8 - 1.2,
            Math.sin(frame * 0.02 + i) * 0.15,
            -i * 1.5
          ]}
        >
          <boxGeometry args={[1, 2, 0.2]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </>
  );
};
