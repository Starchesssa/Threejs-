import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  staticFile,
} from 'remotion';

/* ---------------- CONFIG ---------------- */

const SLIDE_DURATION = 90;

const slides = [
  'img/slide1.jpeg',
  'img/slide2.jpeg',
  'img/slide3.jpg',
];

/* ---------------- DIVERGENCE SLIDE ---------------- */

const DivergenceSlide: React.FC<{ src: string; frame: number }> = ({
  src,
  frame,
}) => {
  const t = interpolate(frame, [0, 45], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        perspective: '1400px',
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
      }}
    >
      {/* DEEP IMAGE */}
      <img
        src={staticFile(src)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scale(1.1)',
        }}
      />

      {/* MIDDLE (GRAY / INK BODY) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#777',
          transform: `
            translateX(${t * 140}px)
            translateZ(${t * 300}px)
          `,
        }}
      />

      {/* TOP (BLACK / INK EDGE) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000',
          transform: `
            translateX(${-t * 240}px)
            translateZ(${t * 600}px)
          `,
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------------- MAIN SLIDER ---------------- */

const DivergenceSlider: React.FC = () => {
  const frame = useCurrentFrame();

  const slideIndex = Math.floor(frame / SLIDE_DURATION);
  const localFrame = frame % SLIDE_DURATION;

  if (!slides[slideIndex]) return null;

  return (
    <DivergenceSlide
      key={slideIndex}
      src={slides[slideIndex]}
      frame={localFrame}
    />
  );
};

export default DivergenceSlider;
