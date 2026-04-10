from pydantic import BaseModel

class TranscriptionSegment(BaseModel):
	transcription: str
	start: float
	end: float

class TranscribeRequest(BaseModel):
	audio_path: str
	group: bool = True