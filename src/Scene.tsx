import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  staticFile,
} from 'remotion';

/* ---------------- SLIDE CONFIG ---------------- */

const SLIDE_DURATION = 90; // frames per slide

const slides = [
  'img/slide1.jpeg',
  'img/slide2.jpeg',
  'img/slide3.jpg',
];

/* ---------------- DIVERGENCE SLIDE ---------------- */

const DivergenceSlide: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();

  // Reveal timing
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
      {/* IMAGE (BOTTOM / DEEP) */}
      <img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scale(1.1)',
        }}
      />

      {/* GRAY LAYER (MIDDLE) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#777',
          transform: `
            translateX(${t * 120}px)
            translateZ(${t * 300}px)
          `,
        }}
      />

      {/* BLACK LAYER (TOP) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000',
          transform: `
            translateX(${-t * 220}px)
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
    <AbsoluteFill>
      <DivergenceSlide
        key={slideIndex}
        src={slides[slideIndex]}
      />
    </AbsoluteFill>
  );
};

export default DivergenceSlider;
