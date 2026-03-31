import reflex as rx

from alpha_sound.models.schema import Session

class AppState(rx.State):
	sessions: list[Session] = []
	current_session_id: str = ""

	transcripts: dict[str, list[dict]] = {}
	notes: dict[str, dict[str, str]] = {}

	is_sidebar_open: bool = True

	@rx.event
	def toggle_sidebar(self) -> None:
		self.is_sidebar_open = not self.is_sidebar_open

	@rx.event
	def set_session(
		self,
		session_id: str
	) -> None:
		self.current_session_id = session_id