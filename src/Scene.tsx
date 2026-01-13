
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  staticFile,
  Easing,
  useVideoConfig,
} from 'remotion';

// --- CONFIGURATION ---
const SETTINGS = {
  TRANSITION_DURATION: 15, // Frames for the "Snap" in/out
  STAY_DURATION: 25,       // Frames character stays in the center
  OVERLAP: 10,             // How many frames the next character starts early
};

type LayerProps = {
  src: string;
  index: number;
};

const CharacterLayer = ({ src, index }: LayerProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing logic: Each character starts after the previous one finishes its "stay"
  const stepDuration = SETTINGS.TRANSITION_DURATION + SETTINGS.STAY_DURATION;
  const startTime = index * stepDuration;
  
  // Phase 1: Entry (Slide from right + Scale up)
  // Phase 2: Active (Slight drift)
  // Phase 3: Exit (Slide to left + Scale down)
  
  const entryEnd = startTime + SETTINGS.TRANSITION_DURATION;
  const exitStart = entryEnd + SETTINGS.STAY_DURATION;
  const exitEnd = exitStart + SETTINGS.TRANSITION_DURATION;

  // 1. Horizontal Motion (The "Null" Slide)
  const translateX = interpolate(
    frame,
    [startTime, entryEnd, exitStart, exitEnd],
    [1000, 0, -50, -1000], // Fast in, slow drift, fast out
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.16, 1, 0.3, 1), // "Quart Out" - very snappy like Alight Motion
    }
  );

  // 2. Scale (The Depth Effect)
  const scale = interpolate(
    frame,
    [startTime, entryEnd, exitStart, exitEnd],
    [0.5, 1.1, 1.05, 0.4], // Starts small, pops large, settles, shrinks away
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    }
  );

  // 3. Opacity & Z-Index
  const opacity = interpolate(
    frame,
    [startTime, startTime + 5, exitEnd - 5, exitEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Ensure current character is on top of the previous one
  const zIndex = frame > startTime ? index + 100 : index;

  const style: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity,
    zIndex,
    transform: `translate3d(${translateX}px, 0, 0) scale(${scale})`,
    filter: `drop-shadow(0 30px 60px rgba(0,0,0,0.8))`,
    transformOrigin: 'bottom center',
  };

  return (
    <div style={style}>
      <img
        src={staticFile(src)}
        style={{
          height: '95%',
          objectFit: 'contain',
        }}
        alt={`Character ${index}`}
      />
    </div>
  );
};

const Scene: React.FC = () => {
  // Automatically generate the array for P1.png through P12.png
  const characters = Array.from({ length: 12 }, (_, i) => `P${i + 1}.png`);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        overflow: 'hidden',
        perspective: '1500px', // Creates the 3D depth field
      }}
    >
      {/* Dark background vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle, #222 0%, #000 80%)',
      }} />

      {characters.map((img, i) => (
        <CharacterLayer key={img} src={img} index={i} />
      ))}
    </AbsoluteFill>
  );
};

export default Scene;
