from gradio import Blocks
import gradio as gr
from pydub import AudioSegment
import tempfile

from pipeline.transcriber import transcribe_audio


def convert_to_mp3(wav_path: str) -> str:
	mp3_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
	mp3_path = mp3_file.name
	mp3_file.close()

	audio = AudioSegment.from_file(wav_path)
	audio.export(mp3_path, format="mp3")

	return mp3_path


def handle_audio(audio):
	if audio is None:
		yield "No audio provided", "", None
		return

	if isinstance(audio, str):
		wav_path = audio
	else:
		tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
		AudioSegment(
			audio[1].tobytes(),
			frame_rate=audio[0],
			sample_width=audio[1].dtype.itemsize,
			channels=1
		).export(tmp.name, format="wav")
		wav_path = tmp.name

	mp3_path = convert_to_mp3(wav_path)

	full_text = ""
	yield "Transcribing...", full_text, mp3_path

	for chunk_load in transcribe_audio(mp3_path):
		full_text += chunk_load["text"] + " "
		yield "Transcribing...", full_text, mp3_path

	yield "Done", full_text, mp3_path

def build_page() -> Blocks:
	with gr.Blocks() as app:
		gr.Markdown("# Alpha Sound")

		with gr.Row(equal_height=True):
			with gr.Column(scale=1):

				audio_input = gr.Audio(
					sources=["microphone", "upload"],
					type="filepath",
					label="Record or Upload Audio"
				)

				transcribe_button = gr.Button("Process Audio")

				audio_output = gr.File(label="Generated MP3")

			with gr.Column(scale=4):
				status_label = gr.Textbox("...", label="Status")

				live_transcription = gr.Textbox(
					lines=25,
					label="Transcription",
					show_label=True
				)

		transcribe_button.click(
			fn=handle_audio,
			inputs=audio_input,
			outputs=[status_label, live_transcription, audio_output]
		)

	return app