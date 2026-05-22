# UniGroup Hub

UniGroup Hub is a student collaboration web app developed for INFO2222. The final implementation lives in [Phase_3](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3) and combines real team management, group chat, meeting coordination, task support, AI-assisted summaries, and security demonstrations in one project workspace.

This repository contains the project across multiple stages:

- [Phase_1](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_1): earlier coursework stage
- [Phase_2](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_2): intermediate implementation stage
- [Phase_3](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3): final security, evaluation, and report stage

## Final Scope

The final [Phase_3](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3) app includes:

- custom registration and login flow backed by Supabase
- password storage with Argon2id
- HTTPS-only credential submission in production
- session management with secure cookies
- real database-backed teams, channels, members, tasks, calls, and availability
- end-to-end encrypted group chat
- group key distribution and key rotation when members are removed
- team member management by email
- stress heatmap based on real deadlines and availability data
- meeting decider with slot-picker modal and suggested meeting time
- personal reminders based on `@mentions`
- AI-generated daily summaries
- AI-generated catch-up summaries
- AI-generated meeting discussion questions
- Security Lab demos for Task 2 vulnerabilities

## Project Structure

The main files for the final app are:

- [Phase_3/index.html](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3/index.html): application layout and page sections
- [Phase_3/style.css](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3/style.css): interface styling
- [Phase_3/script.js](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3/script.js): frontend logic, E2EE flow, state rendering, and UI interactions
- [Phase_3/api/auth](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3/api/auth): login, register, session, and logout endpoints
- [Phase_3/api/_lib/custom-auth.js](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3/api/_lib/custom-auth.js): authentication helpers, Argon2id hashing, session handling, HTTPS enforcement, and login rate limiting
- [Phase_3/api/app-state.js](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3/api/app-state.js): authenticated app data loader
- [Phase_3/api/app-action.js](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3/api/app-action.js): backend actions for chat, groups, tasks, meetings, and Security Lab
- [Phase_3/api/daily-summary.js](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3/api/daily-summary.js): OpenAI-powered daily summary route
- [Phase_3/api/catchup-summary.js](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3/api/catchup-summary.js): OpenAI-powered catch-up route
- [Phase_3/api/call-questions.js](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3/api/call-questions.js): OpenAI-powered meeting question generator
- [Phase_3/supabase-chat-schema.sql](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3/supabase-chat-schema.sql): database schema and supporting functions
- [Phase_3/vercel.json](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3/vercel.json): deployment config for the static app and API routes

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- Supabase REST API
- Vercel serverless functions
- OpenAI Responses API
- Argon2id for password hashing
- Web Crypto API for client-side encryption

## Setup

### 1. Install dependencies

From [Phase_3](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3):

```bash
npm install
```

### 2. Configure environment variables

The server routes expect:

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

Optional model overrides:

```bash
OPENAI_MODEL=
OPENAI_DAILY_SUMMARY_MODEL=
OPENAI_CATCHUP_MODEL=
OPENAI_CALL_QUESTIONS_MODEL=
```

### 3. Apply the database schema

Run [Phase_3/supabase-chat-schema.sql](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3/supabase-chat-schema.sql) against your Supabase project before using the final app.

### 4. Configure frontend Supabase values

Update [Phase_3/supabase-config.js](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3/supabase-config.js) with the public project configuration used by the frontend.

## Running the App

The frontend is still a static app, so you can serve [Phase_3/index.html](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3/index.html) locally for UI work:

```bash
cd Phase_3
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

For the full authenticated experience, the `/api` routes must also be available in the deployment environment. The project is configured for Vercel-style deployment through [Phase_3/vercel.json](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3/vercel.json).

## Security Features

The final app implements the following security mechanisms:

- Argon2id password hashing
- HTTPS-only authentication in production
- browser certificate verification through standard CA trust chains
- secure session cookies
- end-to-end encrypted group chat with per-user encrypted group keys
- group key rotation after member removal
- login rate limiting

## Security Demonstrations

The Security Lab in the final app supports two vulnerability demos:

1. disabling E2EE for the next message to demonstrate plaintext message exposure
2. disabling login rate limiting to demonstrate brute-force susceptibility

These demos were added for Task 2 and are intended for controlled coursework demonstration rather than normal production use.

## AI Features

The final app uses OpenAI for:

- daily summaries of recent team chat
- catch-up summaries for selected team members
- meeting discussion question generation

The project report also includes a separate LLM evaluation focused on:

- security advice quality across models
- bias and inconsistency under different prompt framings

## Notes

- The app uses a custom auth layer rather than Supabase Auth for the final flow.
- Older project stages remain in the repository for coursework history, but [Phase_3](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3) should be treated as the final implementation.
- `node_modules` should not be committed. See [Phase_3/.gitignore](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/Phase_3/.gitignore).
