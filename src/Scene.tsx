
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Video,
  staticFile,
} from 'remotion';

type LayerProps = {
  src: string;
  depth: number;
  scale?: number;
  yOffset?: number;
  isVideo?: boolean;
};

const Layer = ({
  src,
  depth,
  scale = 1,
  yOffset = 0,
  isVideo = false,
}: LayerProps) => {
  const frame = useCurrentFrame();

  // Smooth cinematic push
  const push = interpolate(frame, [0, 240], [0, 1], {
    extrapolateRight: 'clamp',
  });

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

  if (isVideo) {
    return (
      <Video
        src={staticFile(src)}
        style={style}
        startFrom={0}
        muted
        onError={(e) => {
          console.error('Video failed:', src, e);
        }}
      />
    );
  }

  return <img src={staticFile(src)} style={style} />;
};

export const CinematicScene = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        overflow: 'hidden',
        perspective: '1400px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* BACKGROUND */}
      <Layer
        src="Cloud.mp4"
        isVideo
        depth={-700}
        scale={2.8}
      />

      {/* MIDGROUND */}
      <Layer
        src="House.png"
        depth={-250}
        scale={1.6}
      />

      {/* FOREGROUND */}
      <Layer
        src="P5.png"
        depth={250}
        scale={1.15}
        yOffset={40}
      />

      {/* EXTREME FOREGROUND */}
      <Layer
        src="Pole1.png"
        depth={700}
        scale={1.9}
      />
      <Layer
        src="Pole1.png"
        depth={900}
        scale={2.2}
      />
    </AbsoluteFill>
  );
};
