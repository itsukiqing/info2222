import { useState, useEffect, useRef, useCallback } from "react";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MEMBERS = [
  { id: 1, name: "Aisha Patel", avatar: "AP", role: "Project Lead", color: "#6C5CE7", status: "online" },
  { id: 2, name: "Marcus Chen", avatar: "MC", role: "Researcher", color: "#00B894", status: "online" },
  { id: 3, name: "Sophie Müller", avatar: "SM", role: "Designer", color: "#E17055", status: "away" },
  { id: 4, name: "James Okonkwo", avatar: "JO", role: "Developer", color: "#0984E3", status: "offline" },
  { id: 5, name: "Lily Tanaka", avatar: "LT", role: "Writer", color: "#E84393", status: "online" },
];

const TOPICS = [
  { id: "general", name: "General", emoji: "💬", unread: 3 },
  { id: "research", name: "Research Notes", emoji: "📚", unread: 0 },
  { id: "design", name: "Design Review", emoji: "🎨", unread: 7 },
  { id: "deadlines", name: "Deadlines", emoji: "⏰", unread: 1 },
  { id: "random", name: "Off Topic", emoji: "🎲", unread: 0 },
];

const MESSAGES = {
  general: [
    { id: 1, memberId: 1, text: "Hey team! Just pushed the updated project brief to the shared drive. Please review before Wednesday's meeting.", time: "10:32 AM", thread: [] },
    { id: 2, memberId: 2, text: "Thanks Aisha! I've been going through the literature review section. Found some really strong sources on neural network interpretability.", time: "10:45 AM", thread: [
      { id: 21, memberId: 5, text: "Can you share the DOIs? I need them for the bibliography.", time: "10:48 AM" },
      { id: 22, memberId: 2, text: "Sure, I'll compile a list and post in #research later today.", time: "10:50 AM" },
    ]},
    { id: 3, memberId: 3, text: "The wireframes for the presentation are almost done. Thinking of using a dark theme with accent colours — thoughts?", time: "11:15 AM", thread: [
      { id: 31, memberId: 4, text: "Dark theme would look great for a tech-focused presentation!", time: "11:18 AM" },
      { id: 32, memberId: 1, text: "Love it. Maybe use our group's purple as the accent?", time: "11:22 AM" },
      { id: 33, memberId: 3, text: "Perfect, I'll mock that up tonight.", time: "11:25 AM" },
    ]},
    { id: 4, memberId: 4, text: "I've set up the GitHub repo for the code component. Everyone should have access now. Let me know if you hit any permission issues.", time: "12:01 PM", thread: [] },
    { id: 5, memberId: 5, text: "Working on the intro chapter. Should I frame it around the ethical implications angle or the technical innovation angle?", time: "1:30 PM", thread: [
      { id: 51, memberId: 1, text: "Let's go with ethical implications — it's more aligned with the marking rubric emphasis on critical analysis.", time: "1:35 PM" },
    ]},
    { id: 6, memberId: 2, text: "Quick update: the survey results are in. 87% response rate! I'll start the data analysis tonight.", time: "2:15 PM", thread: [] },
    { id: 7, memberId: 1, text: "Amazing work everyone. We're ahead of schedule. Let's keep this momentum going! 🚀", time: "3:00 PM", thread: [] },
  ],
  research: [
    { id: 101, memberId: 2, text: "Key paper: 'Attention Is All You Need' (Vaswani et al., 2017) — foundational for our transformer section.", time: "9:00 AM", thread: [] },
    { id: 102, memberId: 5, text: "Added 12 new sources to the Zotero library. All tagged by subtopic.", time: "11:30 AM", thread: [
      { id: 1021, memberId: 2, text: "Great, I'll cross-reference with mine to avoid duplicates.", time: "11:45 AM" },
    ]},
    { id: 103, memberId: 1, text: "Prof. Williams suggested we look at the 2024 NeurIPS proceedings for recent advances. Anyone want to take that on?", time: "2:00 PM", thread: [] },
  ],
  design: [
    { id: 201, memberId: 3, text: "Here's the colour palette I'm proposing for the final presentation. Thoughts on the contrast ratios?", time: "9:30 AM", thread: [
      { id: 2011, memberId: 1, text: "The purple on dark grey might be hard to read for accessibility. Can we bump the lightness?", time: "9:45 AM" },
      { id: 2012, memberId: 3, text: "Good catch. I'll adjust to WCAG AA standards.", time: "9:50 AM" },
    ]},
    { id: 202, memberId: 3, text: "Slide templates are done — 24 slides with consistent layouts. Ready for content drop-in.", time: "3:15 PM", thread: [] },
  ],
  deadlines: [
    { id: 301, memberId: 1, text: "⚠️ REMINDER: Literature review draft due this Friday 11:59 PM. Lily and Marcus — how's progress?", time: "8:00 AM", thread: [
      { id: 3011, memberId: 5, text: "About 70% done. Will finish by Thursday evening.", time: "8:15 AM" },
      { id: 3012, memberId: 2, text: "Data analysis section needs one more pass. On track for Friday.", time: "8:30 AM" },
    ]},
    { id: 302, memberId: 4, text: "Code demo scheduled for next Tuesday. I need the dataset from Marcus by Monday latest.", time: "10:00 AM", thread: [] },
  ],
  random: [
    { id: 401, memberId: 4, text: "Anyone else surviving on coffee and instant noodles this week? 😅", time: "11:00 PM", thread: [
      { id: 4011, memberId: 3, text: "The library café's oat milk flat white is keeping me alive.", time: "11:05 PM" },
      { id: 4012, memberId: 5, text: "I've transcended physical needs. I am one with the assignment.", time: "11:10 PM" },
    ]},
  ],
};

