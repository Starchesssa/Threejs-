
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

  /* ================= CAMERA (FAKE BUT REAL) ================= */

  // Dolly (forward / backward)
  const cameraDepth = interpolate(
    progress,
    [0, 0.5, 1],
    [-4600, -2200, -600],
    { easing: ease }
  );

  // Pan (left / right)
  const cameraX = interpolate(progress, [0, 1], [0, -120], { easing: ease });

  // Tilt (up / down)
  const cameraY = interpolate(progress, [0, 1], [0, -260], { easing: ease });

  // Look up / down
  const cameraRotateX = interpolate(progress, [0, 1], [0, -6], {
    easing: ease,
  });

  // Look left / right
  const cameraRotateY = interpolate(progress, [0, 1], [0, 3], {
    easing: ease,
  });

  // Inversion trick (world moves instead of camera)
  const cameraZ = -cameraDepth;

  /* ================= LAYERS ================= */

  const BG = { Z: -3000, X: 0, Y: 0, SCALE: 3.6, DEPTH: 0.2 };
  const MG = { Z: -1800, X: 0, Y: 240, SCALE: 1.7, DEPTH: 0.6 };
  const FG = { Z: -900, X: 0, Y: 460, SCALE: 0.5, DEPTH: 1.0 };

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
          transform: `
            translateX(${cameraX}px)
            translateY(${cameraY}px)
            translateZ(${cameraZ}px)
            rotateX(${cameraRotateX}deg)
            rotateY(${cameraRotateY}deg)
          `,
        }}
      >
        {/* 🌄 BACKGROUND */}
        <AbsoluteFill
          style={{
            transform: `
              translateX(${BG.X + cameraX * BG.DEPTH}px)
              translateY(${BG.Y + cameraY * BG.DEPTH}px)
              translateZ(${BG.Z}px)
              scale(${BG.SCALE})
            `,
          }}
        >
          <Video
            src={staticFile('Cloud.mp4')}
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>

        {/* 🏠 MIDGROUND */}
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            transform: `
              translateX(${MG.X + cameraX * MG.DEPTH}px)
              translateY(${MG.Y + cameraY * MG.DEPTH}px)
              translateZ(${MG.Z}px)
              scale(${MG.SCALE})
            `,
          }}
        >
          <Img src={staticFile('House.png')} />
        </AbsoluteFill>

        {/* 👤 FOREGROUND */}
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            transform: `
              translateX(${FG.X + cameraX * FG.DEPTH}px)
              translateY(${FG.Y + cameraY * FG.DEPTH}px)
              translateZ(${FG.Z}px)
              scale(${FG.SCALE})
            `,
          }}
        >
          <Img src={staticFile('P10.png')} />
        </AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};

export default Scene;
