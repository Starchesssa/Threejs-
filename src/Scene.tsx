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

  /* ================= CAMERA (Z ONLY) ================= */
  const cameraDepth = interpolate(
    progress,
    [0, 0.5, 1],
    [-4600, -2200, -600],
    { easing: ease }
  );

  // Move world instead of camera
  const cameraZ = -cameraDepth;

  /* ================= LAYERS ================= */
  // X → horizontal
  // Y → vertical
  // Z → depth

  const BG = { X: 0, Y: 0, Z: -3000, SCALE: 3.6 };
  const MG = { X: 0, Y: 200, Z: -1800, SCALE: 2.7 };
  const FG = { X: 0, Y: 380, Z: -900, SCALE: 0.5 };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        perspective: 1400,
        overflow: 'hidden',
      }}
    >
      {/* ================= CAMERA RIG ================= */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `translateZ(${cameraZ}px)`,
        }}
      >
        {/* 🌄 BACKGROUND (VIDEO) */}
        <AbsoluteFill
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 50%',
            transform: `
              translateX(${BG.X}px)
              translateY(${BG.Y}px)
              translateZ(${BG.Z}px)
              scale(${BG.SCALE})
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

        {/* 🏠 MIDGROUND (HOUSE) */}
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            transformStyle: 'preserve-3d',
            transformOrigin: '50% 50%',
            transform: `
              translateX(${MG.X}px)
              translateY(${MG.Y}px)
              translateZ(${MG.Z}px)
              scale(${MG.SCALE})
            `,
          }}
        >
          <Img
            src={staticFile('img/House2.png')}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </AbsoluteFill>

        {/* 👤 FOREGROUND (PERSON) */}
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            transformStyle: 'preserve-3d',
            transformOrigin: '50% 50%',
            transform: `
              translateX(${FG.X}px)
              translateY(${FG.Y}px)
              translateZ(${FG.Z}px)
              scale(${FG.SCALE})
            `,
          }}
        >
          <Img
            src={staticFile('P10.png')}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};

export default Scene;
