
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import { useCurrentFrame } from "remotion";
import { TextureLoader, VideoTexture, LinearFilter, Vector3 } from "three";
import { IMAGES, VIDEOS } from "./media";

interface MediaItem {
  type: "image" | "video";
  src: string;
}

// Combine images and videos safely
export const MEDIA_SEQUENCE: MediaItem[] = [
  ...IMAGES.filter(Boolean).map((src) => ({ type: "image", src })),
  ...VIDEOS.filter(Boolean).map((src) => ({ type: "video", src })),
];

export const Phone: React.FC = () => {
  const camera = useThree((state) => state.camera);
  const frame = useCurrentFrame();
  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));

  const totalItems = MEDIA_SEQUENCE.length;

  if (totalItems === 0) return null;

  // Loop over media
  const currentIndex = frame % totalItems;
  const currentMedia = MEDIA_SEQUENCE[currentIndex];

  // Load image texture safely
  const imageTexture =
    currentMedia.type === "image" && currentMedia.src
      ? useLoader(TextureLoader, [currentMedia.src])
      : null;

  // Load video texture safely
  const videoTexture = useMemo(() => {
    if (currentMedia.type === "video" && currentMedia.src) {
      videoRef.current.src = currentMedia.src;
      videoRef.current.crossOrigin = "anonymous";
      videoRef.current.loop = false;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
      const tex = new VideoTexture(videoRef.current);
      tex.minFilter = LinearFilter;
      tex.magFilter = LinearFilter;
      return tex;
    }
    return null;
  }, [currentMedia]);

  // Camera smooth zoom effect
  useFrame(() => {
    const zoomStart = 6; // initial distance
    const zoomEnd = 4.5; // closer zoom
    const t = 0.02; // smoothing factor
    const targetZ = zoomStart - (zoomStart - zoomEnd) * (currentIndex / totalItems);
    camera.position.lerp(new Vector3(0, 0, targetZ), t);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Render image */}
      {currentMedia.type === "image" && imageTexture && (
        <mesh>
          <planeGeometry
            args={[
              3,
              3 * (imageTexture[0].image.height / imageTexture[0].image.width),
            ]}
          />
          <meshStandardMaterial
            map={imageTexture[0]}
            transparent
            opacity={1}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      )}

      {/* Render video */}
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
