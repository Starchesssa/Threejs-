#!/usr/bin/env python3
import subprocess
import os

# --- SETTINGS ---
SCENE_DUR = 6        # Scene duration in seconds
OUT = "public/out_parallax.mp4"

os.makedirs("public", exist_ok=True)

# --- FFmpeg command ---
cmd = f"""
ffmpeg -y \
-loop 1 -t {SCENE_DUR} -i public/T1.png \
-loop 1 -t {SCENE_DUR} -i public/T2.png \
-loop 1 -t {SCENE_DUR} -i public/T3.png \
-loop 1 -t {SCENE_DUR} -i public/T4.png \
-loop 1 -t {SCENE_DUR} -i public/House.png \
-loop 1 -t {SCENE_DUR} -i public/T1.png \
-loop 1 -t {SCENE_DUR} -i public/P1.png \
-loop 1 -t {SCENE_DUR} -i public/P5.png \
-loop 1 -t {SCENE_DUR} -i public/P9.png \
-i public/Cloud.mp4 \
-i public/Cloud1.mp4 \
-loop 1 -t {SCENE_DUR} -i public/Pole1.png \
-filter_complex "
# Base background
color=size=1920x1080:color=black:d={SCENE_DUR}[base];

# Clouds overlay
[9:v] setpts=PTS-STARTPTS, scale=1920x1080 [cloud0];
[10:v] setpts=PTS-STARTPTS, scale=1920x1080 [cloud1];
[base][cloud0] overlay=shortest=1:x=0:y=0 [tmp1];
[tmp1][cloud1] overlay=shortest=1:x=0:y=0 [scene];

# Layer T1
[0:v] setpts=PTS-STARTPTS, scale=800:-1, pad=1920:1080:(ow-iw)/2:oh-ih-60 [t1];
[scene][t1] overlay=shortest=1:x='(W-w)/2 + (t*20)*0.06':y='H-h-60' [scene1];

# Layer T2
[1:v] setpts=PTS-STARTPTS, scale=700:-1, pad=1920:1080:(ow-iw)/2:oh-ih-60 [t2];
[scene1][t2] overlay=shortest=1:x='(W-w)/2 + (t*20)*0.07 - 200':y='H-h-60' [scene2];

# Layer T3
[2:v] setpts=PTS-STARTPTS, scale=700:-1, pad=1920:1080:(ow-iw)/2:oh-ih-60 [t3];
[scene2][t3] overlay=shortest=1:x='(W-w)/2 + (t*20)*0.05 + 200':y='H-h-60' [scene3];

# Layer T4
[3:v] setpts=PTS-STARTPTS, scale=750:-1, pad=1920:1080:(ow-iw)/2:oh-ih-60 [t4];
[scene3][t4] overlay=shortest=1:x='(W-w)/2 + (t*20)*0.055 - 80':y='H-h-60' [scene4];

# House
[4:v] setpts=PTS-STARTPTS, scale=900:-1, pad=1920:1080:(ow-iw)/2:oh-ih-0 [house];
[scene4][house] overlay=shortest=1:x='(W-w)/2 + (t*40)*0.18':y='H-h - (t*5)*0.18' [scene5];

# PBG (previously RG replaced with T1)
[5:v] setpts=PTS-STARTPTS, scale=1920:-1, pad=1920:1080:(ow-iw)/2:oh-ih-0 [pbg];
[scene5][pbg] overlay=shortest=1:x=0:y='H-h-(t*30)' [scene6];

# Front people
[6:v] setpts=PTS-STARTPTS, scale=350:-1, pad=1920:1080:(ow-iw)/2:oh-ih-200 [p1];
[scene6][p1] overlay=shortest=1:x='(W-w)/6 + (t*80)*0.45':y='H-h-200' [scene7];

[7:v] setpts=PTS-STARTPTS, scale=500:-1, pad=1920:1080:(ow-iw)/2:oh-ih-100 [p5];
[scene7][p5] overlay=shortest=1:x='(W-w)*0.7 + (t*80)*0.5':y='H-h-100' [scene8];

[8:v] setpts=PTS-STARTPTS, scale=700:-1, pad=1920:1080:(ow-iw)/2:oh-ih-150 [p9];
[scene8][p9] overlay=shortest=1:x='(W-w)*0.25 + (t*80)*0.6':y='H-h-150' [scene9];

# Pole foreground
[11:v] setpts=PTS-STARTPTS, scale=400:-1, pad=1920:1080:(ow-iw)/2:oh-ih-0 [pole];
[scene9][pole] overlay=shortest=1:x='(W-w)/2':y='H-h' [final];

[final]format=yuv420p
" -map "[final]" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p "{OUT}"
"""

# --- RUN FFmpeg ---
subprocess.run(cmd, shell=True, check=True)

print(f"Render complete: {OUT}")
