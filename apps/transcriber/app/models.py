from pydantic import BaseModel

class TranscriptionSegment(BaseModel):
	transcription: str
	start: float
	end: float

class TranscribeRequest(BaseModel):
	audio_path: str
	audio_minimal_size: int = 30