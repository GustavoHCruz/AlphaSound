import subprocess
import uuid
import os

def cut_audio(input_path, start, end, output_dir) -> str:
	output_path = os.path.join(output_dir, f"{uuid.uuid4()}.mp3")

	subprocess.run([
		"ffmpeg",
		"-i", input_path,
		"-ss", str(start),
		"-to", str(end),
		"-c", "copy",
		output_path
	], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

	return output_path