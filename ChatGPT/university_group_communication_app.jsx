import React, { useEffect, useMemo, useState } from "react";

const members = [
  {
    id: 1,
    name: "Mia Chen",
    role: "Project Lead",
    avatar: "MC",
    color: "from-blue-500 to-cyan-400",
    tasks: ["Finalize proposal", "Coordinate team meeting"],
    deadlines: [
      { title: "Proposal draft", date: "2026-03-15", stress: 3 },
      { title: "Client questions", date: "2026-03-22", stress: 2 },
    ],
  },
  {
    id: 2,
    name: "Noah Patel",
    role: "Frontend Dev",
    avatar: "NP",
    color: "from-violet-500 to-fuchsia-400",
    tasks: ["Build dashboard UI", "Refine task interactions"],
    deadlines: [
      { title: "UI prototype", date: "2026-03-18", stress: 2 },
      { title: "Frontend review", date: "2026-03-25", stress: 3 },
    ],
  },
  {
    id: 3,
    name: "Sofia Nguyen",
    role: "Research & Content",
    avatar: "SN",
    color: "from-emerald-500 to-teal-400",
    tasks: ["Literature review", "Case study notes"],
    deadlines: [
      { title: "Research synthesis", date: "2026-03-17", stress: 2 },
      { title: "Presentation talking points", date: "2026-03-24", stress: 2 },
    ],
  },
  {
    id: 4,
    name: "Liam Walker",
    role: "Data Analyst",
    avatar: "LW",
    color: "from-amber-500 to-orange-400",
    tasks: ["Analyse survey data", "Prepare charts"],
    deadlines: [
      { title: "Data cleaning", date: "2026-03-16", stress: 2 },
      { title: "Insights deck", date: "2026-03-23", stress: 3 },
    ],
  },
];

const initialThreads = [
  {
    id: 1,
    topic: "Assignment Scope",
    unread: 3,
    messages: [
      {
        id: 11,
        sender: "Mia Chen",
        memberId: 1,
        time: "09:12",
        text: "I think we should narrow the scope to collaboration problems in student project teams rather than all campus communication issues.",
        mentions: [3],
      },
      {
        id: 12,
        sender: "Sofia Nguyen",
        memberId: 3,
        time: "09:18",
        text: "Agreed. That makes the literature review cleaner and gives us a stronger problem statement.",
        mentions: [1],
      },
      {
        id: 13,
        sender: "Noah Patel",
        memberId: 2,
        time: "09:26",
        text: "From a UI point of view, that focus also makes the dashboard and meeting-planning features much easier to justify.",
        mentions: [1, 4],
      },
    ],
  },
  {
    id: 2,
    topic: "Prototype Feedback",
    unread: 1,
    messages: [
      {
        id: 21,
        sender: "Noah Patel",
        memberId: 2,
        time: "11:05",
        text: "Uploaded the revised dashboard layout. I made the task cards denser so we can fit deadlines and ownership on one screen.",
        mentions: [1],
      },
      {
        id: 22,
        sender: "Liam Walker",
        memberId: 4,
        time: "11:13",
        text: "Looks better. Could we also surface workload by week? That would help with planning meetings before crunch time.",
        mentions: [2],
      },
      {
        id: 23,
        sender: "Mia Chen",
        memberId: 1,
        time: "11:20",
        text: "Yes, let’s add a heatmap view. That’s a strong differentiator for the app pitch.",
        mentions: [2, 4],
      },
    ],
  },
  {
    id: 3,
    topic: "Meeting Plan",
    unread: 0,
    messages: [
      {
        id: 31,
        sender: "Sofia Nguyen",
        memberId: 3,
        time: "14:10",
        text: "Wednesday afternoon is rough for me because the research synthesis is due the next day.",
        mentions: [1],
      },
      {
        id: 32,
        sender: "Liam Walker",
        memberId: 4,
        time: "14:18",
        text: "I’m overloaded early next week too. Thursday evening or Friday morning would be much safer.",
        mentions: [1, 3],
      },
      {
        id: 33,
        sender: "Mia Chen",
        memberId: 1,
        time: "14:24",
        text: "Perfect. I’ll compare everyone’s deadlines and suggest a low-stress slot in the planner.",
        mentions: [2, 3, 4],
      },
    ],
  },
];

