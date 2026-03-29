const appData = {
  members: [
    { id: 1, name: 'Ava', role: 'Coordinator', currentTask: 'Meeting plan', stage: 'In Progress', deadline: '2026-04-08', workload: 'High', initials: 'A' },
    { id: 2, name: 'Ben', role: 'Frontend', currentTask: 'Chat UI', stage: 'Review', deadline: '2026-04-10', workload: 'Medium', initials: 'B' },
    { id: 3, name: 'Chloe', role: 'Report Lead', currentTask: 'Methodology section', stage: 'To Do', deadline: '2026-04-06', workload: 'Low', initials: 'C' },
    { id: 4, name: 'Daniel', role: 'Developer', currentTask: 'Heatmap logic', stage: 'In Progress', deadline: '2026-04-12', workload: 'High', initials: 'D' }
  ],
  groups: [
    {
      id: 1,
      name: 'INFO2222 Team Alpha',
      channels: [
        {
          id: 'general',
          name: 'General',
          messages: [
            { sender: 'Ava', text: 'Hi team, let’s keep progress updates here.', time: '9:05 AM' },
            { sender: 'Ben', text: 'I finished the sidebar layout and will push the prototype tonight.', time: '9:20 AM' },
            { sender: 'Chloe', text: 'Please remember the tutor wants the heatmap visible in the demo.', time: '10:02 AM' }
          ]
        },
        {
          id: 'meeting',
          name: 'Meeting Planning',
          messages: [
            { sender: 'Daniel', text: 'Wednesday 4pm–5pm seems the lowest-stress slot for everyone.', time: '11:15 AM' },
            { sender: 'Ava', text: 'Great, let’s confirm that after the report outline is done.', time: '11:18 AM' }
          ]
        },
        {
          id: 'coding',
          name: 'Coding',
          messages: [
            { sender: 'Ben', text: 'I’m building the group chat tab first, then the task board.', time: '12:11 PM' },
            { sender: 'Daniel', text: 'I’ll handle the meeting overlap logic and scheduled calls.', time: '12:30 PM' }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'COMP Project Beta',
      channels: [
        {
          id: 'general-2',
          name: 'General',
          messages: [
            { sender: 'Mia', text: 'Prototype notes are in the shared doc.', time: '8:30 AM' }
          ]
        }
      ]
    }
  ],
  heatmap: [
    { day: 'Mon', date: 1, level: 'low', label: '1 due' },
    { day: 'Tue', date: 2, level: 'medium', label: '2 due' },
    { day: 'Wed', date: 3, level: 'high', label: 'clash' },
    { day: 'Thu', date: 4, level: 'medium', label: 'busy' },
    { day: 'Fri', date: 5, level: 'low', label: 'free' },
    { day: 'Sat', date: 6, level: 'low', label: 'free' },
    { day: 'Sun', date: 7, level: 'medium', label: 'prep' },
    { day: 'Mon', date: 8, level: 'high', label: '3 deadlines' },
    { day: 'Tue', date: 9, level: 'high', label: 'report + code' },
    { day: 'Wed', date: 10, level: 'medium', label: 'call day' },
    { day: 'Thu', date: 11, level: 'low', label: 'free' },
    { day: 'Fri', date: 12, level: 'medium', label: 'review' },
    { day: 'Sat', date: 13, level: 'low', label: 'free' },
    { day: 'Sun', date: 14, level: 'low', label: 'free' }
  ],
  scheduledCalls: [
    { id: 1, title: 'Weekly stand-up', date: '2026-04-03', time: '16:00' },
    { id: 2, title: 'Prototype review', date: '2026-04-06', time: '18:00' }
  ],
  tasks: [
    { id: 1, title: 'Build sidebar navigation', assignee: 'Ben', deadline: '2026-04-03', priority: 'High', stage: 'Done' },
    { id: 2, title: 'Write stress heatmap explanation', assignee: 'Chloe', deadline: '2026-04-06', priority: 'Medium', stage: 'To Do' },
    { id: 3, title: 'Meeting overlap logic', assignee: 'Daniel', deadline: '2026-04-05', priority: 'High', stage: 'In Progress' },
    { id: 4, title: 'Prepare tutor demo script', assignee: 'Ava', deadline: '2026-04-07', priority: 'Medium', stage: 'Review' },
    { id: 5, title: 'Task panel polish', assignee: 'Ben', deadline: '2026-04-08', priority: 'Low', stage: 'In Progress' }
  ],
  availability: {
    Wednesday: {
      Ava: ['12-1', '1-2', '4-5', '5-6'],
      Ben: ['3-4', '4-5', '5-6'],
      Chloe: ['4-5', '5-6'],
      Daniel: ['1-2', '2-3', '3-4', '4-5', '5-6']
    },
    Thursday: {
      Ava: ['10-11', '11-12', '3-4'],
      Ben: ['11-12', '12-1', '3-4'],
      Chloe: ['9-10', '10-11', '11-12', '3-4'],
      Daniel: ['10-11', '11-12', '3-4']
    },
    Friday: {
      Ava: ['2-3', '3-4'],
      Ben: ['2-3', '3-4', '4-5'],
      Chloe: ['3-4', '4-5'],
      Daniel: ['1-2', '2-3', '3-4']
    }
  }
};

let activeSection = 'dashboard';
let activeGroupId = 1;
let activeChannelId = 'general';

const sectionsMeta = {
  dashboard: ['Dashboard', 'Overview of members, workload, and current progress.'],
  chat: ['Group Chat', 'Create groups, switch channels, and follow topic-based discussions.'],
  heatmap: ['Stress Heatmap', 'See deadlines, clashes, and low-stress periods for meetings.'],
  meeting: ['Meeting Decider', 'Compare free slots and confirm the best group meeting time.'],
  calls: ['Scheduled Calls', 'Initialize calls, reminders, and calendar-based meeting setup.'],
  checklist: ['Checklist', 'Add tasks and tick them off when they are done.'],
  catchup: ['Catch Me Up', 'Summarise recent updates relevant to a selected member.']
};

const timeSlots = ['9-10', '10-11', '11-12', '12-1', '1-2', '2-3', '3-4', '4-5'];

function $(selector) {
  return document.querySelector(selector);
}
function $all(selector) {
  return [...document.querySelectorAll(selector)];
}

function init() {
  bindNavigation();
  bindChat();
  bindMeeting();
  bindCalls();
  bindTasks();
  bindCatchup();
  bindGroupModal();
  renderAll();
}

function renderAll() {
  renderDashboard();
  renderChat();
  renderHeatmap();
  renderMeeting();
  renderCalls();
  renderTasks();
  renderCatchupHighlights();
}

function bindNavigation() {
  $all('.nav-link').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      activeSection = section;
      $all('.nav-link').forEach(n => n.classList.toggle('active', n === btn));
      $all('.section').forEach(sec => sec.classList.toggle('active', sec.id === section));
      $('#sectionTitle').textContent = sectionsMeta[section][0];
      $('#sectionSubtitle').textContent = sectionsMeta[section][1];
    });
  });

  $('#quickMeetingBtn').addEventListener('click', () => {
    document.querySelector('[data-section="meeting"]').click();
  });
}

