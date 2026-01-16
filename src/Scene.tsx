
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

  const t = frame / fps;
  const ease = Easing.inOut(Easing.cubic);

  /* ---------------- CAMERA ---------------- */
  // Camera moves BACKWARD through the scene
  const cameraZ = interpolate(
    t,
    [0, 12],
    [-200, -2200],
    { easing: ease }
  );

  /* ---------------- WORLD POSITIONS ---------------- */
  const CLOUD_Z = -1600;
  const HOUSE_Z = -900;
  const PERSON_Z = -300;

  /* ---------------- NORMALIZED SIZES ---------------- */
  const CLOUD_SCALE = 1.2;  // sky is huge
  const HOUSE_SCALE = 0.9;  // buildings smaller
  const PERSON_SCALE = 0.55; // humans much smaller

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'black',
        perspective: 1200,
        overflow: 'hidden',
      }}
    >
      {/* CAMERA */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `translateZ(${cameraZ}px)`,
        }}
      >

        {/* 🌥 CLOUDS (BACKGROUND) */}
        <AbsoluteFill
          style={{
            transform: `
              translateZ(${CLOUD_Z}px)
              scale(${CLOUD_SCALE})
            `,
          }}
        >
          <Video src={staticFile('Cloud.mp4')} />
        </AbsoluteFill>

        {/* 🏠 HOUSE (MIDGROUND) */}
        <AbsoluteFill
          style={{
            transform: `
              translateY(200px)
              translateZ(${HOUSE_Z}px)
              scale(${HOUSE_SCALE})
            `,
          }}
        >
          <Img src={staticFile('House.png')} />
        </AbsoluteFill>

        {/* 👤 PERSON (FOREGROUND) */}
        <AbsoluteFill
          style={{
            transform: `
              translateY(420px)
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
