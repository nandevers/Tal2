## Project Overview

This is a single-page web application built with React, TypeScript, and Vite. It serves as a dashboard for managing marketing-related activities, including campaigns, leads (entities), and data ingestion. The application uses Tailwind CSS for styling and `lucide-react` for icons. State management is primarily handled within the main `App.tsx` component, which orchestrates the different views and components.

**Key Technologies:**

*   **Framework:** React 19
*   **Language:** TypeScript 5
*   **Build Tool:** Vite 7
*   **Styling:** Tailwind CSS 4
*   **Testing:** Vitest with React Testing Library
*   **Icons:** Lucide React

## Building and Running

### Prerequisites

*   Node.js and npm (or a compatible package manager).

### Installation

To install the project dependencies, run the following command from the project root directory:

```bash
npm install
```

### Development Server

To start the local development server, run:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port). The server supports hot module replacement.

### Building for Production

To create a production-ready build, run:

```bash
npm run build
```

This command first runs the TypeScript compiler (`tsc`) and then uses Vite to bundle the application. The output will be placed in the `dist` directory (this is Vite's default).

### Previewing the Production Build

To preview the production build locally, run:

```bash
npm run preview
```

This will start a local server to serve the files from the `dist` directory.

## Testing

The project uses Vitest for running unit and component tests.

To run all tests, use:

```bash
npm run test
```

To run tests in watch mode with an interactive UI, you can often use `vitest --ui`, though you may need to add this as a separate script to `package.json`.

## Development Conventions

### Linting

The project is configured with ESLint for code quality and consistency. To run the linter, use:

```bash
npm run lint
```

### Directory Structure

*   `src/components`: Contains reusable React components.
*   `src/views`: Contains larger components that represent different "pages" or "views" of the application (e.g., `SearchView`, `CampaignsView`).
*   `src/data`: Contains mock data used for development.
*   `src/utils`: Contains utility functions or components (e.g., `IconComponent`).
*   `public/`: Contains static assets that are copied directly to the build output.

### State Management

Global application state and routing logic are managed within the main `App.tsx` component using React hooks (`useState`, `useEffect`).

### Styling

Styling is done using Tailwind CSS utility classes directly in the JSX. A global stylesheet `src/index.css` is used for base styles.
