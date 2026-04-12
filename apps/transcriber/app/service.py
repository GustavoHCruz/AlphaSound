import json
from typing import Iterator
from faster_whisper import WhisperModel

from app.models import TranscriptionSegment

model = WhisperModel(
	"large-v3",
	device="cpu"
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
		transcription += segment.transcription

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