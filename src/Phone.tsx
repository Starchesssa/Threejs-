
import React from "react";

export const Phone: React.FC<{
  position: [number, number, number];
  color: string;
}> = ({ position, color }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 2, 0.2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};
