
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  staticFile,
} from 'remotion';

const TOTAL_IMAGES = 12;
const GAP = 20; // frames between images

const ImageLayer = ({ src, index }: { src: string; index: number }) => {
  const frame = useCurrentFrame();

  // when this image starts
  const start = index * GAP;
  const localFrame = frame - start;

  // zoom-out feeling (moving backward)
  const scale = interpolate(
    localFrame,
    [0, 30, 90],
    [1, 0.85, 0.6],
    { extrapolateRight: 'clamp' }
  );

  // move upward from bottom (brush reveal)
  const translateY = interpolate(
    localFrame,
    [0, 20],
    [200, 0],
    { extrapolateRight: 'clamp' }
  );

  // fade as it goes far
  const opacity = interpolate(
    localFrame,
    [0, 20, 90],
    [0, 1, 0.4],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end', // bottom brush
        alignItems: 'center',
        transform: `
          translateY(${translateY}px)
          scale(${scale})
        `,
        opacity,
      }}
    >
      <img
        src={staticFile(src)}
        style={{
          height: '70%', // NOT full screen
          objectFit: 'contain',
        }}
      />
    </AbsoluteFill>
  );
};

export const Scene: React.FC = () => {
  const images = Array.from({ length: TOTAL_IMAGES }, (_, i) => `P${i + 1}.png`);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        overflow: 'hidden',
      }}
    >
      {images.map((img, i) => (
        <ImageLayer key={img} src={img} index={i} />
      ))}
    </AbsoluteFill>
  );
};

export default Scene;