function workloadClass(level) {
  return `${level.toLowerCase()}-pill`;
}

function renderDashboard() {
  $('#statMembers').textContent = appData.members.length;
  $('#statTasks').textContent = appData.tasks.length;
  $('#statDeadlines').textContent = appData.tasks.filter(t => t.stage !== 'Done').length;
  $('#statMeetingTime').textContent = computeSuggestedMeeting().label;

  $('#memberCards').innerHTML = appData.members.map(member => `
    <div class="member-card">
      <div class="member-top">
        <div style="display:flex; gap:10px; align-items:center;">
          <div class="avatar">${member.initials}</div>
          <div>
            <strong>${member.name}</strong>
            <div class="muted">${member.role}</div>
          </div>
        </div>
        <span class="pill ${workloadClass(member.workload)}">${member.workload}</span>
      </div>
      <p><strong>Current:</strong> ${member.currentTask}</p>
      <p><strong>Stage:</strong> ${member.stage}</p>
      <p><strong>Deadline:</strong> ${formatShortDate(member.deadline)}</p>
    </div>
  `).join('');

  $('#taskSnapshot').innerHTML = appData.tasks.slice(0, 5).map(task => `
    <div class="snapshot-item">
      <strong>${task.title}</strong>
      <p class="muted">${task.assignee} · ${task.stage} · ${task.priority} priority</p>
      <small>Deadline: ${formatShortDate(task.deadline)}</small>
    </div>
  `).join('');
}

function getActiveGroup() {
  return appData.groups.find(g => g.id === activeGroupId) || appData.groups[0];
}
function getActiveChannel() {
  return getActiveGroup().channels.find(c => c.id === activeChannelId) || getActiveGroup().channels[0];
}

