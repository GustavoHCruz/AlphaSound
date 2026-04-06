from typing import Iterator
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

from app.models import TranscribeRequest
from app.service import transcribe_audio, group_segments
from app.streaming import stream_segments

app = FastAPI()

@app.post("/transcribe")
def transcribe(req: TranscribeRequest) -> StreamingResponse:
	raw_segments = transcribe_audio(req.audio_path)

	if req.group:
		segments = list(raw_segments)
		grouped = group_segments(segments)

		def generator() ->Iterator[str]:
			for seg in grouped:
				yield seg.model_dump_json() + "\n"

		return StreamingResponse(generator(), media_type="application/x-ndjson")

	return StreamingResponse(
		stream_segments(raw_segments),
		media_type="application/x-ndjson"
	)