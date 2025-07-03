# AGENT.md

## Commands
- **Dev server**: `npm run dev` (runs on port 3000)
- **Build**: `npm run build` (Vite build)
- **Lint**: `npm run lint` (ESLint)
- **Preview**: `npm run preview` (preview build)

## Architecture
- **Frontend**: React 19 + Vite + TailwindCSS
- **State**: Zustand (theme store), React Query (server state)
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Data**: Last.fm API integration

## Structure
- `src/pages/` - Route components (Dashboard, Artists, Tracks, Albums, Insights)
- `src/components/` - Reusable UI components (layout/, charts/, stats/, ui/)
- `src/store/` - Zustand stores
- `src/services/` - API integrations (lastfm.js)
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions
- `src/types/` - Type definitions

## Code Style
- Use functional components with hooks
- Import React explicitly: `import React from 'react'`
- Use camelCase for variables, PascalCase for components
- ESLint enforces: no unused vars (except A-Z_ prefixed), React hooks rules
- TailwindCSS utility classes, custom theme with primary/secondary colors
- Dark mode support via `dark:` classes and theme store
