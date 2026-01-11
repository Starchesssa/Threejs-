
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 60;
  const durationInFrames = 12 * fps; // 12-second video

  // CAMERA movement
  const cameraZ = interpolate(frame, [0, durationInFrames], [0, 600]);
  const cameraY = interpolate(frame, [0, durationInFrames], [0, 50]);

  // Helper to animate individual PNG keyframes
  const animate = (start: number, end: number, min: number, max: number) =>
    interpolate(frame, [start, end], [min, max]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#050505', overflow: 'hidden' }}>

      {/* SKY */}
      <img
        src="/Cloud.png"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -10,
        }}
      />

      {/* TOWERS (Horizon) */}
      {['T1.png','T2.png','T3.png','T4.png'].map((src, i) => {
        const x = animate(0, durationInFrames, -300 + i*200, -200 + i*200); // Example keyframe X
        return (
          <img
            key={i}
            src={`/${src}`}
            style={{
              position: 'absolute',
              bottom: '100px',
              left: `50%`,
              transform: `translateX(${x}px) translateZ(-1000px) scale(2)`,
              height: '600px',
              filter: 'brightness(0.5) blur(1px) grayscale(0.5)',
            }}
          />
        );
      })}

      {/* HOUSE (midground hero) */}
      <img
        src="/House.png"
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: `translateX(-50%) translateY(${animate(0,durationInFrames,0,30)}px) translateZ(-300px) scale(1.3)`,
          height: '700px',
          zIndex: 1,
        }}
      />

      {/* PEOPLE BACK ROW */}
      {['P1.png','P2.png','P3.png','P4.png'].map((src,i) => (
        <img
          key={'back'+i}
          src={`/${src}`}
          style={{
            position: 'absolute',
            bottom: 200 + animate(0,durationInFrames,0,10), // subtle Y animation
            left: `${20 + i*20}%`,
            height: '350px',
            transformOrigin: 'bottom center',
            transform: `scaleY(${1 + Math.sin(frame/30)/50}) scaleX(${1 - Math.sin(frame/30)/100}) translateZ(-100px)`,
            filter: 'brightness(0.8)',
            zIndex: 5,
          }}
        />
      ))}

      {/* PEOPLE MID ROW */}
      {['P5.png','P6.png','P7.png','P8.png'].map((src,i) => (
        <img
          key={'mid'+i}
          src={`/${src}`}
          style={{
            position: 'absolute',
            bottom: 100 + animate(0,durationInFrames,0,10),
            left: [15,30,70,85][i] + '%',
            height: '500px',
            transformOrigin: 'bottom center',
            transform: `scaleY(${1 + Math.sin(frame/30)/50}) scaleX(${1 - Math.sin(frame/30)/100}) translateZ(100px)`,
            zIndex: 10,
          }}
        />
      ))}

      {/* PEOPLE FRONT ROW */}
      {['P9.png','P10.png','P11.png','P12.png'].map((src,i)=>(
        <img
          key={'front'+i}
          src={`/${src}`}
          style={{
            position: 'absolute',
            bottom: i<2?-50:-150,
            left: [-10,90,25,65][i] + '%',
            height: '700px',
            transformOrigin:'bottom center',
            transform: `scaleY(${1 + Math.sin(frame/30)/50}) scaleX(${1 - Math.sin(frame/30)/100}) translateZ(300px)`,
            filter: 'blur(4px) brightness(0.6)',
            zIndex: 15,
          }}
        />
      ))}

      {/* POLES (foreground) */}
      {['Pole1.png','Pole2.png','Pole3.png'].map((src,i)=>(
        <img
          key={'pole'+i}
          src={`/${src}`}
          style={{
            position:'absolute',
            bottom:'-200px',
            left: [5,95,40][i] + '%',
            height:'1200px',
            transform: `translateZ(${[500,400,700][i]}px)`,
            filter:'blur(10px) brightness(0.2)',
            zIndex: 50,
          }}
        />
      ))}

    </AbsoluteFill>
  );
};
