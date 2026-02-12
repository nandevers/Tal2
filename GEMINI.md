# Project Overview
You live on Powershell.


This project is a full-stack web application consisting of a React frontend and a Python FastAPI backend. The entire application is containerized using Docker, making it easy to build and run.

You must use the mock.html for design guidance. 

NEVER TOUCH THE .env files 

# Services

The application is composed of four main services orchestrated by `docker-compose.yml`:

## 1. Frontend

* **Framework:** React with Vite (TypeScript)
* **Dependencies:** `react`, `lucide-react`, `tailwindcss`.
* **Description:** Modern SPA served by Nginx.

## 2. Backend

* **Framework:** FastAPI (Python)
* **Dependencies:** `fastapi`, `uvicorn`, `sqlalchemy`, `google-genai`.
* **Description:** API providing data and GenAI logic to the frontend.

## 3. Generative AI

* **SDK:** `google-genai` (Unified SDK)
* **Model:** `gemini-2.0-flash`
* **Config:** Requires `GEMINI_API_KEY` environment variable.

## 4. Nginx

* **Description:** Reverse proxy for API routing and static file serving.

# Building and Running
Always dettach:

1. **Build and start:**
```bash
docker-compose up -d --build 

```


2. **View App:** `http://localhost:5174`
3. **Stop:** `docker-compose down`

# Development Conventions

## Frontend

* **Management:** `npm install` in `nexus-light-app`.
* **Scripts:** `npm run dev` (development), `npm run build` (production).

## Backend & AI

* **Management:** `pip install -r requirements.txt`.
* **Local Server:** `uvicorn main:app --host 0.0.0.0 --port 8000`.
* **GenAI:** Use the `aio` (asynchronous) client for non-blocking requests.

