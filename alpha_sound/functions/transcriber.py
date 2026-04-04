from typing import Iterator

from faster_whisper import WhisperModel

from alpha_sound.models.schema import TranscriptionSegment

model_size = "large-v3"
model = WhisperModel(model_size, device="cuda", compute_type="float16")

def transcribe_audio(
	audio_path: str
) -> Iterator[TranscriptionSegment]:
	segments, _ = model.transcribe(audio_path, beam_size=5, language="pt")

	for segment in segments:
		yield TranscriptionSegment(
			text=segment.text.strip(),
			start=segment.start,
			end=segment.end
		)