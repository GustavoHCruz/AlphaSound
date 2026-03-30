import reflex as rx
from reflex.components.radix.themes.layout.box import Box
from alpha_sound.state.app_state import AppState

def toggle_button():
	return rx.button(
		rx.icon("menu", size=20),
		on_click=AppState.toggle_sidebar,

		position="fixed",
		top="12px",
		left="12px",
		z_index="1100",

		background=rx.cond(
			AppState.is_sidebar_open,
			"rgba(255,255,255,0.05)",
			"rgba(0,0,0,0.05)"
		),

		color=rx.cond(
			AppState.is_sidebar_open,
			"white",
			"black"
		),

		border=rx.cond(
			AppState.is_sidebar_open,
			"1px solid rgba(255,255,255,0.3)",
			"1px solid rgba(0,0,0,0.2)"
		),

		box_shadow="0 2px 8px rgba(0,0,0,0.15)",
		backdrop_filter="blur(6px)",
		border_radius="10px",

		padding="6px 10px",

		_hover={
			"background": rx.cond(
				AppState.is_sidebar_open,
				"rgba(255,255,255,0.15)",
				"rgba(0,0,0,0.08)"
			)
		},

		transition="all 0.2s ease"
	)

def sidebar() -> Box:
	return rx.box(
		rx.vstack(
			rx.heading("Sessions"),

			rx.foreach(
				AppState.sessions,
				lambda session: rx.button(
					session.filename,
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