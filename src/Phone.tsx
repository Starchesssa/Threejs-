
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import { useCurrentFrame } from "remotion";
import { TextureLoader, VideoTexture, LinearFilter, Spherical, Vector3 } from "three";
import { IMAGES, VIDEOS } from "./media";

export const Phone: React.FC = () => {
  const camera = useThree((s) => s.camera);
  const frame = useCurrentFrame();

  /* =========================
     CINEMATIC ORBIT CAMERA
  ========================== */
  useFrame(() => {
    const radius = 10 + Math.sin(frame * 0.01) * 1.5;
    const theta = frame * 0.008;

    const spherical = new Spherical(radius, Math.PI / 2.5, theta);
    camera.position.setFromSpherical(spherical);
    camera.lookAt(new Vector3(0, 0, 0));
  });

  /* =========================
     IMAGE SEQUENCE
  ========================== */
  const imageIndex = Math.floor(frame / 120) % IMAGES.length;
  const imageTexture = useLoader(TextureLoader, IMAGES[imageIndex]);

  /* =========================
     VIDEO SEQUENCE
  ========================== */
  const videoIndex = Math.floor(frame / 300) % VIDEOS.length;
  const video = useRef<HTMLVideoElement>(document.createElement("video"));

  useEffect(() => {
    video.current.src = VIDEOS[videoIndex];
    video.current.crossOrigin = "anonymous";
    video.current.loop = true;
    video.current.muted = true;
    video.current.play();
  }, [videoIndex]);

  const videoTexture = useMemo(() => {
    const tex = new VideoTexture(video.current);
    tex.minFilter = LinearFilter;
    tex.magFilter = LinearFilter;
    return tex;
  }, []);

  /* =========================
     IMAGE + VIDEO OPACITY & POSITION
  ========================== */
  const imageOpacity = Math.min(1, Math.sin((frame % 120) * 0.05) + 0.5);
  const videoOpacity = Math.min(1, Math.sin((frame % 300) * 0.03) + 0.5);

  const imageZ = -2 + Math.sin(frame * 0.02) * 0.5;
  const videoZ = -4 + Math.cos(frame * 0.015) * 0.5;

  const imageX = -1 + Math.sin(frame * 0.01);
  const videoX = 1 + Math.cos(frame * 0.012);

  const imageY = 0.5 * Math.sin(frame * 0.008);
  const videoY = 0.5 * Math.cos(frame * 0.01);

  /* =========================
     RENDER
  ========================== */
  return (
    <>
      {/* IMAGE PLANE */}
      <mesh position={[imageX, imageY, imageZ]}>
        <planeGeometry
          args={[3, 3 * (imageTexture.image.height / imageTexture.image.width)]}
        />
        <meshStandardMaterial
          map={imageTexture}
          transparent
          opacity={imageOpacity}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* VIDEO PLANE */}
      <mesh position={[videoX, videoY, videoZ]}>
        <planeGeometry args={[4, 4 * 0.5625]} />
        <meshStandardMaterial
          map={videoTexture}
          transparent
          opacity={videoOpacity}
          roughness={0.2}
          metalness={0}
        />
      </mesh>
    </>
  );
};
