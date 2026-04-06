import reflex as rx
from alpha_sound.configs.paths import UPLOAD_DIR
from alpha_sound.models.schema import TranscriptionSegment
from apps.transcriber.transcriber import group_segments, transcribe_audio
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
		self.progress = 0.0

		for file in files:
			self.current_step = "Saving file..."
			data = await file.read()
			file_path = save_file(data, file.filename or "")

			self.current_step = "Transcribing..."
			raw_segments: list[TranscriptionSegment] = []
			
			for segment in transcribe_audio(file_path):
				raw_segments.append(segment)

			self.current_step = "Grouping segments..."
			grouped_segments = group_segments(
				raw_segments,
				max_duration=20.0,
				max_gap=1.0
			)

			self.current_step = "Processing audio..."
			session = build_session(file_path, grouped_segments)

			AppState.add_session(session)

		self.current_step = "Done"
		self.is_processing = False