
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

const ease = Easing.inOut(Easing.cubic);

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ======================================================
     TIME
     ====================================================== */

  // Current time in seconds (THIS drives everything)
  const t = frame / fps;

  /* ======================================================
     🌥 CLOUDS — BACKGROUND
     ====================================================== */

  const clouds = {
    // ⏱ WHEN (seconds)
    start: 0,
    end: 6,

    // 🔍 SCALE (camera distance)
    // MIN: 1.0   (far)
    // MAX: 3.0   (close)
    scaleFrom: 2.4,
    scaleTo: 1.2,

    // ↕ POSITION Y
    // MIN: -600  (very high)
    // MAX: 300   (low)
    yFrom: -300,
    yTo: 0,
  };

  const cloudScale = interpolate(
    t,
    [clouds.start, clouds.end],
    [clouds.scaleFrom, clouds.scaleTo],
    { easing: ease, extrapolateRight: 'clamp' }
  );

  const cloudY = interpolate(
    t,
    [clouds.start, clouds.end],
    [clouds.yFrom, clouds.yTo],
    { easing: ease, extrapolateRight: 'clamp' }
  );

  /* ======================================================
     🏠 HOUSE — MIDGROUND
     ====================================================== */

  const house = {
    // ⏱ WHEN
    start: 3,
    end: 8,

    // 🔍 SCALE
    // MIN: 1.0   (natural)
    // MAX: 2.2   (fills 16:9)
    scaleFrom: 5.8,
    scaleTo: 3.6,

    // ↕ POSITION Y
    // MIN: -200  (too high)
    // MAX: 300   (too low)
    yFrom: 200,
    yTo: 0,
  };

  const houseScale = interpolate(
    t,
    [house.start, house.end],
    [house.scaleFrom, house.scaleTo],
    { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const houseY = interpolate(
    t,
    [house.start, house.end],
    [house.yFrom, house.yTo],
    { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  /* ======================================================
     👤 PERSON — FOREGROUND
     ====================================================== */

  const person = {
    // ⏱ WHEN
    start: 6,
    end: 10,

    // 🔍 SCALE
    // MIN: 0.6   (far)
    // MAX: 7.0   (extreme close)
    scaleFrom: 6.5,
    scaleTo: 0.75,

    // ↕ POSITION Y
    // MIN: 200
    // MAX: 1200
    yFrom: 1100,
    yTo: 420,
  };

  const personScale = interpolate(
    t,
    [person.start, person.end],
    [person.scaleFrom, person.scaleTo],
    { easing: ease, extrapolateLeft: 'clamp' }
  );

  const personY = interpolate(
    t,
    [person.start, person.end],
    [person.yFrom, person.yTo],
    { easing: ease, extrapolateLeft: 'clamp' }
  );

  /* ======================================================
     RENDER
     ====================================================== */

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
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* 🏠 HOUSE */}
      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `translateY(${houseY}px) scale(${houseScale})`,
        }}
      >
        <Img
          src={staticFile('House.png')}
          style={{ height: '900px' }}
        />
      </AbsoluteFill>

      {/* 👤 PERSON */}
      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          transform: `translateY(${personY}px) scale(${personScale})`,
        }}
      >
        <Img
          src={staticFile('P10.png')}
          style={{ height: '820px' }}
        />
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

export default Scene;
