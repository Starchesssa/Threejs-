import React from 'react';
import {
  AbsoluteFill,
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

  const progress = frame / durationInFrames;
  const ease = Easing.inOut(Easing.cubic);

  const cameraDepth = interpolate(
    progress,
    [0, 0.5, 1],
    [-4600, -2200, -600],
    { easing: ease }
  );
  const cameraZ = -cameraDepth;

  const BG = { X: 0, Y: 0, Z: -3000, SCALE: 3.6 };
  const MG = { X: 0, Y: 200, Z: -1800, SCALE: 2.7 };
  const FG = { X: 0, Y: 380, Z: -900, SCALE: 0.5 };

  const handleMediaError = (e: any) => {
    // Helpful for debugging — remove or replace with production handling
    // eslint-disable-next-line no-console
    console.error('Media load error', e);
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        perspective: 1400,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `translateZ(${cameraZ}px)`,
        }}
      >
        {/* BACKGROUND (image, not Video) */}
        <AbsoluteFill
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 50%',
            transform: `
              translateX(${BG.X}px)
              translateY(${BG.Y}px)
              translateZ(${BG.Z}px)
              scale(${BG.SCALE})
            `,
          }}
        >
          <Img
            src={staticFile('img/slide3.jpg')}
            onError={handleMediaError}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </AbsoluteFill>

        {/* MIDGROUND */}
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 50%',
            transform: `
              translateX(${MG.X}px)
              translateY(${MG.Y}px)
              translateZ(${MG.Z}px)
              scale(${MG.SCALE})
            `,
          }}
        >
          <Img
            src={staticFile('img/slide1.jpeg')}
            onError={handleMediaError}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </AbsoluteFill>

        {/* FOREGROUND */}
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 50%',
            transform: `
              translateX(${FG.X}px)
              translateY(${FG.Y}px)
              translateZ(${FG.Z}px)
              scale(${FG.SCALE})
            `,
          }}
        >
          <Img
            src={staticFile('img/slide2.jpeg')}
            onError={handleMediaError}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};

export default Scene;
