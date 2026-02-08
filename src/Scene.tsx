import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  staticFile,
} from 'remotion';

const boards = [
  { src: 'img/slide3.jpg', baseZ: -3000, baseY: 0, baseX: 0, scale: 1.0 },
  { src: 'img/slide1.jpeg', baseZ: -1800, baseY: 200, baseX: 0, scale: 1.0 },
  { src: 'img/slide2.jpeg', baseZ: -900, baseY: 380, baseX: 0, scale: 1.0 },
];

const BoardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width: vpW, height: vpH } = useVideoConfig();

  const progress = frame / Math.max(1, durationInFrames);
  const ease = Easing.inOut(Easing.cubic);

  // Camera Z animation (pull-in / push-out)
  const cameraDepth = interpolate(progress, [0, 0.5, 1], [-4600, -2200, -600], {
    easing: ease,
  });
  const cameraZ = -cameraDepth;

  // Camera X/Y pan across the large board (smooth)
  const cameraX = interpolate(progress, [0, 1], [-600, 600], { easing: ease });
  const cameraY = interpolate(progress, [0, 0.5, 1], [0, -120, 0], { easing: ease });

  // Board size: make each board much larger than viewport so edges are never visible.
  // Adjust BOARD_W/BOARD_H to taste (bigger = safer against edge visibility).
  const BOARD_W = Math.max(vpW * 3, 3000);
  const BOARD_H = Math.max(vpH * 3, 2000);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        perspective: 1400,
        overflow: 'hidden', // keep world clipped to frame
      }}
    >
      {/* Camera rig: move the whole world relative to camera */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          // Move world so camera is effectively at 0,0,0
          transform: `translateX(${-cameraX}px) translateY(${-cameraY}px) translateZ(${cameraZ}px)`,
        }}
      >
        {boards.map((b, i) => {
          // subtle parallax offset per board for depth
          const parallax = (i + 1) * 0.08;
          const z = b.baseZ + parallax * 400;
          const y = b.baseY;
          const x = b.baseX;

          // Slight scale change as camera approaches for cinematic feel
          const approachScale = interpolate(progress, [0, 0.6, 1], [1.0, 1.06, 1.12], {
            easing: ease,
          });

          return (
            <div
              key={b.src}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: BOARD_W,
                height: BOARD_H,
                // center the board at the origin before 3D transform
                transformStyle: 'preserve-3d',
                transformOrigin: '50% 50%',
                transform: `
                  translateX(${x - BOARD_W / 2}px)
                  translateY(${y - BOARD_H / 2}px)
                  translateZ(${z}px)
                  scale(${b.scale * approachScale})
                `,
                // background image fills the board; no visible rectangle edges because board is huge
                backgroundImage: `url(${staticFile(b.src)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                // remove any visible border or box artifacts
                border: 'none',
                boxShadow: 'none',
                // ensure the board is rendered as a flat plane
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                willChange: 'transform',
                pointerEvents: 'none',
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default BoardScene;
