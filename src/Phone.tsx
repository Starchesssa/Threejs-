import { useFrame, useThree } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { CanvasTexture, Spherical } from "three";
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
   * Camera initial setup (once)
   */
  useEffect(() => {
    camera.near = 0.1;
    camera.far = 5000;
    camera.position.set(0, 0, CAMERA_DISTANCE + 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  /**
   * CAMERA ANIMATION (THIS IS THE KEY)
   */
  useFrame(() => {
    const entrance = spring({
      frame,
      fps,
      config: { damping: 180, mass: 3 },
    });

    const theta = interpolate(
      frame,
      [0, durationInFrames],
      [0, Math.PI * 2]
    );

    const phi = interpolate(
      entrance,
      [0, 1],
      [Math.PI / 2.2, Math.PI / 2.05]
    );

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
  const screenGeometry = useMemo(
    () =>
      roundedRect({
        width: phoneLayout.screen.width,
        height: phoneLayout.screen.height,
        radius: phoneLayout.screen.radius,
      }),
    [phoneLayout]
  );

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

  const ctx = canvas.getContext("2d")!;
  const [texture] = useState(() => new CanvasTexture(canvas));

  const onVideoFrame = useCallback(
    (frame: CanvasImageSource) => {
      ctx.drawImage(frame, 0, 0);
      texture.needsUpdate = true;
    },
    [ctx, texture]
  );

  /**
   * PHONE — NO TRANSFORMS
   */
  return (
    <>
      <Video src={videoSrc} onVideoFrame={onVideoFrame} muted />

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
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </>
  );
};

