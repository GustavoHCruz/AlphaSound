import reflex as rx
from reflex.components.radix.themes.layout.box import Box

from alpha_sound.components.sidebar import sidebar, toggle_button
from alpha_sound.state.app_state import AppState


def overlay() -> rx.Component:
	return rx.cond(
		AppState.is_sidebar_open,
		rx.box(
			position="fixed",
			top="0",
			left="0",
			width="100vw",
			height="100vh",
			background="transparent",
			z_index="900",
			pointer_events="none"
		),
		rx.fragment(),
	)

def container(content: rx.Component) -> Box:
	return rx.box(
		content,
		width="100%",
		max_width="900px",
		margin="0 auto",
		padding="2em",
		background="white",
		border_radius="16px",
		box_shadow="0 4px 20px rgba(0,0,0,0.08)",
	)

def app_layout(content: rx.Component) -> Box:
	return rx.box(
		sidebar(),
		toggle_button(),
		overlay(),

		rx.flex(
			container(content),
			justify="center",
			width="100%",
			min_height="100vh",
			padding="2em",
		),
	)