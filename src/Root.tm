
import React from "react";
import { Composition } from "remotion";
import { Scene } from "./Scene";
import { MEDIA_SEQUENCE } from "./media-sequence";
import { getMediaMetadata } from "./helpers/get-media-metadata";
import { FPS, IMAGE_SECONDS } from "./timing";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Scene"
      component={Scene}
      fps={FPS}
      width={1280}
      height={720}
      calculateMetadata={async () => {
        let totalFrames = 0;
        const videoFrameMap: Record<string, number> = {};

        for (const item of MEDIA_SEQUENCE) {
          if (item.type === "image") {
            totalFrames += IMAGE_SECONDS * FPS;
          } else {
            // ✅ PASS URL DIRECTLY (NO staticFile)
            const meta = await getMediaMetadata(item.src);
            const frames = Math.floor(meta.durationInSeconds * FPS);
            videoFrameMap[item.src] = frames;
            totalFrames += frames;
          }
        }

        return {
          durationInFrames: totalFrames,
          props: {
            mediaSequence: MEDIA_SEQUENCE,
            videoFrameMap,
          },
        };
      }}
    />
  );
};
