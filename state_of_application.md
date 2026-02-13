# State of Nexus Light Application - February 13, 2026

This document details the current state of the Nexus Light application, covering its frontend, backend, and deployment aspects, with a focus on recent modernizations and the Generative AI integration.

## 1. Frontend (React/Vite)

The frontend is a React Single Page Application (SPA) built with Vite, utilizing Tailwind CSS for styling and Lucide Icons for iconography. It serves as the primary user interface for interacting with the sales OS features.

### Key UI Features & Modernizations:

*   **Segmented Control for Entity Filtering:**
    *   Located directly beneath the main search input field.
    *   Pill-shaped buttons for "People (X)" and "Companies (Y)", where X and Y dynamically represent the counts of filtered entities.
    *   Allows users to quickly toggle between viewing only individuals or only businesses in the search results list.
*   **Enhanced Entity Cards with Contextual Metadata:**
    *   Each entity in the search results is displayed in a card format.
    *   **Always-Visible Status Badge:** Next to the entity's name (e.g., "Elena Silva [Active]"), a small, colored badge displays its current status (e.g., "Active", "Target", "New").
    *   **Contextual Badge:** In the top-right of the card, a subtle, semi-transparent badge dynamically shows:
        *   The **Job Title** (e.g., "VP Sales") for "People" entities, with a light blue background.
        *   The **Industry** (e.g., "Fintech") for "Company" entities, with a light purple background.
    *   **Detailed Information Line:** The second line of text provides further context, including the company and source for people (e.g., "TechFlow • LinkedIn Sales Nav") or location and source for businesses (e.g., "São Paulo • Google Places").
*   **Progressive Disclosure with Hover Actions:**
    *   **Interactive Right Side:** The right side of the entity card is interactive.
    *   **On Hover Transition:** When the user hovers over a card, the contextual badge smoothly fades out, and a set of action icons smoothly appears in its place.
    *   **Action Icons:**
        *   **"Quick Add"** (plus icon): Allows adding the entity to a campaign.
        *   **"Email Contact"** (envelope icon): Appears specifically for "People" entities, enabling quick email initiation.
        *   **"View People in Company"** (users icon): Appears specifically for "Company" entities, to view associated individuals.
*   **Single Toggle for Selection:**
    *   Entity selection is now solely controlled by an explicit `ghost-checkbox` on the left side of each card.
    *   Clicking anywhere else on the card does not trigger selection, ensuring clear interaction.
*   **Dynamic Selection Action Bar:**
    *   When one or more entities are selected via their checkboxes, a floating action bar appears at the bottom of the screen.
    *   Displays the count of selected leads and provides a "Build Campaign" button, triggering further actions.

## 2. Backend (FastAPI/Python)

The backend is a FastAPI application written in Python, serving as the API layer and integrating Generative AI capabilities.

### Key Backend Features:

*   **Dynamic GenAI Model Fallback Chain:**
    *   The `MODEL_FALLBACK_CHAIN` is no longer a hardcoded list of models.
    *   **Dynamic Population on Startup:** On application startup, the `on_startup` event handler dynamically fetches a list of available Generative AI models from the Google GenAI API using `client.models.list()`.
    *   **Capability Filtering:** Models are filtered to include only those that support the `generateContent` method.
    *   **Prioritization:** A priority list (`gemini-1.5-pro`, `gemini-1.0-pro-001`, `gemini-1.0-pro`) is used to ensure preferred models are added to the fallback chain first, if available. Other compatible models are added subsequently.
    *   **Robustness:** Includes fallback logic to a default hardcoded list if the dynamic model listing fails.
    *   **Error Handling:** The system can now gracefully handle cases where a specific model is not available or exhausted (e.g., `429 RESOURCE_EXHAUSTED`), attempting the next model in the dynamically constructed chain.
*   **GenAI Client Initialization:** The GenAI client is initialized globally for model listing and then locally within `ai_search_generator` and `suggest_name` functions, using `GEMINI_API_KEY`.
*   **Intent Classification (Gate Keeper):** An AI model classifies user queries as "SEARCH" (requiring tool use) or "CHAT" (a conversational question).
*   **Tool-Using Agent:**
    *   Utilizes `search_web_tool` (powered by SerpApi) for external web searches.
    *   Utilizes `search_db_wrapper` for querying the local PostgreSQL database (via SQLAlchemy).
    *   The AI orchestrates the use of these tools to fulfill "SEARCH" intent queries.
*   **Streaming Responses:** The `/api/search` endpoint provides real-time updates on the AI's thought process and tool usage via `StreamingResponse`.
*   **Campaign Name Suggestion:** An endpoint (`/api/search/groups/suggest-name`) uses a GenAI model to suggest descriptive names for selected entity groups.

## 3. Deployment & Technologies

*   **Containerization:** The entire application is containerized using Docker and orchestrated with `docker-compose.yml`.
*   **Frontend Service:** Served by Nginx, built with Node.js/Vite.
*   **Backend Service:** Python FastAPI application.
*   **Database:** PostgreSQL (managed via SQLAlchemy).
*   **Generative AI SDK:** `google-genai` (Unified SDK).
*   **API Keys:** `GEMINI_API_KEY` and `SERPAPI_API_KEY` are used for external API integrations, loaded from environment variables.

This comprehensive overview reflects the current functional and architectural state of the Nexus Light application.