const TASKS = [
  { id: 1, title: "Write project introduction", assignee: 5, status: "in-progress", priority: "high", due: "2026-03-14" },
  { id: 2, title: "Complete literature review", assignee: 2, status: "in-progress", priority: "high", due: "2026-03-14" },
  { id: 3, title: "Design presentation slides", assignee: 3, status: "done", priority: "medium", due: "2026-03-12" },
  { id: 4, title: "Build code demo prototype", assignee: 4, status: "in-progress", priority: "high", due: "2026-03-18" },
  { id: 5, title: "Analyse survey data", assignee: 2, status: "todo", priority: "medium", due: "2026-03-16" },
  { id: 6, title: "Write methodology section", assignee: 5, status: "todo", priority: "medium", due: "2026-03-20" },
  { id: 7, title: "Peer review all sections", assignee: 1, status: "todo", priority: "high", due: "2026-03-22" },
  { id: 8, title: "Create data visualisations", assignee: 3, status: "todo", priority: "low", due: "2026-03-19" },
  { id: 9, title: "Final report compilation", assignee: 1, status: "todo", priority: "high", due: "2026-03-25" },
  { id: 10, title: "Prepare presentation script", assignee: 5, status: "todo", priority: "medium", due: "2026-03-24" },
  { id: 11, title: "Code documentation", assignee: 4, status: "todo", priority: "low", due: "2026-03-21" },
  { id: 12, title: "Submit final deliverables", assignee: 1, status: "todo", priority: "high", due: "2026-03-27" },
];

const DEADLINES = [
  { id: 1, memberId: 1, title: "Peer review draft", date: "2026-03-14", course: "CS3100" },
  { id: 2, memberId: 1, title: "Final report", date: "2026-03-25", course: "CS3100" },
  { id: 3, memberId: 1, title: "Ethics essay", date: "2026-03-20", course: "PHIL2050" },
  { id: 4, memberId: 2, title: "Lit review", date: "2026-03-14", course: "CS3100" },
  { id: 5, memberId: 2, title: "Data analysis", date: "2026-03-16", course: "CS3100" },
  { id: 6, memberId: 2, title: "Stats exam", date: "2026-03-19", course: "STAT2020" },
  { id: 7, memberId: 3, title: "Slide deck", date: "2026-03-12", course: "CS3100" },
  { id: 8, memberId: 3, title: "Portfolio review", date: "2026-03-17", course: "DES3300" },
  { id: 9, memberId: 3, title: "UX report", date: "2026-03-21", course: "DES3300" },
  { id: 10, memberId: 4, title: "Code demo", date: "2026-03-18", course: "CS3100" },
  { id: 11, memberId: 4, title: "Algo assignment", date: "2026-03-15", course: "CS3200" },
  { id: 12, memberId: 4, title: "Code docs", date: "2026-03-21", course: "CS3100" },
  { id: 13, memberId: 5, title: "Intro chapter", date: "2026-03-14", course: "CS3100" },
  { id: 14, memberId: 5, title: "Methodology", date: "2026-03-20", course: "CS3100" },
  { id: 15, memberId: 5, title: "Creative writing", date: "2026-03-16", course: "ENG2100" },
  { id: 16, memberId: 5, title: "Presentation script", date: "2026-03-24", course: "CS3100" },
  { id: 17, memberId: 1, title: "Submit deliverables", date: "2026-03-27", course: "CS3100" },
  { id: 18, memberId: 2, title: "Lab report", date: "2026-03-23", course: "STAT2020" },
  { id: 19, memberId: 3, title: "Visualisations", date: "2026-03-19", course: "CS3100" },
  { id: 20, memberId: 4, title: "Database project", date: "2026-03-24", course: "CS3050" },
];

// ─── Helper Functions ────────────────────────────────────────────────────────
const getMember = (id) => MEMBERS.find((m) => m.id === id);
const formatDate = (dateStr) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { month: "short", day: "numeric" });
};
const daysUntil = (dateStr) => {
  const now = new Date("2026-03-12T00:00:00");
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg-primary: #0B0E14;
  --bg-secondary: #111621;
  --bg-tertiary: #171D2A;
  --bg-elevated: #1C2333;
  --bg-hover: #222B3E;
  --border: #252D3F;
  --border-subtle: #1E2638;
  --text-primary: #E2E8F0;
  --text-secondary: #8B95A8;
  --text-muted: #5A6578;
  --accent: #7C6AEF;
  --accent-hover: #6B59DE;
  --accent-subtle: rgba(124,106,239,0.12);
  --green: #34D399;
  --green-subtle: rgba(52,211,153,0.12);
  --yellow: #FBBF24;
  --yellow-subtle: rgba(251,191,36,0.12);
  --red: #F87171;
  --red-subtle: rgba(248,113,113,0.12);
  --orange: #FB923C;
  --blue: #60A5FA;
  --pink: #F472B6;
  --radius: 10px;
  --radius-sm: 6px;
  --radius-lg: 14px;
  --shadow: 0 4px 24px rgba(0,0,0,0.3);
  --transition: 180ms cubic-bezier(0.4, 0, 0.2, 1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
  height: 100vh;
}

#root { height: 100vh; }

.app {
  display: grid;
  grid-template-columns: 68px 1fr;
  height: 100vh;
  overflow: hidden;
}

/* ─── Sidebar ─── */
.sidebar {
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  gap: 4px;
  z-index: 10;
}

.sidebar-logo {
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, #7C6AEF, #A78BFA);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  color: white;
  margin-bottom: 20px;
  letter-spacing: -1px;
}

.sidebar-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--radius);
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
  position: relative;
  font-size: 18px;
}

.sidebar-btn:hover {
  background: var(--bg-hover);
  color: var(--text-secondary);
}

.sidebar-btn.active {
  background: var(--accent-subtle);
  color: var(--accent);
}

.sidebar-btn .badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--red);
  border: 2px solid var(--bg-secondary);
}

.sidebar-spacer { flex: 1; }

.sidebar-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #6C5CE7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all var(--transition);
}

.sidebar-avatar:hover { transform: scale(1.08); }

/* ─── Main Content ─── */
.main-content {
  display: grid;
  overflow: hidden;
}

.main-content.chat-layout {
  grid-template-columns: 230px 1fr;
}

.main-content.full-layout {
  grid-template-columns: 1fr;
}

/* ─── Channel Sidebar ─── */
.channel-sidebar {
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.channel-header {
  padding: 20px 16px 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.channel-header h2 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.2px;
}

.channel-header span {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
  display: block;
}

.channel-group-title {
  padding: 16px 16px 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
}

.channel-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px 8px;
}

