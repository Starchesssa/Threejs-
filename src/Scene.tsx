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

  // Normalized progress (0 → 1)
  const progress = frame / durationInFrames;

  // Smooth cinematic motion
  const eased = interpolate(
    progress,
    [0, 1],
    [0, 1],
    { easing: Easing.inOut(Easing.cubic) }
  );

  /* ================= CAMERA ================= */

  // CAMERA Z
  // MIN: 0        → camera close
  // MAX: -1200    → camera pulled back (safe)
  const cameraZ = interpolate(
    eased,
    [0, 1],
    [0, -1200]
  );

  /* ================= FIXED WORLD POSITIONS ================= */

  /* ☁️ CLOUDS (BACKGROUND) */
  // Z MIN: -1800  (far)
  // Z MAX: -3000  (very far)
  const CLOUD_Z = -2200;

  // SCALE MIN: 1.8  → fills screen
  // SCALE MAX: 3.0  → infinite sky illusion
  const CLOUD_SCALE = 2.4;

  /* 🏠 HOUSE (MIDGROUND) */
  // Z MIN: -700
  // Z MAX: -1400
  const HOUSE_Z = -900;

  // Y MIN: 100   → higher
  // Y MAX: 400   → grounded
  const HOUSE_Y = 220;

  // SCALE MIN: 0.9
  // SCALE MAX: 1.4
  const HOUSE_SCALE = 1.1;

  /* 👤 PERSON (FOREGROUND) */
  // Z MIN: -300
  // Z MAX: -700
  const PERSON_Z = -400;

  // Y MIN: 300
  // Y MAX: 600
  const PERSON_Y = 440;

  // SCALE MIN: 0.6
  // SCALE MAX: 1.6
  const PERSON_SCALE = 1.3;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        perspective: 1200, // 800–1600 SAFE
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

        {/* ☁️ CLOUDS — BACKGROUND */}
        <AbsoluteFill
          style={{
            transform: `
              translateZ(${CLOUD_Z}px)
              scale(${CLOUD_SCALE})
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
              translateY(${HOUSE_Y}px)
              translateZ(${HOUSE_Z}px)
              scale(${HOUSE_SCALE})
            `,
          }}
        >
          <Img src={staticFile('House.png')} />
        </AbsoluteFill>

        {/* 👤 PERSON — FOREGROUND */}
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            transform: `
              translateY(${PERSON_Y}px)
              translateZ(${PERSON_Z}px)
              scale(${PERSON_SCALE})
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
