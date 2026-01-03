
import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect } from "react";
import { useCurrentFrame } from "remotion";
import { Spherical } from "three";

export const Phone: React.FC = () => {
  const camera = useThree((s) => s.camera);
  const frame = useCurrentFrame();

  /* CAMERA ANIMATION — ONLY THING THAT MOVES */
  useFrame(() => {
    const radius = 6;
    const theta = frame * 0.02;

    const spherical = new Spherical(
      radius,
      Math.PI / 2.2,
      theta
    );

    camera.position.setFromSpherical(spherical);

    // IMPORTANT: not looking exactly at center
    camera.lookAt(0.5, 0, 0);
  });

  /* OBJECT — STATIC FOREVER */
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 2, 0.2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};
