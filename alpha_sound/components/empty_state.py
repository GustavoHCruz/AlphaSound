import reflex as rx

from alpha_sound.state.app_state import AppState

def empty_state():
	return rx.vstack(
		rx.icon("upload", size=40),

		rx.heading("No sessions yet"),
		rx.text("Upload an audio file to get started"),

		rx.upload(
			rx.button("Upload audio"),
			on_drop=AppState.handle_upload,
			border="1px dashed var(--gray-6)",
			padding="2em",
			border_radius="12px",
		),

		spacing="4",
		align="center",
		justify="center",
		height="70vh",
		text_align="center"
	)