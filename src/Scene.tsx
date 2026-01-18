
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

  /* ================= TIME ================= */
  const p = frame / durationInFrames;
  const ease = Easing.inOut(Easing.cubic);
  const progress = interpolate(p, [0, 1], [0, 1], { easing: ease });

  /* ================= CLOUDS ================= */
  const cloudScale = interpolate(progress, [0, 1], [2.4, 1.2]);
  const cloudY = interpolate(progress, [0, 1], [-300, 0]);

  /* ================= HOUSE ================= */
  const houseScale = interpolate(progress, [0, 1], [3.2, 1.0]);
  const houseY = interpolate(progress, [0, 1], [400, 80]);

  /* ================= PERSON ================= */
  const personScale = interpolate(progress, [0, 1], [6.5, 0.75]);
  const personY = interpolate(progress, [0, 1], [700, 260]);

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
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* 🏠 HOUSE — FULL WIDTH, CENTERED */}
      <AbsoluteFill>
        <Img
          src={staticFile('House.png')}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '100%',          // 🔥 fills 16:9
            height: 'auto',
            transform: `
              translate(-50%, -50%)
              translateY(${houseY}px)
              scale(${houseScale})
            `,
          }}
        />
      </AbsoluteFill>

      {/* 👤 PERSON — CENTERED FOREGROUND */}
      <AbsoluteFill>
        <Img
          src={staticFile('P10.png')}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            height: '85vh',
            width: 'auto',
            transform: `
              translate(-50%, -50%)
              translateY(${personY}px)
              scale(${personScale})
            `,
          }}
        />
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

export default Scene;
