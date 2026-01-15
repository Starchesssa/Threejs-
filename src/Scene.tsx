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
  const { fps } = useVideoConfig();

  // ⏱ time in seconds
  const t = frame / fps;

  const ease = Easing.inOut(Easing.cubic);

  /* ---------------- BACKGROUND (CLOUDS) ---------------- */
  // already visible, slow zoom-in
  const bgScale = interpolate(
    t,
    [0, 12],
    [1.4, 1.1],
    { easing: ease }
  );

  /* ---------------- MIDGROUND (HOUSE) ---------------- */
  // appears later, comes from bottom big → up smaller
  const mgY = interpolate(
    t,
    [3, 8],
    [900, 520],
    { easing: ease }
  );

  const mgScale = interpolate(
    t,
    [3, 8],
    [1.8, 1.05],
    { easing: ease }
  );

  /* ---------------- FOREGROUND (PERSON) ---------------- */
  // appears last, even bigger, more depth
  const fgY = interpolate(
    t,
    [7, 12],
    [1200, 420],
    { easing: ease }
  );

  const fgScale = interpolate(
    t,
    [7, 12],
    [2.6, 1.0],
    { easing: ease }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', perspective: 1000 }}>

      {/* 🌥 BACKGROUND */}
      <AbsoluteFill
        style={{
          transform: `
            scale(${bgScale})
            translateZ(-800px)
          `,
        }}
      >
        <Video src={staticFile('Cloud.mp4')} />
      </AbsoluteFill>

      {/* 🏠 MIDGROUND */}
      <AbsoluteFill
        style={{
          transform: `
            translateY(${mgY}px)
            scale(${mgScale})
            translateZ(-300px)
          `,
        }}
      >
        <Img src={staticFile('House.png')} />
      </AbsoluteFill>

      {/* 👤 FOREGROUND */}
      <AbsoluteFill
        style={{
          transform: `
            translateY(${fgY}px)
            scale(${fgScale})
            translateZ(-80px)
          `,
        }}
      >
        <Img src={staticFile('P10.png')} />
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

export default Scene;
