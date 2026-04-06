import reflex as rx
from reflex.components.radix.themes.layout.box import Box

from alpha_sound.components.app_layout import app_layout
from alpha_sound.components.main_content import main_content
from alpha_sound.components.processing import processing_overlay
from alpha_sound.state.app_state import AppState

@rx.page(on_load=AppState.load_sessions)
def index() -> Box:
	return app_layout(
		rx.box(
			rx.text(AppState.current_session_id),
			main_content(),
			processing_overlay()
		)
	)