import json
from typing import Iterator

from app.models import TranscriptionSegment


def stream_segments(
	segments: Iterator[TranscriptionSegment]
) -> Iterator[str]:
	for seg in segments:
		yield json.dumps(seg.model_dump()) + "\n"