const initialTaskPool = [
  { id: 1, title: "Finalise problem statement", owner: 1, status: "In Progress", due: "Mar 15" },
  { id: 2, title: "Build interactive dashboard", owner: 2, status: "In Review", due: "Mar 18" },
  { id: 3, title: "Summarise key journal sources", owner: 3, status: "In Progress", due: "Mar 17" },
  { id: 4, title: "Prepare charts for insights", owner: 4, status: "Not Started", due: "Mar 23" },
  { id: 5, title: "Draft presentation outline", owner: 1, status: "Not Started", due: "Mar 22" },
  { id: 6, title: "Create clickable prototype", owner: 2, status: "In Progress", due: "Mar 25" },
];

const workloadCalendar = [
  { week: "Mar 9", level: "low", label: "Scoping & planning", score: 2 },
  { week: "Mar 16", level: "high", label: "Prototype + research deadlines", score: 8 },
  { week: "Mar 23", level: "high", label: "Review clashes across team", score: 9 },
  { week: "Mar 30", level: "moderate", label: "Presentation refinement", score: 5 },
  { week: "Apr 6", level: "low", label: "Buffer / final polish", score: 2 },
];

const meetingSuggestions = [
  { slot: "Thu, Mar 19 · 6:00 PM", reason: "Lowest combined workload after the mid-week spike" },
  { slot: "Fri, Mar 20 · 10:00 AM", reason: "No major deadline due within 24 hours for any member" },
  { slot: "Mon, Apr 6 · 4:00 PM", reason: "Light buffer week, best for retrospective or rehearsal" },
];

const workloadColor = {
  low: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
  moderate: "bg-yellow-500/15 text-yellow-100 border-yellow-400/30",
  high: "bg-red-500/15 text-red-100 border-red-400/30",
};

const statusColor = {
  "Not Started": "bg-slate-700 text-slate-200",
  "In Progress": "bg-blue-500/20 text-blue-100",
  "In Review": "bg-violet-500/20 text-violet-100",
  Done: "bg-emerald-500/20 text-emerald-100",
};

const navItems = [
  { id: "overview", label: "Overview", icon: "◫" },
  { id: "chat", label: "Group Chat", icon: "✦" },
  { id: "deadlines", label: "Stress Heatmap", icon: "◩" },
  { id: "tasks", label: "Task Board", icon: "☑" },
  { id: "catchup", label: "Catch Me Up", icon: "⚡" },
];

function getSelectedMember(memberId) {
  return members.find((member) => member.id === memberId) ?? members[0];
}

function buildCatchUpSummary(threads, selectedMemberId) {
  const relevant = threads
    .flatMap((thread) =>
      thread.messages
        .filter((msg) => msg.memberId === selectedMemberId || msg.mentions.includes(selectedMemberId))
        .map((msg) => ({ ...msg, topic: thread.topic }))
    )
    .slice(-5);

  const member = getSelectedMember(selectedMemberId);
  const focusTopics = [...new Set(relevant.map((msg) => msg.topic))];

  const summaryLines = [
    `${member.name} is most involved in ${focusTopics.join(", ") || "recent team planning"}.`,
    relevant.some((item) => item.topic === "Meeting Plan")
      ? "Recent messages suggest scheduling meetings away from the March 16 and March 23 crunch weeks."
      : "No urgent meeting conflicts were mentioned in the latest relevant messages.",
    relevant.some((item) => item.topic === "Prototype Feedback")
      ? "Prototype discussion is active, with strong support for surfacing workload and deadline visibility."
      : "Prototype feedback has been relatively quiet for this member.",
  ];

  return { relevant, summaryLines };
}

function runSanityChecks() {
  const results = [];

  results.push({
    name: "Loads four group members",
    pass: members.length === 4,
  });

  results.push({
    name: "Includes threaded chat topics",
    pass: initialThreads.length >= 3 && initialThreads.every((thread) => Array.isArray(thread.messages) && thread.messages.length > 0),
  });

  results.push({
    name: "Catch Me Up returns summary lines",
    pass: buildCatchUpSummary(initialThreads, 1).summaryLines.length === 3,
  });

  results.push({
    name: "Task pool has owners assigned",
    pass: initialTaskPool.every((task) => typeof task.owner === "number"),
  });

  return results;
}

function MemberAvatar({ member, size = "md" }) {
  const sizeClass = size === "sm" ? "h-10 w-10" : size === "lg" ? "h-12 w-12" : "h-11 w-11";

  return (
    <div
      className={`flex ${sizeClass} items-center justify-center rounded-2xl bg-gradient-to-br ${member.color} font-semibold text-white`}
    >
      {member.avatar}
    </div>
  );
}

