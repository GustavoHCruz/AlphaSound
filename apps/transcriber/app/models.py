from pydantic import BaseModel

class TranscriptionSegment(BaseModel):
	text: str
	start: float
	end: float

class TranscribeRequest(BaseModel):
	audio_path: str
	group: bool = True