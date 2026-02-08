import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const images = [
  "/1748447519296.jpg",
  "/file_00000000f59c722fa1bf1388685eb7ae.png",
  "/1706211372198.png",
];

const SLIDE_DURATION = 90; // frames per slide

// -------------------- SLIDE 1: GRADIENT WIPE --------------------
const GradientReveal: React.FC<{ src: string; progress: number }> = ({
  src,
  progress,
}) => {
  return (
    <AbsoluteFill>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          WebkitMaskImage: `linear-gradient(
            to right,
            black ${progress * 100}%,
            transparent ${(progress + 0.2) * 100}%
          )`,
        }}
      />
    </AbsoluteFill>
  );
};

// -------------------- SLIDE 2: INK / NOISE DIVERGENCE --------------------
const InkReveal: React.FC<{ src: string; progress: number }> = ({
  src,
  progress,
}) => {
  return (
    <AbsoluteFill>
      {/* IMAGE */}
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          WebkitMaskImage: `
            radial-gradient(circle at 50% 50%,
              white ${progress * 120}%,
              black ${(progress + 0.15) * 120}%
            )
          `,
          filter: "contrast(110%)",
        }}
      />
    </AbsoluteFill>
  );
};

// -------------------- SLIDE 3: LAYER DIVERGENCE (YOUR TECHNIQUE) --------------------
const LayerDivergence: React.FC<{ src: string; progress: number }> = ({
  src,
  progress,
}) => {
  const blackOffset = interpolate(progress, [0, 1], [0, -200]);
  const grayOffset = interpolate(progress, [0, 1], [0, 150]);

  return (
    <AbsoluteFill>
      {/* IMAGE (STATIC) */}
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* GRAY COVER */}
      <AbsoluteFill
        style={{
          backgroundColor: "#999",
          transform: `translateX(${grayOffset}px)`,
          mixBlendMode: "multiply",
        }}
      />

      {/* BLACK COVER */}
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          transform: `translateX(${blackOffset}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

// -------------------- MAIN SLIDESHOW --------------------
const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const slideIndex = Math.floor(frame / SLIDE_DURATION);
  const slideFrame = frame % SLIDE_DURATION;

  const progress = interpolate(slideFrame, [0, SLIDE_DURATION], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {slideIndex === 0 && <GradientReveal src={images[0]} progress={progress} />}
      {slideIndex === 1 && <InkReveal src={images[1]} progress={progress} />}
      {slideIndex === 2 && (
        <LayerDivergence src={images[2]} progress={progress} />
      )}
    </AbsoluteFill>
  );
};

export default Scene;
