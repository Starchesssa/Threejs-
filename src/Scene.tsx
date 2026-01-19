
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

  /* ================= CAMERA DEPTH (REAL) ================= */
  // This is where the CAMERA IS in the world
  const cameraDepth = interpolate(
    progress,
    [0, 0.5, 1],
    [
      -4600, // Phase 1: behind BG
      -2200, // Phase 2: between MG & FG
      -600,  // Phase 3: in front of FG
    ],
    { easing: ease }
  );

  /**
   * CSS DOES NOT MOVE CAMERA
   * We INVERT to move the world instead
   */
  const cameraZ = -cameraDepth;

  /* ================= LAYERS ================= */

  // Background
  const BG_Z = -3000;
  const BG_SCALE = 3.6;

  // Midground
  const MG_Z = -1800;
  const MG_Y = 240;
  const MG_SCALE = 1.7;

  // Foreground
  const FG_Z = -900;
  const FG_Y = 460;
  const FG_SCALE = 0.5;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        perspective: 1400,
        overflow: 'hidden',
      }}
    >
      {/* CAMERA RIG */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `translateZ(${cameraZ}px)`,
        }}
      >
        {/* 🌄 BACKGROUND */}
        <AbsoluteFill
          style={{
            transform: `
              translateZ(${BG_Z}px)
              scale(${BG_SCALE})
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
              translateY(${MG_Y}px)
              translateZ(${MG_Z}px)
              scale(${MG_SCALE})
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
              translateY(${FG_Y}px)
              translateZ(${FG_Z}px)
              scale(${FG_SCALE})
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
