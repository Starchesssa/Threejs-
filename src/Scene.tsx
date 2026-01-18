The cide is cool , i love it but you reversed it , it shows the perosn first , cause i needed like this

Man cant lie the code wa oretty good , here it is

import React from 'react'; import { AbsoluteFill, Video, Img, useCurrentFrame, useVideoConfig, interpolate, Easing, staticFile, } from 'remotion';

const Scene: React.FC = () => { const frame = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();

/* ================= TIME ================= */ // Convert frame → seconds const t = frame / fps;

// Normalized progress: 0 → 1 for entire video const p = frame / durationInFrames;

// Smooth cinematic curve const ease = Easing.inOut(Easing.cubic); const progress = interpolate(p, [0, 1], [0, 1], { easing: ease });

/* ====================================================== CORE RULE (IMPORTANT – THIS IS THE GOLDEN RULE) ----------------------------------------------- BIG SCALE + DOWNWARD POSITION  = CLOSE SMALL SCALE + UPWARD POSITION = FAR ====================================================== */

/* ================= CLOUDS (BACKGROUND) ================= Clouds behave like INFINITE SKY: - Always behind everything - Very slow movement - Small scale change ====================================================== */ const cloudScale = interpolate(progress, [0, 1], [2.4, 1.2]); const cloudY = interpolate(progress, [0, 1], [-300, 0]);

/* ================= HOUSE (MIDGROUND) ================= House is revealed AFTER clouds: - Starts very large (camera close) - Moves upward - Slowly shrinks ====================================================== */ const houseScale = interpolate(progress, [0, 1], [3.2, 1.0]); const houseY = interpolate(progress, [0, 1], [700, 180]);

/* ================= PERSON (FOREGROUND) ================= Person is revealed LAST: - Starts EXTREMELY zoomed - Moves up the MOST - Ends at natural human size ====================================================== */ const personScale = interpolate(progress, [0, 1], [6.5, 0.75]); const personY = interpolate(progress, [0, 1], [1100, 420]);

return ( <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden', }} > {/* 🌥 CLOUDS — ALWAYS BOTTOM LAYER */} <AbsoluteFill style={{ transform:  translateY(${cloudY}px)   scale(${cloudScale}) , }} > <Video src={staticFile('Cloud.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover', }} />
 {/* 🏠 HOUSE — ON TOP OF CLOUDS */}     <AbsoluteFill       style={{         display: 'flex',         justifyContent: 'center',         alignItems: 'flex-end',         transform:           translateY(${houseY}px)           scale(${houseScale})         ,       }}     >       <Img         src={staticFile('House.png')}         style={{           height: '620px',         }}       />     </AbsoluteFill>      {/* 👤 PERSON — TOPMOST LAYER */}     <AbsoluteFill       style={{         display: 'flex',         justifyContent: 'center',         alignItems: 'flex-end',         transform:            translateY(${personY}px)           scale(${personScale})         ,       }}     >       <Img         src={staticFile('P10.png')}         style={{           height: '820px',         }}       />     </AbsoluteFill>   </AbsoluteFill>   
); };

export default Scene;
