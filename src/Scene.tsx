
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 60;
  const durationInFrames = 12 * fps;

  // CAMERA MOVEMENT
  const cameraZ = interpolate(frame, [0, durationInFrames], [0, 600]);
  const cameraY = interpolate(frame, [0, durationInFrames], [0, 50]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#050505', overflow: 'hidden' }}>
      {/* --- SKY VIDEO --- */}
      <video
        src="/Cloud.mp4"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `translateZ(-2000px) scale(3)`,
          opacity: 0.6,
        }}
        autoPlay
        loop
        muted
      />

      {/* --- TOWERS --- */}
      {['T1.png','T2.png','T3.png','T4.png'].map((src, i) => (
        <img
          key={i}
          src={`/${src}`}
          style={{
            position: 'absolute',
            bottom: '100px',
            left: `${i * 33}%`,
            height: '600px',
            transform: `translateZ(-1000px) scale(2)`,
            filter: 'brightness(0.5) blur(1px) grayscale(0.5)',
          }}
        />
      ))}

      {/* --- GROUND --- */}
      <div
        style={{
          position: 'absolute',
          bottom: '-500px',
          left: '-50%',
          width: '200%',
          height: '1500px',
          background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #000 80%)',
          transform: 'rotateX(80deg) translateZ(-200px)',
          opacity: 0.8,
        }}
      />

      {/* --- HOUSE --- */}
      <img
        src="/House.png"
        style={{
          position: 'absolute',
          bottom: '0px',
          left: '50%',
          transform: `translateX(-50%) translateZ(-300px) scale(1.3)`,
          height: '700px',
        }}
      />

      {/* --- PEOPLE LAYERS --- */}
      {/* BACK ROW */}
      {['P1.png','P2.png','P3.png','P4.png'].map((src,i)=>(
        <img
          key={'back'+i}
          src={`/${src}`}
          style={{
            position:'absolute',
            bottom: '200px',
            left: `${20 + i*20}%`,
            height:'350px',
            transformOrigin: 'bottom center',
            transform: `scaleY(${1 + Math.sin(frame/30)/50}) scaleX(${1 - Math.sin(frame/30)/100}) translateZ(-100px) scale(1.1)`,
            filter:'brightness(0.8)',
          }}
        />
      ))}

      {/* MID ROW */}
      {['P5.png','P6.png','P7.png','P8.png'].map((src,i)=>(
        <img
          key={'mid'+i}
          src={`/${src}`}
          style={{
            position:'absolute',
            bottom: '100px',
            left: [15,30,70,85][i] + '%',
            height:'500px',
            transformOrigin: 'bottom center',
            transform: `scaleY(${1 + Math.sin(frame/30)/50}) scaleX(${1 - Math.sin(frame/30)/100}) translateZ(100px) scale(0.9)`,
            zIndex: [2,1,1,2][i],
          }}
        />
      ))}

      {/* FRONT ROW */}
      {['P9.png','P10.png','P11.png','P12.png'].map((src,i)=>(
        <img
          key={'front'+i}
          src={`/${src}`}
          style={{
            position:'absolute',
            bottom: i<2?-50:-150,
            left: [ -10,90,25,65 ][i] + '%',
            height:'700px',
            transformOrigin:'bottom center',
            transform: `scaleY(${1 + Math.sin(frame/30)/50}) scaleX(${1 - Math.sin(frame/30)/100}) translateZ(300px) scale(0.7)`,
            filter: 'blur(4px) brightness(0.6)',
          }}
        />
      ))}

      {/* --- POLES (Foreground) --- */}
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
          }}
        />
      ))}

      {/* --- OVERLAYS --- */}
      <div style={{
        position:'absolute',top:0,left:0,width:'100%',height:'100%',
        background: 'radial-gradient(circle, transparent 50%, #000 100%)',
        zIndex:100, pointerEvents:'none'
      }} />

      <div style={{
        position:'absolute',top:0,left:0,width:'100%',height:'100%',
        backgroundImage:'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
        opacity:0.05,
        zIndex:99,
        pointerEvents:'none'
      }} />
    </AbsoluteFill>
  );
};
