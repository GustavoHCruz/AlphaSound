import json
import os
from typing import Iterator
from dotenv import load_dotenv
from faster_whisper import WhisperModel

from app.models import TranscriptionSegment

load_dotenv()

MODEL_SIZE = os.getenv("WHISPER_MODEL_SIZE", "large").lower()
DEVICE = os.getenv("WHISPER_DEVICE", "cpu").lower()

MODEL_MAP = {
	"large": "large-v3",
	"medium": "medium",
	"small": "small"
}

model_name = MODEL_MAP.get(MODEL_SIZE, "large-v3")

if DEVICE == "cuda":
	compute_type = "float16"
else:
	compute_type = "int8"

model = WhisperModel(
	model_name,
	device=DEVICE,
	compute_type=compute_type
)

def transcribe_audio(audio_path: str) -> Iterator[TranscriptionSegment]:
	segments, _ = model.transcribe(
		audio_path,
		beam_size=5,
		language="pt",
		vad_filter=True,
		vad_parameters=dict(min_silence_duration_ms=1000)
	)

	for segment in segments:
		yield TranscriptionSegment(
			transcription=segment.text.strip(),
			start=segment.start,
			end=segment.end
		)

def generate_segments(
	raw_segments: Iterator[TranscriptionSegment],
	min_size: int
) -> Iterator[str]:
	acc = 0.0
	start: float | None = None
	end: float | None = None
	transcription = ""

	for segment in raw_segments:
		acc += segment.end - segment.start

		if start is None:
			start = segment.start

		end = segment.end
		transcription += f" {segment.transcription}"

		if acc >= min_size:
			yield json.dumps({
				"transcription": transcription,
				"start": start,
				"end": end
			}) + "\n"

			acc = 0.0
			start = None
			end = None
			transcription = ""

	if transcription:
		yield json.dumps({
			"transcription": transcription,
			"start": start,
			"end": end
		}) + "\n"