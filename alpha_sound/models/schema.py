from pydantic import BaseModel
from datetime import datetime

class Segment(BaseModel):
	id: str
	text: str
	start: float
	end: float
	audio_path: str
	description: str = ""

class Session(BaseModel):
	id: str
	session_name: str
	date: datetime
	segments: list[Segment]

class TranscriptionSegment(BaseModel):
	text: str
	start: float
	end: float