
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

  /* ---------------- CLOUDS (TOP MATTE) ---------------- */
  const cloudScale = interpolate(p, [0, 0.5], [3.2, 1.6]);
  const cloudY = interpolate(p, [0, 0.5], [0, -700]);

  /* ---------------- HOUSE (SECOND MATTE) ---------------- */
  const houseScale = interpolate(p, [0.3, 0.8], [3.0, 0.9]);
  const houseY = interpolate(p, [0.3, 0.8], [800, 200]);

  /* ---------------- PERSON (FINAL REVEAL) ---------------- */
  const personScale = interpolate(p, [0.6, 1], [3.5, 0.55]);
  const personY = interpolate(p, [0.6, 1], [1100, 420]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'black',
        overflow: 'hidden',
      }}
    >
      {/* 👤 PERSON (DEEPEST) */}
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

      {/* 🏠 HOUSE (MIDDLE MASK) */}
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

      {/* 🌥 CLOUDS (TOP MASK — ALWAYS ON TOP) */}
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
    </AbsoluteFill>
  );
};

export default Scene;
