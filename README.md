# Historian's Bookshelf

An AI-powered book recommendation web app that uses Google Gemini to recommend history books based on user-provided topics.

## Features

- **AI-Powered Recommendations** - Get curated history book suggestions powered by Google Gemini
- **Topic-Based Search** - Enter any historical topic, era, or figure
- **Related Topics** - Discover related subjects after each search
- **Favorites** - Save books to your personal collection
- **Reading Lists** - Organize books into custom lists
- **Dark Mode** - Toggle between light, dark, and system themes

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Google Gemini API

## Getting Started

### Prerequisites

- Node.js 18+
- Google Gemini API key

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file:

```
GEMINI_API_KEY=your_api_key_here
```

### Development

```bash
npm run dev          # Start dev server on http://localhost:4001
npm run build        # Production build
npm run preview      # Preview production build
```

## Project Structure

```
App.tsx                    # Main component - state management, view switching
├── components/
│   ├── SearchBar.tsx          # Topic input with education level selector
│   ├── BookRecommendationCard.tsx  # Book display with favorite/list actions
│   ├── InitialState.tsx       # Welcome screen with example topics
│   ├── RelatedTopics.tsx      # Suggested related topics after search
│   ├── LoadingSpinner.tsx     # Loading state
│   ├── ErrorMessage.tsx       # Error display
│   └── ThemeToggle.tsx        # Dark mode toggle (light/dark/system)
├── hooks/
│   └── useTheme.ts            # Theme state and system preference detection
├── services/
│   └── geminiService.ts       # Gemini API integration
└── types.ts                   # TypeScript interfaces
```

## Color Palette

| Element | Light | Dark |
|---------|-------|------|
| Background | stone-50 | stone-900 |
| Cards | white | stone-800 |
| Primary text | stone-800 | stone-100 |
| Accent | amber-800 | amber-400 |

## License

MIT
