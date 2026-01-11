import { Composition } from 'remotion';
import { Scene } from './Scene';

/**
 * 🎯 CONFIG (edit ONLY this section)
 */
const FPS = 60;           // constant 60fps
const DURATION_SEC = 12;  // 👈 duration in seconds

export const Root = () => {
  return (
    <Composition
      id="CinematicScene"
      component={Scene}
      width={1920}
      height={1080}
      fps={FPS}
      durationInFrames={FPS * DURATION_SEC} // ✅ seconds → frames
    />
  );
};
