
import React, { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  LinearFilter,
  TextureLoader,
  VideoTexture,
} from "three";
import { useLoader } from "@react-three/fiber";
import { IMAGES, VIDEOS } from "./media";

const IMAGE_DURATION = 180; // 6 seconds @ 30fps
const VIDEO_DURATION = 300; // 10 seconds @ 30fps

export const Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const camera = useThree((s) => s.camera);

  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));

  /* -------------------------------------------------------
     1️⃣ MEDIA TIMELINE (VERY IMPORTANT)
  ------------------------------------------------------- */

  const totalImageFrames = IMAGES.length * IMAGE_DURATION;
  const totalVideoFrames = VIDEOS.length * VIDEO_DURATION;
  const totalFrames = totalImageFrames + totalVideoFrames;

  const localFrame = frame % totalFrames;

  let currentMedia: {
    type: "image" | "video";
    src: string;
    localFrame: number;
  };

  if (localFrame < totalImageFrames) {
    const index = Math.floor(localFrame / IMAGE_DURATION);
    currentMedia = {
      type: "image",
      src: IMAGES[index],
      localFrame: localFrame % IMAGE_DURATION,
    };
  } else {
    const videoFrame = localFrame - totalImageFrames;
    const index = Math.floor(videoFrame / VIDEO_DURATION);
    currentMedia = {
      type: "video",
      src: VIDEOS[index],
      localFrame: videoFrame % VIDEO_DURATION,
    };
  }

  /* -------------------------------------------------------
     2️⃣ LOAD IMAGE TEXTURE
  ------------------------------------------------------- */

  const imageTexture = useLoader(
    TextureLoader,
    currentMedia.type === "image" ? currentMedia.src : ""
  );

  /* -------------------------------------------------------
     3️⃣ VIDEO TEXTURE (PLAY FULL VIDEO)
  ------------------------------------------------------- */

  const videoTexture = useMemo(() => {
    const video = videoRef.current;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const texture = new VideoTexture(video);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    return texture;
  }, []);

  useEffect(() => {
    if (currentMedia.type === "video") {
      videoRef.current.src = currentMedia.src;
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, [currentMedia]);

  /* -------------------------------------------------------
     4️⃣ MAGNATESMEDIA MOTION GRAPHICS
  ------------------------------------------------------- */

  const progress =
    currentMedia.type === "image"
      ? currentMedia.localFrame / IMAGE_DURATION
      : currentMedia.localFrame / VIDEO_DURATION;

  const scale = spring({
    fps,
    frame: currentMedia.localFrame,
    from: 1.25,
    to: 1,
    config: { damping: 200 },
  });

  const y = interpolate(progress, [0, 1], [-0.4, 0]);
  const opacity = interpolate(progress, [0, 0.15], [0, 1]);

  /* -------------------------------------------------------
     5️⃣ CINEMATIC 3D CAMERA
  ------------------------------------------------------- */

  camera.position.z = interpolate(progress, [0, 1], [6, 4.5]);
  camera.lookAt(0, 0, 0);

  /* -------------------------------------------------------
     6️⃣ RENDER
  ------------------------------------------------------- */

  return (
    <>
      {/* BACKGROUND PLANE */}
      <mesh position={[0, 0, -3]} scale={[10, 10, 1]}>
        <planeGeometry />
        <meshStandardMaterial color="#f4f4f4" />
      </mesh>

      {/* IMAGE */}
      {currentMedia.type === "image" && imageTexture && (
        <mesh
          scale={[scale, scale, scale]}
          position={[0, y, 0]}
        >
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

      {/* VIDEO */}
      {currentMedia.type === "video" && (
        <mesh
          scale={[scale, scale, scale]}
          position={[0, y, 0]}
        >
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
