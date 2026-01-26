# Historians Bookshelf - Project Rules

## Do NOT Modify
- Gemini API integration patterns — they're working
- Book card component styling — it's tuned for the design

## Always
- Use port 4000 for dev server (port 3000 is used by Open WebUI)
- Handle Gemini API errors gracefully with fallbacks
- Validate JSON responses from Gemini before using

## Code Style
- TypeScript with React 19
- Functional components with hooks
- Tailwind CSS (amber/stone color palette)

## Data
- Book recommendations come from Google Gemini
- Favorites stored in localStorage under 'historianFavorites'
- Reading lists stored in localStorage under 'historianReadingLists'
- Theme preference stored in localStorage under 'historianTheme'
- Always use structured JSON output schema with Gemini

## Dark Mode
- Uses Tailwind `class` strategy (darkMode: 'class' in tailwind config)
- All components must include `dark:` variants for colors
- Color mapping: amber-800 → dark:amber-400, stone-50 → dark:stone-900, white → dark:stone-800
- Flash prevention script in index.html applies theme before React loads

## API
- Gemini API key stored in environment variable
- Implement rate limiting awareness
- Cache responses where appropriate

## Git
- Use conventional commits (feat:, fix:, docs:, etc.)
