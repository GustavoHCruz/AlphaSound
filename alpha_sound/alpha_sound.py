import reflex as rx
from alpha_sound.pages.home import index

app = rx.App(
	style={
		"background": "#f8fafc",
		"color": "#0f172a"
	},
	theme=rx.theme(
		appearance="light",
		has_background=False,
		radius="full",
		accent_color="teal"
	)
)

app.add_page(index, title="Alpha Sound | Home")
