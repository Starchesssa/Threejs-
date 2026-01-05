import { registerRoot } from "remotion";
import { Composition } from "remotion";
import { Scene, SCENE_DURATION, SCENE_FPS } from "./Scene";

// Register the root for Remotion
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MagnettesScene"          // Unique composition ID
      component={Scene}            // Scene contains camera + layers
      fps={SCENE_FPS}              // Duration control comes from Scene.tsx
      durationInFrames={SCENE_DURATION}
      width={1920}                 // Full HD cinematic
      height={1080}
    />
  );
};

// This line ensures Remotion knows the root
registerRoot(RemotionRoot);
