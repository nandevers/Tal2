# Project Overview

This is a React and TypeScript project, "nexus-light-app," built with Vite. The application is a "Sales OS 2026" and appears to be a CRM or sales management tool. It includes views for searching, managing entities (leads), running campaigns, an inbox, and viewing insights. The UI is styled with Tailwind CSS and includes icons from `lucide-react`. The application state is managed within the main `App.tsx` component.

# Building and Running

To get the application running locally, follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the next available port).

3.  **Build for Production:**
    ```bash
    npm run build
    ```

4.  **Run Tests:**
    ```bash
    npm run test
    ```

5.  **Lint Files:**
    ```bash
    npm run lint
    ```

# Development Conventions

*   **Component Structure:** Components are organized by feature/view within the `src/components` and `src/views` directories. Each component folder contains the component file (`.tsx`) and a `types.ts` file for its specific types.
*   **Styling:** The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`. Global styles are in `src/index.css`.
*   **State Management:** The main application state is managed in the `App.tsx` component using React hooks (`useState`, `useEffect`).
*   **Data:** Mock data is used for development and is located in `src/data/mockData.ts`.
*   **Testing:** Tests are written with `vitest` and `@testing-library/react`. Test files are co-located with the components they test (e.g., `Dock.test.tsx`).
