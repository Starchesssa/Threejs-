
import { AbsoluteFill, IFrame, useVideoConfig } from 'remotion';

export const Scene = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill>
      <IFrame
        src="/scene.html"
        width={width}
        height={height}
        style={{ border: 'none' }}
      />
    </AbsoluteFill>
  );
};
