
import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

type LayerProps = {
  src: string;
  depth: number; // negative = far, positive = near
  xPercent: number; // 0..100 horizontal anchor
  bottom?: number | string;
  baseScale?: number;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  isVideo?: boolean;
  zIndex?: number;
};

const Layer: React.FC<LayerProps> = ({
  src,
  depth,
  xPercent,
  bottom = 0,
  baseScale = 1,
  width,
  height,
  style,
  isVideo = false,
  zIndex = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Camera animation (shared)
  const cameraZ = interpolate(frame, [0, durationInFrames], [0, 600]);
  const cameraY = interpolate(frame, [0, durationInFrames], [0, 50]);

  // small idle bob for life
  const idle = Math.sin(frame / 12) * (1 + Math.cos(frame / 30)) * 0.2;

  // Depth factor: normalize depth to -2000..+1000 range for math
  const depthFactor = depth / 2000; // far negative -> large negative factor

  // Parallax offsets derived from camera and depth
  const z = depth + cameraZ * depthFactor * -1; // far layers move less; near layers move more
  const y = cameraY * depthFactor * -1 + idle * Math.abs(depthFactor) * 6;
  const x = (xPercent - 50) * 2 + cameraZ * depthFactor * -0.2; // slight horizontal shift based on depth

  // Scale slightly with depth so far layers appear larger (simulate zoom)
  const scale = baseScale * (1 + (cameraZ / 4000) * -depthFactor);

  const transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`;

  const commonStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${xPercent}%`,
    bottom: typeof bottom === 'number' ? `${bottom}px` : bottom,
    transformOrigin: 'bottom center',
    transform,
    willChange: 'transform, filter',
    backfaceVisibility: 'hidden',
    zIndex,
    pointerEvents: 'none',
    ...style,
  };

  const visualProps = {
    style: {
      ...commonStyle,
      width,
      height,
    },
  };

  if (isVideo) {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        {...visualProps}
      />
    );
  }

  return <img src={src} {...visualProps} />;
};

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width, height} = useVideoConfig();

  // subtle overall camera easing (optional)
  const camEase = spring({frame, fps, config: {damping: 12, stiffness: 60}}) * 1.0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        overflow: 'hidden',
        perspective: 1200, // essential for 3D
        transformStyle: 'preserve-3d',
        WebkitTransformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {/* BACKGROUND: clouds (videos) */}
      <Layer
        src="/Cloud.mp4"
        isVideo
        depth={-2200}
        xPercent={50}
        baseScale={3.2}
        width="120%"
        height="120%"
        style={{
          left: '50%',
          transformOrigin: 'center center',
          filter: 'brightness(0.9) saturate(0.9)',
        }}
        zIndex={-30}
      />
      <Layer
        src="/Cloud1.mp4"
        isVideo
        depth={-1800}
        xPercent={50}
        baseScale={2.6}
        width="120%"
        height="120%"
        style={{
          left: '50%',
          transformOrigin: 'center center',
          opacity: 0.9,
          filter: 'brightness(0.95) contrast(1.05)',
        }}
        zIndex={-25}
      />

      {/* MIDGROUND: towers */}
      {['T1.png', 'T2.png', 'T3.png', 'T4.png'].map((s, i) => (
        <Layer
          key={s}
          src={`/${s}`}
          depth={-1000}
          xPercent={20 + i * 18}
          bottom={60}
          baseScale={1.9}
          height="600px"
          style={{
            filter: 'brightness(0.55) blur(0.6px) grayscale(0.35)',
          }}
          zIndex={-10}
        />
      ))}

      {/* HOUSE (mid) */}
      <Layer
        src="/House.png"
        depth={-300}
        xPercent={50}
        bottom={0}
        baseScale={1.3}
        height="700px"
        style={{
          transformOrigin: 'bottom center',
          filter: 'brightness(1)',
        }}
        zIndex={0}
      />

      {/* FRONT ROW: people groups */}
      {['P1.png', 'P2.png', 'P3.png', 'P4.png'].map((s, i) => (
        <Layer
          key={s}
          src={`/${s}`}
          depth={-100}
          xPercent={15 + i * 20}
          bottom={200}
          baseScale={0.9}
          height="350px"
          style={{
            filter: 'brightness(0.9)',
            // small breathing scale handled in Layer via idle
          }}
          zIndex={5}
        />
      ))}

      {['P5.png', 'P6.png', 'P7.png', 'P8.png'].map((s, i) => (
        <Layer
          key={s}
          src={`/${s}`}
          depth={100}
          xPercent={[15, 30, 70, 85][i]}
          bottom={100}
          baseScale={1.05}
          height="500px"
          style={{}}
          zIndex={10}
        />
      ))}

      {['P9.png', 'P10.png', 'P11.png', 'P12.png'].map((s, i) => (
        <Layer
          key={s}
          src={`/${s}`}
          depth={300}
          xPercent={[ -10, 90, 25, 65 ][i]}
          bottom={i < 2 ? -50 : -150}
          baseScale={1.15}
          height="700px"
          style={{
            filter: 'blur(2px) brightness(0.65)',
          }}
          zIndex={15}
        />
      ))}

      {/* RG ground reveal */}
      <Layer
        src="/RG.png"
        depth={50}
        xPercent={50}
        bottom={0}
        baseScale={1.05}
        width="120%"
        height="420px"
        style={{
          transformOrigin: 'bottom center',
          filter: 'brightness(1)',
        }}
        zIndex={20}
      />

      {/* FOREGROUND POLES (very front) */}
      <Layer
        src="/Pole1.png"
        depth={700}
        xPercent={5}
        bottom={-200}
        baseScale={1.6}
        height="1200px"
        style={{filter: 'blur(6px) brightness(0.18)'}}
        zIndex={50}
      />
      <Layer
        src="/Pole2.png"
        depth={400}
        xPercent={95}
        bottom={-200}
        baseScale={1.6}
        height="1200px"
        style={{filter: 'blur(8px) brightness(0.18)'}}
        zIndex={50}
      />
      <Layer
        src="/Pole3.png"
        depth={900}
        xPercent={40}
        bottom={-200}
        baseScale={1.6}
        height="1200px"
        style={{filter: 'blur(10px) brightness(0.12)'}}
        zIndex={50}
      />
    </AbsoluteFill>
  );
};
