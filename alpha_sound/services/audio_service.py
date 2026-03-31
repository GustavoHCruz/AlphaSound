from uuid import uuid4
from datetime import datetime

import csv
from alpha_sound.configs.paths import SEGMENTS_DIR
from alpha_sound.models.schema import Segment, Session
from alpha_sound.services.audio_generator import cut_audio

def build_session(audio_path: str, raw_segments) -> Session:
	from alpha_sound.services.text_processing import group_segments_by_sentence

	grouped = group_segments_by_sentence(raw_segments)

	segments: list[Segment] = []

	for group in grouped:
		text = " ".join(s["text"] for s in group)
		start = group[0]["start"]
		end = group[-1]["end"]

		audio_cut = cut_audio(audio_path, start, end, SEGMENTS_DIR)

		segments.append(Segment(
			id=str(uuid4()),
			text=text,
			start=start,
			end=end,
			audio_path=audio_cut
		))

	return Session(
		id=str(uuid4()),
		session_name=datetime.now().strftime("%Y-%m-%d %H:%M"),
		date=datetime.now(),
		segments=segments
	)

def save_session_csv(session, path) -> None:
	with open(path, "w", newline="", encoding="utf-8") as f:
		writer = csv.writer(f)

		writer.writerow([
			"session_id", "segment_id", "text",
			"start", "end", "audio_path", "description"
		])

		for seg in session["segments"]:
			writer.writerow([
				session["id"],
				seg["id"],
				seg["text"],
				seg["start"],
				seg["end"],
				seg["audio_path"],
				seg.get("description", "")
			])