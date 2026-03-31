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

	@rx.event
	async def handle_upload(self, files: list[rx.UploadFile]):
		self.is_processing = True

		for file in files:
			data = await file.read()

			if not file.filename:
				raise ValueError("Something went wrong...")
			file_path = save_file(data, file.filename)

			raw_segments = list(transcribe_audio(file_path))

			session = build_session(file_path, raw_segments)

			AppState.sessions.append(session)
			self.current_session_id = session.id

		self.is_processing = False