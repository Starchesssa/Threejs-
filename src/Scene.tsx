
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

type KeyframeLayer = {
  start: number;      // seconds when animation starts
  end: number;        // seconds when animation ends
  scaleFrom: number;  // starting scale
  scaleTo: number;    // ending scale
  yFrom: number;      // starting Y position
  yTo: number;        // ending Y position
  minScale?: number;  // optional limit for tweaking
  maxScale?: number;  // optional limit for tweaking
};

const ease = Easing.inOut(Easing.cubic);

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

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
      minScale: 1.0,
      maxScale: 2.4,
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
      minScale: 1.0,
      maxScale: 3.8,
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
      minScale: 0.75,
      maxScale: 6.5,
    },
  };

  const renderLayer = (layer: typeof layers[keyof typeof layers]) => {
    // === Check if layer should appear ===
    if (t < layer.start || t > layer.end) {
      return null; // completely invisible outside timeline
    }

    // === SCALE & POSITION ===
    const scale = interpolate(t, [layer.start, layer.end], [layer.scaleFrom, layer.scaleTo], { easing: ease });
    const y = interpolate(t, [layer.start, layer.end], [layer.yFrom, layer.yTo], { easing: ease });

    // === Render ===
    if (layer.type === 'video') {
      return (
        <AbsoluteFill
          key={layer.src}
          style={{ transform: `translateY(${y}px) scale(${scale})` }}
        >
          <Video
            src={staticFile(layer.src)}
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