function renderChat() {
  const activeGroup = getActiveGroup();
  $('#activeGroupName').textContent = activeGroup.name;

  $('#groupList').innerHTML = appData.groups.map(group => `
    <button class="group-item ${group.id === activeGroupId ? 'active' : ''}" data-group-id="${group.id}">
      <strong>${group.name}</strong><br />
      <small class="muted">${group.channels.length} topic channels</small>
    </button>
  `).join('');

  $('#channelList').innerHTML = activeGroup.channels.map(channel => `
    <button class="channel-item ${channel.id === activeChannelId ? 'active' : ''}" data-channel-id="${channel.id}">
      # ${channel.name}
    </button>
  `).join('');

  const activeChannel = getActiveChannel();
  $('#chatTitle').textContent = `# ${activeChannel.name}`;
  $('#chatGroupLabel').textContent = activeGroup.name;
  $('#messageCountBadge').textContent = `${activeChannel.messages.length} messages`;
  $('#chatMessages').innerHTML = activeChannel.messages.map((msg, i) => `
    <div class="message ${i % 3 === 2 ? 'self' : ''}">
      <strong>${msg.sender}</strong>
      <div>${msg.text}</div>
      <small>${msg.time}</small>
    </div>
  `).join('');

  $all('.group-item').forEach(btn => {
    btn.addEventListener('click', () => {
      activeGroupId = Number(btn.dataset.groupId);
      activeChannelId = getActiveGroup().channels[0].id;
      renderChat();
    });
  });

  $all('.channel-item').forEach(btn => {
    btn.addEventListener('click', () => {
      activeChannelId = btn.dataset.channelId;
      renderChat();
    });
  });
}

function bindChat() {
  $('#chatForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = $('#chatInput');
    const text = input.value.trim();
    if (!text) return;
    getActiveChannel().messages.push({ sender: 'You', text, time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) });
    input.value = '';
    renderChat();
  });
}

function renderHeatmap() {
  $('#heatmapCalendar').innerHTML = appData.heatmap.map(item => `
    <div class="heat-day heat-${item.level}">
      <strong>${item.day} ${item.date}</strong>
      <span class="muted">${item.label}</span>
    </div>
  `).join('');

  const highDays = appData.heatmap.filter(d => d.level === 'high');
  const mediumDays = appData.heatmap.filter(d => d.level === 'medium');
  $('#clashInsights').innerHTML = `
    <div class="insight-item"><strong>High-stress days:</strong> ${highDays.map(d => `${d.day} ${d.date}`).join(', ')}</div>
    <div class="insight-item"><strong>Moderate workload:</strong> ${mediumDays.length} days need earlier check-ins.</div>
    <div class="insight-item"><strong>Meeting suggestion:</strong> ${computeSuggestedMeeting().label} is currently the lowest-stress overlap.</div>
    <div class="insight-item"><strong>Deadline clash:</strong> Week 2 has multiple overlapping report and coding deadlines.</div>
  `;

  $('#memberTimetables').innerHTML = appData.members.map(member => {
    const width = member.workload === 'High' ? 88 : member.workload === 'Medium' ? 60 : 32;
    const className = member.workload.toLowerCase();
    return `
      <div class="timetable-card">
        <h4>${member.name}</h4>
        <p class="muted">Current task: ${member.currentTask}</p>
        <div class="timetable-bars">
          <div>Workload this week</div>
          <div class="bar-track"><div class="bar-fill ${className}" style="width:${width}%"></div></div>
          <small>Deadline: ${formatShortDate(member.deadline)} · ${member.workload} stress</small>
        </div>
      </div>
    `;
  }).join('');
}

function bindMeeting() {
  $('#confirmMeeting').addEventListener('click', () => {
    $('#meetingFeedback').textContent = 'Meeting confirmed and reminder ready.';
  });
  $('#rejectMeeting').addEventListener('click', () => {
    $('#meetingFeedback').textContent = 'Suggestion rejected. Try another low-stress slot.';
  });

  $('#meetingDaySelect').addEventListener('change', renderAvailabilityGrid);
}

