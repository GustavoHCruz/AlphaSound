from alpha_sound.components.empty_state import empty_state
from alpha_sound.components.session_view import sessions_list
from alpha_sound.state.app_state import AppState
import reflex as rx

def main_content() -> rx.Component:
	return rx.cond(
		AppState.sessions.length() == 0, # type: ignore
		empty_state(),
		sessions_list()
	)