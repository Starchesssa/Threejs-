
import subprocess
import os

# --- SETTINGS ---
SCENE_DUR = 6  # duration in seconds
OUT = "public/out_parallax.mp4"

# Ensure output directory exists
os.makedirs("public", exist_ok=True)

# --- STEP 1: Render each PNG to a short video ---
layers = [
    "T1.png",  # BG
    "Cloud.mp4",  # cloud video
    "Cloud1.mp4",
    "T2.png",  # MG
    "T3.png",  # FG
    "T4.png",  # Extra FG / RG
    "House.png",
    "P1.png",
    "P5.png",
    "P9.png",
    "Pole1.png"
]

# Convert images to 1920x1080 videos if needed
for i, layer in enumerate(layers):
    if layer.endswith(".png"):
        out_layer = f"public/layer_{i}.mp4"
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-t", str(SCENE_DUR),
            "-i", f"public/{layer}",
            "-vf", "scale=1920:1080",
            "-c:v", "libx264", "-pix_fmt", "yuv420p",
            out_layer
        ]
        subprocess.run(cmd, check=True)
        layers[i] = out_layer  # replace PNG with generated video

# --- STEP 2: Overlay videos one by one ---
# Start from first layer
base = layers[0]

for overlay in layers[1:]:
    out_temp = "public/out_temp.mp4"
    cmd = [
        "ffmpeg", "-y",
        "-i", base,
        "-i", overlay,
        "-filter_complex", "[0:v][1:v] overlay=0:0:shortest=1",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        out_temp
    ]
    subprocess.run(cmd, check=True)
    base = out_temp

# --- STEP 3: Rename final video ---
os.rename(base, OUT)
print(f"Render complete: {OUT}")
