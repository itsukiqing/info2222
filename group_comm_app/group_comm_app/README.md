# UniGroup Hub

UniGroup Hub is a front-end prototype for a university group collaboration app. It focuses on helping student teams manage group chat, shared workload visibility, meeting planning, reminders, and task tracking in one interface.

This project is currently a static HTML/CSS/JavaScript app with demo data and UI interactions. It is designed as a prototype, so some features use mocked content for now, including chat reminders and daily summaries.

## Features

- Dashboard with quick team stats and an `Initialiser` shortcut
- Group Chat page with:
  - group switching
  - combined group message feed
  - `Group Chat`, `Personal Reminder`, and `Daily Summary` views
- Stress Heatmap for deadline pressure across members
- Meeting Decider with editable free slots and suggested meeting time
- Initialiser page for call setup and reminder settings
- To-Do List with sorting, filtering, and status changes
- Catch Me Up page for recent update summaries
- Live Sydney date/time card in the sidebar

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript

## Project Structure

- [index.html](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/group_comm_app/group_comm_app/index.html): App layout and sections
- [style.css](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/group_comm_app/group_comm_app/style.css): Visual styling and responsive layout
- [script.js](/Users/Itsuki/INFO2222-PRJ-T05-G06-PH01/group_comm_app/group_comm_app/script.js): Demo data, rendering logic, and UI interactions

## Running the Project

Because this is a static prototype, you can run it by opening `index.html` in a browser.

If you want a local server instead, from this folder run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Current Prototype Notes

- Chat reminders and daily summaries are mocked with demo content
- Group chat messages are seeded directly in `script.js`
- Meeting suggestions are computed from the demo availability data
- No backend or database is connected yet

## Future Improvements

- Connect chat summaries and reminders to an AI API
- Persist tasks, groups, and meeting preferences
- Add authentication and real user profiles
- Support real-time messaging and notifications
- Add calendar integration for meeting scheduling

## Purpose

This project is intended as a prototype for exploring interaction design and workflow support for student group projects.