function renderMeeting() {
  const days = Object.keys(appData.availability);
  $('#meetingDaySelect').innerHTML = days.map(day => `<option value="${day}">${day}</option>`).join('');
  renderAvailabilityGrid();

  $('#monthlyView').innerHTML = [1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(day => {
    const freeDays = [3,5,8,10,12];
    return `<div class="month-cell ${freeDays.includes(day) ? 'free-day' : ''}"><strong>${day}</strong>${freeDays.includes(day) ? '<div class="muted">Everyone free</div>' : '<div class="muted">Partial overlap</div>'}</div>`;
  }).join('');

  const suggestion = computeSuggestedMeeting();
  $('#suggestedMeeting').textContent = suggestion.labelFull;
}

function renderAvailabilityGrid() {
  const day = $('#meetingDaySelect').value || Object.keys(appData.availability)[0];
  const dayData = appData.availability[day];
  const memberNames = Object.keys(dayData);
  const overlaps = timeSlots.filter(slot => memberNames.every(name => dayData[name].includes(slot)));

  let html = `<div class="availability-header"><div class="availability-cell member-label">Member</div>${timeSlots.map(slot => `<div class="availability-cell">${slot}</div>`).join('')}</div>`;
  html += memberNames.map(name => `
    <div class="availability-row">
      <div class="availability-cell member-label">${name}</div>
      ${timeSlots.map(slot => {
        const isSelected = dayData[name].includes(slot);
        const isOverlap = overlaps.includes(slot);
        return `<div class="availability-cell ${isOverlap ? 'overlap' : isSelected ? 'selected' : ''}">${isOverlap ? '✓' : isSelected ? '•' : ''}</div>`;
      }).join('')}
    </div>
  `).join('');
  $('#availabilityGrid').innerHTML = html;
}

function computeSuggestedMeeting() {
  let best = { day: 'Wednesday', slot: '4-5', score: -1 };
  for (const [day, memberData] of Object.entries(appData.availability)) {
    for (const slot of timeSlots) {
      const count = Object.values(memberData).filter(slots => slots.includes(slot)).length;
      if (count > best.score) best = { day, slot, score: count };
    }
  }
  return {
    ...best,
    label: `${best.day} ${slotToReadable(best.slot)}`,
    labelFull: `${best.day} ${slotToReadable(best.slot, true)}`
  };
}

function bindCalls() {
  $('#callForm').addEventListener('submit', e => {
    e.preventDefault();
    appData.scheduledCalls.push({
      id: Date.now(),
      title: $('#callTitle').value.trim(),
      date: $('#callDate').value,
      time: $('#callTime').value
    });
    e.target.reset();
    renderCalls();
  });
}

function renderCalls() {
  $('#scheduledCalls').innerHTML = appData.scheduledCalls.map(call => `
    <button class="call-item" data-call-id="${call.id}">
      <h4>${call.title}</h4>
      <div>${formatShortDate(call.date)} · ${formatTime(call.time)}</div>
      <small class="muted">Click to highlight on calendar</small>
    </button>
  `).join('');

  const days = Array.from({ length: 14 }, (_, i) => i + 1);
  let selectedDate = null;
  $('#callCalendar').innerHTML = days.map(day => {
    const matching = appData.scheduledCalls.filter(call => new Date(call.date).getDate() === day);
    return `
      <div class="call-calendar-day" data-date="${day}">
        <strong>${day}</strong>
        ${matching.map(call => `<div class="call-chip">${call.title}</div>`).join('')}
      </div>
    `;
  }).join('');

  $all('.call-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const call = appData.scheduledCalls.find(c => c.id === Number(btn.dataset.callId));
      selectedDate = new Date(call.date).getDate();
      $all('.call-calendar-day').forEach(cell => {
        cell.style.outline = Number(cell.dataset.date) === selectedDate ? '3px solid #4f46e5' : 'none';
      });
    });
  });
}

function bindTasks() {
  $('#taskAssignee').innerHTML = appData.members.map(m => `<option value="${m.name}">${m.name}</option>`).join('');
  $('#taskForm').addEventListener('submit', e => {
    e.preventDefault();
    appData.tasks.push({
      id: Date.now(),
      title: $('#taskTitle').value.trim(),
      assignee: $('#taskAssignee').value,
      priority: $('#taskPriority').value,
      deadline: $('#taskDeadline').value,
      stage: 'To Do'
    });
    e.target.reset();
    renderTasks();
    renderDashboard();
  });
}

