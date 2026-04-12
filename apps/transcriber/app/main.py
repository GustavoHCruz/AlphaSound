from fastapi import FastAPI
from fastapi.responses import StreamingResponse

from app.models import TranscribeRequest
from app.service import generate_segments, transcribe_audio

app = FastAPI()

@app.post("/transcribe")
def transcribe(req: TranscribeRequest) -> StreamingResponse:
	raw_segments = transcribe_audio(req.audio_path)

	return StreamingResponse(
		generate_segments(raw_segments, req.audio_minimal_size),
		media_type="application/x-ndjson"
	)

@app.get("/ping")
def pong() -> str:
	return "Pong!"