import { useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import { useCurrentFrame, spring } from "remotion";
import { TextureLoader, VideoTexture, LinearFilter, Vector3 } from "three";
import { IMAGES, VIDEOS } from "./media";

export const Phone: React.FC = () => {
  const camera = useThree((s) => s.camera);
  const frame = useCurrentFrame();

  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));

  // Determine which media is active
  const imageDuration = 180; // 3–7 sec: 180 frames ~ 6 sec at 30fps
  const videoDuration = 300; // 10 sec per video

  const totalImageFrames = IMAGES.length * imageDuration;
  const totalVideoFrames = VIDEOS.length * videoDuration;

  const cycleFrames = totalImageFrames + totalVideoFrames;
  const currentFrameInCycle = frame % cycleFrames;

  let currentMedia: { type: "image" | "video"; src: string; index: number };
  if (currentFrameInCycle < totalImageFrames) {
    const idx = Math.floor(currentFrameInCycle / imageDuration);
    currentMedia = { type: "image", src: IMAGES[idx], index: idx };
  } else {
    const idx = Math.floor((currentFrameInCycle - totalImageFrames) / videoDuration);
    currentMedia = { type: "video", src: VIDEOS[idx], index: idx };
  }

  // Load textures
  const imageTexture = useLoader(TextureLoader, currentMedia.type === "image" ? [currentMedia.src] : []);
  
  const videoTexture = useMemo(() => {
    if (currentMedia.type === "video") {
      videoRef.current.src = currentMedia.src;
      videoRef.current.crossOrigin = "anonymous";
      videoRef.current.loop = false;
      videoRef.current.muted = true;
      videoRef.current.play();
      const tex = new VideoTexture(videoRef.current);
      tex.minFilter = LinearFilter;
      tex.magFilter = LinearFilter;
      return tex;
    }
    return null;
  }, [currentMedia]);

  // Camera zoom effect
  useFrame(() => {
    const t = (currentMedia.type === "image"
      ? (currentFrameInCycle % imageDuration) / imageDuration
      : (currentFrameInCycle - totalImageFrames) % videoDuration / videoDuration
    );

    const zoom = 6 - 2 * t; // zoom in from 6 to 4
    camera.position.lerp(new Vector3(0, 0, zoom), 0.1);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {currentMedia.type === "image" && (
        <mesh>
          <planeGeometry args={[3, 3 * (imageTexture[0].image.height / imageTexture[0].image.width)]} />
          <meshStandardMaterial
            map={imageTexture[0]}
            transparent
            opacity={1}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      )}

      {currentMedia.type === "video" && videoTexture && (
        <mesh>
          <planeGeometry args={[4, 4 * 0.5625]} />
          <meshStandardMaterial
            map={videoTexture}
            transparent
            opacity={1}
            roughness={0.2}
            metalness={0}
          />
        </mesh>
      )}
    </>
  );
};
