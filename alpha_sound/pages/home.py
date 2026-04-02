import reflex as rx
from reflex.components.radix.themes.layout.box import Box

from alpha_sound.components.app_layout import app_layout
from alpha_sound.components.main_content import main_content
from alpha_sound.components.processing import processing_overlay

def home() -> Box:
	return app_layout(
		rx.box(
			main_content(),
			processing_overlay()
		)
	)