.channel-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition);
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 13px;
}

.channel-item:hover { background: var(--bg-hover); color: var(--text-primary); }

.channel-item.active {
  background: var(--accent-subtle);
  color: var(--accent);
}

.channel-item .emoji { font-size: 16px; flex-shrink: 0; }

.channel-item .unread-badge {
  margin-left: auto;
  background: var(--accent);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.member-list {
  padding: 4px 8px;
  border-top: 1px solid var(--border-subtle);
  max-height: 200px;
  overflow-y: auto;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--text-secondary);
}

.member-item .member-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.member-item .member-dot.online { background: var(--green); }
.member-item .member-dot.away { background: var(--yellow); }
.member-item .member-dot.offline { background: var(--text-muted); }

/* ─── Chat Panel ─── */
.chat-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-primary);
}

.chat-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-bottom: 1px solid var(--border);
  min-height: 56px;
}

.chat-topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-topbar-left .topic-emoji { font-size: 20px; }
.chat-topbar-left h3 { font-size: 15px; font-weight: 600; letter-spacing: -0.3px; }
.chat-topbar-left span { font-size: 12px; color: var(--text-muted); }

.chat-topbar-actions {
  display: flex;
  gap: 6px;
}

.topbar-btn {
  padding: 7px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 12px;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
  display: flex;
  align-items: center;
  gap: 6px;
}

.topbar-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

.topbar-btn.accent {
  background: var(--accent-subtle);
  border-color: transparent;
  color: var(--accent);
}

.topbar-btn.accent:hover {
  background: var(--accent);
  color: white;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.message-group {
  display: flex;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius);
  transition: background var(--transition);
}

.message-group:hover { background: var(--bg-secondary); }

.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
  margin-top: 2px;
}

.msg-body { flex: 1; min-width: 0; }

.msg-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.msg-name { font-size: 13px; font-weight: 600; }
.msg-time { font-size: 11px; color: var(--text-muted); }

.msg-text {
  font-size: 13.5px;
  line-height: 1.55;
  color: var(--text-secondary);
  word-break: break-word;
}

.thread-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 6px 10px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  cursor: pointer;
  transition: all var(--transition);
}

.thread-indicator:hover {
  background: var(--bg-hover);
  border-color: var(--border);
}

.thread-avatars {
  display: flex;
  margin-right: 4px;
}

.thread-avatars .mini-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 8px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-left: -6px;
  border: 2px solid var(--bg-tertiary);
}

.thread-avatars .mini-avatar:first-child { margin-left: 0; }

.thread-info {
  font-size: 11px;
  color: var(--accent);
  font-weight: 500;
}

.thread-preview {
  font-size: 11px;
  color: var(--text-muted);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Thread expanded */
.thread-expanded {
  margin-top: 8px;
  margin-left: 12px;
  padding-left: 12px;
  border-left: 2px solid var(--accent-subtle);
}

.thread-msg {
  display: flex;
  gap: 8px;
  padding: 6px 0;
}

.thread-msg .mini-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.thread-msg-body { flex: 1; }
.thread-msg-header { display: flex; gap: 6px; align-items: baseline; margin-bottom: 2px; }
.thread-msg-name { font-size: 12px; font-weight: 600; }
.thread-msg-time { font-size: 10px; color: var(--text-muted); }
.thread-msg-text { font-size: 12.5px; color: var(--text-secondary); line-height: 1.45; }

/* Chat Input */
.chat-input-container {
  padding: 12px 24px 20px;
  border-top: 1px solid var(--border-subtle);
}

.chat-input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 14px;
  transition: border-color var(--transition);
}

.chat-input-wrapper:focus-within {
  border-color: var(--accent);
}

.chat-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 13.5px;
  outline: none;
}

.chat-input::placeholder { color: var(--text-muted); }

.send-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: none;
  background: var(--accent);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
  font-size: 14px;
}

.send-btn:hover { background: var(--accent-hover); transform: scale(1.05); }

/* ─── Page Headers ─── */
.page-container {
  overflow-y: auto;
  padding: 28px 36px;
}

.page-header {
  margin-bottom: 28px;
}

.page-header h1 {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 4px;
}

.page-header p {
  font-size: 13px;
  color: var(--text-muted);
}

/* ─── Dashboard ─── */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.dash-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  transition: border-color var(--transition);
}

.dash-card:hover { border-color: var(--text-muted); }

.dash-card.full-width { grid-column: 1 / -1; }

.dash-card-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-muted);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dash-card-title .icon { font-size: 14px; }

.member-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: var(--radius);
  margin-bottom: 8px;
  border: 1px solid transparent;
  transition: all var(--transition);
}

.member-card:hover { border-color: var(--border); }
.member-card:last-child { margin-bottom: 0; }

.member-card-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  position: relative;
}

.member-card-avatar .status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--bg-tertiary);
}

.member-card-info { flex: 1; min-width: 0; }
.member-card-name { font-size: 13px; font-weight: 600; }
.member-card-role { font-size: 11px; color: var(--text-muted); }
.member-card-tasks { text-align: right; }
.member-card-tasks .count {
  font-size: 20px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}
.member-card-tasks .label {
  font-size: 10px;
  color: var(--text-muted);
  display: block;
}

/* Stats row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -1px;
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

/* ─── Heatmap ─── */
.heatmap-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.heatmap-calendar {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  gap: 3px;
}

.heatmap-day-header {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  text-align: center;
  padding: 8px 0;
}

.heatmap-member-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  padding-right: 8px;
}

.heatmap-member-label .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.heatmap-cell {
  height: 38px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  cursor: default;
  transition: all var(--transition);
  position: relative;
  border: 1px solid transparent;
}

.heatmap-cell:hover { transform: scale(1.06); z-index: 2; }

.heatmap-cell.empty { background: var(--bg-tertiary); }
.heatmap-cell.low { background: rgba(52,211,153,0.15); color: var(--green); border-color: rgba(52,211,153,0.2); }
.heatmap-cell.medium { background: rgba(251,191,36,0.15); color: var(--yellow); border-color: rgba(251,191,36,0.2); }
.heatmap-cell.high { background: rgba(248,113,113,0.18); color: var(--red); border-color: rgba(248,113,113,0.25); }

