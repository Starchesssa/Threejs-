import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Video,
} from 'remotion';

type LayerProps = {
  src: string;
  depth: number; // higher = closer to camera
  scale?: number;
  yOffset?: number;
  isVideo?: boolean;
};

const Layer: React.FC<LayerProps> = ({
  src,
  depth,
  scale = 1,
  yOffset = 0,
  isVideo = false,
}) => {
  const frame = useCurrentFrame();

  // Slow cinematic push-in
  const push = interpolate(frame, [0, 240], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Magnates-style parallax
  const z = depth * push;
  const x = depth * push * 0.12;
  const y = yOffset + depth * push * 0.04;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    bottom: 0,
    transform: `
      translate(-50%, ${y}px)
      translate3d(${x}px, 0px, ${z}px)
      scale(${scale})
    `,
    transformOrigin: 'bottom center',
    willChange: 'transform',
    pointerEvents: 'none',
  };

  return isVideo ? (
    <Video src={src} style={style} />
  ) : (
    <img src={src} style={style} />
};

export const Scene: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        overflow: 'hidden',
        perspective: 1400,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* BACKGROUND — CLOUD VIDEO */}
      <Layer
        src="/Cloud.mp4"
        isVideo
        depth={-700}
        scale={2.8}
      />

      {/* MIDGROUND — HOUSE PNG */}
      <Layer
        src="/House.png"
        depth={-250}
        scale={1.6}
      />

      {/* FOREGROUND — PERSON */}
      <Layer
        src="/P5.png"
        depth={250}
        scale={1.15}
        yOffset={40}
      />

      {/* EXTREME FOREGROUND — POLES */}
      <Layer
        src="/Pole1.png"
        depth={700}
        scale={1.9}
      />
      <Layer
        src="/Pole1.png"
        depth={900}
        scale={2.2}
      />
    </AbsoluteFill>
  );
};
