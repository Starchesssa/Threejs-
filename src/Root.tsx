
import { Composition } from 'remotion';
import { Scene } from './Scene';

export const Root = () => {
  return (
    <Composition
      id="CinematicScene"
      component={Scene}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={360} // 12 seconds
    />
  );
};
