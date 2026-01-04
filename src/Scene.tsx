
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useVideoConfig } from "remotion";
import React from "react";
import { Phone, MediaItem } from "./Phone";

// Example media array (replace dynamically)
const EXAMPLE_MEDIA: MediaItem[] = [
  { type: "image", src: "/images/img1.jpg" },
  { type: "video", src: "/videos/video1.mp4" },
  { type: "image", src: "/images/img2.jpg" },
  { type: "video", src: "/videos/video2.mp4" },
];

export const Scene: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      <ThreeCanvas width={width} height={height} frameloop="always" linear camera={{ fov: 38, position: [0, 0, 6] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} />
        <directionalLight position={[-5, -5, 5]} intensity={0.8} />

        {/* Phone with dynamic media */}
        <Phone phoneColor="#6e98bf" phoneLayout={{ 
          phone: { width: 2, height: 4, thickness: 0.3, radius: 0.2, position: [0, 0, 0] },
          screen: { width: 1.8, height: 3.6, radius: 0.1, position: [0, 0, 0.16] }
        }} mediaSequence={EXAMPLE_MEDIA} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
