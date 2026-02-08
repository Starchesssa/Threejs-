import React, {useRef, useState, useCallback} from 'react';
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  staticFile,
} from 'remotion';

type LayerSpec = {
  src: string;
  baseX: number;
  baseY: number;
  baseZ: number;
  baseScale: number;
  // optional max fraction of viewport the image may occupy (0..1)
  maxViewportFraction?: number;
};

const layers: LayerSpec[] = [
  { src: 'img/slide3.jpg', baseX: 0, baseY: 0, baseZ: -3000, baseScale: 3.6, maxViewportFraction: 1 },
  { src: 'img/slide1.jpeg', baseX: 0, baseY: 200, baseZ: -1800, baseScale: 2.7, maxViewportFraction: 0.9 },
  { src: 'img/slide2.jpeg', baseX: 0, baseY: 380, baseZ: -900, baseScale: 0.5, maxViewportFraction: 0.8 },
];

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width: vpWidth, height: vpHeight } = useVideoConfig();

  const progress = frame / Math.max(1, durationInFrames);
  const ease = Easing.inOut(Easing.cubic);

  // camera depth animation (same idea as your original)
  const cameraDepth = interpolate(progress, [0, 0.5, 1], [-4600, -2200, -600], { easing: ease });
  const cameraZ = -cameraDepth;

  // store natural sizes per layer
  const [sizes, setSizes] = useState<Record<string, { w: number; h: number }>>({});

  const onImgLoad = useCallback((src: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setSizes(prev => ({ ...prev, [src]: { w: img.naturalWidth, h: img.naturalHeight } }));
  }, []);

  const handleMediaError = useCallback((src: string, e: any) => {
    // eslint-disable-next-line no-console
    console.error('Media load error for', src, e);
  }, []);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        perspective: 1400,
        overflow: 'hidden',
      }}
    >
      {/* Camera rig */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `translateZ(${cameraZ}px)`,
        }}
      >
        {layers.map((layer) => {
          const key = layer.src;
          const natural = sizes[key];
          // compute display scale so image shows at intrinsic size unless it would overflow viewport
          let displayScale = 1;
          if (natural) {
            const maxFrac = layer.maxViewportFraction ?? 1;
            const maxW = vpWidth * maxFrac;
            const maxH = vpHeight * maxFrac;
            const scaleW = maxW / natural.w;
            const scaleH = maxH / natural.h;
            // If natural size is larger than allowed viewport fraction, scale down proportionally
            if (natural.w > maxW || natural.h > maxH) {
              displayScale = Math.min(scaleW, scaleH);
            } else {
              displayScale = 1; // show at natural pixel size
            }
          } else {
            // fallback while loading: use baseScale so layout is stable
            displayScale = layer.baseScale;
          }

          // Smooth parallax motion: small Z and Y shifts over time
          const zShift = interpolate(progress, [0, 1], [0, 120], { easing: ease });
          const yBob = interpolate(Math.sin(progress * Math.PI * 2), [-1, 1], [-8, 8], { easing: ease });

          // final computed transform values
          const translateX = layer.baseX;
          const translateY = layer.baseY + yBob;
          const translateZ = layer.baseZ + zShift;
          const finalScale = displayScale * (natural ? 1 : layer.baseScale);

          return (
            <AbsoluteFill
              key={key}
              style={{
                // allow the image to overflow its container so intrinsic size is preserved
                overflow: 'visible',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transformStyle: 'preserve-3d',
                transformOrigin: '50% 50%',
                pointerEvents: 'none',
                // apply the animated 3D transform
                transform: `
                  translateX(${translateX}px)
                  translateY(${translateY}px)
                  translateZ(${translateZ}px)
                  scale(${finalScale})
                `,
              }}
            >
              <Img
                src={staticFile(layer.src)}
                onLoad={(e) => onImgLoad(layer.src, e)}
                onError={(e) => handleMediaError(layer.src, e)}
                style={{
                  // let the image render at its intrinsic size by default
                  width: natural ? `${natural.w}px` : 'auto',
                  height: natural ? `${natural.h}px` : 'auto',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  objectFit: 'none',
                  // keep images crisp and centered
                  display: 'block',
                }}
              />
            </AbsoluteFill>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default Scene;
