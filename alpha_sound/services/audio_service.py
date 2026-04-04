from uuid import uuid4
from datetime import datetime

import csv

from alpha_sound.configs.paths import SEGMENTS_DIR
from alpha_sound.models.schema import Segment, Session, TranscriptionSegment
from alpha_sound.functions.audio_generator import cut_audio

def save_session_csv(
	session: Session,
	path: str
) -> None:
	with open(path, "w", newline="", encoding="utf-8") as f:
		writer = csv.writer(f)

		writer.writerow([
			"session_id", "segment_id", "text",
			"start", "end", "audio_path", "description"
		])

		for segment in session.segments:
			writer.writerow([
				session.id,
				segment.id,
				segment.text,
				segment.start,
				segment.end,
				segment.audio_path,
				segment.description
			])

def build_session(
	audio_path: str,
	raw_segments: list[TranscriptionSegment]
) -> Session:
	segments: list[Segment] = []

	for segment in raw_segments:
		text = segment.text.strip()
		start = segment.start
		end = segment.end

		audio_cut = cut_audio(audio_path, start, end, SEGMENTS_DIR)

		segments.append(Segment(
			id=str(uuid4()),
			text=text,
			start=start,
			end=end,
			audio_path=audio_cut
		))


	session = Session(
		id=str(uuid4()),
		session_name=datetime.now().strftime("%Y-%m-%d %H:%M"),
		date=datetime.now(),
		segments=segments
	)

	save_session_csv(
		session=session,
		path="./data/sessions.csv"
	)

	return session