function renderTasks() {
  const container = $('#checklistItems');
  if (!appData.tasks.length) {
    container.innerHTML = '<p class="muted">No tasks yet. Add one on the left.</p>';
    return;
  }

  container.innerHTML = appData.tasks
    .map(task => {
      const done = task.stage === 'Done';
      const statusLabel = done ? '' : task.stage !== 'To Do' ? `<span class="task-tag">${task.stage}</span>` : '';
      return `
    <label class="checklist-item${done ? ' is-done' : ''}">
      <input type="checkbox" data-task-id="${task.id}" ${done ? 'checked' : ''} />
      <span class="checklist-body">
        <strong class="checklist-title">${task.title}</strong>
        <span class="checklist-meta">
          <span class="task-tag">${task.assignee}</span>
          <span class="task-tag">${task.priority}</span>
          <span class="task-tag">${formatShortDate(task.deadline)}</span>
          ${statusLabel}
        </span>
      </span>
    </label>`;
    })
    .join('');

  $all('#checklistItems input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const task = appData.tasks.find(t => t.id === Number(cb.dataset.taskId));
      if (!task) return;
      task.stage = cb.checked ? 'Done' : 'To Do';
      renderTasks();
      renderDashboard();
    });
  });
}

function bindCatchup() {
  $('#catchupMember').innerHTML = appData.members.map(m => `<option value="${m.name}">${m.name}</option>`).join('');
  $('#generateCatchup').addEventListener('click', renderCatchupSummary);
}

function renderCatchupSummary() {
  const member = $('#catchupMember').value;
  const taskItems = appData.tasks.filter(t => t.assignee === member || t.stage !== 'Done').slice(0, 3);
  const meeting = computeSuggestedMeeting();
  $('#catchupSummary').innerHTML = `
    <div class="summary-card">
      <h4>Catch-up for ${member}</h4>
      <p>Recent discussion focused on finalising the prototype layout, confirming the heatmap feature, and preparing a tutor demo.</p>
      <p><strong>Important task updates:</strong> ${taskItems.map(t => `${t.title} (${t.stage})`).join(', ')}.</p>
      <p><strong>Upcoming meeting:</strong> ${meeting.labelFull} is currently the best suggested slot.</p>
      <p><strong>Deadline watch:</strong> Multiple members have overlapping report and coding deadlines this week.</p>
    </div>
  `;
}

function renderCatchupHighlights() {
  $('#recentHighlights').innerHTML = `
    <div class="insight-item"><strong>Chat summary:</strong> Team agreed the heatmap and meeting decider should be the main demo focus.</div>
    <div class="insight-item"><strong>Task movement:</strong> “Prepare tutor demo script” moved to Review.</div>
    <div class="insight-item"><strong>Meeting note:</strong> Wednesday 4–5pm remains the strongest common time slot.</div>
    <div class="insight-item"><strong>Reminder logic:</strong> End-of-day discussion summary and deadline reminders are enabled.</div>
  `;
}

function bindGroupModal() {
  const openers = ['#openCreateGroup', '#openCreateGroupInline'];
  openers.forEach(id => $(id).addEventListener('click', () => $('#groupModal').classList.remove('hidden')));
  $('#closeGroupModal').addEventListener('click', () => $('#groupModal').classList.add('hidden'));
  $('#groupModal').addEventListener('click', e => {
    if (e.target.id === 'groupModal') $('#groupModal').classList.add('hidden');
  });
  $('#groupForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#groupNameInput').value.trim();
    const topic = $('#groupTopicInput').value.trim();
    const newGroup = {
      id: Date.now(),
      name,
      channels: [{ id: `channel-${Date.now()}`, name: topic, messages: [{ sender: 'System', text: `Welcome to ${name}.`, time: 'Now' }] }]
    };
    appData.groups.push(newGroup);
    activeGroupId = newGroup.id;
    activeChannelId = newGroup.channels[0].id;
    e.target.reset();
    $('#groupModal').classList.add('hidden');
    renderChat();
  });
}

function formatShortDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
}
function formatTime(timeStr) {
  const [h, m] = timeStr.split(':');
  const date = new Date();
  date.setHours(Number(h), Number(m));
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}
function slotToReadable(slot, long = false) {
  const [start, end] = slot.split('-');
  const s = readableHour(start);
  const e = readableHour(end);
  return long ? `${s} – ${e}` : `${s}–${e}`;
}
function readableHour(hourText) {
  const hour = Number(hourText);
  const suffix = hour >= 12 ? 'pm' : 'am';
  const display = hour === 12 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${display}:00${suffix}`;
}

document.addEventListener('DOMContentLoaded', init);
