
import { useThree } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
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
}> = ({ phoneColor, phoneLayout, mediaMetadata, videoSrc }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const camera = useThree((state) => state.camera);
  const { invalidate } = useThree();

  /**
   * Initial camera setup
   */
  useEffect(() => {
    camera.near = 0.2;
    camera.far = Math.max(5000, CAMERA_DISTANCE * 2);
    camera.position.set(0, 0, CAMERA_DISTANCE + 4);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  /**
   * Camera animation (instead of object animation)
   */
  useEffect(() => {
    // Constant orbit rotation
    const constantRotation = interpolate(
      frame,
      [0, durationInFrames],
      [0, Math.PI * 6]
    );

    // Entrance spring
    const entrance = spring({
      frame,
      fps,
      config: {
        damping: 200,
        mass: 3,
      },
    });

    const entranceRotation = interpolate(
      entrance,
      [0, 1],
      [-Math.PI, Math.PI]
    );

    const rotateY = entranceRotation + constantRotation;

    // Zoom animation
    const distance = interpolate(
      entrance,
      [0, 1],
      [CAMERA_DISTANCE + 4, CAMERA_DISTANCE]
    );

    camera.position.x = Math.sin(rotateY) * distance;
    camera.position.z = Math.cos(rotateY) * distance;

    // Vertical entrance movement
    camera.position.y = interpolate(entrance, [0, 1], [-4, 0]);

    camera.lookAt(0, 0, 0);

    invalidate();
  }, [camera, frame, fps, durationInFrames, invalidate]);

  /**
   * Screen geometry
   */
  const screenGeometry = useMemo(() => {
    return roundedRect({
      width: phoneLayout.screen.width,
      height: phoneLayout.screen.height,
      radius: phoneLayout.screen.radius,
    });
  }, [
    phoneLayout.screen.width,
    phoneLayout.screen.height,
    phoneLayout.screen.radius,
  ]);

  /**
   * Canvas video texture
   */
  const [canvas] = useState(
    () =>
      new OffscreenCanvas(
        mediaMetadata.dimensions.width,
        mediaMetadata.dimensions.height
      )
  );

  const [context] = useState(() => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }
    return ctx;
  });

  const [texture] = useState<Texture>(() => {
    const tex = new CanvasTexture(canvas);
    tex.repeat.x = 1 / phoneLayout.screen.width;
    tex.repeat.y = 1 / phoneLayout.screen.height;
    return tex;
  });

  const onVideoFrame = useCallback(
    (frame: CanvasImageSource) => {
      context.drawImage(frame, 0, 0);
      texture.needsUpdate = true;
      invalidate();
    },
    [context, texture, invalidate]
  );

  /**
   * Render
   */
  return (
    <>
      <Video src={videoSrc} onVideoFrame={onVideoFrame} headless muted />

      {/* Phone Body */}
      <RoundedBox
        radius={phoneLayout.phone.radius}
        depth={phoneLayout.phone.thickness}
        curveSegments={PHONE_CURVE_SEGMENTS}
        position={phoneLayout.phone.position}
        width={phoneLayout.phone.width}
        height={phoneLayout.phone.height}
      >
        <meshPhongMaterial
          color={phoneColor}
          shininess={PHONE_SHININESS}
        />
      </RoundedBox>

      {/* Screen */}
      <mesh position={phoneLayout.screen.position}>
        <shapeGeometry args={[screenGeometry]} />
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
          color={0xffffff}
        />
      </mesh>
    </>
  );
};