.heatmap-cell.clash {
  animation: pulse-clash 2s ease-in-out infinite;
}

@keyframes pulse-clash {
  0%, 100% { box-shadow: 0 0 0 0 rgba(248,113,113,0.3); }
  50% { box-shadow: 0 0 0 4px rgba(248,113,113,0.1); }
}

.heatmap-legend {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
  padding: 12px 0 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
}

.legend-swatch {
  width: 14px;
  height: 14px;
  border-radius: 3px;
}

/* ─── Meeting Suggestions ─── */
.meeting-suggestions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.meeting-slot {
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all var(--transition);
  cursor: pointer;
}

.meeting-slot:hover {
  border-color: var(--green);
  background: var(--green-subtle);
}

.meeting-slot .slot-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--green-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.meeting-slot .slot-info h4 {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 2px;
}

.meeting-slot .slot-info p {
  font-size: 11px;
  color: var(--text-muted);
}

.meeting-slot .slot-score {
  margin-left: auto;
  font-size: 11px;
  font-weight: 700;
  color: var(--green);
  font-family: 'JetBrains Mono', monospace;
}

/* ─── Tasks Panel ─── */
.tasks-columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.task-column {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  min-height: 400px;
}

.task-column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.task-column-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-column-title .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.task-column-count {
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-muted);
  background: var(--bg-tertiary);
  padding: 2px 8px;
  border-radius: 10px;
}

.task-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  padding: 14px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all var(--transition);
}

.task-card:hover {
  border-color: var(--border);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.task-card:last-child { margin-bottom: 0; }

.task-title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 10px;
  line-height: 1.35;
}

.task-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.task-assignee {
  display: flex;
  align-items: center;
  gap: 6px;
}

.task-assignee-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 8px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.task-assignee-name {
  font-size: 11px;
  color: var(--text-muted);
}

.task-priority {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 3px 8px;
  border-radius: 4px;
}

.task-priority.high { background: var(--red-subtle); color: var(--red); }
.task-priority.medium { background: var(--yellow-subtle); color: var(--yellow); }
.task-priority.low { background: var(--green-subtle); color: var(--green); }

.task-due {
  font-size: 10px;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.task-due.overdue { color: var(--red); }
.task-due.soon { color: var(--yellow); }

/* ─── Catch Me Up Modal ─── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 200ms ease;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.modal {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  width: 580px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,0.5);
  animation: slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.modal-header h2 { font-size: 16px; font-weight: 700; letter-spacing: -0.3px; }

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg-tertiary);
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all var(--transition);
}

.modal-close:hover { background: var(--bg-hover); color: var(--text-primary); }

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.catch-up-select {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.catch-up-member-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition);
}

.catch-up-member-btn:hover { border-color: var(--text-muted); }
.catch-up-member-btn.active { border-color: var(--accent); background: var(--accent-subtle); color: var(--accent); }

.catch-up-member-btn .mini-av {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.catch-up-summary {
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
}

.catch-up-summary h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-section {
  margin-bottom: 14px;
}

.summary-section:last-child { margin-bottom: 0; }

.summary-section h4 {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--accent);
  margin-bottom: 6px;
}

.summary-section p, .summary-section li {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.summary-section ul {
  list-style: none;
  padding: 0;
}

.summary-section li {
  padding: 4px 0;
  padding-left: 16px;
  position: relative;
}

.summary-section li::before {
  content: "→";
  position: absolute;
  left: 0;
  color: var(--accent);
  font-size: 12px;
}

/* ─── Scrollbar ─── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

/* Clash row highlight */
.clash-row {
  background: rgba(248,113,113,0.04);
  border-radius: var(--radius-sm);
}

/* Task new form */
.new-task-form {
  background: var(--bg-tertiary);
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  padding: 12px;
  margin-top: 10px;
}

.new-task-form input, .new-task-form select {
  width: 100%;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 12px;
  margin-bottom: 8px;
  outline: none;
}

.new-task-form input:focus, .new-task-form select:focus { border-color: var(--accent); }

.new-task-form select option { background: var(--bg-elevated); }

.new-task-actions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

.btn-sm {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: 1px solid var(--border);
  transition: all var(--transition);
}

.btn-sm.primary { background: var(--accent); border-color: var(--accent); color: white; }
.btn-sm.primary:hover { background: var(--accent-hover); }
.btn-sm.ghost { background: transparent; color: var(--text-secondary); }
.btn-sm.ghost:hover { background: var(--bg-hover); }

.add-task-btn {
  width: 100%;
  padding: 10px;
  border-radius: var(--radius);
  border: 1px dashed var(--border);
  background: transparent;
  color: var(--text-muted);
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition);
  margin-top: 10px;
}

.add-task-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-subtle); }

/* Heatmap tooltip */
.heatmap-cell[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-size: 10px;
  padding: 5px 9px;
  border-radius: 5px;
  white-space: nowrap;
  z-index: 10;
  box-shadow: var(--shadow);
  pointer-events: none;
}

.deadline-list-section { margin-top: 0; }

.deadline-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  margin-bottom: 4px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-subtle);
  font-size: 12px;
}

.deadline-item .dl-date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--text-muted);
  min-width: 56px;
}

.deadline-item .dl-title { flex: 1; color: var(--text-secondary); }

.deadline-item .dl-course {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--text-muted);
  background: var(--bg-elevated);
  padding: 2px 7px;
  border-radius: 4px;
}

.deadline-item .dl-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 8px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.section-divider {
  margin: 24px 0 20px;
  padding-bottom: 0;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}
