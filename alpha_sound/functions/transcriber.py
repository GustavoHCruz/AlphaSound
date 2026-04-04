from typing import Iterator

from faster_whisper import WhisperModel

from alpha_sound.models.schema import TranscriptionSegment

model_size = "large-v3"
model = WhisperModel(model_size, device="cuda", compute_type="float16")

def group_segments(
	segments: list[TranscriptionSegment],
	max_duration: float = 15.0,
	max_gap: float = 1.0
) -> list[TranscriptionSegment]:

	grouped = []
	current = []

	start_time = None

	for seg in segments:
		if not current:
			current = [seg]
			start_time = seg.start
			continue

		duration = seg.end - start_time
		gap = seg.start - current[-1].end

		if (
			duration > max_duration
			or gap > max_gap
			or current[-1].text.endswith((".", "!", "?"))
		):
			grouped.append(_merge(current))
			current = [seg]
			start_time = seg.start
		else:
			current.append(seg)

	if current:
		grouped.append(_merge(current))

	return grouped


def _merge(segments: list[TranscriptionSegment]) -> TranscriptionSegment:
	return TranscriptionSegment(
		text=" ".join(s.text for s in segments),
		start=segments[0].start,
		end=segments[-1].end
	)

def transcribe_audio(
	audio_path: str
) -> Iterator[TranscriptionSegment]:
	segments, _ = model.transcribe(
		audio_path,
		beam_size=5, 
		language="pt",
		vad_filter=True,
		vad_parameters=dict(
			min_silence_duration_ms=1000 
		)
	)

	for segment in segments:
		yield TranscriptionSegment(
			text=segment.text.strip(),
			start=segment.start,
			end=segment.end
		)