
import { useThree } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { CanvasTexture, Texture } from "three";
import {
  CAMERA_DISTANCE,
  PHONE_CURVE_SEGMENTS,
  PHONE_SHININESS,
  PhoneLayout,
} from "./helpers/layout";
import { roundedRect } from "./helpers/rounded-rectangle";
import { RoundedBox } from "./RoundedBox";
import { MediabunnyMetadata } from "./helpers/get-media-metadata";

export const Phone: React.FC<{
  readonly phoneColor: string;
  readonly phoneLayout: PhoneLayout;
  readonly mediaMetadata: MediabunnyMetadata;
  readonly videoSrc: string;
  readonly zOffset?: number;
}> = ({
  phoneColor,
  phoneLayout,
  mediaMetadata,
  videoSrc,
  zOffset = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // CAMERA (AE-style: mostly static, cinematic)
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    camera.position.set(0, 0, CAMERA_DISTANCE);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // CONSTANT ROTATION (parallax)
  const constantRotation = interpolate(
    frame,
    [0, durationInFrames],
    [0, Math.PI * 2],
  );

  // ENTRANCE EASE (AE spring)
  const entrance = spring({
    frame,
    fps,
    config: { damping: 200, mass: 3 },
  });

  // POSITION
  const translateY = interpolate(entrance, [0, 1], [-2, 0]);

  // Z FLY-THROUGH (THIS IS THE MAGIC)
  const translateZ = interpolate(
    frame,
    [0, durationInFrames],
    [4 + zOffset, -6 + zOffset],
  );

  // ROTATION
  const rotateY = constantRotation;

  // SCREEN GEOMETRY
  const screenGeometry = useMemo(
    () =>
      roundedRect({
        width: phoneLayout.screen.width,
        height: phoneLayout.screen.height,
        radius: phoneLayout.screen.radius,
      }),
    [
      phoneLayout.screen.width,
      phoneLayout.screen.height,
      phoneLayout.screen.radius,
    ],
  );

  // VIDEO TEXTURE
  const [canvas] = useState(
    () =>
      new OffscreenCanvas(
        mediaMetadata.dimensions.width,
        mediaMetadata.dimensions.height,
      ),
  );

  const [ctx] = useState(() => {
    const c = canvas.getContext("2d");
    if (!c) throw new Error("No canvas context");
    return c;
  });

  const [texture] = useState<Texture>(() => new CanvasTexture(canvas));
  const { invalidate } = useThree();

  const onVideoFrame = useCallback(
    (frame: CanvasImageSource) => {
      ctx.drawImage(frame, 0, 0);
      texture.needsUpdate = true;
      invalidate();
    },
    [ctx, texture, invalidate],
  );

  return (
    <group
      scale={entrance}
      rotation={[0, rotateY, 0]}
      position={[0, translateY, translateZ]}
    >
      <Video src={videoSrc} onVideoFrame={onVideoFrame} headless muted />

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

      <mesh position={phoneLayout.screen.position}>
        <shapeGeometry args={[screenGeometry]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
};
