# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Historian's Bookshelf is an AI-powered book recommendation web app that uses Google Gemini to recommend history books based on user-provided topics. Built with React 19, TypeScript, and Vite.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build
npm run preview      # Preview production build
```

**Environment setup:** Set `GEMINI_API_KEY` in `.env.local` before running.

## Architecture

```
App.tsx                    # Main component - state management, view switching (search/favorites)
├── components/
│   ├── SearchBar.tsx          # Topic input with Enter key support
│   ├── BookRecommendationCard.tsx  # Book display with favorite toggle
│   ├── InitialState.tsx       # Welcome screen with example topics
│   ├── RelatedTopics.tsx      # Suggested related topics after search
│   ├── LoadingSpinner.tsx     # Loading state
│   └── ErrorMessage.tsx       # Error display
├── services/
│   └── geminiService.ts       # Gemini API integration with structured output schema
└── types.ts                   # BookRecommendation and GeminiResponse interfaces
```

### Data Flow

1. User enters topic → `SearchBar` calls `handleSearch()`
2. `searchQuery` state change triggers `useEffect` → calls `getBookRecommendation()`
3. `geminiService.ts` sends structured prompt to Gemini 2.5 Flash with JSON schema
4. Response validated and filtered → displayed via `BookRecommendationCard`
5. Favorites persisted to `localStorage` under key `historianFavorites`

### Key Patterns

- **Gemini Integration:** Uses `@google/genai` with `Type` schema for structured JSON output. The schema enforces required fields (title, author, summary, purchaseLink, coverImageURL) and includes relatedTopics array.
- **State Management:** React hooks only (useState, useCallback, useEffect). No external state library.
- **Styling:** Tailwind CSS utilities. Color palette uses amber (primary), stone (neutral). Fonts loaded via CDN (Merriweather serif for headings, Source Sans 3 for body).
- **Environment Variables:** `GEMINI_API_KEY` from `.env.local` is injected via Vite's `define` config as `process.env.API_KEY`.

### Import Alias

`@/*` maps to the project root (configured in `vite.config.ts` and `tsconfig.json`).

