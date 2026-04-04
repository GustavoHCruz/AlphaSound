import reflex as rx

from alpha_sound.models.schema import Session
from alpha_sound.services.audio_service import save_all_sessions
from alpha_sound.services.session_service import load_sessions_from_csv

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
	
	@rx.event
	def set_note(self, segment_id: str, value: str) -> None:
		if self.current_session_id not in self.notes:
			self.notes[self.current_session_id] = {}

		self.notes[self.current_session_id][segment_id] = value
	
	@rx.event
	def set_session_name(self, session_id: str, value: str) -> None:
		if not value:
			return

		for session in self.sessions:
			if session.id == session_id:
				session.name = value
				break

		save_all_sessions(
			self.sessions,
			"./data/sessions.csv",
			"./data/segments.csv"
		)
	
	@rx.event
	async def load_sessions(self) -> None:
		sessions = load_sessions_from_csv()

		self.sessions = sessions
		
		if sessions:
			self.current_session_id = sessions[0].id

	@rx.event
	def add_session(self, session: Session) -> None:
		self.sessions.append(session)
		self.current_session_id = session.id

		save_all_sessions(
			self.sessions,
			"./data/sessions.csv",
			"./data/segments.csv"
		)