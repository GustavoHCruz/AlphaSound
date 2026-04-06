import reflex as rx

from alpha_sound.state.upload_state import UploadState

def processing_overlay() -> rx.Component:
	return rx.cond(
		UploadState.is_processing,
		rx.box(
			rx.vstack(
				rx.spinner(size="3"),

				rx.text(UploadState.current_step),

				rx.progress(
					value=(UploadState.progress * 100).to(int), # type: ignore
					width="300px"
				),

				align="center",
				spacing="4"
			),
			position="fixed",
			top="0",
			left="0",
			width="100vw",
			height="100vh",
			background="rgba(0,0,0,0.5)",
			display="flex",
			align_items="center",
			justify_content="center",
			z_index="999"
		)
	)