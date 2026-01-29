
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
  const cameraZ = interpolate(progress, [0, 1], [0, 5600], {
    easing: ease,
  });

  /* ================= DOT BOUNCE (SYNCED) ================= */
  const bounce = Math.abs(Math.sin(progress * Math.PI * 6)) * 60;

  /* ================= ROAD LINES ================= */
  const lines = new Array(36).fill(0);

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at center, #0c1020, #000)',
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
        {/* ================= PATH LINES ================= */}
        {lines.map((_, i) => {
          const z = -i * 340;
          const localZ = z + (cameraZ % 340);

          const scale = interpolate(localZ, [-5600, -500], [0.1, 1.9], {
            extrapolateLeft: 'clamp',
          });

          const opacity = interpolate(localZ, [-5600, -800], [0, 1], {
            extrapolateLeft: 'clamp',
          });

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '22%',
                width: 640,
                height: 10,
                opacity,
                background:
                  'linear-gradient(90deg, #00f0ff, #7b6cff)',
                borderRadius: '999px', // ✅ smooth edges
                boxShadow: `
                  0 0 200px rgba(80,120,255,0.6),
                  inset 0 0 20px rgba(255,255,255,0.6)
                `,
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

        {/* ================= HERO DOT (FIXED TO CAMERA) ================= */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: `calc(22% + ${bounce}px)`,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, #ffffff, #7b6cff)',
            boxShadow: `
              0 0 400px rgba(120,140,255,0.9),
              0 0 200px rgba(120,140,255,0.8),
              inset 0 0 60px rgba(255,255,255,0.9)
            `,
            transform: 'translateX(-50%) translateZ(0px)', // ✅ fixed to camera
          }}
        />

        {/* ================= FINISH GATE ================= */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '30%',
            width: 600,
            height: 38,
            background:
              'linear-gradient(90deg, #ffffff, #7b6cff)',
            borderRadius: '16px', // ✅ smooth edges
            boxShadow: '0 0 200px rgba(120,140,255,0.8)',
            transformStyle: 'preserve-3d',
            transform: `
              translateX(-50%)
              translateZ(-700px)
            `,
          }}
        />

        {/* ================= FINISH BILLBOARD ================= */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '26%',
            padding: '44px 140px',
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: 12,
            color: '#fff',
            background:
              'linear-gradient(180deg, #0b0f2a, #000)',
            border: '6px solid #7b6cff',
            borderRadius: '16px', // ✅ smooth edges
            boxShadow: `
              0 0 300px rgba(120,140,255,0.9),
              inset 0 0 40px rgba(120,140,255,0.6)
            `,
            transformStyle: 'preserve-3d',
            transform: `
              translateX(-50%)
              translateZ(-1000px)
            `,
          }}
        />
      </div>

      {/* ================= NOISE OVERLAY ================= */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'0.15\'/%3E%3C/svg%3E")',
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default Scene;
