from alpha_sound.components.empty_state import empty_state
from alpha_sound.state.app_state import AppState
import reflex as rx

def main_content() -> rx.Component:
	return rx.cond(
		AppState.sessions.length() == 0, # type: ignore

		empty_state(),

		rx.box(
			rx.audio(
				src="",
				controls=True
			),
			width="100%",
			max_width="800px",
			margin="0 auto",
			padding="2em",
		)
	)