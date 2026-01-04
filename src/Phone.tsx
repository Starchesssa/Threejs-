
import React, { useEffect, useMemo, useRef } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import { TextureLoader, VideoTexture, LinearFilter } from "three";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MediaItem } from "./media-sequence";
import { IMAGE_SECONDS, FPS } from "./timing";

export const Phone: React.FC<{
  mediaSequence: MediaItem[];
  videoFrameMap: Record<string, number>;
}> = ({ mediaSequence, videoFrameMap }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const camera = useThree((s) => s.camera);

  /* ----------------------------------
     FIND CURRENT MEDIA BY ACCUMULATION
  ---------------------------------- */

  let accumulated = 0;
  let current: MediaItem | null = null;
  let localFrame = 0;

  for (const item of mediaSequence) {
    const duration =
      item.type === "image"
        ? IMAGE_SECONDS * FPS
        : videoFrameMap[item.src];

    if (frame < accumulated + duration) {
      current = item;
      localFrame = frame - accumulated;
      break;
    }
    accumulated += duration;
  }

  if (!current) return null;

  /* ----------------------------------
     TEXTURES
  ---------------------------------- */

  const imageTexture = useLoader(
    TextureLoader,
    current.type === "image" ? current.src : ""
  );

  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));

  const videoTexture = useMemo(() => {
    const video = videoRef.current;
    video.muted = true;
    video.playsInline = true;
    const tex = new VideoTexture(video);
    tex.minFilter = LinearFilter;
    tex.magFilter = LinearFilter;
    return tex;
  }, []);

  useEffect(() => {
    if (current?.type === "video") {
      videoRef.current.src = current.src;
      videoRef.current.currentTime = localFrame / fps;
      videoRef.current.play();
    }
  }, [current, localFrame, fps]);

  /* ----------------------------------
     MOTION GRAPHICS (MAGNATES STYLE)
  ---------------------------------- */

  const duration =
    current.type === "image"
      ? IMAGE_SECONDS * FPS
      : videoFrameMap[current.src];

  const progress = localFrame / duration;

  const scale = spring({
    fps,
    frame: localFrame,
    from: 1.25,
    to: 1,
    config: { damping: 200 },
  });

  const y = interpolate(progress, [0, 1], [-0.4, 0]);
  const opacity = interpolate(progress, [0, 0.15], [0, 1]);

  camera.position.z = interpolate(progress, [0, 1], [6, 4.5]);
  camera.lookAt(0, 0, 0);

  /* ----------------------------------
     RENDER
  ---------------------------------- */

  return (
    <>
      <mesh position={[0, 0, -3]} scale={[10, 10, 1]}>
        <planeGeometry />
        <meshStandardMaterial color="#f3f3f3" />
      </mesh>

      {current.type === "image" && imageTexture && (
        <mesh scale={[scale, scale, scale]} position={[0, y, 0]}>
          <planeGeometry
            args={[
              3,
              3 *
                (imageTexture.image.height /
                  imageTexture.image.width),
            ]}
          />
          <meshStandardMaterial
            map={imageTexture}
            transparent
            opacity={opacity}
          />
        </mesh>
      )}

      {current.type === "video" && (
        <mesh scale={[scale, scale, scale]} position={[0, y, 0]}>
          <planeGeometry args={[4, 4 * 0.5625]} />
          <meshStandardMaterial
            map={videoTexture}
            transparent
            opacity={opacity}
          />
        </mesh>
      )}
    </>
  );
};
