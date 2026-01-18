
import React from 'react';
import {
  AbsoluteFill,
  Video,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  staticFile,
} from 'remotion';

/* ======================================================
   KEYFRAME TEMPLATE INTERFACE
   ====================================================== */
type KeyframeLayer = {
  start: number;      // seconds when animation starts
  end: number;        // seconds when animation ends
  scaleFrom: number;  // starting scale
  scaleTo: number;    // ending scale
  yFrom: number;      // starting Y position
  yTo: number;        // ending Y position
};

const ease = Easing.inOut(Easing.cubic);

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // current time in seconds
  const t = frame / fps;

  /* ======================================================
     DEFINE LAYERS WITH KEYFRAMES
     ====================================================== */

  const layers: { [key: string]: KeyframeLayer & { type: 'img' | 'video'; src: string; height?: number } } = {
    clouds: {
      type: 'video',
      src: 'Cloud.mp4',
      start: 0,
      end: 6,
      scaleFrom: 2.4,
      scaleTo: 1.2,
      yFrom: -300,
      yTo: 0,
    },
    house: {
      type: 'img',
      src: 'House.png',
      height: 900,
      start: 3,
      end: 8,
      scaleFrom: 3.8,
      scaleTo: 1.6,
      yFrom: 200,
      yTo: 0,
    },
    person: {
      type: 'img',
      src: 'P10.png',
      height: 820,
      start: 6,
      end: 10,
      scaleFrom: 6.5,
      scaleTo: 0.75,
      yFrom: 1100,
      yTo: 420,
    },
  };

  /* ======================================================
     RENDER FUNCTION
     ====================================================== */
  const renderLayer = (layer: typeof layers[keyof typeof layers]) => {
    // Calculate scale and Y based on time
    const scale =
      t < layer.start
        ? 0 // invisible before start
        : interpolate(t, [layer.start, layer.end], [layer.scaleFrom, layer.scaleTo], {
            easing: ease,
            extrapolateRight: 'clamp',
          });

    const y =
      t < layer.start
        ? layer.yFrom + 300 // offscreen before start
        : interpolate(t, [layer.start, layer.end], [layer.yFrom, layer.yTo], {
            easing: ease,
            extrapolateRight: 'clamp',
          });

    // Optional: fade-in
    const opacity =
      t < layer.start
        ? 0
        : interpolate(t, [layer.start, layer.end], [0, 1], { easing: ease, extrapolateRight: 'clamp' });

    // Return JSX
    if (layer.type === 'video') {
      return (
        <AbsoluteFill
          key={layer.src}
          style={{
            transform: `translateY(${y}px) scale(${scale})`,
            opacity,
          }}
        >
          <Video
            src={staticFile(layer.src)}
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </AbsoluteFill>
      );
    }

    if (layer.type === 'img') {
      return (
        <AbsoluteFill
          key={layer.src}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            transform: `translateY(${y}px) scale(${scale})`,
            opacity,
          }}
        >
          <Img src={staticFile(layer.src)} style={{ height: layer.height ?? 800 }} />
        </AbsoluteFill>
      );
    }

    return null;
  };

  return <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>{Object.values(layers).map(renderLayer)}</AbsoluteFill>;
};

export default Scene;
