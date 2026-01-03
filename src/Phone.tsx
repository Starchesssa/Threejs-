
import { useFrame, useThree } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
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
}> = ({ phoneColor, phoneLayout, mediaMetadata }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const camera = useThree((s) => s.camera);

  /* CAMERA ANIMATION */
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

    const radius = interpolate(
      entrance,
      [0, 1],
      [CAMERA_DISTANCE + 6, CAMERA_DISTANCE]
    );

    const spherical = new Spherical(
      radius,
      Math.PI / 2.1,
      theta
    );

    camera.position.setFromSpherical(spherical);
    camera.lookAt(0, 0, 0);
  });

  /* SCREEN GEOMETRY */
  const screenGeometry = useMemo(
    () =>
      roundedRect({
        width: phoneLayout.screen.width,
        height: phoneLayout.screen.height,
        radius: phoneLayout.screen.radius,
      }),
    [phoneLayout]
  );

  /* VIDEO TEXTURE */
  const [canvas] = useState(
    () =>
      new OffscreenCanvas(
        mediaMetadata.dimensions.width,
        mediaMetadata.dimensions.height
      )
  );

  const ctx = canvas.getContext("2d")!;
  const [texture] = useState(() => new CanvasTexture(canvas));

  /* NOTE:
     The video frame drawing must be wired from Scene.tsx
     or via a shared hook – DOM → THREE boundary
  */

  return (
    <>
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