`;

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const Icons = {
  chat: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  dashboard: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  calendar: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  tasks: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  send: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>,
};

// ─── Catch Me Up Summaries ───────────────────────────────────────────────────
const CATCH_UP = {
  1: {
    mentions: ["Marcus shared survey results (87% response rate) — data analysis starting tonight", "Sophie adopted group purple as presentation accent colour", "Lily starting intro with ethical implications angle per your suggestion"],
    tasks: ["Peer review draft due Fri 14 Mar", "Ethics essay due 20 Mar (PHIL2050)", "Final report compilation due 25 Mar"],
    decisions: ["Presentation will use dark theme with purple accents", "Intro chapter to focus on ethical implications over technical innovation"],
  },
  2: {
    mentions: ["Aisha pushed updated project brief — review before Wednesday", "James needs your dataset by Monday for code demo", "Prof. Williams suggested 2024 NeurIPS proceedings for recent advances"],
    tasks: ["Literature review draft due Fri 14 Mar", "Survey data analysis due 16 Mar", "Stats exam 19 Mar (STAT2020)"],
    decisions: ["Project brief updated and on shared drive", "Intro chapter taking ethical implications angle"],
  },
  3: {
    mentions: ["Aisha loved the dark theme idea — use group purple as accent", "Accessibility concern raised: purple on dark grey contrast needs WCAG AA adjustment", "24 slide templates reported as ready for content"],
    tasks: ["Slide deck done ✓", "Portfolio review 17 Mar (DES3300)", "Data visualisations due 19 Mar"],
    decisions: ["Dark theme with purple accent approved", "Adjusting contrast to meet WCAG AA standards"],
  },
  4: {
    mentions: ["GitHub repo set up — all members given access", "Need dataset from Marcus by Monday for code demo", "Code demo scheduled for next Tuesday"],
    tasks: ["Algo assignment due 15 Mar (CS3200)", "Code demo 18 Mar", "Code documentation due 21 Mar"],
    decisions: ["Using ethical implications angle for intro", "Dark theme presentation approved"],
  },
  5: {
    mentions: ["Aisha confirmed ethical implications angle for intro chapter", "Marcus posted key research paper for transformer section", "Need to get DOIs from Marcus for bibliography"],
    tasks: ["Intro chapter due Fri 14 Mar", "Creative writing due 16 Mar (ENG2100)", "Methodology section due 20 Mar"],
    decisions: ["Intro chapter: ethical implications framing", "Presentation: dark theme with purple accents"],
  },
};

// ─── Main App Component ──────────────────────────────────────────────────────
export default function App() {
  const [activeView, setActiveView] = useState("chat");
  const [activeTopic, setActiveTopic] = useState("general");
  const [expandedThreads, setExpandedThreads] = useState({});
  const [showCatchUp, setShowCatchUp] = useState(false);
  const [catchUpMember, setCatchUpMember] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(MESSAGES);
  const [tasks, setTasks] = useState(TASKS);
  const [showNewTask, setShowNewTask] = useState(null);
  const [newTaskData, setNewTaskData] = useState({ title: "", assignee: "", priority: "medium", due: "" });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTopic]);

  const toggleThread = (msgId) => {
    setExpandedThreads((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now(),
      memberId: 1,
      text: newMessage,
      time: new Date().toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" }),
      thread: [],
    };
    setMessages((prev) => ({
      ...prev,
      [activeTopic]: [...(prev[activeTopic] || []), msg],
    }));
    setNewMessage("");
  };

  const addTask = (status) => {
    if (!newTaskData.title) return;
    const task = {
      id: Date.now(),
      title: newTaskData.title,
      assignee: parseInt(newTaskData.assignee) || 1,
      status,
      priority: newTaskData.priority,
      due: newTaskData.due || "2026-03-28",
    };
    setTasks((prev) => [...prev, task]);
    setShowNewTask(null);
    setNewTaskData({ title: "", assignee: "", priority: "medium", due: "" });
  };

  // Heatmap data generation
  const generateHeatmap = useCallback(() => {
    const days = [];
    const start = new Date("2026-03-12T00:00:00");
    for (let i = 0; i < 16; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      days.push(d.toISOString().split("T")[0]);
    }

    const memberRows = MEMBERS.map((member) => {
      const cells = days.map((day) => {
        const memberDeadlines = DEADLINES.filter(
          (dl) => dl.memberId === member.id && dl.date === day
        );
        const totalDeadlinesOnDay = DEADLINES.filter((dl) => dl.date === day).length;
        const level = memberDeadlines.length === 0 ? "empty" : memberDeadlines.length === 1 ? "low" : memberDeadlines.length === 2 ? "medium" : "high";
        const isClash = totalDeadlinesOnDay >= 3;
        return { day, level, count: memberDeadlines.length, deadlines: memberDeadlines, isClash };
      });
      return { member, cells };
    });

    const clashDays = days.filter((day) => {
      const count = DEADLINES.filter((dl) => dl.date === day).length;
      return count >= 3;
    });

    return { days, memberRows, clashDays };
  }, []);

  const getMeetingSuggestions = useCallback(() => {
    const { days } = generateHeatmap();
    const suggestions = [];
    days.forEach((day) => {
      const count = DEADLINES.filter((dl) => dl.date === day).length;
      const d = new Date(day + "T00:00:00");
      const dayName = d.toLocaleDateString("en-AU", { weekday: "long" });
      if (d.getDay() !== 0 && d.getDay() !== 6 && count <= 1) {
        suggestions.push({
          day,
          dayName,
          date: formatDate(day),
          score: Math.max(0, 100 - count * 30),
          freeMembers: MEMBERS.filter((m) => !DEADLINES.some((dl) => dl.memberId === m.id && dl.date === day)).length,
        });
      }
    });
    return suggestions.sort((a, b) => b.score - a.score).slice(0, 4);
  }, [generateHeatmap]);

  const nav = [
    { id: "chat", icon: Icons.chat, label: "Chat", hasNotif: true },
    { id: "dashboard", icon: Icons.dashboard, label: "Dashboard" },
    { id: "heatmap", icon: Icons.calendar, label: "Heatmap" },
    { id: "tasks", icon: Icons.tasks, label: "Tasks" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* ─── Icon Sidebar ─── */}
        <nav className="sidebar">
          <div className="sidebar-logo">SG</div>
          {nav.map((item) => (
            <button
              key={item.id}
              className={`sidebar-btn ${activeView === item.id ? "active" : ""}`}
              onClick={() => setActiveView(item.id)}
              title={item.label}
            >
              {item.icon}
              {item.hasNotif && <span className="badge" />}
            </button>
          ))}
          <div className="sidebar-spacer" />
          <div className="sidebar-avatar" title="Aisha Patel (You)">AP</div>
        </nav>

        {/* ─── Main Content ─── */}
        <div className={`main-content ${activeView === "chat" ? "chat-layout" : "full-layout"}`}>
          {/* Channel sidebar for chat */}
          {activeView === "chat" && (
            <aside className="channel-sidebar">
              <div className="channel-header">
                <h2>CS3100 Group 7</h2>
                <span>AI Ethics Research Project</span>
              </div>
              <div className="channel-group-title">Topics</div>
              <div className="channel-list">
                {TOPICS.map((t) => (
                  <button
                    key={t.id}
                    className={`channel-item ${activeTopic === t.id ? "active" : ""}`}
                    onClick={() => setActiveTopic(t.id)}
                  >
                    <span className="emoji">{t.emoji}</span>
                    {t.name}
                    {t.unread > 0 && <span className="unread-badge">{t.unread}</span>}
                  </button>
                ))}
              </div>
              <div className="channel-group-title">Members</div>
              <div className="member-list">
                {MEMBERS.map((m) => (
                  <div key={m.id} className="member-item">
                    <span className={`member-dot ${m.status}`} />
                    {m.name}
                  </div>
                ))}
              </div>
            </aside>
          )}

          {/* ─── Chat View ─── */}
          {activeView === "chat" && (
            <div className="chat-panel">
              <div className="chat-topbar">
                <div className="chat-topbar-left">
                  <span className="topic-emoji">{TOPICS.find((t) => t.id === activeTopic)?.emoji}</span>
                  <div>
                    <h3>{TOPICS.find((t) => t.id === activeTopic)?.name}</h3>
                    <span>{(messages[activeTopic] || []).length} messages</span>
                  </div>
                </div>
                <div className="chat-topbar-actions">
                  <button className="topbar-btn accent" onClick={() => setShowCatchUp(true)}>
                    ⚡ Catch Me Up
                  </button>
                </div>
              </div>

              <div className="messages-container">
                {(messages[activeTopic] || []).map((msg) => {
                  const member = getMember(msg.memberId);
                  return (
                    <div key={msg.id}>
                      <div className="message-group">
                        <div className="msg-avatar" style={{ background: member.color }}>{member.avatar}</div>
                        <div className="msg-body">
                          <div className="msg-header">
                            <span className="msg-name" style={{ color: member.color }}>{member.name}</span>
                            <span className="msg-time">{msg.time}</span>
                          </div>
                          <div className="msg-text">{msg.text}</div>
                          {msg.thread.length > 0 && !expandedThreads[msg.id] && (
                            <div className="thread-indicator" onClick={() => toggleThread(msg.id)}>
                              <div className="thread-avatars">
                                {[...new Set(msg.thread.map((t) => t.memberId))].slice(0, 3).map((mid) => {
                                  const tm = getMember(mid);
                                  return <div key={mid} className="mini-avatar" style={{ background: tm.color }}>{tm.avatar}</div>;
                                })}
                              </div>
                              <span className="thread-info">{msg.thread.length} {msg.thread.length === 1 ? "reply" : "replies"}</span>
                              <span className="thread-preview">{msg.thread[msg.thread.length - 1].text}</span>
                            </div>
                          )}
                          {msg.thread.length > 0 && expandedThreads[msg.id] && (
                            <div className="thread-expanded">
                              {msg.thread.map((reply) => {
                                const rm = getMember(reply.memberId);
                                return (
                                  <div key={reply.id} className="thread-msg">
                                    <div className="mini-avatar" style={{ background: rm.color }}>{rm.avatar}</div>
                                    <div className="thread-msg-body">
                                      <div className="thread-msg-header">
                                        <span className="thread-msg-name" style={{ color: rm.color }}>{rm.name}</span>
                                        <span className="thread-msg-time">{reply.time}</span>
                                      </div>
                                      <div className="thread-msg-text">{reply.text}</div>
                                    </div>
                                  </div>
                                );
                              })}
                              <button className="topbar-btn" style={{ marginTop: 8, fontSize: 11 }} onClick={() => toggleThread(msg.id)}>
                                Collapse thread
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-container">
                <div className="chat-input-wrapper">
                  <input
                    className="chat-input"
                    placeholder={`Message #${TOPICS.find((t) => t.id === activeTopic)?.name.toLowerCase()}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button className="send-btn" onClick={sendMessage}>{Icons.send}</button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Dashboard View ─── */}
          {activeView === "dashboard" && (
            <div className="page-container">
              <div className="page-header">
                <h1>Project Dashboard</h1>
                <p>CS3100 — AI Ethics Research Project — Group 7</p>
              </div>

              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-value" style={{ color: "var(--accent)" }}>{tasks.length}</div>
                  <div className="stat-label">Total Tasks</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: "var(--green)" }}>{tasks.filter((t) => t.status === "done").length}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: "var(--yellow)" }}>{tasks.filter((t) => t.status === "in-progress").length}</div>
                  <div className="stat-label">In Progress</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: "var(--red)" }}>
                    {tasks.filter((t) => t.status !== "done" && daysUntil(t.due) <= 3).length}
                  </div>
                  <div className="stat-label">Due Soon</div>
                </div>
              </div>

              <div className="dashboard-grid">
                <div className="dash-card full-width">
                  <div className="dash-card-title"><span className="icon">👥</span> Team Members</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
                    {MEMBERS.map((m) => {
                      const memberTasks = tasks.filter((t) => t.assignee === m.id && t.status !== "done");
                      return (
                        <div key={m.id} className="member-card">
                          <div className="member-card-avatar" style={{ background: m.color }}>
                            {m.avatar}
                            <div className="status-dot" style={{ background: m.status === "online" ? "var(--green)" : m.status === "away" ? "var(--yellow)" : "var(--text-muted)" }} />
                          </div>
                          <div className="member-card-info">
                            <div className="member-card-name">{m.name}</div>
                            <div className="member-card-role">{m.role}</div>
                          </div>
                          <div className="member-card-tasks">
                            <span className="count" style={{ color: m.color }}>{memberTasks.length}</span>
                            <span className="label">active tasks</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="dash-card">
                  <div className="dash-card-title"><span className="icon">🔥</span> Upcoming Deadlines</div>
                  {DEADLINES.filter((dl) => dl.course === "CS3100").sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6).map((dl) => {
                    const m = getMember(dl.memberId);
                    const d = daysUntil(dl.date);
                    return (
                      <div key={dl.id} className="deadline-item">
                        <div className="dl-avatar" style={{ background: m.color }}>{m.avatar}</div>
                        <span className="dl-title">{dl.title}</span>
                        <span className="dl-date" style={{ color: d <= 2 ? "var(--red)" : d <= 5 ? "var(--yellow)" : "var(--text-muted)" }}>
                          {d === 0 ? "Today" : d === 1 ? "Tomorrow" : `${d}d`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="dash-card">
                  <div className="dash-card-title"><span className="icon">📊</span> Progress Overview</div>
                  {MEMBERS.map((m) => {
                    const total = tasks.filter((t) => t.assignee === m.id).length;
                    const done = tasks.filter((t) => t.assignee === m.id && t.status === "done").length;
                    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                    return (
                      <div key={m.id} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 12, fontWeight: 500 }}>{m.name}</span>
                          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)" }}>{pct}%</span>
                        </div>
                        <div style={{ height: 6, background: "var(--bg-tertiary)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: m.color, borderRadius: 3, transition: "width 600ms ease" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ─── Heatmap View ─── */}
          {activeView === "heatmap" && (() => {
            const { days, memberRows, clashDays } = generateHeatmap();
            const suggestions = getMeetingSuggestions();
            return (
              <div className="page-container">
                <div className="page-header">
                  <h1>Deadline Stress Heatmap</h1>
                  <p>Visualise workload across the team — find the best times to meet</p>
                </div>

                <div className="dash-card" style={{ marginBottom: 24 }}>
                  <div className="dash-card-title"><span className="icon">🗓️</span> March 12 – 27, 2026</div>
                  <div className="heatmap-calendar">
                    <div />
                    {days.slice(0, 7).map((day) => {
                      const d = new Date(day + "T00:00:00");
                      return <div key={day} className="heatmap-day-header">{d.toLocaleDateString("en-AU", { weekday: "short" })}<br />{d.getDate()}</div>;
                    })}

                    {memberRows.map(({ member, cells }) => (
                      <React.Fragment key={member.id}>
                        <div className="heatmap-member-label">
                          <span className="dot" style={{ background: member.color }} />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.name.split(" ")[0]}</span>
                        </div>
                        {cells.slice(0, 7).map((cell) => (
                          <div
                            key={cell.day}
                            className={`heatmap-cell ${cell.level} ${cell.isClash ? "clash" : ""}`}
                            data-tooltip={cell.deadlines.length > 0 ? cell.deadlines.map((d) => d.title).join(", ") : "No deadlines"}
                          >
                            {cell.count > 0 ? cell.count : ""}
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>

                  {days.length > 7 && (
                    <>
                      <div style={{ height: 16 }} />
                      <div className="heatmap-calendar">
                        <div />
                        {days.slice(7, 14).map((day) => {
                          const d = new Date(day + "T00:00:00");
                          return <div key={day} className="heatmap-day-header">{d.toLocaleDateString("en-AU", { weekday: "short" })}<br />{d.getDate()}</div>;
                        })}

                        {memberRows.map(({ member, cells }) => (
                          <React.Fragment key={member.id}>
                            <div className="heatmap-member-label">
                              <span className="dot" style={{ background: member.color }} />
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.name.split(" ")[0]}</span>
                            </div>
                            {cells.slice(7, 14).map((cell) => (
                              <div
                                key={cell.day}
                                className={`heatmap-cell ${cell.level} ${cell.isClash ? "clash" : ""}`}
                                data-tooltip={cell.deadlines.length > 0 ? cell.deadlines.map((d) => d.title).join(", ") : "No deadlines"}
                              >
                                {cell.count > 0 ? cell.count : ""}
                              </div>
                            ))}
                          </React.Fragment>
                        ))}
                      </div>
                    </>
                  )}

                  {days.length > 14 && (
                    <>
                      <div style={{ height: 16 }} />
                      <div className="heatmap-calendar" style={{ gridTemplateColumns: `80px repeat(${days.length - 14}, 1fr)` }}>
                        <div />
                        {days.slice(14).map((day) => {
                          const d = new Date(day + "T00:00:00");
                          return <div key={day} className="heatmap-day-header">{d.toLocaleDateString("en-AU", { weekday: "short" })}<br />{d.getDate()}</div>;
                        })}

                        {memberRows.map(({ member, cells }) => (
                          <React.Fragment key={member.id}>
                            <div className="heatmap-member-label">
                              <span className="dot" style={{ background: member.color }} />
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.name.split(" ")[0]}</span>
                            </div>
                            {cells.slice(14).map((cell) => (
                              <div
                                key={cell.day}
                                className={`heatmap-cell ${cell.level} ${cell.isClash ? "clash" : ""}`}
                                data-tooltip={cell.deadlines.length > 0 ? cell.deadlines.map((d) => d.title).join(", ") : "No deadlines"}
                              >
                                {cell.count > 0 ? cell.count : ""}
                              </div>
                            ))}
                          </React.Fragment>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="heatmap-legend">
                    <div className="legend-item"><div className="legend-swatch" style={{ background: "var(--bg-tertiary)" }} /> No deadlines</div>
                    <div className="legend-item"><div className="legend-swatch" style={{ background: "rgba(52,211,153,0.2)" }} /> Low (1)</div>
                    <div className="legend-item"><div className="legend-swatch" style={{ background: "rgba(251,191,36,0.2)" }} /> Moderate (2)</div>
                    <div className="legend-item"><div className="legend-swatch" style={{ background: "rgba(248,113,113,0.2)" }} /> High (3+)</div>
                    <div className="legend-item"><div className="legend-swatch" style={{ background: "rgba(248,113,113,0.25)", boxShadow: "0 0 0 2px rgba(248,113,113,0.3)" }} /> Team clash</div>
                  </div>
                </div>

                {clashDays.length > 0 && (
                  <div className="dash-card" style={{ marginBottom: 24, borderColor: "rgba(248,113,113,0.2)" }}>
                    <div className="dash-card-title" style={{ color: "var(--red)" }}><span className="icon">⚠️</span> Deadline Clashes</div>
                    {clashDays.map((day) => {
                      const dls = DEADLINES.filter((dl) => dl.date === day);
                      return (
                        <div key={day} style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: "var(--red)" }}>
                            {formatDate(day)} — {dls.length} deadlines across team
                          </div>
                          {dls.map((dl) => {
                            const m = getMember(dl.memberId);
                            return (
                              <div key={dl.id} className="deadline-item" style={{ borderColor: "rgba(248,113,113,0.15)" }}>
                                <div className="dl-avatar" style={{ background: m.color }}>{m.avatar}</div>
                                <span className="dl-title">{dl.title}</span>
                                <span className="dl-course">{dl.course}</span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="dash-card">
                  <div className="dash-card-title" style={{ color: "var(--green)" }}><span className="icon">✨</span> Suggested Meeting Times</div>
                  <div className="meeting-suggestions">
                    {suggestions.map((s, i) => (
                      <div key={i} className="meeting-slot">
                        <div className="slot-icon">📅</div>
                        <div className="slot-info">
                          <h4>{s.dayName}, {s.date}</h4>
                          <p>{s.freeMembers} of {MEMBERS.length} members free</p>
                        </div>
                        <div className="slot-score">{s.score}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ─── Tasks View ─── */}
          {activeView === "tasks" && (
            <div className="page-container">
              <div className="page-header">
                <h1>Task Board</h1>
                <p>Assign and track responsibilities across the team</p>
              </div>

              <div className="tasks-columns">
                {[
                  { key: "todo", label: "To Do", color: "var(--text-muted)" },
                  { key: "in-progress", label: "In Progress", color: "var(--yellow)" },
                  { key: "done", label: "Done", color: "var(--green)" },
                ].map((col) => {
                  const colTasks = tasks.filter((t) => t.status === col.key);
                  return (
                    <div key={col.key} className="task-column">
                      <div className="task-column-header">
                        <div className="task-column-title">
                          <span className="dot" style={{ background: col.color }} />
                          {col.label}
                        </div>
                        <span className="task-column-count">{colTasks.length}</span>
                      </div>

                      {colTasks.map((task) => {
                        const m = getMember(task.assignee);
                        const d = daysUntil(task.due);
                        return (
                          <div key={task.id} className="task-card">
                            <div className="task-title">{task.title}</div>
                            <div className="task-meta">
                              <div className="task-assignee">
                                <div className="task-assignee-avatar" style={{ background: m.color }}>{m.avatar}</div>
                                <span className="task-assignee-name">{m.name.split(" ")[0]}</span>
                              </div>
                              <span className={`task-priority ${task.priority}`}>{task.priority}</span>
                            </div>
                            <div className={`task-due ${d < 0 ? "overdue" : d <= 3 ? "soon" : ""}`}>
                              📅 {d < 0 ? `${Math.abs(d)}d overdue` : d === 0 ? "Due today" : d === 1 ? "Due tomorrow" : `Due in ${d}d`}
                              {" · "}{formatDate(task.due)}
                            </div>
                          </div>
                        );
                      })}

                      {showNewTask === col.key ? (
                        <div className="new-task-form">
                          <input
                            placeholder="Task title..."
                            value={newTaskData.title}
                            onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                            autoFocus
                          />
                          <select
                            value={newTaskData.assignee}
                            onChange={(e) => setNewTaskData({ ...newTaskData, assignee: e.target.value })}
                          >
                            <option value="">Assign to...</option>
                            {MEMBERS.map((m) => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                          <select
                            value={newTaskData.priority}
                            onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value })}
                          >
                            <option value="low">Low priority</option>
                            <option value="medium">Medium priority</option>
                            <option value="high">High priority</option>
                          </select>
                          <input
                            type="date"
                            value={newTaskData.due}
                            onChange={(e) => setNewTaskData({ ...newTaskData, due: e.target.value })}
                          />
                          <div className="new-task-actions">
                            <button className="btn-sm ghost" onClick={() => setShowNewTask(null)}>Cancel</button>
                            <button className="btn-sm primary" onClick={() => addTask(col.key)}>Add Task</button>
                          </div>
                        </div>
                      ) : (
                        <button className="add-task-btn" onClick={() => setShowNewTask(col.key)}>+ Add task</button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ─── Catch Me Up Modal ─── */}
        {showCatchUp && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowCatchUp(false)}>
            <div className="modal">
              <div className="modal-header">
                <h2>⚡ Catch Me Up</h2>
                <button className="modal-close" onClick={() => setShowCatchUp(false)}>✕</button>
              </div>
              <div className="modal-body">
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>Select a team member to see what they've missed:</p>
                <div className="catch-up-select">
                  {MEMBERS.map((m) => (
                    <button
                      key={m.id}
                      className={`catch-up-member-btn ${catchUpMember === m.id ? "active" : ""}`}
                      onClick={() => setCatchUpMember(m.id)}
                    >
                      <div className="mini-av" style={{ background: m.color }}>{m.avatar}</div>
                      {m.name.split(" ")[0]}
                    </button>
                  ))}
                </div>

                {CATCH_UP[catchUpMember] && (
                  <div className="catch-up-summary">
                    <h3>
                      <span style={{ width: 28, height: 28, borderRadius: "50%", background: getMember(catchUpMember).color, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white" }}>
                        {getMember(catchUpMember).avatar}
                      </span>
                      Summary for {getMember(catchUpMember).name}
                    </h3>

                    <div className="summary-section">
                      <h4>💬 What you missed</h4>
                      <ul>
                        {CATCH_UP[catchUpMember].mentions.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="summary-section">
                      <h4>📋 Your upcoming tasks</h4>
                      <ul>
                        {CATCH_UP[catchUpMember].tasks.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="summary-section">
                      <h4>🤝 Key decisions made</h4>
                      <ul>
                        {CATCH_UP[catchUpMember].decisions.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
