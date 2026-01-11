import cv2
import numpy as np
import os

# --- SETTINGS ---
SCENE_DUR = 6          # seconds
FPS = 60
FRAME_COUNT = SCENE_DUR * FPS
WIDTH, HEIGHT = 1920, 1080
OUT_VIDEO = "public/out_parallax_cv.mp4"

# Ensure output dir exists
os.makedirs("public", exist_ok=True)

# --- LOAD IMAGES ---
# Each layer should be a PNG with alpha channel
layers = {
    "BG": cv2.imread("public/T1.png", cv2.IMREAD_UNCHANGED),
    "MG": cv2.imread("public/T2.png", cv2.IMREAD_UNCHANGED),
    "FG": cv2.imread("public/T3.png", cv2.IMREAD_UNCHANGED),
    "House": cv2.imread("public/House.png", cv2.IMREAD_UNCHANGED),
    "P1": cv2.imread("public/P1.png", cv2.IMREAD_UNCHANGED),
    "P5": cv2.imread("public/P5.png", cv2.IMREAD_UNCHANGED),
    "P9": cv2.imread("public/P9.png", cv2.IMREAD_UNCHANGED),
    "Pole": cv2.imread("public/Pole1.png", cv2.IMREAD_UNCHANGED),
}

# Optional: Load cloud video layers
cloud1_cap = cv2.VideoCapture("public/Cloud.mp4")
cloud2_cap = cv2.VideoCapture("public/Cloud1.mp4")

# --- UTILITY FUNCTION ---
def overlay_alpha(base, overlay, x, y):
    """Overlay a PNG with alpha channel onto base image at (x, y)."""
    h, w = overlay.shape[:2]
    bh, bw = base.shape[:2]

    # Crop overlay if it goes out of bounds
    if y + h > bh:
        h = bh - y
        overlay = overlay[:h, :, :]
    if x + w > bw:
        w = bw - x
        overlay = overlay[:, :w, :]

    if overlay.shape[2] < 4:
        # No alpha, just overlay
        base[y:y+h, x:x+w] = overlay
        return base

    alpha = overlay[:, :, 3] / 255.0
    for c in range(3):
        base[y:y+h, x:x+w, c] = (alpha * overlay[:h, :w, c] +
                                 (1 - alpha) * base[y:y+h, x:x+w, c])
    return base

# --- SETUP VIDEO WRITER ---
fourcc = cv2.VideoWriter_fourcc(*"mp4v")
out = cv2.VideoWriter(OUT_VIDEO, fourcc, FPS, (WIDTH, HEIGHT))

# --- GENERATE FRAMES ---
for f in range(FRAME_COUNT):
    frame = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)  # black background

    t = f / FPS  # current time in seconds

    # Overlay layers with simple parallax motion
    frame = overlay_alpha(frame, cv2.resize(layers["BG"], (WIDTH, HEIGHT)), int(t*10), 0)
    frame = overlay_alpha(frame, cv2.resize(layers["MG"], (900, 600)), int(t*20), 100)
    frame = overlay_alpha(frame, cv2.resize(layers["FG"], (800, 500)), int(t*30), 200)
    frame = overlay_alpha(frame, cv2.resize(layers["House"], (700, 700)), int(t*40), 250)
    frame = overlay_alpha(frame, cv2.resize(layers["P1"], (350, 350)), int(t*50), 400)
    frame = overlay_alpha(frame, cv2.resize(layers["P5"], (400, 400)), int(t*60), 450)
    frame = overlay_alpha(frame, cv2.resize(layers["P9"], (450, 450)), int(t*70), 500)
    frame = overlay_alpha(frame, cv2.resize(layers["Pole"], (200, 800)), int(t*20), 550)

    # Overlay cloud video frames
    ret1, cloud1_frame = cloud1_cap.read()
    if ret1:
        cloud1_frame = cv2.resize(cloud1_frame, (WIDTH, HEIGHT))
        frame = cv2.addWeighted(frame, 1.0, cloud1_frame, 0.5, 0)

    ret2, cloud2_frame = cloud2_cap.read()
    if ret2:
        cloud2_frame = cv2.resize(cloud2_frame, (WIDTH, HEIGHT))
        frame = cv2.addWeighted(frame, 1.0, cloud2_frame, 0.5, 0)

    out.write(frame)

# --- CLEANUP ---
out.release()
cloud1_cap.release()
cloud2_cap.release()
print(f"Render complete: {OUT_VIDEO}")
