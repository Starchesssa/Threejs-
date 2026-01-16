
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

  /* ---------------- PROGRESS ---------------- */
  const p = interpolate(t, [0, duration], [0, 1], {
    easing: ease,
  });

  /* ---------------- CLOUDS (INFINITE SKY) ---------------- */
  const cloudScale = interpolate(p, [0, 0.5], [3.2, 1.6]);
  const cloudY = interpolate(p, [0, 0.5], [-300, 0]);

  /* ---------------- HOUSE (MIDGROUND REVEAL) ---------------- */
  const houseReveal = interpolate(p, [0.25, 0.75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const houseScale = interpolate(houseReveal, [0, 1], [2.8, 0.9]);
  const houseY = interpolate(houseReveal, [0, 1], [600, 200]);

  /* ---------------- PERSON (FOREGROUND REVEAL) ---------------- */
  const personReveal = interpolate(p, [0.5, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const personScale = interpolate(personReveal, [0, 1], [3.5, 0.55]);
  const personY = interpolate(personReveal, [0, 1], [900, 420]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'black',
        perspective: 1200,
        overflow: 'hidden',
      }}
    >
      {/* 🌥 CLOUDS — ALWAYS BACKGROUND */}
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

      {/* 🏠 HOUSE — REVEALED BY CLOUD DIMINISH */}
      <AbsoluteFill
        style={{
          opacity: houseReveal,
          transform: `
            translateY(${houseY}px)
            scale(${houseScale})
          `,
        }}
      >
        <Img src={staticFile('House.png')} />
      </AbsoluteFill>

      {/* 👤 PERSON — REVEALED BY HOUSE DIMINISH */}
      <AbsoluteFill
        style={{
          opacity: personReveal,
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
