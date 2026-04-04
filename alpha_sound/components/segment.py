import reflex as rx
from alpha_sound.models.schema import Segment
from alpha_sound.state.app_state import AppState


def format_time(t: float) -> str:
	return f"{t:.2f}"


def segment_item(segment: Segment) -> rx.Component:
	return rx.box(
		rx.vstack(

			rx.text(
				f"Time: {format_time(segment.start)}s - {format_time(segment.end)}s",
				font_size="0.8em",
				color="gray"
			),

			rx.text_area(
				placeholder="Write notes...",
				value=AppState.notes.get(
					AppState.current_session_id, {}
				).get(segment.id, ""),
				on_change=lambda value: AppState.set_note(segment.id, value),
				width="100%"
			),

			rx.audio(
				src=segment.audio_path,
				controls=True,
				width="100%"
			),

			rx.text(
				segment.text,
				white_space="pre-wrap"
			),

			align_items="start",
			spacing="2",
			width="100%"
		),

		padding="12px",
		border="1px solid #eee",
		border_radius="8px",
		width="100%"
	)