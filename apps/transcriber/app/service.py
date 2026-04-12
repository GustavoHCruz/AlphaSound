from typing import Iterator, List
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


def group_segments(
	segments: List[TranscriptionSegment],
	max_duration: float = 15.0,
	max_gap: float = 1.0
) -> List[TranscriptionSegment]:

	grouped = []
	current = []
	start_time = 0.0

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
			or current[-1].transcription.endswith((".", "!", "?"))
		):
			grouped.append(_merge(current))
			current = [seg]
			start_time = seg.start
		else:
			current.append(seg)

	if current:
		grouped.append(_merge(current))

	return grouped


def _merge(segments: List[TranscriptionSegment]) -> TranscriptionSegment:
	return TranscriptionSegment(
		transcription=" ".join(s.transcription for s in segments),
		start=segments[0].start,
		end=segments[-1].end
	)