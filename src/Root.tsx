
import React from 'react';
import { Composition } from 'remotion';
import Scene from './Scene'; // default import because Scene.tsx uses export default

export const Root: React.FC = () => {
  return (
    <Composition
      id="CinematicScene"
      component={Scene}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={12 * 60} // 12 seconds
    />
  );
};
