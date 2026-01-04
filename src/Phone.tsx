
import { useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useCurrentFrame, useVideoConfig, Video } from "remotion";
import { CanvasTexture, Texture, Vector3 } from "three";
import { interpolate, spring } from "remotion";
import { RoundedBox } from "./RoundedBox";
import { roundedRect } from "./helpers/rounded-rectangle";
import { PHONE_CURVE_SEGMENTS, PHONE_SHININESS, CAMERA_DISTANCE, PhoneLayout } from "./helpers/layout";

// Media type
export type MediaItem = { type: "image" | "video"; src: string };

// Props
interface PhoneProps {
  phoneColor: string;
  phoneLayout: PhoneLayout;
  mediaSequence: MediaItem[];
}

export const Phone: React.FC<PhoneProps> = ({ phoneColor, phoneLayout, mediaSequence }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const camera = useThree((s) => s.camera);

  // Set camera properties
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
  const [imageFrameStart, setImageFrameStart] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));

  const currentMedia = mediaSequence[currentIndex];

  // --- CanvasTexture for images ---
  const [canvasTexture, setCanvasTexture] = useState<CanvasTexture | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (currentMedia.type === "image") {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Cannot get canvas context");
      const img = new Image();
      img.src = currentMedia.src;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const tex = new CanvasTexture(canvas);
        setCanvasTexture(tex);
        setContext(ctx);
      };
    }
  }, [currentMedia]);

  // --- Media switching logic ---
  useEffect(() => {
    if (currentMedia.type === "video") {
      videoRef.current.src = currentMedia.src;
      videoRef.current.crossOrigin = "anonymous";
      videoRef.current.loop = false;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [currentMedia]);

  useEffect(() => {
    // Image duration: 5 seconds
    const imageDuration = fps * 5;

    let raf: number;

    const tick = () => {
      if (currentMedia.type === "image") {
        const nextFrame = frame - imageFrameStart;
        if (nextFrame >= imageDuration) {
          setCurrentIndex((i) => (i + 1) % mediaSequence.length);
          setImageFrameStart(frame);
        }
      } else if (currentMedia.type === "video") {
        if (videoRef.current.ended) {
          setCurrentIndex((i) => (i + 1) % mediaSequence.length);
          setImageFrameStart(frame);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [frame, currentMedia, mediaSequence, fps, imageFrameStart]);

  // --- Smooth camera motion ---
  useFrame(() => {
    const t = frame / 120; // slow interpolation factor
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
  }, [phoneLayout.screen.height, phoneLayout.screen.radius, phoneLayout.screen.width]);

  return (
    <group scale={[1, 1, 1]}>
      {/* Video */}
      {currentMedia.type === "video" && (
        <Video src={currentMedia.src} onVideoFrame={() => {}} headless muted />
      )}

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
      {currentMedia.type === "image" && canvasTexture && (
        <mesh position={phoneLayout.screen.position}>
          <shapeGeometry args={[screenGeometry]} />
          <meshBasicMaterial map={canvasTexture} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};
