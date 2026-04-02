import reflex as rx
from alpha_sound.configs.paths import UPLOAD_DIR
from alpha_sound.services.transcriber import transcribe_audio
from alpha_sound.services.audio_service import build_session
from alpha_sound.state.app_state import AppState

import os
import uuid

def save_file(data: bytes, filename: str) -> str:
	file_id = str(uuid.uuid4())
	safe_filename = filename.replace(" ", "_")

	save_path = os.path.join(UPLOAD_DIR, f"{file_id}_{safe_filename}")

	with open(save_path, "wb") as f:
		f.write(data)

	return save_path

class UploadState(rx.State):
	is_processing: bool = False
	progress: float = 0.0
	current_step: str = ""

	@rx.event
	async def handle_upload(self, files: list[rx.UploadFile]) -> None:
		self.is_processing = True
		self.progress = 0
		self.current_step = "Uploading..."

		try:
			for file in files:
				data = await file.read()

				self.current_step = "Saving file..."

				file_path = save_file(data, file.filename or "")

				self.current_step = "Transcribing..."

				segments = list(transcribe_audio(file_path))

				total = len(segments)

				for i, _ in enumerate(segments):
					self.progress = (i + 1) / total
					self.current_step = f"Processing segment {i+1}/{total}"

		finally:
			self.is_processing = False