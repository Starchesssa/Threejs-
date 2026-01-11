import cv2
import numpy as np
import os

# --- SETTINGS ---
SCENE_DUR = 6         # seconds
FPS = 30
WIDTH, HEIGHT = 1920, 1080
OUT = "public/out_parallax.mp4"

os.makedirs("public", exist_ok=True)

# --- LOAD LAYERS ---
# PNGs with alpha
T1 = cv2.imread("public/T1.png", cv2.IMREAD_UNCHANGED)
T2 = cv2.imread("public/T2.png", cv2.IMREAD_UNCHANGED)
T3 = cv2.imread("public/T3.png", cv2.IMREAD_UNCHANGED)
T4 = cv2.imread("public/T4.png", cv2.IMREAD_UNCHANGED)
House = cv2.imread("public/House.png", cv2.IMREAD_UNCHANGED)
P1 = cv2.imread("public/P1.png", cv2.IMREAD_UNCHANGED)
P5 = cv2.imread("public/P5.png", cv2.IMREAD_UNCHANGED)
P9 = cv2.imread("public/P9.png", cv2.IMREAD_UNCHANGED)
Pole1 = cv2.imread("public/Pole1.png", cv2.IMREAD_UNCHANGED)

# Optional: load video layers
Cloud = cv2.VideoCapture("public/Cloud.mp4")
Cloud1 = cv2.VideoCapture("public/Cloud1.mp4")

# --- VIDEO WRITER ---
fourcc = cv2.VideoWriter_fourcc(*"mp4v")
out = cv2.VideoWriter(OUT, fourcc, FPS, (WIDTH, HEIGHT))

total_frames = SCENE_DUR * FPS

for f in range(total_frames):
    frame = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)  # black background

    # --- Overlay clouds from video ---
    def overlay_video(cap):
        ret, img = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, img = cap.read()
        img = cv2.resize(img, (WIDTH, HEIGHT))
        return img

    cloud_frame = overlay_video(Cloud)
    cloud_frame1 = overlay_video(Cloud1)

    # simple overlay using max (replace pixels)
    frame = cv2.addWeighted(frame, 1.0, cloud_frame, 0.6, 0)
    frame = cv2.addWeighted(frame, 1.0, cloud_frame1, 0.6, 0)

    # --- Overlay PNG layers with alpha ---
    def overlay_alpha(base, overlay, x, y):
        if overlay.shape[2] < 4:
            base[y:y+overlay.shape[0], x:x+overlay.shape[1]] = overlay
        else:
            alpha = overlay[:, :, 3] / 255.0
            for c in range(3):
                base[y:y+overlay.shape[0], x:x+overlay.shape[1], c] = \
                    overlay[:, :, c] * alpha + base[y:y+overlay.shape[0], x:x+overlay.shape[1], c] * (1-alpha)
        return base

    # Example simple parallax positions
    frame = overlay_alpha(frame, T1, int(f*2), 0)
    frame = overlay_alpha(frame, T2, int(f*3), 50)
    frame = overlay_alpha(frame, T3, int(f*1.5), 100)
    frame = overlay_alpha(frame, T4, int(f*2.2), 150)
    frame = overlay_alpha(frame, House, int(f*1.8), 200)
    frame = overlay_alpha(frame, P1, int(f*2.5), 300)
    frame = overlay_alpha(frame, P5, int(f*2), 400)
    frame = overlay_alpha(frame, P9, int(f*1.2), 500)
    frame = overlay_alpha(frame, Pole1, int(f*1.5), 600)

    out.write(frame)

out.release()
Cloud.release()
Cloud1.release()
print(f"Video saved to {OUT}")
