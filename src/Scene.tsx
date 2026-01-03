
import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Phone } from "./Phone";
import { Video } from "@remotion/media";
import { MediabunnyMetadata } from "./helpers/get-media-metadata";
import { getPhoneLayout } from "./helpers/layout";

export const Scene: React.FC<{
  baseScale: number;
  phoneColor: string;
  mediaMetadata: MediabunnyMetadata;
  videoSrc: string;
}> = ({ baseScale, phoneColor, mediaMetadata, videoSrc }) => {
  const { width, height } = useVideoConfig();

  const aspectRatio = useMemo(
    () =>
      mediaMetadata.dimensions.width /
      mediaMetadata.dimensions.height,
    [mediaMetadata]
  );

  const layout = useMemo(
    () => getPhoneLayout(aspectRatio, baseScale),
    [aspectRatio, baseScale]
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "white" }}>
      {/* ✅ DOM VIDEO (NOT INSIDE THREE) */}
      <Video
        src={videoSrc}
        style={{ display: "none" }}
      />

      {/* ✅ THREE SCENE */}
      <ThreeCanvas
        width={width}
        height={height}
        frameloop="always"
        linear
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />

        <Phone
          phoneColor={phoneColor}
          phoneLayout={layout}
          mediaMetadata={mediaMetadata}
          videoSrc={videoSrc}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
