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

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. Unified Progress: Everything happens over the whole duration
  const progress = frame / durationInFrames;
  
  // 2. Cinematic Easing: "Out" easing makes it feel like it's slowing down into place
  const ease = Easing.out(Easing.quad);
  const p = interpolate(progress, [0, 1], [0, 1], { easing: ease });

  /**
   * PARALLAX LOGIC:
   * Foreground (Person) = Massive scale change + Massive Y movement
   * Midground (House)   = Moderate scale change + Moderate Y movement
   * Background (Clouds) = Tiny scale change + Tiny Y movement
   */

  /* 🌥 CLOUDS — BACKGROUND (Moves the least) */
  const cloudScale = interpolate(p, [0, 1], [1.3, 1.0]);
  const cloudY = interpolate(p, [0, 1], [0, 50]);

  /* 🏠 HOUSE — MIDGROUND (Moves moderately) */
  const houseScale = interpolate(p, [0, 1], [3.5, 1.0]);
  const houseY = interpolate(p, [0, 1], [-200, 150]);

  /* 👤 PERSON — FOREGROUND (Moves the most) */
  // We start at scale 12 so the person "fills" the screen at the start
  const personScale = interpolate(p, [0, 1], [12, 0.7]);
  const personY = interpolate(p, [0, 1], [-800, 450]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      
      {/* 🌥 CLOUDS */}
      <AbsoluteFill
        style={{
          transform: `translateY(${cloudY}px) scale(${cloudScale})`,
        }}
      >
        <Video 
          src={staticFile('Cloud.mp4')} 
          startFrom={0} 
          muted 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* 🏠 HOUSE */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(${houseY}px) scale(${houseScale})`,
        }}
      >
        <Img src={staticFile('House.png')} style={{ height: '600px' }} />
      </AbsoluteFill>

      {/* 👤 PERSON */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(${personY}px) scale(${personScale})`,
        }}
      >
        <Img src={staticFile('P10.png')} style={{ height: '800px' }} />
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

export default Scene;
