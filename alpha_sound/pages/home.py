import reflex as rx
from reflex.components.radix.themes.layout.box import Box

from alpha_sound.components.main_content import main_content
from alpha_sound.components.sidebar import sidebar, toggle_button

def home() -> Box:
	return rx.box(
		toggle_button(),
		sidebar(),

		rx.flex(
			main_content(),
			justify="center",
			width="100%",
			min_height="100vh",
		)
	)