import subprocess
import os

# --- SETTINGS ---
SCENE_DUR = 6  # duration in seconds
OUT = "public/out_parallax.mp4"
TMP_A = "public/_sceneA.mp4"
TMP_B = "public/_sceneB.mp4"

# Ensure output dir exists
os.makedirs("public", exist_ok=True)

# --- FFmpeg COMMAND ---
cmd = f"""
ffmpeg -y \\
-loop 1 -t {SCENE_DUR} -i public/T1.png \\
-loop 1 -t {SCENE_DUR} -i public/T2.png \\
-loop 1 -t {SCENE_DUR} -i public/T3.png \\
-loop 1 -t {SCENE_DUR} -i public/T4.png \\
-loop 1 -t {SCENE_DUR} -i public/House.png \\
-loop 1 -t {SCENE_DUR} -i public/T1.png \\
-loop 1 -t {SCENE_DUR} -i public/P1.png \\
-loop 1 -t {SCENE_DUR} -i public/P5.png \\
-loop 1 -t {SCENE_DUR} -i public/P9.png \\
-i public/Cloud.mp4 \\
-i public/Cloud1.mp4 \\
-loop 1 -t {SCENE_DUR} -i public/Pole1.png \\
-filter_complex "
color=size=1920x1080:color=black:d={SCENE_DUR}[base];

[9:v] setpts=PTS-STARTPTS,scale=1920x1080,format=rgba[cloud0];
[10:v] setpts=PTS-STARTPTS,scale=1920x1080,format=rgba[cloud1];
[base][cloud0] overlay=shortest=1:x=0:y=0[s0];
[s0][cloud1] overlay=shortest=1:x=0:y=0[s1];

# Layer T1
[0:v] setpts=PTS-STARTPTS, scale=800:-1, format=rgba, pad=1920:1080:(ow-iw)/2:oh-ih-60[t1];
[s1][t1] overlay=shortest=1:x='(W-w)/2 + (t*20)*0.06':y='H-h-60'[s2];

# Layer T2
[1:v] setpts=PTS-STARTPTS, scale=700:-1, format=rgba, pad=1920:1080:(ow-iw)/2:oh-ih-60[t2];
[s2][t2] overlay=shortest=1:x='(W-w)/2 + (t*20)*0.07 - 200':y='H-h-60'[s3];

# Layer T3
[2:v] setpts=PTS-STARTPTS, scale=700:-1, format=rgba, pad=1920:1080:(ow-iw)/2:oh-ih-60[t3];
[s3][t3] overlay=shortest=1:x='(W-w)/2 + (t*20)*0.05 + 200':y='H-h-60'[s4];

# Layer T4
[3:v] setpts=PTS-STARTPTS, scale=750:-1, format=rgba, pad=1920:1080:(ow-iw)/2:oh-ih-60[t4];
[s4][t4] overlay=shortest=1:x='(W-w)/2 + (t*20)*0.055 - 80':y='H-h-60'[s5];

# House
[4:v] setpts=PTS-STARTPTS, scale=900:-1, format=rgba, pad=1920:1080:(ow-iw)/2:oh-ih-0[house];
[s5][house] overlay=shortest=1:x='(W-w)/2 + (t*40)*0.18':y='H-h - (t*5)*0.18'[s6];

# P1
[6:v] setpts=PTS-STARTPTS, scale=350:-1, format=rgba, pad=1920:1080:(ow-iw)/2:oh-ih-200[p1];
[s6][p1] overlay=shortest=1:x='(W-w)/6 + (t*80)*0.45':y='H-h-200'[s7];

# P5
[7:v] setpts=PTS-STARTPTS, scale=500:-1, format=rgba, pad=1920:1080:(ow-iw)/2:oh-ih-100[p5];
[s7][p5] overlay=shortest=1:x='(W-w)*0.7 + (t*80)*0.5':y='H-h-100'[s8];

# P9
[8:v] setpts=PTS-STARTPTS, scale=700:-1, format=rgba, pad=1920:1080:(ow-iw)/2:oh-ih-150[p9];
[s8][p9] overlay=shortest=1:x='(W-w)*0.25 + (t*80)*0.6':y='H-h-150'[sceneFinal];

# Add subtle blur
[sceneFinal] boxblur=luma_radius='if(lt(t,3),0,2)':luma_power=1[sceneFinalBlur];

[sceneFinalBlur] format=yuv420p[output]
" -map "[output]" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p "{OUT}"
"""

# --- RUN FFmpeg ---
try:
    subprocess.run(cmd, shell=True, check=True)
    print(f"Render complete: {OUT}")
except subprocess.CalledProcessError as e:
    print("FFmpeg failed:", e)
