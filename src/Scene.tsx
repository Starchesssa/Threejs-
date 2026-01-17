
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
  // Camera moves FORWARD toward the subject
  const cameraZ = interpolate(
    t,
    [0, 6],
    [300, -300],
    { easing: ease }
  );

  /* ---------------- WORLD POSITIONS ---------------- */
  const CLOUD_Z = -600;   // far background
  const HOUSE_Z = -350;   // midground
  const PERSON_Z = -120;  // foreground (very close)

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'black',
        perspective: 500, // STRONG perspective = close feel
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
            transform: `translateZ(${CLOUD_Z}px) scale(1.05)`,
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
