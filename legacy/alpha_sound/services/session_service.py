from pathlib import Path

from alpha_sound.models.schema import Session, Segment
import csv
from collections import defaultdict
from datetime import datetime


def load_segments_grouped() -> dict[str, list[Segment]]:
	segments_by_session = defaultdict(list)

	with open("./data/segments.csv", newline="", encoding="utf-8") as f:
		reader = csv.DictReader(f)

		for row in reader:
			try:
				segment = Segment(
					id=row["segment_id"],
					text=row["text"],
					start=float(row["start"]),
					end=float(row["end"]),
					audio_path = f"/segments/{Path(row['audio_path']).name}",
					description=row.get("description") or ""
				)

				segments_by_session[row["session_id"]].append(segment)

			except Exception as e:
				print(f"[SEGMENT ERROR] {row} -> {e}")

	return segments_by_session


def load_sessions_from_csv() -> list[Session]:
	sessions = []

	segments_map = load_segments_grouped()

	with open("./data/sessions.csv", newline="", encoding="utf-8") as f:
		reader = csv.DictReader(f)

		for row in reader:
			try:
				session = Session(
					id=row["id"],
					name=row["name"],
					date=datetime.fromisoformat(row["date"]),
					segments=segments_map.get(row["id"], [])
				)

				sessions.append(session)

			except Exception as e:
				print(f"[SESSION ERROR] {row} -> {e}")

	return sessions