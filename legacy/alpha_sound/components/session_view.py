import reflex as rx

from alpha_sound.components.segment import segment_item
from alpha_sound.models.schema import Session
from alpha_sound.state.app_state import AppState


import reflex as rx
from alpha_sound.components.segment import segment_item
from alpha_sound.models.schema import Session
from alpha_sound.state.app_state import AppState


def session_view(session: Session) -> rx.Component:
	return rx.vstack(

		rx.input(
			value=session.name,
			on_change=lambda value: AppState.set_session_name(session.id, value),
			font_size="1.5em",
			font_weight="bold",
			width="100%"
		),

		rx.foreach(
			session.segments,
			segment_item
		),

		spacing="4",
		width="100%"
	)

def sessions_list() -> rx.Component:
	return rx.vstack(
		rx.foreach(
			AppState.sessions,
			lambda session: rx.cond(
				session.id == AppState.current_session_id,
				session_view(session),
				rx.box()
			)
		),
		width="100%"
	)