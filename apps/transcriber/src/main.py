from fastapi import FastAPI
from fastapi.responses import RedirectResponse, StreamingResponse
from src.models import TranscribeRequest
from src.service import generate_segments, save_temp_audio, transcribe_audio

app = FastAPI()


@app.get("/")
def root() -> RedirectResponse:
    return RedirectResponse(url="/docs")


@app.post("/transcribe")
def transcribe(req: TranscribeRequest) -> StreamingResponse:
    audio_path = save_temp_audio(req.audio_base64)

    raw_segments = transcribe_audio(audio_path)

    return StreamingResponse(
        generate_segments(raw_segments, req.audio_minimal_size, audio_path),
        media_type="application/x-ndjson",
    )


@app.get("/ping")
def pong() -> str:
    return "Pong!"
