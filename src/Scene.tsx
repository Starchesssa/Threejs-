   import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  staticFile,
  Easing,
} from 'remotion';

/* ---------------- CAMERA NULL ---------------- */

const useCameraRig = () => {
  const frame = useCurrentFrame();

  // MASTER CAMERA PROGRESS
  const cam = interpolate(
    frame,
    [0, 40, 120, 160],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.2, 0.9, 0.2, 1),
    }
  );

  const z = interpolate(cam, [0, 1], [-1200, 0]);
  const x = interpolate(cam, [0, 1], [80, 0]);
  const rotY = interpolate(cam, [0, 1], [-8, 0]);
  const rotX = interpolate(cam, [0, 1], [4, 0]);

  return { cam, z, x, rotX, rotY };
};

/* ---------------- IMAGE ACTOR ---------------- */

type ActorProps = {
  src: string;
  depth: number;
  index: number;
};

const Actor: React.FC<ActorProps> = ({ src, depth, index }) => {
  const frame = useCurrentFrame();

  // slight organic motion
  const breathe = Math.sin(frame * 0.04 + index) * 6;

  // blur based on depth
  const blur = interpolate(depth, [-200, 600], [0, 18]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        transformStyle: 'preserve-3d',
        transform: `
          translate3d(${breathe}px, 0, ${depth}px)
          rotateY(${depth * -0.01}deg)
        `,
        filter: `blur(${blur}px)`,
        pointerEvents: 'none',
      }}
    >
      <img
        src={staticFile(src)}
        style={{
          height: '90%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 40px 90px rgba(0,0,0,0.85))',
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------------- SCENE ---------------- */

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = useCameraRig();

  // IMAGES PLACED IN WORLD SPACE (NOT ANIMATED)
  const images = Array.from({ length: 7 }, (_, i) => ({
    src: `P${i + 1}.png`,
    z: i * 420, // spacing in depth
  }));

  return (
    <AbsoluteFill
      style={{
        background: '#000',
        perspective: '1800px',
        overflow: 'hidden',
      }}
    >
      {/* VIGNETTE */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, #222 0%, #000 75%)',
          zIndex: 0,
        }}
      />

      {/* CAMERA */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `
            translate3d(${camera.x}px, 0, ${camera.z}px)
            rotateX(${camera.rotX}deg)
            rotateY(${camera.rotY}deg)
          `,
        }}
      >
        {images.map((img, i) => (
          <Actor
            key={img.src}
            src={img.src}
            depth={-img.z}
            index={i}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export default Scene;     
