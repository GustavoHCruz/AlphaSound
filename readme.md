# AlphaSound

Modular pipeline for audio transcription and session management, using a distributed architecture with **NestJS (backend)**, **FastAPI (transcription microservice)**, and **Next.js (frontend)**.

The system is designed to process audio asynchronously, segment transcriptions, and offer a simple interface for navigation and analysis.

---

## Setup

### API (NestJS)

```bash
cd api
npm install
```

`.env`:

PORT=
JWT_SECRET=
DATABASE_URL= #sqlite file
TRANSCRIBER_API_URL=

```bash
npx prism migrate dev
npm run start:dev
```

---

### Transcriber (FastAPI)

```bash
cd transcriber
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

### Web (Next.js)

```bash
cd web
npm install
npm run start
```
