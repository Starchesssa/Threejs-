
import React from 'react';
import {
  AbsoluteFill,
  Video,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  staticFile,
} from 'remotion';

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const t = frame / fps;
  const duration = durationInFrames / fps;
  const ease = Easing.inOut(Easing.cubic);

  const p = interpolate(t, [0, duration], [0, 1], { easing: ease });

  /* 🌥 CLOUDS — BACKGROUND */
  const cloudScale = interpolate(p, [0, 0.4], [3.5, 1.6]);
  const cloudY = interpolate(p, [0, 0.4], [0, -600]);

  /* 🏠 HOUSE — MIDGROUND */
  const houseScale = interpolate(p, [0.25, 0.75], [3.0, 0.9]);
  const houseY = interpolate(p, [0.25, 0.75], [900, 220]);

  /* 👤 PERSON — FOREGROUND */
  const personScale = interpolate(p, [0.55, 1], [3.8, 0.55]);
  const personY = interpolate(p, [0.55, 1], [1200, 420]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'black',
        overflow: 'hidden',
      }}
    >
      {/* 🌥 CLOUDS (BACKGROUND) */}
      <AbsoluteFill
        style={{
          transform: `
            translateY(${cloudY}px)
            scale(${cloudScale})
          `,
        }}
      >
        <Video src={staticFile('Cloud.mp4')} />
      </AbsoluteFill>

      {/* 🏠 HOUSE (OVER CLOUDS) */}
      <AbsoluteFill
        style={{
          transform: `
            translateY(${houseY}px)
            scale(${houseScale})
          `,
        }}
      >
        <Img src={staticFile('House.png')} />
      </AbsoluteFill>

      {/* 👤 PERSON (OVER HOUSE) */}
      <AbsoluteFill
        style={{
          transform: `
            translateY(${personY}px)
            scale(${personScale})
          `,
        }}
      >
        <Img src={staticFile('P10.png')} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default Scene;
