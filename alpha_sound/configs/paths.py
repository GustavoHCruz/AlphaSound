import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ASSETS_DIR = os.path.join(BASE_DIR, "assets")

UPLOAD_DIR = os.path.join(ASSETS_DIR, "originals")
SEGMENTS_DIR = os.path.join(ASSETS_DIR, "segments")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(SEGMENTS_DIR, exist_ok=True)