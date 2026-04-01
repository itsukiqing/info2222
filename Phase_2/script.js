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
            { sender: 'Ava', text: 'Hi team, let’s keep progress updates here.', time: '9:05 AM', date: '2026-04-01' },
            { sender: 'Ben', text: '@You can you review the group chat spacing after lunch?', time: '9:20 AM', date: '2026-04-01' },
            { sender: 'Chloe', text: 'Please remember the tutor wants the heatmap visible in the demo.', time: '10:02 AM', date: '2026-04-01' }
          ]
        },
        {
          id: 'meeting',
          name: 'Meeting Planning',
          messages: [
            { sender: 'Daniel', text: 'Wednesday 4pm–5pm seems the lowest-stress slot for everyone.', time: '11:15 AM', date: '2026-04-01' },
            { sender: 'Ava', text: '@You if the reminder panel is ready, we can demo this flow today.', time: '11:18 AM', date: '2026-04-01' }
          ]
        },
        {
          id: 'coding',
          name: 'Coding',
          messages: [
            { sender: 'Ben', text: 'I’m building the group chat tab first, then the task board.', time: '12:11 PM', date: '2026-04-01' },
            { sender: 'Daniel', text: '@You please fake a short daily summary block for today so we can wire AI later.', time: '12:30 PM', date: '2026-04-01' }
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
            { sender: 'Mia', text: 'Prototype notes are in the shared doc.', time: '8:30 AM', date: '2026-03-31' },
            { sender: 'Noah', text: '@You could you share your reminder flow mock after studio?', time: '4:40 PM', date: '2026-04-01' },
            { sender: 'Mia', text: 'We should lock the sensor dashboard colours before tomorrow.', time: '5:10 PM', date: '2026-04-01' }
          ]
        },
        {
          id: 'testing-2',
          name: 'Testing',
          messages: [
            { sender: 'Ivy', text: 'I found two issues in the prototype export flow and added them to the sheet.', time: '10:15 AM', date: '2026-04-01' },
            { sender: 'Noah', text: 'I can fix the onboarding copy tonight if everyone is happy with the current flow.', time: '11:45 AM', date: '2026-04-01' }
          ]
        },
        {
          id: 'presentation-2',
          name: 'Presentation',
          messages: [
            { sender: 'Mia', text: '@You please bring the reminder mock into the final slide deck.', time: '1:20 PM', date: '2026-04-01' },
            { sender: 'Ivy', text: 'I drafted a shorter walkthrough so the final demo stays under five minutes.', time: '2:05 PM', date: '2026-04-01' }
          ]
        }
      ]
    }
  ],
  /** Mon=0 … Sun=6 — nearest task due day this week (matches demo sketch) */
  heatmapMembers: [
    { name: 'Ava', dueWeekday: 4 },
    { name: 'Ben', dueWeekday: 3 },
    { name: 'Chloe', dueWeekday: 1 },
    { name: 'Daniel', dueWeekday: 6 }
  ],
  scheduledCalls: [
    { id: 1, title: 'Weekly stand-up', date: '2026-04-03', time: '16:00' },
    { id: 2, title: 'Prototype review', date: '2026-04-06', time: '18:00' }
  ],
  tasks: [
    { id: 1, title: 'Coding', assignee: 'Ava', priorityRank: 1, durationDays: 5, status: 'Done' },
    { id: 2, title: 'Testing', assignee: 'Ben', priorityRank: 2, durationDays: 3, status: 'In Progress' },
    { id: 3, title: 'Building Framework', assignee: 'Chloe', priorityRank: 3, durationDays: 2, status: 'Not Started' },
    { id: 4, title: 'Marketing', assignee: 'N/A', priorityRank: 4, durationDays: 2, status: 'Not Assigned' },
    { id: 5, title: 'Task panel polish', assignee: 'Ben', priorityRank: 4, durationDays: 1, status: 'In Progress' }
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

const TASK_STATUSES = ['Not Started', 'In Progress', 'Done', 'Not Assigned'];

let checklistSortBy = 'priority';
let checklistSortAscending = true;
let checklistStatusFilter = null;
let checklistFilterMenuOpen = false;
let meetingEditMode = false;
let activeChatUtility = 'chat';
const editableMeetingMember = 'You';

const sectionsMeta = {
  dashboard: ['Dashboard', 'Overview of members, workload, and current progress.'],
  chat: ['Group Chat', 'Create groups, switch channels, and follow topic-based discussions.'],
  heatmap: ['Stress Heatmap', 'See deadlines, clashes, and low-stress periods for meetings.'],
  meeting: ['Meeting Decider', 'Compare free slots and confirm the best group meeting time.'],
  calls: ['Initialiser', 'Initialize calls, reminders, and calendar-based meeting setup.'],
  checklist: ['To-Do List', 'Priority, duration, status, sort, and filter.'],
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
  ensureEditableMeetingMember();
  bindNavigation();
  bindAddDeadlineModal();
  bindChat();
  bindMeeting();
  bindCalls();
  bindTasks();
  bindChecklistControls();
  bindCatchup();
  bindGroupModal();
  startSidebarClock();
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

function navigateToSection(section) {
  activeSection = section;
  $all('.nav-link').forEach(btn => btn.classList.toggle('active', btn.dataset.section === section));
  $all('.section').forEach(sec => sec.classList.toggle('active', sec.id === section));
  $('#sectionTitle').textContent = sectionsMeta[section][0];
  $('#sectionSubtitle').textContent = sectionsMeta[section][1];
  syncPageMeetingBox();
}

function bindNavigation() {
  $all('.nav-link').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateToSection(btn.dataset.section);
    });
  });
  $('#statInitialiserBtn').addEventListener('click', () => navigateToSection('calls'));
  syncPageMeetingBox();
}

