
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
    [0, 5200], // ⬅️ longer journey
    { easing: ease }
  );

  /* ================= ROAD ================= */
  const lines = new Array(34).fill(0);

  /* ================= BOUNCING DOT ================= */
  const bounce = Math.abs(Math.sin(frame * 0.12)) * 60;

  const dotZ = interpolate(
    progress,
    [0, 1],
    [-4200, -900]
  );

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

        {/* ================= PATH ================= */}
        {lines.map((_, i) => {
          const z = -i * 320;
          const localZ = z + (cameraZ % 320);

          const scale = interpolate(
            localZ,
            [-5200, -400],
            [0.12, 1.8],
            { extrapolateLeft: 'clamp' }
          );

          const opacity = interpolate(
            localZ,
            [-5200, -700],
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
                width: 620,
                height: 8,
                background: '#fff',
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

        {/* ================= BOUNCING DOT ================= */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: `calc(20% + ${bounce}px)`,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 0 30px rgba(255,255,255,0.8)',
            transformStyle: 'preserve-3d',
            transform: `
              translateX(-50%)
              translateZ(${dotZ}px)
            `,
          }}
        />

        {/* ================= FINISH GATE (FARTHER) ================= */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '28%',
            width: 560,
            height: 36,
            background: '#fff',
            transformStyle: 'preserve-3d',
            transform: `
              translateX(-50%)
              translateZ(-600px)
            `,
          }}
        />

        {/* ================= FINISH BILLBOARD ================= */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '28%',
            padding: '42px 130px',
            background: '#000',
            border: '6px solid white',
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: 10,
            color: 'white',
            transformStyle: 'preserve-3d',
            transform: `
              translateX(-50%)
              translateZ(-900px)
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
