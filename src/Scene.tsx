import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 60;
  const durationInFrames = 12 * fps; // 12-second video

  // Camera movement
  const cameraZ = interpolate(frame, [0, durationInFrames], [0, 600]);
  const cameraY = interpolate(frame, [0, durationInFrames], [0, 50]);

  // helper to animate a value
  const anim = (startF: number, endF: number, startVal: number, endVal: number) =>
    interpolate(frame, [startF, endF], [startVal, endVal]);

  return (
    <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>

      {/* ======================= */}
      {/* 1. BACKGROUND (Sky / Clouds) */}
      {/* ======================= */}
      <video
        src="/Cloud.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          top: 0,
          left: 0,
          zIndex: -20,
          transform: `translateZ(-2000px) scale(3)`,
        }}
      />
      <video
        src="/Cloud1.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          top: 0,
          left: 0,
          zIndex: -19,
          transform: `translateZ(-1800px) scale(2.5)`,
        }}
      />

      {/* ======================= */}
      {/* 2. MIDGROUND (Towers / House) */}
      {/* ======================= */}
      {['T1.png','T2.png','T3.png','T4.png'].map((src,i)=>(
        <img
          key={i}
          src={`/${src}`}
          style={{
            position:'absolute',
            bottom: anim(0,durationInFrames,50,60), 
            left: `${20 + i*20}%`,
            height:'600px',
            transformOrigin:'bottom center',
            transform:`translateZ(-1000px) scale(2)`,
            filter:'brightness(0.5) blur(1px) grayscale(0.5)',
            zIndex: -10,
          }}
        />
      ))}

      <img
        src="/House.png"
        style={{
          position:'absolute',
          bottom: anim(0,durationInFrames,0,30),
          left:'50%',
          transform:`translateX(-50%) translateZ(-300px) scale(1.3)`,
          height:'700px',
          zIndex: 0,
        }}
      />

      {/* ======================= */}
      {/* 3. FRONT ROW (People / FG) */}
      {/* ======================= */}
      {['P1.png','P2.png','P3.png','P4.png'].map((src,i)=>(
        <img
          key={'back'+i}
          src={`/${src}`}
          style={{
            position:'absolute',
            bottom:200 + anim(0,durationInFrames,0,10),
            left:`${15 + i*20}%`,
            height:'350px',
            transformOrigin:'bottom center',
            transform:`scaleY(${1 + Math.sin(frame/30)/50}) scaleX(${1 - Math.sin(frame/30)/100}) translateZ(-100px)`,
            filter:'brightness(0.8)',
            zIndex:5
          }}
        />
      ))}

      {['P5.png','P6.png','P7.png','P8.png'].map((src,i)=>(
        <img
          key={'mid'+i}
          src={`/${src}`}
          style={{
            position:'absolute',
            bottom:100 + anim(0,durationInFrames,0,10),
            left:[15,30,70,85][i] + '%',
            height:'500px',
            transformOrigin:'bottom center',
            transform:`scaleY(${1 + Math.sin(frame/30)/50}) scaleX(${1 - Math.sin(frame/30)/100}) translateZ(100px)`,
            zIndex:10
          }}
        />
      ))}

      {['P9.png','P10.png','P11.png','P12.png'].map((src,i)=>(
        <img
          key={'front'+i}
          src={`/${src}`}
          style={{
            position:'absolute',
            bottom:i<2?-50:-150,
            left:[-10,90,25,65][i]+'%',
            height:'700px',
            transformOrigin:'bottom center',
            transform:`scaleY(${1 + Math.sin(frame/30)/50}) scaleX(${1 - Math.sin(frame/30)/100}) translateZ(300px)`,
            filter:'blur(4px) brightness(0.6)',
            zIndex:15
          }}
        />
      ))}

      {/* ======================= */}
      {/* 4. RG (Reveal Ground) */}
      {/* ======================= */}
      <img
        src="/RG.png"  // your ground layer that appears later
        style={{
          position:'absolute',
          bottom: anim(0,durationInFrames*0.5,-300,0), // reveal from below halfway
          left:'50%',
          transform:'translateX(-50%)',
          width:'120%',
          height:'400px',
          zIndex:20,
        }}
      />

      {/* ======================= */}
      {/* 5. FOREGROUND POLES */}
      {/* ======================= */}
      {['Pole1.png','Pole2.png','Pole3.png'].map((src,i)=>(
        <img
          key={'pole'+i}
          src={`/${src}`}
          style={{
            position:'absolute',
            bottom:'-200px',
            left:[5,95,40][i] + '%',
            height:'1200px',
            transform:`translateZ(${[500,400,700][i]}px)`,
            filter:'blur(10px) brightness(0.2)',
            zIndex:50
          }}
        />
      ))}

    </AbsoluteFill>
  );
};
