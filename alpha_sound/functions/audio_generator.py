import subprocess
import uuid
import os

def cut_audio(
	input_path: str,
	start: float,
	end: float,
	output_dir: str
) -> str:
	output_path = os.path.join(output_dir, f"{uuid.uuid4()}.mp3")

	result = subprocess.run(
	[
		"ffmpeg",
		"-i", input_path,
		"-ss", str(start),
		"-to", str(end),
		"-c", "copy",
		output_path
	],
	stdout=subprocess.DEVNULL,
	stderr=subprocess.DEVNULL
)

	if result.returncode != 0 or not os.path.exists(output_path):
		raise RuntimeError("FFmpeg failed to cut audio segment")

	return output_path