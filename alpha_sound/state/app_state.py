import reflex as rx

from alpha_sound.models.schema import Session

class AppState(rx.State):
	sessions: list[Session] = []
	current_session_id: str = ""

	transcripts: dict[str, list[dict]] = {}
	notes: dict[str, dict[str, str]] = {}

	is_sidebar_open: bool = True

	is_processing: bool = False

	def toggle_sidebar(self):
		self.is_sidebar_open = not self.is_sidebar_open

	def set_session(
		self,
		session_id: str
	) -> None:
		self.current_session_id = session_id


	async def handle_upload(self, files: list[rx.UploadFile]):
		self.is_processing = True

		for file in files:
			upload_data = await file.read()

			# TODO: salvar arquivo / mandar pro backend
			# ex: session = await process_audio(upload_data)

			session = {
				"id": "temp_id",  # substitui depois
				"filename": file.filename
			}
			self.current_session_id = session["id"]

			self.sessions.append(session)


		self.is_processing = False