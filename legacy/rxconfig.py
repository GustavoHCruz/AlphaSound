import reflex as rx

config = rx.Config(
	app_name="alpha_sound",
    plugins=[
        rx.plugins.SitemapPlugin(),
        rx.plugins.TailwindV4Plugin(),
    ]
)