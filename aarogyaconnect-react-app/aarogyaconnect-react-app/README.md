# AarogyaConnect — AI Healthcare Decision Support Platform

A React + Vite + Tailwind CSS single-page app: hospital search & comparison
across Maharashtra's district → taluka → city hierarchy, an AI symptom
checker, live-simulated GPS ambulance dispatch, an ABHA linker and
tele-consultation portal, blood bank locator, treatment cost calculator,
government scheme guides (PM-JAY / MJPJAY), and an admin dashboard — all in
one dark, glassmorphism "obsidian" UI.

> All hospital, bed, blood, GPS and cost data in this app is **simulated
> demo data** generated in-browser (see `src/App.jsx`, section 1: "BACKEND
> SIMULATION & MOCK DATABASE"). Replace it with real API calls before any
> production use.

## Requirements

- **Node.js 18+** and **npm** (check with `node -v` / `npm -v`)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open the URL Vite prints (default **http://localhost:5173**) — it
should also open automatically.

## Other commands

```bash
npm run build      # production build -> dist/
npm run preview    # locally preview the production build
npm run lint        # run ESLint
```

## Project structure

```
aarogyaconnect-react-app/
├── index.html              Vite entry HTML (mounts #root)
├── package.json             Dependencies & npm scripts
├── vite.config.js           Vite + React plugin config
├── tailwind.config.js       Tailwind content paths
├── postcss.config.js        PostCSS (Tailwind + Autoprefixer)
├── .eslintrc.cjs             ESLint rules (React + hooks)
├── .env.example              Optional Gemini API key template
├── .gitignore
├── .vscode/
│   └── extensions.json       Recommended VS Code extensions
├── public/                   Static assets served as-is (empty by default)
└── src/
    ├── main.jsx               React root / StrictMode mount
    ├── App.jsx                 The entire application (all sections/components)
    └── index.css                Tailwind directives + base styles
```

`src/App.jsx` is intentionally the whole app in one file (as originally
authored) — it's organised internally into numbered sections
(BACKEND SIMULATION & MOCK DATABASE, VOICE ASSISTANT, AI SYMPTOM CHECKER,
AMBULANCE DISPATCH, ABHA/TELE-CONSULT, HOSPITAL SEARCH & COMPARISON, etc.).
If you want to split it into multiple component files under `src/components/`,
that refactor is safe to do incrementally — every section is already a
self-contained block of state + handlers + JSX.

## Notable dependencies

- **lucide-react** — icon set used throughout the UI
- **Tailwind CSS** — all styling (dark "obsidian" theme, glassmorphism
  cards, gradients, animations) is utility classes; no custom CSS beyond
  `src/index.css`

## Browser APIs this app uses

These are real browser features, not simulated — they'll only work in a
browser that supports them, and some need user permission:

- **Web Speech API** (`webkitSpeechRecognition` / `SpeechRecognition`) —
  powers the multilingual voice assistant (English/Marathi/Hindi). Best
  support is Chrome (desktop & Android). The app already feature-detects
  this and disables the mic button with a message if unsupported.
- **`speechSynthesis`** — spoken responses from the assistant.

## Wiring up a real Gemini API key (optional)

The AI chat assistant calls the Gemini API directly from the browser with
an empty key by default, and **already falls back** to a rule-based reply
if that call fails (see the `try/catch` around `sendAiChatMessage` in
`src/App.jsx`) — so the app works fully without any key.

To use a real key instead:

1. Copy `.env.example` to `.env` and set `VITE_GEMINI_API_KEY=your-key`.
2. In `src/App.jsx`, find the `fetch(\`https://generativelanguage.googleapis.com/...?key=\`)`
   call and change the URL to append `import.meta.env.VITE_GEMINI_API_KEY`.

**Security note:** calling a Google API directly from client-side code
exposes your key to anyone who opens dev tools. For anything beyond local
experimentation, proxy this call through your own backend instead (see the
`aarogyaconnect-backend` FastAPI project, whose `/api/ai/recommend`
endpoint already implements this "existing engine → Gemini → safe
fallback" pattern server-side).

## Known simulations / things to replace before production

Everything below is clearly a simulation in the code, so nothing here is a
silent gap — each is called out with a comment in `src/App.jsx`:

- **GPS ambulance tracking** — the map route, ETA and driver details are
  generated client-side, not from a real dispatch/GPS system.
- **ABHA linking** — the 14-digit ID flow and OTP are simulated; a real
  integration calls the ABDM Gateway APIs with registered partner
  credentials.
- **Tele-consultation video** — the call UI is a simulator; plug in a real
  WebRTC/video SDK (Twilio Video, Agora, Daily, etc.) for actual calls.
- **Lab report OCR** — the report analyzer returns simulated extracted
  text; wire in a real OCR provider (Google Cloud Vision, AWS Textract,
  Tesseract) before trusting its output.
- **Symptom triage** — rule-based Green/Yellow/Red classification only.
  It is not a diagnosis, and the UI says so.

## Troubleshooting

- **Blank page after `npm run dev`** — check the terminal/browser console
  for the actual error; open an issue against the specific stack trace.
- **`npm install` fails on Node version** — make sure you're on Node 18+
  (`node -v`); older versions aren't supported by this Vite/React version.
- **Tailwind classes not applying** — confirm `tailwind.config.js`'s
  `content` array still points at `./index.html` and `./src/**/*.{js,jsx}`.
