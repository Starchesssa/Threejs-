
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

export const Scene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 🎯 TIME IN SECONDS
  const time = frame / fps;

  // 🎥 CINEMATIC EASE
  const ease = Easing.bezier(0.4, 0.0, 0.2, 1);

  /* =====================================================
     🌥 BACKGROUND – CLOUD VIDEO
     ===================================================== */

  const bgScale = interpolate(
    time,
    [0, 15],
    [1.2, 1.0],
    { easing: ease }
  );

  const bgX = interpolate(
    time,
    [0, 15],
    [0, 60],
    { easing: ease }
  );

  /* =====================================================
     🏠 MIDGROUND – HOUSE (ENTERS BIG → SHRINKS)
     ===================================================== */

  const mgStart = 3;
  const mgEnd = 8;

  const mgY = interpolate(
    time,
    [mgStart, mgEnd],
    [900, 520],
    { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const mgScale = interpolate(
    time,
    [mgStart, mgEnd],
    [1.6, 1.0],
    { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  /* =====================================================
     👤 FOREGROUND – PERSON (VERY BIG → NORMAL)
     ===================================================== */

  const fgStart = 7;
  const fgEnd = 12;

  const fgY = interpolate(
    time,
    [fgStart, fgEnd],
    [1200, 420],
    { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const fgScale = interpolate(
    time,
    [fgStart, fgEnd],
    [2.4, 1.0],
    { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ perspective: 1200 }}>

      {/* 🌥 BACKGROUND */}
      <AbsoluteFill
        style={{
          transform: `
            translateX(${bgX}px)
            translateZ(-800px)
            scale(${bgScale})
          `,
        }}
      >
        <Video src={staticFile('Cloud.mp4')} />
      </AbsoluteFill>

      {/* 🏠 MIDGROUND */}
      {time >= mgStart && (
        <AbsoluteFill
          style={{
            transform: `
              translateY(${mgY}px)
              translateZ(-300px)
              scale(${mgScale})
            `,
          }}
        >
          <Img src={staticFile('House.png')} />
        </AbsoluteFill>
      )}

      {/* 👤 FOREGROUND */}
      {time >= fgStart && (
        <AbsoluteFill
          style={{
            transform: `
              translateY(${fgY}px)
              translateZ(-80px)
              scale(${fgScale})
            `,
          }}
        >
          <Img src={staticFile('P10.png')} />
        </AbsoluteFill>
      )}

    </AbsoluteFill>
  );
};
