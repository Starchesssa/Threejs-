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
  const { durationInFrames } = useVideoConfig();

  /* ================= TIME ================= */
  const progress = frame / durationInFrames;
  const ease = Easing.inOut(Easing.cubic);

  /* ================= STAGED REVEAL ================= */
  // Clouds appear first
  const cloudP = interpolate(progress, [0, 0.6], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  // House appears second
  const houseP = interpolate(progress, [0.35, 0.8], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Person appears last
  const personP = interpolate(progress, [0.7, 1], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
  });

  /* ================= CLOUDS (BACKGROUND) ================= */
  const cloudScale = interpolate(cloudP, [0, 1], [2.6, 1.2]);
  const cloudY = interpolate(cloudP, [0, 1], [-350, 0]);

  /* ================= HOUSE (MIDGROUND) ================= */
  const houseScale = interpolate(houseP, [0, 1], [3.5, 1.0]);
  const houseY = interpolate(houseP, [0, 1], [900, 200]);

  /* ================= PERSON (FOREGROUND) ================= */
  const personScale = interpolate(personP, [0, 1], [7.5, 0.75]);
  const personY = interpolate(personP, [0, 1], [1200, 420]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      
      {/* 🌥 CLOUDS — BACKGROUND */}
      <AbsoluteFill
        style={{
          transform: `
            translateY(${cloudY}px)
            scale(${cloudScale})
          `,
        }}
      >
        <Video
          src={staticFile('Cloud.mp4')}
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AbsoluteFill>

      {/* 🏠 HOUSE — MIDGROUND */}
      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          transform: `
            translateY(${houseY}px)
            scale(${houseScale})
          `,
        }}
      >
        <Img
          src={staticFile('House.png')}
          style={{
            width: '100%',        // Fills 16:9 width
            maxWidth: '100%',
            objectFit: 'contain',
          }}
        />
      </AbsoluteFill>

      {/* 👤 PERSON — FOREGROUND */}
      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          transform: `
            translateY(${personY}px)
            scale(${personScale})
          `,
        }}
      >
        <Img
          src={staticFile('P10.png')}
          style={{
            height: '85%',        // Natural human framing
            objectFit: 'contain',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default Scene;
