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

  /* ======================================================
     TIME
     ====================================================== */

  // 0 → 1 for entire video
  const progress = frame / durationInFrames;

  // Smooth cinematic curve
  const eased = interpolate(progress, [0, 1], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
  });

  /* ======================================================
     FAKE CAMERA Z (THE MOST IMPORTANT PART)
     ====================================================== */

  /**
   * Camera starts DEEP in the scene (cannot see anything)
   * Then pulls BACKWARD revealing layers one by one
   *
   * -3500 → camera behind clouds (nothing visible)
   *  -2500 → clouds appear
   *  -1500 → house appears
   *   -500 → person appears
   */
  const cameraZ = interpolate(eased, [0, 1], [-3500, -200]);

  /* ======================================================
     WORLD LAYERS (FIXED — NEVER ANIMATED)
     ====================================================== */

  /* ☁️ CLOUDS — VERY FAR */
  const CLOUD_Z = -3000;      // Appears first
  const CLOUD_SCALE = 2.6;    // Big to fill screen

  /* 🏠 HOUSE — MID */
  const HOUSE_Z = -1800;      // Appears after clouds
  const HOUSE_Y = 240;
  const HOUSE_SCALE = 1.1;

  /* 👤 PERSON — CLOSE */
  const PERSON_Z = -900;      // Appears LAST
  const PERSON_Y = 460;
  const PERSON_SCALE = 1.3;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        perspective: 1400, // Controls depth strength
        overflow: 'hidden',
      }}
    >
      {/* ================= CAMERA RIG ================= */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',

          /**
           * THIS IS THE CAMERA
           * Moving this Z value reveals layers
           */
          transform: `translateZ(${cameraZ}px)`,
        }}
      >
        {/* ☁️ CLOUDS */}
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

        {/* 🏠 HOUSE */}
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

        {/* 👤 PERSON */}
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
