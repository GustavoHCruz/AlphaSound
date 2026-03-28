import os

from dotenv import load_dotenv

load_dotenv()
gpus = os.getenv("GPUS")

if gpus:
	os.environ["CUDA_VISIBLE_DEVICES"] = gpus

from ui.page import build_page

def main() -> None:
	app = build_page()
	app.launch(
		server_name="0.0.0.0",
		server_port=7860,
		share=False
	)

if __name__ == "__main__":
	main()