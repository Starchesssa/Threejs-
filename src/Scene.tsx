
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

  /* ================= CAMERA ================= */
  const cameraZ = interpolate(t, [0, 6], [0, 600], { easing: ease });
  const cameraTilt = interpolate(t, [0, 6], [6, 2]); // looking upward

  /* ================= DEPTH LAYERS ================= */
  const CLOUD_Z = -2600;
  const HOUSE_Z = -1200;
  const PERSON_Z = -600;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        perspective: 1200,
        overflow: 'hidden',
      }}
    >
      {/* CAMERA RIG */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `
            translateZ(${-cameraZ}px)
            rotateX(${cameraTilt}deg)
          `,
        }}
      >
        {/* 🌥 CLOUDS — SKY BACKGROUND */}
        <AbsoluteFill
          style={{
            transform: `
              translateZ(${CLOUD_Z}px)
              scale(2.2)
            `,
          }}
        >
          <Video
            src={staticFile('Clouds.mp4')}
            style={{ objectFit: 'cover' }}
          />
        </AbsoluteFill>

        {/* 🏠 HOUSE — MIDGROUND */}
        <AbsoluteFill
          style={{
            transform: `
              translateY(260px)
              translateZ(${HOUSE_Z}px)
              scale(1.2)
            `,
          }}
        >
          <Img src={staticFile('House.png')} />
        </AbsoluteFill>

        {/* 👤 PERSON — FOREGROUND */}
        <AbsoluteFill
          style={{
            transform: `
              translateY(520px)
              translateZ(${PERSON_Z}px)
              scale(1.4)
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
