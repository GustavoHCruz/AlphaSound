from pydantic import BaseModel

class TranscriptionSegment(BaseModel):
	transcription: str
	start: float
	end: float

class TranscribeRequest(BaseModel):
	audio_base64: str
	audio_minimal_size: int = 30