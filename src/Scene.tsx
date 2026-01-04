import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Phone } from "./Phone";
import { MediaItem } from "./media-sequence";

export const Scene: React.FC<{
  mediaSequence: MediaItem[];
  videoFrameMap: Record<string, number>;
}> = ({ mediaSequence, videoFrameMap }) => {
  const { width, height } = useVideoConfig(); // ✅ REQUIRED

  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      <ThreeCanvas
        width={width}     // ✅ FIX
        height={height}   // ✅ FIX
        linear
        camera={{ fov: 38, position: [0, 0, 6] }}
      >
        {/* LIGHTING */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <directionalLight position={[-5, -5, 5]} intensity={0.6} />

        <Phone
          mediaSequence={mediaSequence}
          videoFrameMap={videoFrameMap}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
