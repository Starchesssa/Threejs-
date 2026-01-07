
// root.tsx
import { Composition, Sequence } from "remotion";
import { Scene } from "./Scene";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ✅ Main composition for rendering */}
      <Composition
        id="MagnettesScene"          // used in CLI: npx remotion render src/index.ts MagnettesScene out/Scene.mp4
        component={() => (
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
        )}
        fps={FPS}
        width={1920}
        height={1080}
        durationInFrames={150 * FPS} // 3 scenes * 50 sec each = 150 sec
      />
    </>
  );
};
