# The plant project

A web application for plant collectors to manage and organize their plant collections.
Built as part of a React training course.

## Features

- React + TypeScript
- Tailwind CSS for styling
- Vite for fast development
- ESLint + Prettier for code quality
- Vitest + React Testing Library for testing
- GitHub Actions for CI

## Getting Started

### Install dependencies

```
npm install
# or
yarn install
```

### Run the development server

```
npm run dev
# or
yarn dev
```

Open http://localhost:5173
to view in the browser.

### Build for production

```
npm run build
# or
yarn build
```

### Run tests

```
npm run test
# or
yarn test
```

### Lint and Format

```
npm run lint
npm run format
```

### GitHub Actions

Runs lint and tests automatically on push and pull requests.

## Environment Variables

This project uses Firebase for authentication and requires environment variables to be set.

An example file is provided: `.env.example`

To run the project locally:

1. Create a `.env` file in the project root
2. Copy the contents of `.env.example` into `.env`
3. Replace the placeholder values with your own Firebase project credentials

## Folder Structure

```
/src
  ├── /assets/           # Static assets (images, fonts, etc.)
  ├── /components/       # Reusable components
  ├── /features/         # Feature-specific logic and components (could be feature folders)
  ├── /hooks/            # Custom React hooks
  ├── /layouts/          # Layout components (e.g., Header, Footer, Sidebar)
  ├── /pages/            # Page components (routes)
  ├── /services/         # API requests, utilities, external service integrations
  ├── /store/            # State management (Redux, Zustand, Context API)
  ├── /styles/           # Global styles (CSS, SASS, Styled Components)
  ├── /utils/            # Utility functions, helpers, and constants
  ├── /app.tsx           # App component (entry point)
  ├── /index.tsx         # Main entry point for React
  └── /router.tsx        # Routing (React Router setup)
```

## License

This project is licensed under the MIT License — see the LICENSE file for details.
