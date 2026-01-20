
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

  /* ================= CAMERA (ONLY Z ANIMATION) ================= */
  // Camera moves forward/backward (dolly)
  const cameraDepth = interpolate(
    progress,
    [0, 0.5, 1],          // progress points: start, mid, end
    [-4600, -2200, -600], // camera Z positions (min/max)
    { easing: ease }
  );

  // Invert for CSS trick: move world instead of camera
  const cameraZ = -cameraDepth;

  /* ================= LAYER POSITIONS ================= */
  // Each layer has X (horizontal), Y (vertical), Z (depth)
  // DEPTH_FACTOR = how much it responds to cameraZ (parallax)
  
  const BG = { X: 0, Y: 0, Z: -3000, SCALE: 3.6, DEPTH: 0.2 };  // Background
  const MG = { X: 0, Y: 240, Z: -1800, SCALE: 1.7, DEPTH: 0.6 }; // Midground
  const FG = { X: 0, Y: 460, Z: -900, SCALE: 0.5, DEPTH: 1.0 };  // Foreground

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        perspective: 1400, // affects 3D depth feel
        overflow: 'hidden',
      }}
    >
      {/* ================= CAMERA RIG ================= */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `translateZ(${cameraZ}px)`, // cameraZ only
        }}
      >
        {/* 🌄 BACKGROUND */}
        <AbsoluteFill
          style={{
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
              translateX(${MG.X}px)
              translateY(${MG.Y}px)
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
              translateX(${FG.X}px)
              translateY(${FG.Y}px)
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
