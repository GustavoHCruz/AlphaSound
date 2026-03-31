import os
import reflex as rx

BASE_DIR = rx.get_upload_dir()

UPLOAD_DIR = os.path.join(BASE_DIR, "originals")
SEGMENTS_DIR = os.path.join(BASE_DIR, "segments")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(SEGMENTS_DIR, exist_ok=True)