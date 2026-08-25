# Jabali — Educational Platform for Autistic Children

A calm, inclusive learning platform designed for autistic children and their caregivers. Features include learning modules, music, games, progress dashboards, and interactive storybooks.

## Project Structure

```
Jabali/
├── Jabali-WebApp/          # React frontend (Create React App)
│   ├── src/
│   │   ├── pages/          # Page components (Home, Learning, Music, Games, etc.)
│   │   ├── Components/       # Reusable components (Navbar, Footer, Auth, StoryBook)
│   │   ├── styles/         # CSS stylesheets
│   │   └── Assets/         # Images, stories, audio
│   └── package.json
└── Server/
    └── proxy.js            # Express proxy server (port 3001)
```

## Development Setup

### Prerequisites
- Node.js 18+
- npm

### Quick Start

1. **Start the Express proxy server** (provides Gutendex book API):
```bash
cd Server
node proxy.js
# Runs on http://localhost:3001
```

2. **Start the React development server**:
```bash
cd Jabali-WebApp
npm install     # First time only
npm start
# Runs on http://localhost:3000
```

The CRA proxy forwards `/api/*` requests to the Express server automatically.

### API Endpoints

The Express proxy server proxies requests to the Gutendex API (Project Gutenberg):

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/books` | GET | Search books (supports `?search=`, `?page=`, `?languages=`, `?topic=`) |
| `/api/books/:bookId/content` | GET | Fetch full book text + metadata |

## Available Scripts

### Jabali-WebApp
- `npm start` — Run React dev server
- `npm run build` — Build for production
- `npm test` — Run tests

### Server
- `node proxy.js` — Start proxy server

## Technologies
- **Frontend**: React 19, React Router v7, React Icons
- **Server**: Express 5, Axios (proxy)
- **Storage**: localStorage (auth, child profiles, preferences)
