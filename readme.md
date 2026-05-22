# AlphaSound

Modular pipeline for audio transcription and session management, using a distributed architecture with **NestJS (backend)**, **FastAPI (transcription microservice)**, and **Next.js (frontend)**.

The system is designed to process audio asynchronously, segment transcriptions, and offer a simple interface for navigation and analysis.

---

## Setup

Make sure you have [ffmpeg](https://ffmpeg.org/) installed and acessible for the application, as it depends of it to work.

### Transcriber (FastAPI)

Setup the enviroment file (`.env`):

```bash
WHISPER_MODEL_SIZE=			# small | medium | large
WHISPER_DEVICE=				# cuda | cpu
LANGUAGE=						# en | pt | fr | es
```

Then, install the dependencies and run the application:

```bash
cd transcriber
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8080
```

---

### API (NestJS)

Setup the enviroment file (`.env`):

```bash
PORT=8000
JWT_SECRET=your-jwt-secret
DATABASE_URL=file:db.sqlite						# sqlite file
TRANSCRIBER_API_URL=http://localhost:8080
```

Then, you may install the dependencies:

```bash
cd api
npm install
```

Create the database:

```bash
npx prisma migrate dev
npm run start:dev
```

---

### Web (Next.js)

Setup the enviroment file (`.env`):

`.env`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Install the dependencies and run the application:

```bash
cd web
npm install
npm run start
```