export default function GroupCommApp() {
  const [activeSection, setActiveSection] = useState("overview");
  const [activeThreadId, setActiveThreadId] = useState(initialThreads[0].id);
  const [selectedMemberId, setSelectedMemberId] = useState(1);
  const [chatInput, setChatInput] = useState("");
  const [assignedTasks, setAssignedTasks] = useState(initialTaskPool);
  const [threads, setThreads] = useState(initialThreads);
  const [sanityChecks] = useState(runSanityChecks);

  const selectedMember = useMemo(() => getSelectedMember(selectedMemberId), [selectedMemberId]);

  const activeThread = useMemo(() => {
    return threads.find((thread) => thread.id === activeThreadId) ?? threads[0];
  }, [activeThreadId, threads]);

  const catchMeUp = useMemo(() => {
    return buildCatchUpSummary(threads, selectedMemberId);
  }, [selectedMemberId, threads]);

  useEffect(() => {
    if (!threads.some((thread) => thread.id === activeThreadId) && threads.length > 0) {
      setActiveThreadId(threads[0].id);
    }
  }, [activeThreadId, threads]);

  const sendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const newMessage = {
      id: Date.now(),
      sender: "You",
      memberId: selectedMemberId,
      time: "Now",
      text: trimmed,
      mentions: [],
    };

    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === activeThreadId
          ? {
              ...thread,
              unread: 0,
              messages: [...thread.messages, newMessage],
            }
          : thread
      )
    );
    setChatInput("");
  };

  const reassignTask = (taskId, ownerId) => {
    setAssignedTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, owner: Number(ownerId) } : task))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-white/10 bg-slate-900/80 backdrop-blur-xl">
          <div className="border-b border-white/10 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-lg font-bold shadow-lg shadow-cyan-500/20">
                U
              </div>
              <div>
                <div className="text-lg font-semibold tracking-tight">UniSync Teams</div>
                <div className="text-sm text-slate-400">Group assignment coordination</div>
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-4 shadow-inner shadow-cyan-500/5">
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Current sprint</div>
              <div className="mt-2 text-sm font-medium">FIT3120 Collaboration Prototype</div>
              <div className="mt-1 text-sm text-slate-300">
                Pitch-ready build with planning, chat, and deadline intelligence.
              </div>
            </div>
          </div>

          <nav className="p-4">
            <div className="mb-3 px-3 text-xs uppercase tracking-[0.2em] text-slate-500">Workspace</div>
            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                    activeSection === item.id
                      ? "bg-white text-slate-950 shadow-lg"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="space-y-4 p-4">
            <div className="rounded-3xl border border-white/10 bg-slate-800/70 p-4">
              <div className="text-sm font-semibold">Team pulse</div>
              <div className="mt-3 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Deadline pressure</span>
                    <span>78%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/10">
                    <div className="h-2 w-[78%] rounded-full bg-gradient-to-r from-yellow-400 to-red-500" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Task completion</span>
                    <span>52%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/10">
                    <div className="h-2 w-[52%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-4">
              <div className="mb-3 text-sm font-semibold">Built-in sanity checks</div>
              <div className="space-y-2">
                {sanityChecks.map((check) => (
                  <div
                    key={check.name}
                    className={`rounded-2xl border px-3 py-2 text-xs ${
                      check.pass
                        ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
                        : "border-red-400/20 bg-red-500/10 text-red-100"
                    }`}
                  >
                    {check.pass ? "PASS" : "FAIL"} · {check.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-hidden">
          <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/70 px-8 py-5 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Student Group Collaboration Hub</h1>
                <p className="mt-1 text-sm text-slate-400">
                  Real-time messaging, deadline awareness, and task coordination in one workspace.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(Number(e.target.value))}
                  className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none ring-0"
                >
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      View as {member.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setActiveSection("catchup")}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-white/10 transition hover:scale-[1.01]"
                >
                  Catch Me Up
                </button>
              </div>
            </div>
          </header>

          <div className="h-[calc(100vh-93px)] overflow-y-auto px-8 py-8">
            {activeSection === "overview" && (
              <div className="space-y-8">
                <section className="grid gap-6 lg:grid-cols-4">
                  <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl shadow-black/20 lg:col-span-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">Overview</div>
                        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Built for real university group work</h2>
                        <p className="mt-3 max-w-2xl text-slate-300">
                          UniSync Teams combines threaded discussions, live task ownership, and a deadline stress heatmap so student teams can plan around pressure instead of reacting too late.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                        Next recommended meeting: <span className="font-semibold">Thu 19 Mar · 6:00 PM</span>
                      </div>
                    </div>
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <div className="text-sm text-slate-400">Active threads</div>
                        <div className="mt-2 text-3xl font-semibold">{threads.length}</div>
                        <div className="mt-2 text-sm text-slate-300">
                          Topic-based conversations for scope, feedback, and meetings.
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <div className="text-sm text-slate-400">Assigned tasks</div>
                        <div className="mt-2 text-3xl font-semibold">{assignedTasks.length}</div>
                        <div className="mt-2 text-sm text-slate-300">
                          Clear ownership across planning, design, research, and analysis.
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <div className="text-sm text-slate-400">High-pressure weeks</div>
                        <div className="mt-2 text-3xl font-semibold">2</div>
                        <div className="mt-2 text-sm text-slate-300">
                          Detected clashes around prototype review and insights submission.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                    <div className="text-sm font-semibold">Team members</div>
                    <div className="mt-4 space-y-3">
                      {members.map((member) => (
                        <div key={member.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                          <MemberAvatar member={member} />
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-slate-400">{member.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Live team dashboard</h3>
                        <p className="mt-1 text-sm text-slate-400">Who’s doing what right now</p>
                      </div>
                      <button
                        onClick={() => setActiveSection("tasks")}
                        className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
                      >
                        Open task board
                      </button>
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {members.map((member) => (
                        <div key={member.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <div className="flex items-center gap-3">
                            <MemberAvatar member={member} size="lg" />
                            <div>
                              <div className="font-semibold">{member.name}</div>
                              <div className="text-sm text-slate-400">{member.role}</div>
                            </div>
                          </div>
                          <div className="mt-4 space-y-2">
                            {member.tasks.map((task) => (
                              <div
                                key={task}
                                className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-300"
                              >
                                {task}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Stress heatmap preview</h3>
                        <p className="mt-1 text-sm text-slate-400">Workload level by week</p>
                      </div>
                      <button
                        onClick={() => setActiveSection("deadlines")}
                        className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
                      >
                        Expand
                      </button>
                    </div>
                    <div className="mt-5 space-y-3">
                      {workloadCalendar.map((week) => (
                        <div key={week.week} className={`rounded-2xl border p-4 ${workloadColor[week.level]}`}>
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="font-medium">Week of {week.week}</div>
                              <div className="mt-1 text-sm opacity-80">{week.label}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs uppercase tracking-[0.2em] opacity-70">Stress score</div>
                              <div className="text-2xl font-semibold">{week.score}/10</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeSection === "chat" && activeThread && (
              <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
                <div className="rounded-3xl border border-white/10 bg-slate-900 p-5">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Threaded topics</h3>
                    <p className="mt-1 text-sm text-slate-400">Keep discussions organised by theme</p>
                  </div>
                  <div className="space-y-3">
                    {threads.map((thread) => (
                      <button
                        key={thread.id}
                        onClick={() => setActiveThreadId(thread.id)}
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          activeThread.id === thread.id
                            ? "border-cyan-400/30 bg-cyan-500/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-medium">{thread.topic}</div>
                          {thread.unread > 0 && (
                            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-950">
                              {thread.unread}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 line-clamp-2 text-sm text-slate-400">
                          {thread.messages[thread.messages.length - 1]?.text}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{activeThread.topic}</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        Real-time group discussion mockup with topic threading
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                      {activeThread.messages.length} messages
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {activeThread.messages.map((message) => {
                      const member = getSelectedMember(message.memberId);
                      return (
                        <div key={message.id} className="flex gap-4">
                          <MemberAvatar member={member} />
                          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <div className="font-medium">{message.sender}</div>
                              <div className="text-xs text-slate-500">{message.time}</div>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-slate-300">{message.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage();
                      }}
                      placeholder="Reply in this thread..."
                      className="flex-1 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none"
                    />
                    <button
                      onClick={sendMessage}
                      className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "deadlines" && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Deadline Stress Heatmap</div>
                      <h2 className="mt-2 text-2xl font-semibold">Calendar view of workload and clash risk</h2>
                      <p className="mt-2 max-w-3xl text-sm text-slate-400">
                        Weeks turn red when multiple members face deadlines at the same time. Use this view to avoid scheduling meetings during peak stress periods.
                      </p>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-emerald-100">
                        Green = low
                      </span>
                      <span className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-3 py-1 text-yellow-100">
                        Yellow = moderate
                      </span>
                      <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-red-100">
                        Red = clash risk
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-5">
                    {workloadCalendar.map((week) => (
                      <div key={week.week} className={`min-h-[180px] rounded-3xl border p-5 ${workloadColor[week.level]}`}>
                        <div className="text-sm font-semibold">Week of {week.week}</div>
                        <div className="mt-2 text-xs uppercase tracking-[0.2em] opacity-70">Workload</div>
                        <div className="mt-1 text-4xl font-semibold">{week.score}</div>
                        <div className="mt-4 text-sm opacity-90">{week.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                    <h3 className="text-lg font-semibold">Upcoming deadlines by member</h3>
                    <p className="mt-1 text-sm text-slate-400">See individual pressure points across the group</p>
                    <div className="mt-5 space-y-4">
                      {members.map((member) => (
                        <div key={member.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-3">
                            <MemberAvatar member={member} size="sm" />
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-slate-400">{member.role}</div>
                            </div>
                          </div>
                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {member.deadlines.map((deadline) => (
                              <div key={deadline.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                                <div className="text-sm font-medium">{deadline.title}</div>
                                <div className="mt-1 text-sm text-slate-400">{deadline.date}</div>
                                <div className="mt-2 text-xs text-slate-500">Stress weight: {deadline.stress}/3</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                      <h3 className="text-lg font-semibold">Clashing weeks</h3>
                      <div className="mt-4 space-y-3">
                        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-50">
                          <div className="font-medium">Week of Mar 16</div>
                          <div className="mt-1 text-sm text-red-100/80">
                            Mia, Sofia, and Liam all have deadlines between Mar 15–17.
                          </div>
                        </div>
                        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-50">
                          <div className="font-medium">Week of Mar 23</div>
                          <div className="mt-1 text-sm text-red-100/80">
                            Noah, Sofia, and Liam are all under review and delivery pressure.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                      <h3 className="text-lg font-semibold">Suggested meeting times</h3>
                      <div className="mt-4 space-y-3">
                        {meetingSuggestions.map((item) => (
                          <div
                            key={item.slot}
                            className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4"
                          >
                            <div className="font-medium text-emerald-50">{item.slot}</div>
                            <div className="mt-1 text-sm text-emerald-100/80">{item.reason}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "tasks" && (
              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold">Task assignment panel</h2>
                      <p className="mt-1 text-sm text-slate-400">
                        Assign responsibilities and keep ownership visible to everyone
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
                    <table className="min-w-full divide-y divide-white/10 text-left">
                      <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-slate-400">
                        <tr>
                          <th className="px-4 py-4">Task</th>
                          <th className="px-4 py-4">Owner</th>
                          <th className="px-4 py-4">Status</th>
                          <th className="px-4 py-4">Due</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 bg-slate-950/40">
                        {assignedTasks.map((task) => (
                          <tr key={task.id} className="hover:bg-white/[0.03]">
                            <td className="px-4 py-4">
                              <div className="font-medium">{task.title}</div>
                            </td>
                            <td className="px-4 py-4">
                              <select
                                value={task.owner}
                                onChange={(e) => reassignTask(task.id, e.target.value)}
                                className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm"
                              >
                                {members.map((member) => (
                                  <option key={member.id} value={member.id}>
                                    {member.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[task.status]}`}>
                                {task.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-300">{task.due}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                  <h3 className="text-lg font-semibold">Member workload snapshot</h3>
                  <div className="mt-5 space-y-4">
                    {members.map((member) => {
                      const owned = assignedTasks.filter((task) => task.owner === member.id);
                      return (
                        <div key={member.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-3">
                            <MemberAvatar member={member} size="sm" />
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-slate-400">{owned.length} assigned items</div>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {owned.map((task) => (
                              <span
                                key={task.id}
                                className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs text-slate-300"
                              >
                                {task.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "catchup" && (
              <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-slate-500">AI recap</div>
                    <h2 className="mt-2 text-2xl font-semibold">Catch Me Up</h2>
                    <p className="mt-2 text-sm text-slate-400">
                      Summarises recent messages most relevant to the selected member
                    </p>
                  </div>

                  <div className="mt-6 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-5">
                    <div className="flex items-center gap-3">
                      <MemberAvatar member={selectedMember} size="lg" />
                      <div>
                        <div className="font-semibold">Summary for {selectedMember.name}</div>
                        <div className="text-sm text-slate-300">
                          Tailored recap based on mentions and direct involvement
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 space-y-3">
                      {catchMeUp.summaryLines.map((line, index) => (
                        <div
                          key={`${selectedMember.id}-${index}`}
                          className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-6 text-slate-200"
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                  <h3 className="text-lg font-semibold">Relevant recent messages</h3>
                  <div className="mt-5 space-y-4">
                    {catchMeUp.relevant.map((message) => {
                      const member = getSelectedMember(message.memberId);
                      return (
                        <div key={message.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <MemberAvatar member={member} size="sm" />
                              <div>
                                <div className="font-medium">{message.sender}</div>
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                  {message.topic}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-slate-500">{message.time}</div>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-300">{message.text}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
