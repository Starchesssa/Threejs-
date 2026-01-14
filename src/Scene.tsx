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
  const { fps, durationInFrames } = useVideoConfig();

  // ✅ REAL TIME IN SECONDS
  const time = frame / fps;
  const duration = durationInFrames / fps;

  const ease = Easing.inOut(Easing.cubic);

  /* ---------------- BACKGROUND (Clouds) ---------------- */

  const bgX = interpolate(time, [0, duration], [0, 40], { easing: ease });
  const bgScale = interpolate(time, [0, duration], [1.05, 1.15], { easing: ease });

  /* ---------------- MIDGROUND (House) ---------------- */

  const mgX = interpolate(time, [0, duration], [0, 120], { easing: ease });
  const mgY = interpolate(time, [0, duration], [600, 520], { easing: ease });
  const mgScale = interpolate(time, [0, duration], [0.85, 1.1], { easing: ease });

  /* ---------------- FOREGROUND (P1) ---------------- */

  const fgX = interpolate(time, [0, duration], [0, 220], { easing: ease });
  const fgY = interpolate(time, [0, duration], [760, 420], { easing: ease });
  const fgScale = interpolate(time, [0, duration], [1.0, 1.45], { easing: ease });

  return (
    <AbsoluteFill style={{ perspective: 1000 }}>

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
      <AbsoluteFill
        style={{
          transform: `
            translateX(${mgX}px)
            translateY(${mgY}px)
            translateZ(-300px)
            scale(${mgScale})
          `,
        }}
      >
        <Img src={staticFile('House.png')} />
      </AbsoluteFill>

      {/* 👤 FOREGROUND */}
      <AbsoluteFill
        style={{
          transform: `
            translateX(${fgX}px)
            translateY(${fgY}px)
            translateZ(-80px)
            scale(${fgScale})
          `,
        }}
      >
        <Img src={staticFile('P1.png')} />
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
