// root.tsx
import { registerRoot } from "remotion";
import { Composition, Sequence } from "remotion";
import { Scene } from "./Scene";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Scene 1: 50 sec */}
      <Sequence from={0} durationInFrames={50 * FPS}>
        <Scene
          person="/P1.png"
          tower="/T1.png"
          pole="/Pole1.png"
          slideDirection="left"
          timeline={{ pushIn: [0, 10], pullBack: [10, 35], slide: [35, 50] }}
        />
      </Sequence>

      {/* Scene 2: 50 sec */}
      <Sequence from={50 * FPS} durationInFrames={50 * FPS}>
        <Scene
          person="/P2.png"
          tower="/T2.png"
          pole="/Pole2.png"
          slideDirection="right"
          timeline={{ pushIn: [0, 10], pullBack: [10, 35], slide: [35, 50] }}
        />
      </Sequence>

      {/* Scene 3: 50 sec */}
      <Sequence from={100 * FPS} durationInFrames={50 * FPS}>
        <Scene
          person="/P3.png"
          tower="/T3.png"
          pole="/Pole3.png"
          slideDirection="left"
          timeline={{ pushIn: [0, 10], pullBack: [10, 35], slide: [35, 50] }}
        />
      </Sequence>
    </>
  );
};

registerRoot(RemotionRoot);