function bindAddDeadlineModal() {
  $('#addDeadlineWeekday').innerHTML = WEEKDAYS.map((d, i) => `<option value="${i}">${d}</option>`).join('');
  $('#addMyDeadlineBtn').addEventListener('click', () => {
    $('#addDeadlineModal').classList.remove('hidden');
  });
  $('#closeAddDeadlineModal').addEventListener('click', () => {
    $('#addDeadlineModal').classList.add('hidden');
  });
  $('#addDeadlineModal').addEventListener('click', e => {
    if (e.target.id === 'addDeadlineModal') $('#addDeadlineModal').classList.add('hidden');
  });
  $('#addDeadlineForm').addEventListener('submit', e => {
    e.preventDefault();
    const due = Number($('#addDeadlineWeekday').value);
    const idx = appData.heatmapMembers.findIndex(m => m.name === 'Me');
    if (idx >= 0) appData.heatmapMembers[idx].dueWeekday = due;
    else appData.heatmapMembers.push({ name: 'Me', dueWeekday: due });
    $('#addDeadlineModal').classList.add('hidden');
    renderHeatmap();
  });
}

function workloadClass(level) {
  return `${level.toLowerCase()}-pill`;
}

function renderDashboard() {
  $('#statMembers').textContent = appData.members.length;
  $('#statTasks').textContent = appData.tasks.length;
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
      <p class="muted">${task.assignee} · ${task.status} · P${task.priorityRank}</p>
      <small>Duration: ${task.durationDays} days</small>
    </div>
  `).join('');
}

function getActiveGroup() {
  return appData.groups.find(g => g.id === activeGroupId) || appData.groups[0];
}
function getActiveChannel() {
  return getActiveGroup().channels.find(c => c.id === activeChannelId) || getActiveGroup().channels[0];
}
function getGroupMessages(group = getActiveGroup()) {
  return group.channels.flatMap(channel =>
    channel.messages.map(message => ({
      ...message,
      channelId: channel.id,
      channelName: channel.name
    }))
  );
}
function getMentionMessages() {
  return appData.groups.flatMap(group =>
    getGroupMessages(group)
      .filter(message => /@you\b/i.test(message.text))
      .map(message => ({ ...message, groupName: group.name }))
  );
}
function getTodayMessages() {
  return appData.groups.flatMap(group =>
    getGroupMessages(group)
      .filter(message => message.date === '2026-04-01')
      .map(message => ({ ...message, groupName: group.name }))
  );
}
function getActiveGroupSummary(group = getActiveGroup()) {
  if (group.id === 2) {
    return 'COMP Project Beta spent today tightening the prototype for presentation: testing feedback was reviewed, slide timing was shortened, and the reminder mock was requested for the final deck.';
  }
  return 'INFO2222 Team Alpha focused on demo polish today: meeting availability is being confirmed, the chat layout is under review, and the reminder/summary flow is being prepared for the next prototype pass.';
}
function syncChatModeVisibility() {
  $('#chatMainView').classList.toggle('hidden', activeChatUtility !== 'chat');
}

function renderChat() {
  const activeGroup = getActiveGroup();
  const groupMessages = getGroupMessages(activeGroup);

  $('#groupList').innerHTML = appData.groups.map(group => `
    <button class="group-item ${group.id === activeGroupId ? 'active' : ''}" data-group-id="${group.id}">
      <strong>${group.name}</strong><br />
      <small class="muted">${getGroupMessages(group).length} messages</small>
    </button>
  `).join('');

  $('#chatTitle').textContent = activeGroup.name;
  $('#chatGroupLabel').textContent = 'All group messages';
  $('#messageCountBadge').textContent = `${groupMessages.length} messages`;
  $('#chatMessages').innerHTML = groupMessages.map(msg => `
    <div class="message ${msg.sender === 'You' ? 'self' : ''}">
      <span class="message-channel"># ${msg.channelName}</span>
      <strong>${msg.sender}</strong>
      <div>${msg.text}</div>
      <small>${msg.time}</small>
    </div>
  `).join('');
  renderChatUtilityPanel();
  syncChatUtilityButtons();
  syncChatModeVisibility();

  $all('.group-item').forEach(btn => {
    btn.addEventListener('click', () => {
      activeGroupId = Number(btn.dataset.groupId);
      activeChannelId = getActiveGroup().channels[0].id;
      renderChat();
    });
  });
}

function renderChatUtilityPanel() {
  const panel = $('#chatUtilityPanel');

  if (activeChatUtility === 'chat') {
    panel.innerHTML = '';
    panel.classList.add('hidden');
    return;
  }

  panel.classList.remove('hidden');

  if (activeChatUtility === 'summary') {
    const todayMessages = getTodayMessages().filter(message => message.groupName === getActiveGroup().name);
    panel.innerHTML = `
      <div class="chat-utility-card">
        <div class="chat-utility-header">
          <strong>Daily Summary</strong>
          <span class="badge">${todayMessages.length} messages today</span>
        </div>
        <p class="chat-utility-summary">
          ${getActiveGroupSummary()}
        </p>
      </div>
    `;
    return;
  }

  const reminders = getMentionMessages().filter(message => message.groupName === getActiveGroup().name);
  panel.innerHTML = `
    <div class="chat-utility-card">
      <div class="chat-utility-header">
        <strong>Personal Reminder</strong>
        <span class="badge">${reminders.length} mentions</span>
      </div>
      <div class="chat-utility-list">
        ${reminders.map(message => `
          <div class="chat-utility-item">
            <div class="chat-utility-meta">${message.groupName} · # ${message.channelName} · ${message.time}</div>
            <div><strong>${message.sender}:</strong> ${message.text}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function syncChatUtilityButtons() {
  $all('[data-chat-utility]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.chatUtility === activeChatUtility);
  });
}

function bindChat() {
  $('#chatForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = $('#chatInput');
    const text = input.value.trim();
    if (!text) return;
    getActiveChannel().messages.push({
      sender: 'You',
      text,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      date: '2026-04-01'
    });
    input.value = '';
    renderChat();
  });

  $all('[data-chat-utility]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeChatUtility = btn.dataset.chatUtility;
      renderChatUtilityPanel();
      syncChatUtilityButtons();
    });
  });
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Days until due from this weekday (same week). Blue ≥4 days away, yellow 1–3 days, due = red, after due = free. */
function heatmapDayState(dueWeekday, dayIndex) {
  const daysUntil = dueWeekday - dayIndex;
  if (daysUntil < 0) return 'free';
  if (daysUntil === 0) return 'due';
  if (daysUntil >= 4) return 'far';
  return 'urgent';
}

function renderHeatmap() {
  const headerCells = WEEKDAYS.map(d => `<div class="heatmap-head">${d}</div>`).join('');
  const rows = appData.heatmapMembers.map(member => {
    const cells = WEEKDAYS.map((_, dayIndex) => {
      const state = heatmapDayState(member.dueWeekday, dayIndex);
      if (state === 'free') {
        return '<div class="heatmap-cell heatmap-free" title="Free from tasks"><span class="heatmap-check">✓</span></div>';
      }
      if (state === 'due') {
        return '<div class="heatmap-cell heatmap-urgent heatmap-due" title="Due date"></div>';
      }
      if (state === 'far') {
        return '<div class="heatmap-cell heatmap-far" title="Task due in more than 3 days"></div>';
      }
      return '<div class="heatmap-cell heatmap-urgent" title="Due within 3 days"></div>';
    }).join('');
    return `
      <div class="heatmap-row">
        <div class="heatmap-member">${member.name}</div>
        ${cells}
      </div>`;
  }).join('');

  $('#heatmapCalendar').innerHTML = `
    <div class="heatmap-table">
      <div class="heatmap-row heatmap-row-head">
        <div class="heatmap-corner muted">Member</div>
        ${headerCells}
      </div>
      ${rows}
    </div>
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
  $('#toggleFreeSlotsBtn').addEventListener('click', () => {
    meetingEditMode = !meetingEditMode;
    syncMeetingEditState();
    renderAvailabilityGrid();
  });
  $('#availabilityGrid').addEventListener('click', e => {
    const cell = e.target.closest('.availability-cell.editable-cell');
    if (!cell || !meetingEditMode) return;

    const day = $('#meetingDaySelect').value || Object.keys(appData.availability)[0];
    const slot = cell.dataset.slot;
    const slots = appData.availability[day][editableMeetingMember];
    const nextSlots = slots.includes(slot)
      ? slots.filter(value => value !== slot)
      : [...slots, slot].sort((a, b) => timeSlots.indexOf(a) - timeSlots.indexOf(b));

    appData.availability[day][editableMeetingMember] = nextSlots;
    $('#meetingFeedback').textContent = `Updated your availability for ${day}.`;
    renderAvailabilityGrid();
  });
}

function renderMeeting() {
  const days = Object.keys(appData.availability);
  const currentDay = $('#meetingDaySelect').value;
  $('#meetingDaySelect').innerHTML = days.map(day => `<option value="${day}">${day}</option>`).join('');
  $('#meetingDaySelect').value = days.includes(currentDay) ? currentDay : days[0];
  renderAvailabilityGrid();
  syncMeetingEditState();
}

function renderAvailabilityGrid() {
  const day = $('#meetingDaySelect').value || Object.keys(appData.availability)[0];
  const dayData = appData.availability[day];
  const memberNames = Object.keys(dayData).sort((a, b) => {
    if (a === editableMeetingMember) return 1;
    if (b === editableMeetingMember) return -1;
    return 0;
  });
  const overlaps = timeSlots.filter(slot => memberNames.every(name => dayData[name].includes(slot)));

  let html = `<div class="availability-header"><div class="availability-cell member-label">Member</div>${timeSlots.map(slot => `<div class="availability-cell">${slotStartLabel(slot)}</div>`).join('')}</div>`;
  html += memberNames.map(name => `
    <div class="availability-row ${name === editableMeetingMember ? 'editable-member-row' : ''}">
      <div class="availability-cell member-label">${name}</div>
      ${timeSlots.map(slot => {
        const isSelected = dayData[name].includes(slot);
        const isOverlap = overlaps.includes(slot);
        const isEditable = name === editableMeetingMember && meetingEditMode;
        return `<div class="availability-cell ${isOverlap ? 'overlap' : isSelected ? 'selected' : ''} ${isEditable ? 'editable-cell' : ''}" data-slot="${slot}">${isOverlap ? '✓' : ''}</div>`;
      }).join('')}
    </div>
  `).join('');
  $('#availabilityGrid').innerHTML = html;
  $('#availabilityGrid').classList.toggle('is-editing', meetingEditMode);
  updateMeetingSuggestion();
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

function ensureEditableMeetingMember() {
  Object.values(appData.availability).forEach(dayData => {
    if (!dayData[editableMeetingMember]) dayData[editableMeetingMember] = [];
  });
}

function syncMeetingEditState() {
  $('#toggleFreeSlotsBtn').classList.toggle('active', meetingEditMode);
  $('#toggleFreeSlotsBtn').textContent = meetingEditMode ? 'Done marking slots' : 'Mark your free slots';
  $('#meetingEditHint').classList.toggle('visible', meetingEditMode);
}

function updateMeetingSuggestion() {
  const suggestion = computeSuggestedMeeting();
  $('#suggestedMeeting').textContent = suggestion.labelFull;
}

function syncPageMeetingBox() {
  $('#pageMeetingBox').classList.toggle('hidden', activeSection !== 'meeting');
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
  $('#taskAssignee').innerHTML = '<option value="N/A">N/A</option>' + appData.members.map(m => `<option value="${m.name}">${m.name}</option>`).join('');
  $('#taskForm').addEventListener('submit', e => {
    e.preventDefault();
    const assignee = $('#taskAssignee').value;
    appData.tasks.push({
      id: Date.now(),
      title: $('#taskTitle').value.trim(),
      assignee,
      priorityRank: Number($('#taskPriority').value),
      durationDays: Math.max(1, Number($('#taskDuration').value) || 1),
      status: assignee === 'N/A' ? 'Not Assigned' : 'Not Started'
    });
    e.target.reset();
    $('#taskPriority').value = '3';
    $('#taskDuration').value = '3';
    renderTasks();
    renderDashboard();
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

function statusSlug(status) {
  return status.toLowerCase().replace(/\s+/g, '-');
}

function priorityPillClass(rank) {
  if (rank <= 2) return 'priority-pill-urgent';
  if (rank === 3) return 'priority-pill-mid';
  return 'priority-pill-low';
}

function bindChecklistControls() {
  const root = $('#checklistItems');
  root.addEventListener('click', e => {
    e.stopPropagation();
    const sortPri = e.target.closest('[data-action="sort-priority"]');
    if (sortPri) {
      if (checklistSortBy === 'priority') checklistSortAscending = !checklistSortAscending;
      else {
        checklistSortBy = 'priority';
        checklistSortAscending = true;
      }
      checklistFilterMenuOpen = false;
      renderTasks();
      return;
    }
    const sortDur = e.target.closest('[data-action="sort-duration"]');
    if (sortDur) {
      if (checklistSortBy === 'duration') checklistSortAscending = !checklistSortAscending;
      else {
        checklistSortBy = 'duration';
        checklistSortAscending = true;
      }
      checklistFilterMenuOpen = false;
      renderTasks();
      return;
    }
    const filterBtn = e.target.closest('[data-action="toggle-status-filter"]');
    if (filterBtn) {
      checklistFilterMenuOpen = !checklistFilterMenuOpen;
      renderTasks();
      return;
    }
    const filterOpt = e.target.closest('[data-action="set-status-filter"]');
    if (filterOpt) {
      const v = filterOpt.dataset.filterValue;
      checklistStatusFilter = v === 'all' ? null : v;
      checklistFilterMenuOpen = false;
      renderTasks();
      return;
    }
  });
  document.addEventListener('click', () => {
    if (checklistFilterMenuOpen) {
      checklistFilterMenuOpen = false;
      renderTasks();
    }
  });
}

function renderTasks() {
  const container = $('#checklistItems');
  if (!appData.tasks.length) {
    container.innerHTML = '<p class="muted">No tasks yet. Add one on the left.</p>';
    return;
  }

  const filtered = appData.tasks.filter(t => checklistStatusFilter === null || t.status === checklistStatusFilter);
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (checklistSortBy === 'priority') {
      cmp = a.priorityRank - b.priorityRank;
      if (cmp === 0) cmp = a.durationDays - b.durationDays;
    } else {
      cmp = a.durationDays - b.durationDays;
      if (cmp === 0) cmp = a.priorityRank - b.priorityRank;
    }
    const dir = checklistSortAscending ? 1 : -1;
    return cmp * dir;
  });

  const caretPri = checklistSortBy === 'priority' ? (checklistSortAscending ? '▲' : '▼') : '';
  const caretDur = checklistSortBy === 'duration' ? (checklistSortAscending ? '▲' : '▼') : '';
  const filterSelected = f =>
    (f.value === 'all' && checklistStatusFilter === null) ||
    (f.value !== 'all' && checklistStatusFilter === f.value);

  const filterButtons = [
    { value: 'all', label: 'All statuses' },
    { value: 'Done', label: 'Done' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Not Started', label: 'Not Started' },
    { value: 'Not Assigned', label: 'Not Assigned' }
  ]
    .map(
      f => `
      <button type="button" class="checklist-filter-option" data-action="set-status-filter" data-filter-value="${f.value}">
        ${f.label}${filterSelected(f) ? ' ✓' : ''}
      </button>`
    )
    .join('');

  const rows = sorted
    .map(task => {
      const assigneeClass = task.assignee === 'N/A' ? 'checklist-assignee-na' : 'checklist-assignee';
      const statusOpts = TASK_STATUSES.map(
        s => `<option value="${s}" ${task.status === s ? 'selected' : ''}>${s}</option>`
      ).join('');
      return `
      <tr>
        <td class="checklist-col-task">${escapeHtml(task.title)}</td>
        <td class="checklist-col-pri"><span class="priority-pill ${priorityPillClass(task.priorityRank)}">${task.priorityRank}</span></td>
        <td class="${assigneeClass}">${task.assignee}</td>
        <td class="checklist-duration">${task.durationDays} days</td>
        <td class="checklist-col-status"><select class="checklist-status-select checklist-status-${statusSlug(task.status)}" data-task-id="${task.id}">${statusOpts}</select></td>
      </tr>`;
    })
    .join('');

  const tbodyHtml = sorted.length
    ? rows
    : '<tr><td colspan="5" class="checklist-empty-row muted">No tasks match this status filter.</td></tr>';

  container.innerHTML = `
    <div class="checklist-table-scroll">
      <table class="checklist-table">
        <thead>
          <tr>
            <th scope="col">Task</th>
            <th scope="col">
              <button type="button" class="checklist-th-btn" data-action="sort-priority" title="Click to sort by priority">
                Priority <span class="sort-caret" aria-hidden="true">${caretPri}</span>
              </button>
            </th>
            <th scope="col">Assigned to</th>
            <th scope="col">
              <button type="button" class="checklist-th-btn" data-action="sort-duration" title="Click to sort by duration">
                Duration <span class="sort-caret" aria-hidden="true">${caretDur}</span>
              </button>
            </th>
            <th scope="col" class="checklist-th-filter">
              <button type="button" class="checklist-th-btn checklist-th-filter-btn" data-action="toggle-status-filter" title="Click to filter by status">
                Status <span class="filter-icon" aria-hidden="true">▽</span>
              </button>
              ${checklistFilterMenuOpen ? `<div class="checklist-filter-popover">${filterButtons}</div>` : ''}
            </th>
          </tr>
        </thead>
        <tbody>${tbodyHtml}</tbody>
      </table>
    </div>
    <div class="checklist-scroll-hint" aria-hidden="true">⋮</div>
  `;

  $all('#checklistItems .checklist-status-select').forEach(sel => {
    sel.addEventListener('change', () => {
      const task = appData.tasks.find(t => t.id === Number(sel.dataset.taskId));
      if (!task) return;
      task.status = sel.value;
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
  const taskItems = appData.tasks.filter(t => t.assignee === member || t.status !== 'Done').slice(0, 3);
  const meeting = computeSuggestedMeeting();
  $('#catchupSummary').innerHTML = `
    <div class="summary-card">
      <h4>Catch-up for ${member}</h4>
      <p>Recent discussion focused on finalising the prototype layout, confirming the heatmap feature, and preparing a tutor demo.</p>
      <p><strong>Important task updates:</strong> ${taskItems.map(t => `${t.title} (${t.status})`).join(', ')}.</p>
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
  const openers = ['#openCreateGroupInline'];
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
  const s = readableHour(slotBoundaryHour(slot, 'start'));
  const e = readableHour(slotBoundaryHour(slot, 'end'));
  return long ? `${s} – ${e}` : `${s}–${e}`;
}
function slotStartLabel(slot) {
  return readableHour(slotBoundaryHour(slot, 'start')).replace(':00', '');
}
function slotBoundaryHour(slot, boundary) {
  const [startText, endText] = slot.split('-');
  const start = Number(startText);
  const end = Number(endText);

  if (boundary === 'start') {
    if (start === 12) return 12;
    return start <= 5 ? start + 12 : start;
  }

  if (start === 12 && end === 1) return 13;
  return end <= 5 ? end + 12 : end;
}
function readableHour(hourText) {
  const hour = Number(hourText);
  const suffix = hour >= 12 ? 'pm' : 'am';
  const display = hour === 12 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${display}:00${suffix}`;
}

function startSidebarClock() {
  updateSidebarClock();
  window.setInterval(updateSidebarClock, 1000);
}

function updateSidebarClock() {
  const now = new Date();
  $('#sidebarClockTime').textContent = new Intl.DateTimeFormat('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Australia/Sydney'
  }).format(now);
  $('#sidebarClockDate').textContent = new Intl.DateTimeFormat('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Australia/Sydney'
  }).format(now);
}

document.addEventListener('DOMContentLoaded', init);
