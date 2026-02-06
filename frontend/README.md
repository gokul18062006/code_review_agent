# 🚀 React + TypeScript Frontend Setup

## Complete React + TypeScript frontend with Tailwind CSS

### Project Structure:
```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── CodeEditor.tsx
│   │   └── ReviewResults.tsx
│   ├── App.tsx
│   ├── api.ts
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Quick Start:

### 1. Install Frontend Dependencies
```powershell
cd frontend
npm install
```

### 2. Start Backend Server (Terminal 1)
```powershell
# Make sure you're in the main project directory
cd ..
python app.py
```

### 3. Start Frontend Dev Server (Terminal 2)
```powershell
cd frontend
npm run dev
```

Then open: http://localhost:3000

## Features:

✅ **React 18 + TypeScript** - Type-safe components
✅ **Vite** - Lightning fast development
✅ **Tailwind CSS** - Beautiful, responsive UI
✅ **Dark Mode** - Automatic dark/light theme
✅ **Axios** - API integration
✅ **Lucide Icons** - Modern icon set

## Tech Stack:

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Backend**: FastAPI (Python)

## API Integration:

The frontend connects to FastAPI backend at `http://localhost:8000`

Endpoints:
- POST `/review` - Submit code for review
- GET `/health` - Check backend status

## Development:

```powershell
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment:

API key already configured in `.env` file:
```
OPENAI_API_KEY=ROE0HtsG9o9Zz122QhAPl11juXmzBVs03idWHTT1
```

## Components:

1. **Header** - Branding and navigation
2. **Sidebar** - Settings and example loader
3. **CodeEditor** - Code input area with review button
4. **ReviewResults** - Display analysis results

## UI Features:

- 🎨 Modern gradient design
- 🌓 Dark mode support
- 📱 Fully responsive
- ⚡ Fast and smooth animations
- 🎯 Intuitive user interface
- 📊 Rich data visualization
