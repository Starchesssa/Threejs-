
import os
import requests
import json

# -----------------------------
# HARD-CODED PIXABAY API KEY
# -----------------------------
API_KEY = "54337256-24810dc27eb2353fb6d973d51"

# Search settings
QUERY = "business men silhouette"
PER_PAGE = 200
OUTPUT_DIR = "PIXA/SILHOUTTE"

os.makedirs(OUTPUT_DIR, exist_ok=True)

url = "https://pixabay.com/api/"
params = {
    "key": API_KEY,
    "q": QUERY,
    "image_type": "illustration",
    "orientation": "horizontal",
    "per_page": PER_PAGE,
    "safesearch": "true"
}

response = requests.get(url, params=params)
data = response.json()

# Save metadata
meta_path = os.path.join(OUTPUT_DIR, "results.json")
with open(meta_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

# Download images
for i, hit in enumerate(data.get("hits", []), start=1):
    img_url = hit["largeImageURL"]
    tags = hit.get("tags", "").replace(",", "_").replace(" ", "_")

    img_data = requests.get(img_url).content
    filename = f"{i}_{tags[:40]}.jpg"
    filepath = os.path.join(OUTPUT_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(img_data)

    print(f"Saved: {filename}")

print("Done.")
