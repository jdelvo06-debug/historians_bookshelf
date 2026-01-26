# Historians Bookshelf - Learnings

Things Claude has learned about this project. Updated as we work together.

## Architecture
- React 19 with Vite
- Google Gemini for AI recommendations
- Tailwind CSS styling
- localStorage for persistence

## Key Files
- `src/App.tsx` — Main application
- `src/components/` — UI components
- Uses Google Fonts: Merriweather, Source Sans 3

## Gotchas
- Port 4000 may be in use by Docker; dev server configured for port 4001
- Dark mode uses Tailwind's `class` strategy - add `dark:` variants to all color classes
- Flash-prevention script in index.html applies theme before React hydrates
- Theme localStorage key: `historianTheme` (values: 'light', 'dark', 'system')

## Working Features
- AI-powered book recommendations
- Topic-based search
- Related topics suggestions
- Favorites/bookmarking
- Reading lists
- Dark mode (light/dark/system with localStorage persistence)

## Known Issues
- (Add bugs or limitations here)
