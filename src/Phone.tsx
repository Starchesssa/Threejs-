import { useThree } from "@react-three/fiber";
import React, { useCallback, useMemo, useState } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { CanvasTexture, Texture } from "three";
import {
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
  const { fps } = useVideoConfig();
  const { invalidate } = useThree();

  /* -------------------------------------------------- */
  /* ENTRANCE (AE Easy Ease / Spring)                    */
  /* -------------------------------------------------- */

  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 160,
      mass: 2.5,
    },
  });

  /* -------------------------------------------------- */
  /* POSITION (Subtle, cinematic)                        */
  /* -------------------------------------------------- */

  const translateY = interpolate(entrance, [0, 1], [-1.2, 0]);

  const translateZ = interpolate(
    entrance,
    [0, 1],
    [2 + zOffset, zOffset]
  );

  /* -------------------------------------------------- */
  /* ROTATION (Very subtle – AE realism)                 */
  /* -------------------------------------------------- */

  const rotateY = interpolate(
    frame,
    [0, 200],
    [-0.12, 0.12],
    {
      extrapolateRight: "clamp",
    }
  );

  const rotateX = interpolate(
    frame,
    [0, 200],
    [0.05, 0],
    {
      extrapolateRight: "clamp",
    }
  );

  /* -------------------------------------------------- */
  /* SCREEN GEOMETRY                                    */
  /* -------------------------------------------------- */

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
    ]
  );

  /* -------------------------------------------------- */
  /* VIDEO TEXTURE (AE Video Layer Equivalent)           */
  /* -------------------------------------------------- */

  const [canvas] = useState(
    () =>
      new OffscreenCanvas(
        mediaMetadata.dimensions.width,
        mediaMetadata.dimensions.height
      )
  );

  const [ctx] = useState(() => {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas context not available");
    return context;
  });

  const [texture] = useState<Texture>(() => new CanvasTexture(canvas));

  const onVideoFrame = useCallback(
    (frame: CanvasImageSource) => {
      ctx.drawImage(frame, 0, 0);
      texture.needsUpdate = true;
      invalidate();
    },
    [ctx, texture, invalidate]
  );

  /* -------------------------------------------------- */
  /* RENDER                                             */
  /* -------------------------------------------------- */

  return (
    <group
      scale={entrance}
      position={[0, translateY, translateZ]}
      rotation={[rotateX, rotateY, 0]}
    >
      {/* Video layer (offscreen → texture) */}
      <Video
        src={videoSrc}
        onVideoFrame={onVideoFrame}
        headless
        muted
      />

      {/* Phone body */}
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
        />
      </mesh>
    </group>
  );
};
