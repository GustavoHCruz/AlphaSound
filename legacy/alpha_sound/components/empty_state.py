import reflex as rx
from reflex.components.radix.themes.layout.stack import VStack

from alpha_sound.state.upload_state import UploadState

def empty_state() -> VStack:
	return rx.vstack(
		rx.icon(
			"upload",
			color="black",
			size=40
		),

		rx.heading(
			"No sessions yet",
			color="black"
		),
		rx.text(
			"Upload an audio file to get started",
		),

		rx.upload(
			rx.box(
				rx.vstack(
					rx.button("Upload audio"),
					rx.text("or drag and drop here"),
					spacing="3",
					align="center"
				),
				width="100%"
			),
			id="upload_audio",

			on_drop=UploadState.handle_upload,

			border="1px dashed var(--gray-6)",
			padding="2em",
			border_radius="12px",
			width="100%"
		),

		spacing="4",
		align="center",
		justify="center",
		height="70vh",
		text_align="center"
	)