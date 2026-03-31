from reflex.components.radix.themes.layout.box import Box

from alpha_sound.components.app_layout import app_layout
from alpha_sound.components.main_content import main_content


def home() -> Box:
	return app_layout(
		main_content()
	)