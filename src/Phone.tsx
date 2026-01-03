
import { useFrame, useThree } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { CanvasTexture, Texture, Spherical, Vector3 } from "three";
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
  phoneColor: string;
  phoneLayout: PhoneLayout;
  mediaMetadata: MediabunnyMetadata;
  videoSrc: string;
}> = ({ phoneColor, phoneLayout, mediaMetadata, videoSrc }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const camera = useThree((s) => s.camera);

  /**
   * Camera setup (once)
   */
  useEffect(() => {
    camera.near = 0.2;
    camera.far = 5000;
    camera.position.set(0, 0, CAMERA_DISTANCE + 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  /**
   * TRUE camera animation (ONLY camera moves)
   */
  useFrame(() => {
    const entrance = spring({
      frame,
      fps,
      config: {
        damping: 200,
        mass: 3,
      },
    });

    // Horizontal orbit
    const theta = interpolate(
      frame,
      [0, durationInFrames],
      [Math.PI * 0.25, Math.PI * 6.25]
    );

    // Subtle vertical tilt
    const phi = interpolate(
      entrance,
      [0, 1],
      [Math.PI / 2.2, Math.PI / 2.05]
    );

    // Dolly in
    const radius = interpolate(
      entrance,
      [0, 1],
      [CAMERA_DISTANCE + 6, CAMERA_DISTANCE]
    );

    const spherical = new Spherical(radius, phi, theta);
    camera.position.setFromSpherical(spherical);
    camera.lookAt(0, 0, 0);
  });

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
   * Video texture
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
    if (!ctx) throw new Error("No 2D context");
    return ctx;
  });

  const [texture] = useState<Texture>(() => {
    const tex = new CanvasTexture(canvas);
    tex.repeat.set(
      1 / phoneLayout.screen.width,
      1 / phoneLayout.screen.height
    );
    return tex;
  });

  const { invalidate } = useThree();

  const onVideoFrame = useCallback(
    (frame: CanvasImageSource) => {
      context.drawImage(frame, 0, 0);
      texture.needsUpdate = true;
      invalidate();
    },
    [context, texture, invalidate]
  );

  /**
   * RENDER (PHONE IS STATIC)
   */
  return (
    <>
      <Video src={videoSrc} onVideoFrame={onVideoFrame} headless muted />

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

      <mesh position={phoneLayout.screen.position}>
        <shapeGeometry args={[screenGeometry]} />
        <meshBasicMaterial
          color={0xffffff}
          toneMapped={false}
          map={texture}
        />
      </mesh>
    </>
  );
};
