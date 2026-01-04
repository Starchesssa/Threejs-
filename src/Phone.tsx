import { useThree } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Video,
} from "remotion";
import {
  CanvasTexture,
  SRGBColorSpace,
  Texture,
} from "three";
import { MEDIA, MediaItem } from "./media";

const IMAGE_DURATION_FRAMES = 90; // 3s @ 30fps (smooth)

export const Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const camera = useThree((s) => s.camera);

  /* ---------- CAMERA ---------- */
  useEffect(() => {
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  /* ---------- MEDIA TIMELINE ---------- */
  let current: MediaItem | null = null;
  let frameCursor = 0;
  let localFrame = frame;

  for (const item of MEDIA) {
    const duration =
      item.type === "image" ? IMAGE_DURATION_FRAMES : Infinity;

    if (localFrame < duration) {
      current = item;
      break;
    }
    localFrame -= duration;
    frameCursor += duration;
  }

  if (!current) current = MEDIA[0];

  /* ---------- CANVAS TEXTURE ---------- */
  const [canvas] = useState(() => new OffscreenCanvas(1080, 1920));
  const [ctx] = useState(() => {
    const c = canvas.getContext("2d");
    if (!c) throw new Error("No canvas context");
    return c;
  });

  const [texture] = useState<Texture>(() => {
    const t = new CanvasTexture(canvas);
    t.colorSpace = SRGBColorSpace;
    return t;
  });

  const { invalidate } = useThree();

  /* ---------- VIDEO FRAME ---------- */
  const onVideoFrame = useCallback(
    (img: CanvasImageSource) => {
      ctx.clearRect(0, 0, 1080, 1920);
      ctx.drawImage(img, 0, 0, 1080, 1920);
      texture.needsUpdate = true;
      invalidate();
    },
    [ctx, texture, invalidate]
  );

  /* ---------- IMAGE DRAW ---------- */
  useEffect(() => {
    if (current?.type !== "image") return;

    const img = new Image();
    img.src = current.src;
    img.onload = () => {
      ctx.clearRect(0, 0, 1080, 1920);
      ctx.drawImage(img, 0, 0, 1080, 1920);
      texture.needsUpdate = true;
      invalidate();
    };
  }, [current, ctx, texture, invalidate]);

  /* ---------- MOTION ---------- */
  const intro = spring({ frame, fps });
  const rotateY = interpolate(frame, [0, 300], [0, Math.PI * 0.4]);
  const floatY = Math.sin(frame / 20) * 0.12;

  return (
    <group
      scale={intro}
      rotation={[0, rotateY, 0]}
      position={[0, floatY, 0]}
    >
      {current.type === "video" && (
        <Video
          src={current.src}
          onVideoFrame={onVideoFrame}
          muted
          headless
        />
      )}

      <mesh>
        <planeGeometry args={[3.2, 6]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
};
