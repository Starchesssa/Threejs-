
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import {
  TextureLoader,
  VideoTexture,
  LinearFilter,
  Spherical,
} from "three";

import { IMAGES, VIDEOS } from "../media";

export const Phone: React.FC = () => {
  const camera = useThree((s) => s.camera);
  const frame = useCurrentFrame();

  /* =========================
     CAMERA – CINEMATIC ORBIT
  ========================== */
  useFrame(() => {
    const radius = 7 + Math.sin(frame * 0.02) * 0.4;
    const theta = frame * 0.015;

    const spherical = new Spherical(radius, Math.PI / 2.3, theta);
    camera.position.setFromSpherical(spherical);
    camera.lookAt(0, 0, -2);
  });

  /* =========================
     IMAGE SEQUENCE
  ========================== */
  const imageIndex = Math.floor(frame / 90) % IMAGES.length;

  const imageTexture = useLoader(
    TextureLoader,
    IMAGES[imageIndex]
  );

  const imageOpacity = interpolate(frame % 90, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const imageZ = interpolate(frame % 90, [0, 40], [-6, -2], {
    extrapolateRight: "clamp",
  });

  /* =========================
     VIDEO SEQUENCE
  ========================== */
  const video = useRef<HTMLVideoElement>(document.createElement("video"));
  const videoIndex = Math.floor(frame / 240) % VIDEOS.length;

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

  const videoOpacity = interpolate(frame % 240, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
  });

  const videoY = Math.sin(frame * 0.03) * 0.2;

  /* =========================
     SCENE
  ========================== */
  return (
    <>
      {/* IMAGE PLANE */}
      <mesh position={[-1.4, 0.2, imageZ]}>
        <planeGeometry
          args={[
            2,
            2 * (imageTexture.image.height / imageTexture.image.width),
          ]}
        />
        <meshStandardMaterial
          map={imageTexture}
          transparent
          opacity={imageOpacity}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* VIDEO PLANE */}
      <mesh position={[1.4, videoY, -3]}>
        <planeGeometry args={[3, 3 * 0.5625]} />
        <meshStandardMaterial
          map={videoTexture}
          transparent
          opacity={videoOpacity}
          roughness={0.2}
          metalness={0}
        />
      </mesh>

      {/* DEPTH BLOCKS */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[
            i * 0.8 - 0.8,
            Math.sin(frame * 0.02 + i) * 0.15,
            -i * 1.5 - 1,
          ]}
        >
          <boxGeometry args={[1, 2, 0.15]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
      ))}
    </>
  );
};
