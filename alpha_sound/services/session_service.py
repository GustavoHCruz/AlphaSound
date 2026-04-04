from alpha_sound.models.schema import Session
import csv


def load_sessions_from_csv() -> list[Session]:
	sessions = []

	with open("./data/sessions.csv", newline="", encoding="utf-8") as f:
		reader = csv.DictReader(f)
		
		for row in reader:
			sessions.append(Session(**row))
	
	return sessions