
import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCurrentFrame, useVideoConfig, Video } from "remotion";
import { CanvasTexture, Texture, Vector3 } from "three";
import { interpolate, spring } from "remotion";
import { RoundedBox } from "./RoundedBox";
import { roundedRect } from "./helpers/rounded-rectangle";
import {
  CAMERA_DISTANCE,
  PHONE_CURVE_SEGMENTS,
  PHONE_SHININESS,
  PhoneLayout,
} from "./helpers/layout";

export type MediaItem = { type: "image" | "video"; src: string };

interface PhoneProps {
  phoneColor: string;
  phoneLayout: PhoneLayout;
  mediaSequence: MediaItem[];
}

export const Phone: React.FC<PhoneProps> = ({
  phoneColor,
  phoneLayout,
  mediaSequence,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const camera = useThree((s) => s.camera);

  // Camera setup
  useEffect(() => {
    camera.position.set(0, 0, CAMERA_DISTANCE);
    camera.fov = 38; // cinematic 35mm lens
    camera.near = 0.1;
    camera.far = 5000;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  }, [camera]);

  if (mediaSequence.length === 0) return null;

  // --- Media playback state ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [frameStart, setFrameStart] = useState(frame);

  const currentMedia = mediaSequence[currentIndex];

  // Canvas for image or video texture
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const [texture, setTexture] = useState<Texture | null>(null);
  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (currentMedia.type === "image") {
      const img = new Image();
      img.src = currentMedia.src;
      img.crossOrigin = "anonymous";
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const tex = new CanvasTexture(canvas);
        setTexture(tex);
      };
    } else if (currentMedia.type === "video") {
      videoRef.current.src = currentMedia.src;
      videoRef.current.crossOrigin = "anonymous";
      videoRef.current.loop = false;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});

      const tex = new CanvasTexture(canvas);
      setTexture(tex);

      const tick = () => {
        if (videoRef.current.readyState >= 2) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          tex.needsUpdate = true;
        }
        requestAnimationFrame(tick);
      };
      tick();
    }
  }, [currentMedia]);

  // --- Media switching ---
  useEffect(() => {
    const duration = currentMedia.type === "image" ? fps * 5 : videoRef.current.duration * fps || fps * 5;

    const id = setInterval(() => {
      if (frame - frameStart >= duration) {
        setCurrentIndex((i) => (i + 1) % mediaSequence.length);
        setFrameStart(frame);
      }
    }, 1000 / fps);

    return () => clearInterval(id);
  }, [frame, frameStart, currentMedia, mediaSequence, fps]);

  // --- Smooth camera motion ---
  useFrame(() => {
    const t = (frame - frameStart) / fps / 2; // slower motion
    const targetZ = currentMedia.type === "image" ? 5 : 6;
    camera.position.lerp(new Vector3(0, 0, targetZ), 0.05);
    camera.lookAt(0, 0, 0);
  });

  // --- Screen geometry ---
  const screenGeometry = useMemo(() => {
    return roundedRect({
      width: phoneLayout.screen.width,
      height: phoneLayout.screen.height,
      radius: phoneLayout.screen.radius,
    });
  }, [phoneLayout.screen.width, phoneLayout.screen.height, phoneLayout.screen.radius]);

  return (
    <group scale={[1, 1, 1]}>
      {/* Phone body */}
      <RoundedBox
        radius={phoneLayout.phone.radius}
        depth={phoneLayout.phone.thickness}
        curveSegments={PHONE_CURVE_SEGMENTS}
        position={phoneLayout.phone.position}
        width={phoneLayout.phone.width}
        height={phoneLayout.phone.height}
      >
        <meshPhongMaterial color={phoneColor} shininess={PHONE_SHININESS} />
      </RoundedBox>

      {/* Phone screen */}
      {texture && (
        <mesh position={phoneLayout.screen.position}>
          <shapeGeometry args={[screenGeometry]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};
