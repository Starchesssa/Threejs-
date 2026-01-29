import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = frame / durationInFrames;
  const ease = Easing.inOut(Easing.cubic);

  /* ================= CAMERA ================= */
  const cameraZ = interpolate(
    progress,
    [0, 1],
    [0, 4200],
    { easing: ease }
  );

  /* ================= ROAD LINES ================= */
  const lines = new Array(28).fill(0);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(#0a0a0a, #000)',
        perspective: 1600,
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

        {/* ================= PATH / ROAD ================= */}
        {lines.map((_, i) => {
          const z = -i * 300;
          const localZ = z + (cameraZ % 300);

          const scale = interpolate(
            localZ,
            [-4500, -300],
            [0.15, 1.6],
            { extrapolateLeft: 'clamp' }
          );

          const opacity = interpolate(
            localZ,
            [-4500, -600],
            [0, 1],
            { extrapolateLeft: 'clamp' }
          );

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '20%',
                width: 600,
                height: 8,
                background: '#ffffff',
                opacity,
                transformStyle: 'preserve-3d',
                transform: `
                  translateX(-50%)
                  translateZ(${localZ}px)
                  scale(${scale})
                `,
              }}
            />
          );
        })}

        {/* ================= SIDE RAILS ================= */}
        {['left', 'right'].map((side, i) => (
          <div
            key={side}
            style={{
              position: 'absolute',
              bottom: '20%',
              left: side === 'left' ? '35%' : '65%',
              width: 10,
              height: '60%',
              background: '#444',
              transformStyle: 'preserve-3d',
              transform: `
                translateX(-50%)
                translateZ(-1800px)
                scaleY(2)
              `,
            }}
          />
        ))}

        {/* ================= FINISH GATE ================= */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '30%',
            width: 520,
            height: 40,
            background: '#fff',
            transformStyle: 'preserve-3d',
            transform: `
              translateX(-50%)
              translateZ(-300px)
            `,
          }}
        />

        {/* ================= FINISH BILLBOARD ================= */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '30%',
            padding: '40px 120px',
            background: '#000',
            border: '6px solid white',
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: 10,
            color: 'white',
            transformStyle: 'preserve-3d',
            transform: `
              translateX(-50%)
              translateZ(-600px)
            `,
          }}
        >
          FINISH
        </div>

      </div>
    </AbsoluteFill>
  );
};

export default Scene;
