import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Img,
  staticFile,
} from "remotion";

const SLIDE_DURATION = 90;

const slides = [
  "img/slide1.jpeg",
  "img/slide2.jpeg",
  "img/slide3.jpg",
];

export const DivergenceSlider: React.FC = () => {
  const frame = useCurrentFrame();

  const slideIndex = Math.floor(frame / SLIDE_DURATION);
  const localFrame = frame % SLIDE_DURATION;

  if (!slides[slideIndex]) return null;

  const t = interpolate(localFrame, [0, 45], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      {/* IMAGE */}
      <Img
        src={staticFile(slides[slideIndex])}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scale(1.1)",
        }}
      />

      {/* GRAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#777",
          transform: `translateX(${t * 120}px)`,
        }}
      />

      {/* BLACK */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000",
          transform: `translateX(${-t * 220}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
