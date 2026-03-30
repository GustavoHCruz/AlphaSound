# AlphaSound - Audio Transcription Platform

## Overview

AlphaSound is a local-first audio transcription application designed to process uploaded audio files and convert them into text using state-of-the-art speech recognition models.

The system leverages:

- Reflex for building the web interface and handling application state
- faster-whisper for efficient and high-quality speech-to-text transcription
- A modular Python architecture for scalability and future extensions

The goal is to provide a simple, fast, and extensible transcription pipeline, capable of evolving into more advanced audio understanding systems.

## Installation

Requirements

- Python 3.10+
- FFmpeg installed on system

### Setup

```bash
pip install -r requirements.txt
```

Run the Application

```bash
python main.py
```

### Dependencies

Main dependencies include:

- reflex — Web framework for UI and state management
- faster-whisper - Optimized Whisper inference
- torch - Model execution backend
- ffmpeg-python or system FFmpeg - Audio processing
