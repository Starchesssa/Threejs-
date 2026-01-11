import subprocess
import os

# --- SETTINGS ---
SCENE_DUR = 6  # seconds
FPS = 30
OUT = "public/out_parallax.mp4"

os.makedirs("public", exist_ok=True)

# --- LAYERS ---
layers = [
    "T1.png",  # BG
    "Cloud.mp4",
    "Cloud1.mp4",
    "T2.png",
    "T3.png",
    "T4.png",
    "House.png",
    "P1.png",
    "P5.png",
    "P9.png",
    "Pole1.png"
]

# --- STEP 1: Normalize all layers ---
normalized = []
for i, layer in enumerate(layers):
    out_layer = f"public/layer_{i}.mp4"
    if layer.endswith(".png"):
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-t", str(SCENE_DUR),
            "-i", f"public/{layer}",
            "-vf", "scale=1920:1080",
            "-r", str(FPS),
            "-c:v", "libx264", "-pix_fmt", "yuv420p",
            out_layer
        ]
    else:
        # existing video: re-encode to 1920x1080, 30fps, yuv420p
        cmd = [
            "ffmpeg", "-y",
            "-i", f"public/{layer}",
            "-vf", "scale=1920:1080",
            "-r", str(FPS),
            "-c:v", "libx264", "-pix_fmt", "yuv420p",
            out_layer
        ]
    subprocess.run(cmd, check=True)
    normalized.append(out_layer)

# --- STEP 2: Overlay sequentially ---
base = normalized[0]
for overlay in normalized[1:]:
    out_temp = "public/out_temp.mp4"
    cmd = [
        "ffmpeg", "-y",
        "-i", base,
        "-i", overlay,
        "-filter_complex", "[0:v][1:v] overlay=0:0:shortest=1",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        out_temp
    ]
    subprocess.run(cmd, check=True)
    base = out_temp

# --- STEP 3: Move final video ---
os.rename(base, OUT)
print(f"Render complete: {OUT}")
