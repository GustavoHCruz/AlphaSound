import base64
import json
import os
import subprocess
import tempfile
from typing import Iterator

import torch
from dotenv import load_dotenv
from faster_whisper import WhisperModel
from src.models import TranscriptionSegment

load_dotenv()

MODEL_SIZE = os.getenv("WHISPER_MODEL_SIZE", "large").lower()
DEVICE = os.getenv("WHISPER_DEVICE", "cpu").lower()
LANGUAGE = os.getenv("LANGUAGE", "en").lower()

MODEL_MAP = {"large": "large-v3", "medium": "medium", "small": "small"}

model_name = MODEL_MAP.get(MODEL_SIZE, "large-v3")

if DEVICE == "cuda" and not torch.cuda.is_available():
    print("CUDA requested but unavailable. Falling back to CPU.")
    DEVICE = "cpu"
compute_type = "float16" if DEVICE == "cuda" else "int8"

model = WhisperModel(model_name, device=DEVICE, compute_type=compute_type)


def transcribe_audio(audio_path: str) -> Iterator[TranscriptionSegment]:
    segments, _ = model.transcribe(
        audio_path,
        beam_size=5,
        language=LANGUAGE,
        vad_filter=True,
        vad_parameters=dict(min_silence_duration_ms=1000),
    )

    for segment in segments:
        yield TranscriptionSegment(
            transcription=segment.text.strip(), start=segment.start, end=segment.end
        )


def generate_segments(
    raw_segments: Iterator[TranscriptionSegment], min_size: int, audio_path: str
) -> Iterator[str]:
    acc = 0.0
    start: float | None = None
    end: float | None = None
    transcription = ""

    for segment in raw_segments:
        acc += segment.end - segment.start

        if start is None:
            start = segment.start

        end = segment.end
        transcription += f" {segment.transcription}"

        if acc >= min_size:
            audio_b64 = cut_audio_segment_base64(audio_path, start, end)

            yield (
                json.dumps(
                    {
                        "transcription": transcription.strip(),
                        "start": start,
                        "end": end,
                        "audio_base64": audio_b64,
                    }
                )
                + "\n"
            )

            acc = 0.0
            start = None
            end = None
            transcription = ""

    if transcription:
        audio_b64 = cut_audio_segment_base64(audio_path, start or 0.0, end or 0.0)

        yield (
            json.dumps(
                {
                    "transcription": transcription.strip(),
                    "start": start,
                    "end": end,
                    "audio_base64": audio_b64,
                }
            )
            + "\n"
        )

    if os.path.exists(audio_path):
        os.remove(audio_path)


def save_temp_audio(audio_base64: str) -> str:
    data = base64.b64decode(audio_base64)

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    tmp.write(data)
    tmp.flush()
    tmp.close()

    return tmp.name


def cut_audio_segment_base64(input_path: str, start: float, end: float) -> str:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_out:
        output_path = tmp_out.name

    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        input_path,
        "-ss",
        str(start),
        "-to",
        str(end),
        "-c",
        "copy",
        output_path,
    ]

    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    with open(output_path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")

    os.remove(output_path)

    return encoded
