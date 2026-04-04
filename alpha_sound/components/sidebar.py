import reflex as rx
from reflex.components.radix.themes.components.button import Button
from reflex.components.radix.themes.layout.box import Box
from alpha_sound.state.app_state import AppState

def toggle_button() -> Button:
	return rx.button(
		rx.icon(
			"menu",
			size=20,
			color=rx.cond(
				AppState.is_sidebar_open,
				"white",
				"black"
			)
		),
		on_click=AppState.toggle_sidebar,

		position="fixed",
		top="12px",
		left="12px",
		z_index="1100",

		variant="ghost",

		border=rx.cond(
			AppState.is_sidebar_open,
			"1px solid white",
			"1px solid black"
		),

		border_radius="10px",
		padding="6px 10px",

		box_shadow="0 2px 8px rgba(0,0,0,0.15)",

		_hover=rx.cond(
			AppState.is_sidebar_open,
			{"background": "1px solid white"},
			{"background": "1px solid black"}
		),

		transition="all 0.2s ease"
	)

def sidebar() -> Box:
	return rx.box(
		rx.vstack(
			rx.heading("Sessions"),

			rx.foreach(
				AppState.sessions,
				lambda session: rx.button(
					session.name,
					on_click=AppState.set_session(session.id)
				)
			),
			padding="1em",
			padding_top="4em",
			align_items="start",
			height="100%",
		),

		position="fixed",
		top="0",
		left="0",
		width="300px",
		height="100vh",

		background="""
		linear-gradient(
			160deg,
			#0f2027 0%,
			#134e5e 40%,
			#2c7a7b 100%
		)
		""",

		color="white",

		backdrop_filter="blur(10px)",
		border_right="1px solid rgba(255,255,255,0.1)",

		transform=rx.cond(
			AppState.is_sidebar_open,
			"translateX(0)",
			"translateX(-100%)"
		),

		transition="transform 0.25s ease",
		z_index="1000"
	)