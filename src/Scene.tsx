
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
  // Normalized progress 0 → 1 for the entire video
  const progress = frame / durationInFrames;

  /* ================= CAMERA MOVEMENT ================= */
  // Phase breakdown (based on total video progress):
  // Phase 1: 0% → 33% of video (first ~4 sec if 12 sec video)
  // Phase 2: 33% → 66% of video (middle ~4 sec)
  // Phase 3: 66% → 100% of video (last ~4 sec)

  const ease = Easing.inOut(Easing.cubic);

  // Phase 1: Camera behind BG → between BG/MG
  const phase1 = interpolate(progress, [0, 0.33], [-2800, -2000], { easing: ease });

  // Phase 2: Camera between MG/FG
  const phase2 = interpolate(progress, [0.33, 0.66], [-1700, -1000], { easing: ease });

  // Phase 3: Camera passes FG
  const phase3 = interpolate(progress, [0.66, 1], [-800, -200], { easing: ease });

  // Determine cameraZ based on current progress
  let cameraZ = 0;
  if (progress <= 0.33) cameraZ = phase1;
  else if (progress <= 0.66) cameraZ = phase2;
  else cameraZ = phase3;

  /* ================= LAYERS (FIXED Z) ================= */
  /**
   * Cloud Layer (BG)
   * Z: -3000 → very far
   * Scale: 2.6 → fills screen
   */
  const CLOUD_Z = -3000;
  const CLOUD_SCALE = 2.6;

  /**
   * House Layer (Midground)
   * Z: -1800 → mid distance
   * Y: 240 → vertical position
   * Scale: 1.1 → normal size
   */
  const HOUSE_Z = -1800;
  const HOUSE_Y = 240;
  const HOUSE_SCALE = 1.1;

  /**
   * Person Layer (Foreground)
   * Z: -900 → closest
   * Y: 460 → vertical position
   * Scale: 1.3 → slightly larger
   */
  const PERSON_Z = -900;
  const PERSON_Y = 460;
  const PERSON_SCALE = 1.3;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        perspective: 1400, // depth strength
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
        {/* ☁️ CLOUDS — Background */}
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

        {/* 🏠 HOUSE — Midground */}
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

        {/* 👤 PERSON — Foreground */}
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
