# AI Detective — Mystery Investigation

An AI-powered murder mystery game. Every suspect is an autonomous character driven by Gemini, constrained to only what *they* personally know — their alibi, their secret, their private observations, and whether or not they did it. Interrogate them, search crime scenes for forensic evidence, connect the threads on a corkboard, and make your accusation before the Chief Justice.

Built with React 19 + Vite, served by an Express backend that keeps every Gemini call — and every answer to the mystery — on the server.

**Live:** https://ai-detective-1.ai.studio/

---

## Contents

- [Features](#features)
- [How it works](#how-it-works)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [API reference](#api-reference)
- [Project structure](#project-structure)
- [Updating the live deployment](#updating-the-live-deployment)
- [Deploying somewhere new](#deploying-somewhere-new)
- [Writing your own case](#writing-your-own-case)
- [Known limitations](#known-limitations)
- [Tech stack](#tech-stack)

---

## Features

**Interrogation Room.** Free-text conversation with any suspect. Each one is prompted with a private dossier the others don't share, so their stories can genuinely contradict each other. Suspects track two hidden meters — **nervousness** and **openness** — that shift with every exchange based on how hard you press them.

**Evidence confrontation.** Pull a discovered clue from the evidence drawer and put it on the table mid-interview. The suspect is required to react to that specific item in character, and a guilty one cornered by hard forensics will start to crack.

**Crime scene search.** Each location is searched to surface its clues one at a time, across five categories: physical, forensic, document, digital, and testimony. Some clues are marked crucial — you'll need them to prove your case.

**Case board.** A drag-and-drop corkboard for pinning suspects, clues, locations, and your own notes, then drawing labelled links between them.

**Detective's binder.** Five tabs — Evidence, Autopsy, Testimonies, Timeline, and a free-form Journal — with search and category filtering across everything you've collected. Bookmark individual lines of interrogation dialogue and they show up here.

**The accusation.** Name your culprit, the weapon, the motive, and attach supporting evidence plus a written closing argument. Gemini plays the Chief Justice and grades you 0–100 on accuracy *and* reasoning quality, awarding a rank from *Grand Master Sleuth* down to *Miscarriage of Justice*, then delivers the killer's confession and the full resolution.

**Procedural case generator.** Generate an entirely new mystery from six preset themes (Victorian steamship, Prohibition speakeasy, cyberpunk Neo-Tokyo, alpine chalet, Venetian masquerade, 1954 Hollywood) or write your own, at three difficulty levels. The model produces the whole thing: victim, suspects, secrets, locations, clues, timeline, and a consistent solution — which the server then validates before it becomes playable.

**Police dispatch hints.** Stuck? Request a memo that nudges you toward an overlooked thread without naming the killer.

**Progress is saved.** Discovered clues, transcripts, journal notes, corkboard layout, and suspect mood all persist to `localStorage`, so a refresh doesn't wipe your investigation.

**Procedural audio.** Every sound — typewriter clicks, the clue-discovered chime, the dramatic sting, the gavel, paper rustle — is synthesized live via the Web Audio API. No audio files.

### Included cases

| Case | Difficulty | Suspects | Locations | Clues |
| --- | --- | --- | --- | --- |
| The Echoes in the Dark: Death at the Observatory | Intermediate | 6 | 5 | 15 |
| The Venom of Highclere: The Blackwood Banquet | Master Sleuth | 4 | 3 | 8 |

---

## How it works

```
Browser (React SPA)
    │  GET  /api/cases          → redacted case list
    │  POST /api/*  { caseId }  → never the case body
    ▼
Express server  ──────►  Gemini API (gemini-3.7-flash)
    │   CASE_STORE (authoritative, unredacted)
    │
    └─ dev:  Vite middleware (HMR)
       prod: serves ./dist as static files
```

Two things live only on the server:

**The API key.** The browser talks exclusively to the `/api` routes and never sees `GEMINI_API_KEY`.

**The answers.** `server/cases.ts` holds the full cases — `isGuilty`, `secret`, `actualActivity`, `motive`, `privateKnowledge`, and the whole `solution` block. `server/redact.ts` strips all of that before a case is serialised to the client, so the killer's identity is not sitting in the JavaScript bundle. From then on the client refers to a case by `caseId` and the server looks up its own copy. This also means a modified client can't fabricate evidence: when you confront a suspect, only the clue *id* is sent and the server resolves the real item.

Every case — handcrafted or AI-generated — passes through `normalizeCase()`, which derives each clue's display location from its `locationId`, keeps `location.clueIds` in sync, forces all clues to start undiscovered, clamps the 0–100 meters, and verifies there is exactly one guilty suspect that the solution actually points at. Generated cases that fail those structural checks are rejected with a 502 rather than becoming an unsolvable case.

All four Gemini endpoints use structured output with an explicit `responseSchema`, so responses come back as validated JSON. Each also has a no-API-key fallback so the app stays playable with canned responses if `GEMINI_API_KEY` is missing — except case generation, which needs a real key.

---

## Getting started

**Prerequisites:** Node.js 20+ and a [Gemini API key](https://aistudio.google.com/apikey).

```bash
git clone <your-repo-url>
cd AI-Detective
npm install

cp .env.example .env
# open .env and set GEMINI_API_KEY

npm run dev
```

Open **http://localhost:3000**.

The dev server is Express with Vite in middleware mode — one process serves both the API and the frontend with hot reload, on the same port. There's no separate frontend dev server to start.

> **Windows:** the `dev` and `start` scripts set `NODE_ENV` inline, which PowerShell and `cmd` don't support. Either run under Git Bash / WSL, or add [`cross-env`](https://www.npmjs.com/package/cross-env) and prefix both scripts with it.

---

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | Gemini API key. Without it, interrogation/hints/verdicts fall back to canned responses and case generation returns an error. |
| `PORT` | No | Port to listen on. Defaults to `3000`. Cloud Run injects this automatically. |
| `NODE_ENV` | No | Only `development` changes behaviour (starts Vite + HMR). **Anything else — including unset — runs in production mode**, serving `./dist`. |
| `APP_URL` | No | Public URL of the deployment. Injected by AI Studio; not used by app logic. |
| `DISABLE_HMR` | No | Set to `true` to disable HMR and file watching. |

`.env` is gitignored. Never commit your key.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Express + Vite middleware with HMR on port 3000 |
| `npm run build` | `vite build` → `dist/`, then bundles the server to `dist/server.cjs` with esbuild |
| `npm start` | Runs the built server |
| `npm run lint` | TypeScript check, no emit (`tsc --noEmit`) |
| `npm run clean` | Removes `dist/` |

---

## API reference

All routes accept and return JSON. Unknown `/api/*` routes return a JSON 404 rather than the SPA shell.

### `GET /api/health`

Liveness probe. `{ "status": "ok", "timestamp": "..." }`

### `GET /api/cases`

The redacted, playable case list — the only way the client obtains case data.

```json
{ "cases": [ { "id": "case-observatory-sterling", "title": "...", "suspects": [...], "clues": [...] } ] }
```

Suspect objects have no `isGuilty`, `secret`, `actualActivity`, `motive`, `privateKnowledge` or `falseBeliefs`, and the case has no `solution`.

### `POST /api/interrogate`

Generates one in-character suspect reply.

```json
{
  "caseId": "case-observatory-sterling",
  "suspectId": "suspect-1",
  "playerMessage": "Where were you at 11pm?",
  "conversationHistory": [{ "sender": "player", "text": "..." }],
  "presentedEvidence": "clue-3"
}
```

`presentedEvidence` is a clue **id**; the server resolves the real clue from its own copy. Only the last 8 messages of history are sent to the model.

**Response:** `response`, `emotion` (`neutral` | `nervous` | `angry` | `relieved` | `guilty` | `defensive` | `surprised`), `nervousnessDelta`, `opennessDelta`, `revealedClueHint`.

### `POST /api/cases/generate`

`{ "theme": "1920s Chicago Speakeasy", "difficulty": "Intermediate" }`

Generates a case, assigns it a collision-proof `id`, validates and normalises it, stores the full version server-side, and returns the redacted version. Requires `GEMINI_API_KEY`. Returns `502` if the model produced something structurally unsolvable.

### `POST /api/evaluate`

`{ "caseId": "...", "accusation": { "accusedSuspectId", "murderWeapon", "motive", "selectedEvidenceIds", "reasoning" } }`

**Response:** `isCorrectCulprit`, `isCorrectWeapon`, `isCorrectMotive`, `deductionScore` (0–100), `rankTitle`, `culpritName`, `summaryFeedback`, `detailedCritique`, `confessionNarrative`, `fullCaseResolution`. The culprit is revealed here, with the verdict — which is why the client never needs it earlier.

### `POST /api/hint`

`{ "caseId": "...", "discoveredClueIds": [], "chatCount": 0 }` → `{ "hint": "..." }`

### Common errors

| Status | Meaning |
| --- | --- |
| `400` | Missing `caseId` / `accusedSuspectId`, or malformed JSON body |
| `404` | Suspect not in case, or unknown API route |
| `410` | Case no longer in the server's store (see below) |
| `502` | Generated case failed validation |

---

## Project structure

```
├── server.ts                 Express app, case store, all Gemini endpoints
├── server/
│   ├── cases.ts              FULL cases including solutions — never imported by src/
│   └── redact.ts             toPublicCase() + normalizeCase()
├── index.html                SPA shell, fonts, meta tags
├── vite.config.ts            React + Tailwind v4 plugins, @ alias
├── metadata.json             AI Studio applet manifest
└── src/
    ├── main.tsx              React root
    ├── App.tsx               Loads cases from the API, per-case state, persistence
    ├── types.ts              Shared types; server-only fields marked and optional
    ├── index.css             Tailwind import, theme variables, fade-in animation
    ├── services/api.ts       Typed fetch wrappers for /api/*
    ├── utils/audio.ts        Web Audio sound synthesis
    ├── utils/storage.ts      Versioned localStorage save/load
    └── components/
        ├── Header.tsx              Case switcher, tabs, progress, actions
        ├── SuspectsGrid.tsx        Suspect roster
        ├── InterrogationRoom.tsx   Chat, mood meters, evidence drawer
        ├── LocationsExplorer.tsx   Crime scenes, search, clue inspection
        ├── CaseBoard.tsx           Corkboard with nodes and links
        ├── Notebook.tsx            Evidence / autopsy / testimonies / timeline / journal
        ├── AccusationModal.tsx     Accusation form and verdict screen
        ├── GenerateCaseModal.tsx   Theme picker and generation
        └── HintModal.tsx           Police dispatch hints
```

> **Never import `server/cases.ts` from anything under `src/`.** That single import is what would put the killers' names back into the public JavaScript bundle. The client gets cases from `GET /api/cases`.

---

## Updating the live deployment

The live app at **https://ai-detective-1.ai.studio/** is a [custom AI Studio subdomain](https://ai.google.dev/gemini-api/docs/aistudio-deploying) pointing at a Cloud Run service. There are two ways to ship an update, and it matters which one you use, because they can overwrite each other.

### Option A — Republish from AI Studio

Best if AI Studio Build mode is still where you edit the app.

1. Open the app in [AI Studio](https://aistudio.google.com/app/apps) in **Build** mode.
2. Bring the corrected files in — replace the contents of `server.ts`, `src/App.tsx`, `src/types.ts`, `src/services/api.ts`, `src/index.css`, `package.json`, and the changed components, and add the new `server/cases.ts`, `server/redact.ts`, and `src/utils/storage.ts`. Delete the old `src/data/cases.ts`.
3. Click **Publish** in the top right.
4. In the deployment configuration, make sure the **Custom URL** field still reads `ai-detective-1`. Leaving it unchanged keeps the same public address.
5. Click **Publish App** and wait for the deployment to finish.

> **Do not unpublish or delete the app to "start clean".** Custom subdomains are released on unpublish and are first-come, first-served globally — `ai-detective-1` could be claimed by someone else before you republish.

### Option B — Deploy straight to Cloud Run from this repo

Best now that the code has moved past what AI Studio generated. Requires the [gcloud CLI](https://cloud.google.com/sdk/docs/install).

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Find the service backing ai-detective-1.ai.studio
gcloud run services list --platform managed
```

Note the service **name** and **region** from that output, then deploy from the repo root:

```bash
gcloud run deploy SERVICE_NAME \
  --source . \
  --region REGION \
  --update-env-vars NODE_ENV=production
```

Cloud Run builds with Buildpacks, which run `npm run build` and then `npm start`. The custom domain follows the service, so `ai-detective-1.ai.studio` picks up the new revision automatically once traffic shifts.

You no longer need `--port`: the server reads `PORT` from the environment, so Cloud Run's default works out of the box.

If `GEMINI_API_KEY` isn't already set on the service (AI Studio normally injects it at publish time), add it — preferably from Secret Manager:

```bash
# one-time
echo -n "YOUR_KEY" | gcloud secrets create gemini-api-key --data-file=-
gcloud run services update SERVICE_NAME --region REGION \
  --set-secrets GEMINI_API_KEY=gemini-api-key:latest
```

### Verify the update

```bash
BASE=https://ai-detective-1.ai.studio

curl -s $BASE/api/health

# The bundled server must not be downloadable (expect 404)
curl -s -o /dev/null -w "%{http_code}\n" $BASE/server.cjs

# No dev server in production (expect 404)
curl -s -o /dev/null -w "%{http_code}\n" $BASE/@vite/client

# No solutions in the case payload (expect: false / none)
curl -s $BASE/api/cases | python3 -c "import sys,json; d=json.load(sys.stdin); c=d['cases'][0]; print('solution present:', 'solution' in c); print('spoiler fields:', sorted({k for s in c['suspects'] for k in ('isGuilty','secret','actualActivity','motive','privateKnowledge','falseBeliefs') if k in s}) or 'none')"
```

Then load the site and confirm the case list appears, a suspect replies, and a hint returns.

### Rolling back

Cloud Run keeps every revision, so a bad deploy is one command away from being undone:

```bash
gcloud run revisions list --service SERVICE_NAME --region REGION
gcloud run services update-traffic SERVICE_NAME --region REGION \
  --to-revisions PREVIOUS_REVISION_NAME=100
```

### Generated cases and scaling

AI-generated cases live in the server's memory (`CASE_STORE`), capped at 50. They are lost when a revision restarts or when Cloud Run scales to zero, and a request for one from a different instance won't find it. The client handles this: the API returns `410` and the player is told to generate a new case. The two handcrafted cases are always available.

If you want generated cases to survive properly, either set `--min-instances 1 --max-instances 1` (cheap, single instance, still lost on redeploy) or persist them to Firestore or Cloud Storage, keyed by case id.

---

## Deploying somewhere new

```bash
gcloud run deploy ai-detective \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production \
  --set-secrets GEMINI_API_KEY=gemini-api-key:latest
```

The app is stateless apart from the in-memory generated-case store, so it scales to zero happily between sessions.

---

## Writing your own case

Add a `CaseData` object to the `INITIAL_CASES` array in **`server/cases.ts`** (not `src/`). The structure is typed in `src/types.ts`. The server repairs most inconsistencies at boot and logs what it changed, but it can't invent a plot, so:

- Exactly **one** suspect must have `isGuilty: true`, and `solution.culpritId` should point at them.
- Every clue's `locationId` must match a real location `id`. The display name and `location.clueIds` are derived automatically — don't hand-maintain them.
- `clue.category` must be one of `physical`, `document`, `forensic`, `digital`, `testimony`.
- `suspicionLevel`, `nervousness`, and `openness` are 0–100 (clamped for you).
- `discovered` is forced to `false`; don't bother setting it.

Start the server and watch the log — anything it had to repair or couldn't reconcile is printed as `[case:your-case-id] ...`.

The quality of interrogations depends almost entirely on how rich `privateKnowledge`, `secret`, `actualActivity`, and `voiceStyle` are — those four fields are what make a suspect feel like a person rather than a chatbot. Give innocent suspects real secrets they're desperate to hide; that's what creates convincing red herrings.

---

## Known limitations

- **Generated cases are in-memory only** — see [above](#generated-cases-and-scaling).
- **No rate limiting** on the API routes. Every request costs Gemini tokens, and the deployment is public. Worth adding before it gets shared widely.
- **Saved progress is per-browser.** `localStorage` doesn't sync across devices, and clearing site data resets it.
- **Avatars are hotlinked** from Unsplash, so portraits depend on that service staying available.
- **Suspects have no cross-interrogation memory.** Each conversation is independent; a suspect won't know what you got another suspect to admit unless you tell them.

---

## Tech stack

React 19 · TypeScript 5.8 · Vite 6 · Tailwind CSS v4 · Express 4 · `@google/genai` 2.x (Gemini 3.7 Flash) · Framer Motion · lucide-react · canvas-confetti · Web Audio API

---

## License

Source files carry an `Apache-2.0` SPDX identifier. Add a `LICENSE` file to the repository root to make this explicit.
