const appData = {
  members: [],
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
    {
      id: 1,
      groupId: 1,
      title: 'Weekly stand-up',
      date: '2026-04-03',
      time: '16:00',
      participantNames: ['Ava', 'Ben'],
      generatedQuestions: [
        'What changed since the last check-in?',
        'What is blocking progress right now?',
        'What needs to be finished before the next demo?'
      ]
    },
    {
      id: 2,
      groupId: 2,
      title: 'Prototype review',
      date: '2026-04-06',
      time: '18:00',
      participantNames: ['Chloe', 'Daniel'],
      generatedQuestions: [
        'Which part of the prototype feels strongest for the demo?',
        'What feedback needs to be folded in next?',
        'Who owns the next revision?'
      ]
    }
  ],
  tasks: [
    { id: 1, groupId: 1, title: 'Coding', assignee: 'Ava', priorityRank: 1, durationDays: 5, status: 'Done' },
    { id: 2, groupId: 1, title: 'Testing', assignee: 'Ben', priorityRank: 2, durationDays: 3, status: 'In Progress' },
    { id: 3, groupId: 1, title: 'Building Framework', assignee: 'Ava', priorityRank: 3, durationDays: 2, status: 'Not Started' },
    { id: 4, groupId: 2, title: 'Marketing', assignee: 'N/A', priorityRank: 4, durationDays: 2, status: 'Not Assigned' },
    { id: 5, groupId: 2, title: 'Task panel polish', assignee: 'Ben', priorityRank: 4, durationDays: 1, status: 'In Progress' }
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

const AUTH_STORAGE_KEY = 'unigroupHubCurrentUser';
const DEMO_USERS_STORAGE_KEY = 'unigroupHubDemoUsers';
const SUPABASE_PLACEHOLDER_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_PLACEHOLDER_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const SUPABASE_AUTH_TIMEOUT_MS = 12000;
const demoUsers = [
  { id: 1, name: 'Ava', username: 'ava', email: 'ava@unigroup.test', password: 'password123', role: 'Coordinator', teamName: 'INFO2222 Team Alpha' },
  { id: 2, name: 'Ben', username: 'ben', email: 'ben@unigroup.test', password: 'password123', role: 'Frontend', teamName: 'INFO2222 Team Alpha' },
  { id: 3, name: 'Chloe', username: 'chloe', email: 'chloe@unigroup.test', password: 'password123', role: 'Report Lead', teamName: 'COMP Project Beta' },
  { id: 4, name: 'Daniel', username: 'daniel', email: 'daniel@unigroup.test', password: 'password123', role: 'Developer', teamName: 'COMP Project Beta' }
];

appData.members = demoUsers.map(user => normalizeTeamMember({
  ...user,
  current_task: '',
  stage: 'Not set',
  deadline: '',
  workload: 'Not set'
}));

let activeSection = 'dashboard';
let activeGroupId = 1;
let activeChannelId = 'general';
let currentUser = null;
let supabaseClient = null;
let authMode = 'demo';
let authFormMode = 'login';
let chatSubscription = null;
let chatLoading = false;
let chatInitInProgress = false;
let chatLoadError = '';
let availableChatMembers = [];
let chatLoadVersion = 0;
let dailySummaryLoading = false;
let dailySummaryError = '';
const dailySummaryCache = {};
let dailySummaryFailedKey = '';
let mentionSuggestions = [];
let mentionSelectionIndex = 0;
let activeMentionQuery = null;
let teamMembers = [];
let teamMembersLoading = false;
let teamMembersError = '';
let loadedTeamMembersGroupId = null;
let meetingAvailability = {};
let meetingAvailabilityLoading = false;
let groupCalls = [];
let callsLoading = false;
let callsError = '';
let loadedCallsGroupId = null;
let selectedCallId = null;
let groupTasks = [];
let tasksLoading = false;
let tasksError = '';
let loadedTasksGroupId = null;
let catchupLoading = false;
let catchupError = '';

const TASK_STATUSES = ['Not Started', 'In Progress', 'Done', 'Not Assigned'];
const MEMBER_STAGES = ['Not set', 'To Do', 'In Progress', 'Review', 'Done'];
const MEMBER_WORKLOADS = ['Not set', 'Low', 'Medium', 'High'];

let checklistSortBy = 'priority';
let checklistSortAscending = true;
let checklistStatusFilter = null;
let checklistFilterMenuOpen = false;
let meetingEditMode = false;
let activeChatUtility = 'chat';
const MEETING_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const sectionsMeta = {
  dashboard: ['Dashboard', 'Overview of members, workload, and current progress.'],
  members: ['Team Members', 'Contact details for the current project team.'],
  chat: ['Group Chat', 'Create groups, switch channels, and follow topic-based discussions.'],
  heatmap: ['Stress Heatmap', 'See deadlines, clashes, and low-stress periods for meetings.'],
  meeting: ['Meeting Decider', 'Compare free slots and confirm the best group meeting time.'],
  calls: ['Initialiser', 'Initialise calls, reminders, and calendar-based meeting setup.'],
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

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    credentials: 'same-origin',
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || 'Request failed.');
  }
  return payload;
}

async function performBackendAction(action, payload = {}) {
  return apiRequest('/api/app-action', {
    method: 'POST',
    body: {
      action,
      ...payload
    }
  });
}

async function init() {
  bindAuth();
  initSupabaseClient();
  await restoreSession();
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
  bindAddMemberModal();
  bindMembersDirectory();
  startSidebarClock();
  renderAll();
  syncAuthView();
}

function renderAll() {
  renderMemberDrivenViews();
  renderChat();
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

function bindAuth() {
  $('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email = $('#loginEmail').value.trim().toLowerCase();
    const password = $('#loginPassword').value;

    if (authFormMode === 'register') {
      const registrationEmail = $('#registerEmail').value.trim().toLowerCase();
      await registerUser(registrationEmail, password);
      return;
    }

    if (supabaseClient) {
      await signInWithSupabase(email, password);
      return;
    }

    const user = getDemoUsers().find(account => account.email === email && account.password === password);

    if (!user) {
      $('#loginFeedback').textContent = 'Email or password is incorrect.';
      return;
    }

    currentUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      teamName: user.teamName || ''
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    $('#loginForm').reset();
    $('#loginFeedback').textContent = '';
    renderChat();
    syncAuthView();
  });

  $('#logoutBtn').addEventListener('click', async () => {
    if (supabaseClient) {
      try {
        await apiRequest('/api/auth/logout', { method: 'POST' });
      } catch (error) {
        $('#loginFeedback').textContent = error.message;
        return;
      }
    }

    currentUser = null;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    teardownDatabaseChat();
    teamMembers = [];
    teamMembersError = '';
    teamMembersLoading = false;
    loadedTeamMembersGroupId = null;
    meetingAvailability = {};
    meetingAvailabilityLoading = false;
    navigateToSection('dashboard');
    syncAuthView();
  });

  $('#toggleAuthMode').addEventListener('click', () => {
    authFormMode = authFormMode === 'login' ? 'register' : 'login';
    $('#loginFeedback').textContent = '';
    syncAuthFormMode();
  });
}

function mapBackendStateGroup(group) {
  return {
    id: group.id,
    name: group.name,
    createdBy: group.createdBy || null,
    leaderId: group.leaderId || group.createdBy || null,
    channels: (group.channels || []).map(channel => ({
      id: channel.id,
      name: channel.name,
      messages: (channel.messages || []).map(message => ({
        id: message.id,
        senderId: message.senderId || null,
        sender: message.sender || 'Unknown',
        text: message.text || '',
        time: message.time || formatChatTimestamp(message.createdAt),
        date: message.date || (message.createdAt || '').slice(0, 10),
        createdAt: message.createdAt || ''
      }))
    })),
    members: (group.members || []).map(normalizeTeamMember),
    availability: group.availability || createEmptyMeetingAvailability((group.members || []).map(member => member.full_name || member.name || member.username || member.email)),
    calls: (group.calls || []).map(normalizeCallRecord),
    tasks: (group.tasks || []).map(normalizeTaskRecord)
  };
}

function syncDerivedStateFromActiveGroup() {
  const activeGroup = getActiveGroup();
  const members = activeGroup?.members || [];
  teamMembers = members.map(normalizeTeamMember);
  teamMembersLoading = false;
  teamMembersError = '';
  loadedTeamMembersGroupId = activeGroup?.id || null;

  groupCalls = (activeGroup?.calls || []).map(normalizeCallRecord);
  callsLoading = false;
  callsError = '';
  loadedCallsGroupId = activeGroup?.id || null;

  groupTasks = (activeGroup?.tasks || []).map(normalizeTaskRecord);
  tasksLoading = false;
  tasksError = '';
  loadedTasksGroupId = activeGroup?.id || null;

  syncMeetingAvailabilityMembers();
  if (activeGroup?.availability) {
    meetingAvailability = activeGroup.availability;
  } else if (!supabaseClient) {
    Object.entries(appData.availability).forEach(([day, membersByDay]) => {
      if (!meetingAvailability[day]) return;
      Object.entries(membersByDay).forEach(([name, slots]) => {
        if (meetingAvailability[day][name]) {
          meetingAvailability[day][name] = [...slots];
        }
      });
    });
  }
  meetingAvailabilityLoading = false;
}

async function loadBackendState() {
  if (!supabaseClient || !currentUser) return;

  chatLoading = true;
  chatLoadError = '';
  renderChat();

  try {
    const payload = await apiRequest('/api/app-state');
    currentUser = payload.user || currentUser;
    availableChatMembers = payload.memberDirectory || [];
    appData.groups = (payload.groups || []).map(mapBackendStateGroup);
    ensureActiveChatSelection();
    syncDerivedStateFromActiveGroup();
    renderGroupMemberPicker();
  } catch (error) {
    chatLoadError = error.message || 'Could not load app data.';
  } finally {
    chatLoading = false;
    renderAll();
    renderChat();
  }
}

function initSupabaseClient() {
  const config = window.UNIGROUP_SUPABASE_CONFIG || {};
  const hasRealConfig =
    config.url &&
    config.anonKey &&
    config.url !== SUPABASE_PLACEHOLDER_URL &&
    config.anonKey !== SUPABASE_PLACEHOLDER_ANON_KEY;

  if (!hasRealConfig) {
    authMode = 'demo';
    return;
  }

  supabaseClient = { customBackend: true };
  authMode = 'custom';
}

async function signInWithSupabase(email, password) {
  $('#loginFeedback').textContent = 'Signing in...';
  try {
    const payload = await withTimeout(
      apiRequest('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      }),
      SUPABASE_AUTH_TIMEOUT_MS,
      'Sign in timed out. Check your internet connection and backend settings.'
    );
    currentUser = payload.user || null;
    $('#loginForm').reset();
    $('#loginFeedback').textContent = '';
    await loadBackendState();
    syncAuthView();
  } catch (error) {
    $('#loginFeedback').textContent = error.message || 'Could not sign in.';
  }
}

async function registerUser(email, password) {
  const fullName = $('#registerFullName').value.trim();
  const username = $('#registerUsername').value.trim().toLowerCase();

  if (!fullName || !username || !email) {
    $('#loginFeedback').textContent = 'Enter your full name, username, and email.';
    return;
  }

  if (password.length < 6) {
    $('#loginFeedback').textContent = 'Password must be at least 6 characters.';
    return;
  }

  if (supabaseClient) {
    await registerWithSupabase(email, password, username, fullName);
    return;
  }

  registerDemoUser(email, password, username, fullName);
}

async function registerWithSupabase(email, password, username, fullName) {
  $('#loginFeedback').textContent = 'Creating account...';
  try {
    const payload = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        email,
        password,
        username,
        fullName
      }
    });
    currentUser = payload.user || null;
    $('#loginForm').reset();
    $('#loginFeedback').textContent = '';
    await loadBackendState();
    syncAuthView();
  } catch (error) {
    $('#loginFeedback').textContent = error.message || 'Could not create the account.';
  }
}

function registerDemoUser(email, password, username, fullName) {
  const users = getDemoUsers();

  if (users.some(user => user.email === email)) {
    $('#loginFeedback').textContent = 'An account with this email already exists.';
    return;
  }

  const user = {
    id: Date.now(),
    name: fullName,
    username,
    email,
    password,
    role: 'Team member'
  };

  users.push(user);
  localStorage.setItem(DEMO_USERS_STORAGE_KEY, JSON.stringify(users.filter(account => !demoUsers.some(base => base.email === account.email))));
  currentUser = {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
  $('#loginForm').reset();
  $('#loginFeedback').textContent = '';
  renderChat();
  syncAuthView();
}

function getDemoUsers() {
  try {
    const storedUsers = JSON.parse(localStorage.getItem(DEMO_USERS_STORAGE_KEY)) || [];
    return [...demoUsers, ...storedUsers];
  } catch (error) {
    localStorage.removeItem(DEMO_USERS_STORAGE_KEY);
    return [...demoUsers];
  }
}

async function restoreSession() {
  if (supabaseClient) {
    try {
      const payload = await apiRequest('/api/auth/me');
      currentUser = payload.user || null;
      if (currentUser) await loadBackendState();
    } catch (error) {
      currentUser = null;
    }
    return;
  }

  try {
    const stored = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
    const knownUser = stored && getDemoUsers().find(user => user.email === stored.email);
    currentUser = knownUser
      ? { id: knownUser.id, username: knownUser.username, name: knownUser.name, email: knownUser.email, role: knownUser.role }
      : null;
  } catch (error) {
    currentUser = null;
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

function syncAuthView() {
  const isLoggedIn = Boolean(currentUser);
  $('#loginScreen').classList.toggle('hidden', isLoggedIn);
  $('#appShell').classList.toggle('hidden', !isLoggedIn);

  syncAuthHint();
  syncAuthFormMode();

  if (!isLoggedIn) {
    $('#loginEmail').focus();
    return;
  }

  $('#signedInName').textContent = currentUser.name;
  $('#signedInEmail').textContent = currentUser.email;
}

function syncAuthFormMode() {
  const isRegistering = authFormMode === 'register';
  $all('.register-only').forEach(field => field.classList.toggle('hidden', !isRegistering));
  $all('.login-only').forEach(field => field.classList.toggle('hidden', isRegistering));
  $('#authSubmitBtn').textContent = isRegistering ? 'Create account' : 'Log in';
  $('#authSwitchText').textContent = isRegistering ? 'Already have an account?' : 'Need an account?';
  $('#toggleAuthMode').textContent = isRegistering ? 'Log in' : 'Register';
  $('#loginEmail').required = !isRegistering;
  $('#registerFullName').required = isRegistering;
  $('#registerUsername').required = isRegistering;
  $('#registerEmail').required = isRegistering;
  $('#loginPassword').autocomplete = isRegistering ? 'new-password' : 'current-password';
  $('#loginPassword').placeholder = isRegistering ? 'Create a password' : 'Enter your password';
}

function syncAuthHint() {
  const hint = $('#authHint');

  if (authMode === 'custom') {
    hint.innerHTML = `
      <strong>Custom auth</strong>
      <span>Passwords are stored with PBKDF2 + salt in your database, and the app signs in through server-side sessions.</span>
    `;
    return;
  }

  hint.innerHTML = `
    <strong>Demo fallback</strong>
    <span>Set your Supabase URL/key in supabase-config.js. For now: ava@unigroup.test / password123</span>
  `;
}

function withTimeout(promise, ms, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error(message)), ms);
    })
  ]);
}

function bindNavigation() {
  $all('.nav-link').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateToSection(btn.dataset.section);
    });
  });
  $('#statMembersBtn').addEventListener('click', () => navigateToSection('members'));
  $('#statInitialiserBtn').addEventListener('click', () => navigateToSection('calls'));
  syncPageMeetingBox();
}

function bindAddDeadlineModal() {
  $('#addMyDeadlineBtn').addEventListener('click', () => {
    const currentMember = getActiveTeamMembers().find(member => String(member.id) === String(currentUser?.id));
    $('#addDeadlineDate').value = currentMember?.deadline || '';
    $('#addDeadlineFeedback').textContent = '';
    $('#addDeadlineModal').classList.remove('hidden');
  });
  $('#closeAddDeadlineModal').addEventListener('click', () => {
    $('#addDeadlineModal').classList.add('hidden');
  });
  $('#addDeadlineModal').addEventListener('click', e => {
    if (e.target.id === 'addDeadlineModal') $('#addDeadlineModal').classList.add('hidden');
  });
  $('#addDeadlineForm').addEventListener('submit', async e => {
    e.preventDefault();
    const deadline = $('#addDeadlineDate').value;
    $('#addDeadlineFeedback').textContent = 'Saving...';

    try {
      await saveCurrentUserDeadline(deadline);
      $('#addDeadlineFeedback').textContent = '';
      $('#addDeadlineModal').classList.add('hidden');
      renderMemberDrivenViews();
    } catch (error) {
      $('#addDeadlineFeedback').textContent = error.message || 'Could not save your deadline.';
    }
  });
}

function workloadClass(level) {
  const normalized = String(level || '').toLowerCase();
  if (['low', 'medium', 'high'].includes(normalized)) return `${normalized}-pill`;
  return 'neutral-pill';
}

function getMemberInitials(name) {
  return String(name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('') || '?';
}

function normalizeTeamMember(member) {
  const name = member.full_name || member.name || member.username || member.email || 'Team member';
  return {
    id: member.user_id || member.id,
    username: member.username || '',
    name,
    email: member.email || '',
    role: member.role || 'Team member',
    currentTask: member.current_task || member.currentTask || '',
    stage: member.stage || 'Not set',
    deadline: member.deadline || '',
    workload: member.workload || 'Not set',
    initials: member.initials || getMemberInitials(name),
    isLeader: Boolean(member.is_leader),
    isCreator: Boolean(member.is_creator)
  };
}

function getActiveTeamMembers() {
  if (supabaseClient) return teamMembers;
  return appData.members;
}

function normalizeCallRecord(call) {
  return {
    id: call.call_id || call.id,
    groupId: call.group_id || call.groupId || null,
    title: call.topic || call.title || 'Untitled call',
    date: call.scheduled_date || call.date || '',
    time: call.scheduled_time || call.time || '',
    participantNames: Array.isArray(call.participant_names) ? call.participant_names : (call.participantNames || []),
    generatedQuestions: Array.isArray(call.generated_questions) ? call.generated_questions : (call.generatedQuestions || []),
    createdAt: call.created_at || call.createdAt || '',
    createdBy: call.created_by || call.createdBy || null,
    participantCount: Number(call.participant_count || call.participantNames?.length || 0)
  };
}

function normalizeTaskRecord(task) {
  return {
    id: task.task_id || task.id,
    groupId: task.group_id || task.groupId || null,
    title: task.title || 'Untitled task',
    assignee: task.assignee_name || task.assignee || 'N/A',
    assigneeUserId: task.assignee_user_id || task.assigneeUserId || null,
    priorityRank: Number(task.priority_rank || task.priorityRank || 3),
    durationDays: Math.max(1, Number(task.duration_days || task.durationDays || 1)),
    status: task.status || 'Not Started',
    createdBy: task.created_by || task.createdBy || null,
    createdAt: task.created_at || task.createdAt || ''
  };
}

function getCallsForActiveGroup() {
  const activeGroup = getActiveGroup();
  if (!activeGroup) return [];
  if (supabaseClient) return groupCalls;
  return appData.scheduledCalls
    .filter(call => String(call.groupId || activeGroup.id) === String(activeGroup.id))
    .map(normalizeCallRecord);
}

function getTasksForGroup(group = getActiveGroup()) {
  if (!group) return [];
  if (supabaseClient) {
    return loadedTasksGroupId === group.id ? groupTasks : [];
  }
  return appData.tasks
    .filter(task => String(task.groupId || group.id) === String(group.id))
    .map(normalizeTaskRecord);
}

function getTasksForActiveGroup() {
  return getTasksForGroup(getActiveGroup());
}

function buildLocalCallQuestions(topic, participantNames = []) {
  const teamLabel = participantNames.length ? participantNames.join(', ') : 'the team';
  return [
    `What does success for "${topic}" look like for ${teamLabel}?`,
    `Which tasks or blockers should we resolve in this meeting?`,
    'What needs an owner before the call ends?',
    'What should happen next after this meeting?'
  ];
}

async function generateCallQuestionsForTopic({ topic, groupName, participantNames, scheduledDate, scheduledTime }) {
  const fallbackQuestions = buildLocalCallQuestions(topic, participantNames);

  try {
    const response = await fetch('/api/call-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic,
        groupName,
        participantNames,
        scheduledDate,
        scheduledTime
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error || 'Could not generate meeting questions.');
    }

    const questions = Array.isArray(payload?.questions)
      ? payload.questions.map(question => String(question || '').trim()).filter(Boolean)
      : [];

    if (!questions.length) {
      throw new Error('The AI question generator returned an empty list.');
    }

    return { questions, warning: '' };
  } catch (error) {
    return {
      questions: fallbackQuestions,
      warning: `${error.message || 'Could not use the AI question generator.'} Saved starter questions instead.`
    };
  }
}

async function loadGroupCallsForActiveGroup(force = false) {
  const activeGroup = getActiveGroup();
  if (!supabaseClient || !activeGroup) {
    groupCalls = [];
    callsLoading = false;
    callsError = '';
    loadedCallsGroupId = activeGroup?.id || null;
    renderCalls();
    renderCatchupHighlights();
    return;
  }

  if (force) {
    await loadBackendState();
    return;
  }

  syncDerivedStateFromActiveGroup();
  renderCalls();
  renderCatchupHighlights();
}

function getMentionHandleForMember(member) {
  if (!member) return '';
  if (member.username) return member.username;
  if (member.email) return member.email.split('@')[0];
  return String(member.name || '')
    .trim()
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '');
}

function getMentionableMembers() {
  const seenHandles = new Set();
  return getActiveTeamMembers()
    .map(member => {
      const handle = getMentionHandleForMember(member);
      if (!handle) return null;
      const normalizedHandle = handle.toLowerCase();
      if (seenHandles.has(normalizedHandle)) return null;
      seenHandles.add(normalizedHandle);
      return {
        ...member,
        mentionHandle: handle
      };
    })
    .filter(Boolean);
}

function syncMemberDependentInputs() {
  const members = getActiveTeamMembers();
  const assigneeSelect = $('#taskAssignee');
  const catchupSelect = $('#catchupMember');
  const selectedAssignee = assigneeSelect?.value || 'N/A';
  const selectedCatchupMember = catchupSelect?.value || '';

  if (assigneeSelect) {
    assigneeSelect.innerHTML = '<option value="N/A">N/A</option>' + members.map(member => `
      <option value="${escapeHtml(member.name)}">${escapeHtml(member.name)}</option>
    `).join('');
    assigneeSelect.value = [...assigneeSelect.options].some(option => option.value === selectedAssignee)
      ? selectedAssignee
      : 'N/A';
  }

  if (catchupSelect) {
    if (!members.length) {
      catchupSelect.innerHTML = '<option value="">No team members yet</option>';
      catchupSelect.disabled = true;
    } else {
      catchupSelect.disabled = false;
      catchupSelect.innerHTML = members.map(member => `
        <option value="${escapeHtml(member.name)}">${escapeHtml(member.name)}</option>
      `).join('');
      catchupSelect.value = [...catchupSelect.options].some(option => option.value === selectedCatchupMember)
        ? selectedCatchupMember
        : catchupSelect.options[0].value;
    }
  }
}

function renderMemberDrivenViews() {
  syncMemberDependentInputs();
  renderDashboard();
  renderMembersDirectory();
  renderHeatmap();
  renderMeeting();
}

function canManageActiveGroup() {
  const group = getActiveGroup();
  if (!group || !currentUser) return false;
  return group.createdBy === currentUser.id || group.leaderId === currentUser.id;
}

function getLeaderLabel() {
  const leader = getActiveTeamMembers().find(member => member.isLeader);
  return leader ? leader.name : 'No leader set';
}

function isMissingRpcError(error, functionName) {
  const message = error?.message || '';
  return message.includes(`Could not find the function public.${functionName}`) || message.includes('schema cache');
}

async function loadTeamMembersFromTables(groupId) {
  const { data: membershipRows, error: membershipError } = await supabaseClient
    .from('chat_group_members')
    .select('user_id')
    .eq('group_id', groupId);

  if (membershipError) throw membershipError;

  const userIds = [...new Set((membershipRows || []).map(row => row.user_id).filter(Boolean))];
  if (!userIds.length) return [];

  const { data: profileRows, error: profileError } = await supabaseClient
    .from('profiles')
    .select('id, username, full_name, email, role')
    .in('id', userIds);

  if (profileError) throw profileError;

  const group = getActiveGroup();
  return (profileRows || []).map(profile => normalizeTeamMember({
    ...profile,
    is_leader: profile.id === group?.leaderId,
    is_creator: profile.id === group?.createdBy
  }));
}

async function addMemberByEmailFallback(groupId, email) {
  const { data: profile, error: profileError } = await supabaseClient
    .from('profiles')
    .select('id, email, full_name, username')
    .ilike('email', email)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile) throw new Error('No user found with that email.');

  const { error: membershipError } = await supabaseClient
    .from('chat_group_members')
    .insert({
      group_id: groupId,
      user_id: profile.id,
      added_by: currentUser.id
    });

  if (membershipError && !String(membershipError.message || '').toLowerCase().includes('duplicate')) {
    throw membershipError;
  }

  return {
    added_user_id: profile.id,
    added_email: profile.email,
    added_full_name: profile.full_name || profile.username || profile.email
  };
}

function createEmptyMeetingAvailability(memberNames = []) {
  return MEETING_DAYS.reduce((days, day) => {
    days[day] = memberNames.reduce((membersMap, name) => {
      membersMap[name] = [];
      return membersMap;
    }, {});
    return days;
  }, {});
}

function syncMeetingAvailabilityMembers() {
  const members = getActiveTeamMembers();
  const names = members.map(member => member.name);
  const fresh = createEmptyMeetingAvailability(names);

  for (const day of MEETING_DAYS) {
    for (const name of names) {
      fresh[day][name] = [...(meetingAvailability?.[day]?.[name] || [])];
    }
  }

  meetingAvailability = fresh;
}

function getEditableMeetingMemberName() {
  const currentMember = getActiveTeamMembers().find(member => String(member.id) === String(currentUser?.id));
  return currentMember?.name || currentUser?.name || 'You';
}

function mapAvailabilityRowsToState(rows) {
  const members = getActiveTeamMembers();
  const names = members.map(member => member.name);
  const state = createEmptyMeetingAvailability(names);
  const membersById = new Map(members.map(member => [String(member.id), member.name]));

  (rows || []).forEach(row => {
    const memberName = membersById.get(String(row.user_id));
    if (!memberName || !state[row.day_name]) return;
    state[row.day_name][memberName] = Array.isArray(row.slots) ? row.slots.filter(slot => timeSlots.includes(slot)) : [];
  });

  return state;
}

async function loadMeetingAvailabilityForActiveGroup() {
  syncMeetingAvailabilityMembers();

  if (!supabaseClient || !currentUser) {
    Object.entries(appData.availability).forEach(([day, members]) => {
      if (!meetingAvailability[day]) return;
      Object.entries(members).forEach(([name, slots]) => {
        if (meetingAvailability[day][name]) {
          meetingAvailability[day][name] = [...slots];
        }
      });
    });
    renderMeeting();
    return;
  }

  syncDerivedStateFromActiveGroup();
  meetingAvailabilityLoading = false;
  renderMeeting();
}

async function saveCurrentUserAvailability(day, slots) {
  if (!supabaseClient || !currentUser) {
    if (!appData.availability[day]) appData.availability[day] = {};
    appData.availability[day][getEditableMeetingMemberName()] = [...slots];
    return;
  }

  const activeGroup = getActiveGroup();
  if (!activeGroup) throw new Error('Select a team first.');
  await performBackendAction('save_availability', {
    groupId: activeGroup.id,
    day,
    slots
  });
  await loadBackendState();
}

async function saveCurrentUserDeadline(deadline) {
  const normalizedDeadline = deadline || null;
  const activeMember = getActiveTeamMembers().find(member => String(member.id) === String(currentUser?.id));

  if (!supabaseClient || !currentUser) {
    const target = appData.members.find(member => String(member.id) === String(currentUser?.id));
    if (!target) throw new Error('Could not find your profile.');
    target.deadline = normalizedDeadline || '';
    return;
  }

  const activeGroup = getActiveGroup();
  if (!activeGroup) {
    throw new Error('Select a team first.');
  }
  await performBackendAction('save_member_profile', {
    groupId: activeGroup.id,
    userId: currentUser.id,
    role: activeMember?.role || '',
    currentTask: activeMember?.currentTask || '',
    stage: activeMember?.stage || 'Not set',
    workload: activeMember?.workload || 'Not set',
    deadline: normalizedDeadline
  });
  await loadBackendState();
}

function renderDashboard() {
  const members = getActiveTeamMembers();
  const activeGroup = getActiveGroup();
  const tasks = getTasksForActiveGroup();

  $('#statMembers').textContent = members.length;
  $('#statTasks').textContent = tasks.length;
  $('#statMeetingTime').textContent = computeSuggestedMeeting().label;

  if (supabaseClient && !activeGroup) {
    $('#memberCards').innerHTML = '<p class="muted">Select a group chat to see that team on the dashboard.</p>';
  } else if (teamMembersLoading) {
    $('#memberCards').innerHTML = '<p class="muted">Loading team members...</p>';
  } else if (teamMembersError) {
    $('#memberCards').innerHTML = `<p class="muted">${escapeHtml(teamMembersError)}</p>`;
  } else if (!members.length) {
    $('#memberCards').innerHTML = '<p class="muted">No team members in this group yet.</p>';
  } else {
    $('#memberCards').innerHTML = members.map(member => `
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
      <p><strong>Email:</strong> ${escapeHtml(member.email || 'Not set')}</p>
      <p><strong>Current:</strong> ${escapeHtml(member.currentTask || 'Not set')}</p>
      <p><strong>Stage:</strong> ${escapeHtml(member.stage || 'Not set')}</p>
      <p><strong>Deadline:</strong> ${formatShortDate(member.deadline)}</p>
    </div>
    `).join('');
  }

  $('#taskSnapshot').innerHTML = tasks.slice(0, 5).map(task => `
    <div class="snapshot-item">
      <strong>${task.title}</strong>
      <p class="muted">${task.assignee} · ${task.status} · P${task.priorityRank}</p>
      <small>Duration: ${task.durationDays} days</small>
    </div>
  `).join('') || '<p class="muted">No tasks yet for this team.</p>';
}

function renderMembersDirectory() {
  const members = getActiveTeamMembers();
  const activeGroup = getActiveGroup();
  const container = $('#memberDirectory');
  const canManage = canManageActiveGroup();
  const teamMeta = $('#teamManagementMeta');
  $('#openAddMemberFromTeam').disabled = !activeGroup;

  if (supabaseClient && !activeGroup) {
    teamMeta.textContent = 'Select a group to manage its team.';
    container.innerHTML = '<p class="muted">Select a group chat first. The Team Members page always shows the currently selected team.</p>';
    return;
  }

  if (teamMembersLoading) {
    teamMeta.textContent = activeGroup ? `Loading team for ${activeGroup.name}...` : 'Loading team...';
    container.innerHTML = '<p class="muted">Loading team members...</p>';
    return;
  }

  if (teamMembersError) {
    teamMeta.textContent = 'There is a problem loading this team.';
    container.innerHTML = `<p class="muted">${escapeHtml(teamMembersError)}</p>`;
    return;
  }

  if (activeGroup) {
    const leaderNote = members.length ? `Leader: ${getLeaderLabel()}` : 'No members yet';
    teamMeta.textContent = `${activeGroup.name} · ${leaderNote}`;
  } else {
    teamMeta.textContent = 'Demo team';
  }

  if (!members.length) {
    container.innerHTML = '<p class="muted">No team members found for this group yet.</p>';
    return;
  }

  container.innerHTML = members.map(member => `
    <form class="member-directory-item member-editor" data-member-id="${member.id}">
      <div class="member-directory-top">
        <div class="avatar">${member.initials}</div>
        <div>
          <strong>${escapeHtml(member.name)}</strong>
          <div class="muted">${escapeHtml(member.email || 'No email saved')}</div>
        </div>
      </div>
      <div class="member-card-badges">
        <span class="badge ${member.isLeader ? 'leader-badge' : ''}">${member.isLeader ? 'Leader' : (member.role || 'Team member')}</span>
        ${member.isCreator ? '<span class="badge">Creator</span>' : ''}
      </div>
      <div class="member-editor-grid">
        <label class="stack-label">Role
          <input name="role" type="text" value="${escapeHtml(member.role || '')}" ${supabaseClient ? '' : 'data-local-only="true"'} />
        </label>
        <label class="stack-label">Current task
          <input name="currentTask" type="text" value="${escapeHtml(member.currentTask || '')}" ${supabaseClient ? '' : 'data-local-only="true"'} />
        </label>
        <label class="stack-label">Stage
          <select name="stage">
            ${MEMBER_STAGES.map(stage => `<option value="${stage}" ${member.stage === stage ? 'selected' : ''}>${stage}</option>`).join('')}
          </select>
        </label>
        <label class="stack-label">Workload
          <select name="workload">
            ${MEMBER_WORKLOADS.map(level => `<option value="${level}" ${member.workload === level ? 'selected' : ''}>${level}</option>`).join('')}
          </select>
        </label>
        <label class="stack-label">Deadline
          <input name="deadline" type="date" value="${member.deadline || ''}" />
        </label>
      </div>
      <div class="member-editor-actions">
        <div class="member-card-actions">
          <button class="small-btn member-card-action" type="submit">Save</button>
          ${supabaseClient && canManage && !member.isLeader ? '<button class="secondary-btn member-card-action" type="button" data-action="set-leader">Set leader</button>' : ''}
          ${supabaseClient && canManage && !member.isCreator ? '<button class="danger-btn member-card-action" type="button" data-action="remove-member">Remove</button>' : ''}
        </div>
        <p class="feedback-text member-save-feedback" role="status"></p>
      </div>
    </form>
  `).join('');
}

async function initDatabaseChat() {
  if (!supabaseClient || !currentUser) return;
  if (chatInitInProgress) return;
  chatInitInProgress = true;
  try {
    await loadBackendState();
  } finally {
    chatInitInProgress = false;
  }
}

async function loadTeamMembersForActiveGroup() {
  if (!supabaseClient || !currentUser) {
    teamMembers = [...appData.members];
    teamMembersError = '';
    teamMembersLoading = false;
    loadedTeamMembersGroupId = null;
    renderMemberDrivenViews();
    renderCalls();
    loadMeetingAvailabilityForActiveGroup();
    return;
  }

  syncDerivedStateFromActiveGroup();
  renderMemberDrivenViews();
  renderCalls();
  renderMeeting();
}

async function loadChatMemberDirectory() {
  if (!supabaseClient || !currentUser) return;
  renderGroupMemberPicker();
}

function renderGroupMemberPicker() {
  const picker = $('#groupMemberPicker');
  if (!picker) return;

  const selectableMembers = availableChatMembers.filter(member => member.id !== currentUser?.id);

  if (!supabaseClient || !currentUser) {
    picker.innerHTML = '<p class="member-picker-empty">Sign in to choose group members.</p>';
    return;
  }

  if (!selectableMembers.length) {
    picker.innerHTML = '<p class="member-picker-empty">No other users found yet. You can still create the group and add members later.</p>';
    return;
  }

  picker.innerHTML = selectableMembers.map(member => `
    <label class="member-picker-option">
      <input type="checkbox" class="group-member-checkbox" value="${member.id}" />
      <span>
        <strong>${escapeHtml(member.full_name || member.username || member.email)}</strong>
        <span class="muted">${escapeHtml(member.username || member.email)}</span>
      </span>
    </label>
  `).join('');
}

function teardownDatabaseChat() {
  chatSubscription = null;
}

function subscribeToChatChanges() {
  return;
}

async function loadChatFromDatabase() {
  if (!supabaseClient || !currentUser) return;
  await loadBackendState();
}

function ensureActiveChatSelection() {
  if (!appData.groups.length) {
    activeGroupId = null;
    activeChannelId = null;
    return;
  }

  if (!appData.groups.some(group => group.id === activeGroupId)) {
    activeGroupId = appData.groups[0].id;
  }

  const activeGroup = getActiveGroup();
  if (!activeGroup?.channels.length) {
    activeChannelId = null;
    return;
  }

  if (!activeGroup.channels.some(channel => channel.id === activeChannelId)) {
    activeChannelId = activeGroup.channels[0].id;
  }
}

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}

function getActiveGroup() {
  return appData.groups.find(g => g.id === activeGroupId) || appData.groups[0] || null;
}
function getActiveChannel() {
  const activeGroup = getActiveGroup();
  return activeGroup?.channels.find(c => c.id === activeChannelId) || activeGroup?.channels[0] || null;
}
function isCurrentUserSender(sender) {
  return sender === 'You' || (currentUser && sender === currentUser.name);
}
function getGroupMessages(group = getActiveGroup()) {
  if (!group) return [];
  return group.channels.flatMap(channel =>
    channel.messages.map(message => ({
      ...message,
      channelId: channel.id,
      channelName: channel.name
    }))
  );
}

function normalizeHandle(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function getMentionHandlesForCurrentUser() {
  const handles = new Set();
  const activeMembers = getActiveTeamMembers();
  const currentMember = activeMembers.find(member => String(member.id) === String(currentUser?.id));

  if (currentUser?.username) handles.add(normalizeHandle(currentUser.username));
  if (currentUser?.name) {
    handles.add(normalizeHandle(currentUser.name));
    currentUser.name.split(/\s+/).filter(Boolean).forEach(part => handles.add(normalizeHandle(part)));
  }
  if (currentMember?.name) {
    handles.add(normalizeHandle(currentMember.name));
    currentMember.name.split(/\s+/).filter(Boolean).forEach(part => handles.add(normalizeHandle(part)));
  }
  if (currentMember?.email) handles.add(normalizeHandle(currentMember.email.split('@')[0]));

  return [...handles].filter(Boolean);
}

function getMentionTargets(messageText) {
  return [...String(messageText || '').matchAll(/@([a-zA-Z0-9._-]+)/g)]
    .map(match => normalizeHandle(match[1]))
    .filter(Boolean);
}

function getMentionQueryState(value, caretPosition) {
  const prefix = String(value || '').slice(0, caretPosition);
  const match = prefix.match(/(^|\s)@([a-zA-Z0-9._-]*)$/);
  if (!match) return null;
  const query = match[2] || '';
  const start = prefix.length - query.length - 1;
  return {
    query,
    start,
    end: caretPosition
  };
}

function closeMentionSuggestions() {
  mentionSuggestions = [];
  mentionSelectionIndex = 0;
  activeMentionQuery = null;
  $('#mentionSuggestions').classList.add('hidden');
  $('#mentionSuggestions').innerHTML = '';
}

function renderMentionSuggestions() {
  const container = $('#mentionSuggestions');
  if (!mentionSuggestions.length || !activeMentionQuery) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  container.classList.remove('hidden');
  container.innerHTML = mentionSuggestions.map((member, index) => `
    <button
      type="button"
      class="mention-suggestion ${index === mentionSelectionIndex ? 'active' : ''}"
      data-mention-index="${index}"
      role="option"
      aria-selected="${index === mentionSelectionIndex ? 'true' : 'false'}"
    >
      <span class="mention-suggestion-name">${escapeHtml(member.name)}</span>
      <span class="mention-suggestion-handle">@${escapeHtml(member.mentionHandle)}</span>
    </button>
  `).join('');
}

function updateMentionSuggestions() {
  const input = $('#chatInput');
  const queryState = getMentionQueryState(input.value, input.selectionStart || 0);
  if (!queryState) {
    closeMentionSuggestions();
    return;
  }

  const normalizedQuery = normalizeHandle(queryState.query);
  const matches = getMentionableMembers().filter(member => {
    const handle = normalizeHandle(member.mentionHandle);
    const name = normalizeHandle(member.name);
    return !normalizedQuery || handle.startsWith(normalizedQuery) || name.includes(normalizedQuery);
  });

  if (!matches.length) {
    closeMentionSuggestions();
    return;
  }

  activeMentionQuery = queryState;
  mentionSuggestions = matches.slice(0, 6);
  mentionSelectionIndex = Math.min(mentionSelectionIndex, mentionSuggestions.length - 1);
  renderMentionSuggestions();
}

function applyMentionSuggestion(member) {
  if (!member) return;
  const input = $('#chatInput');
  const queryState = activeMentionQuery || getMentionQueryState(input.value, input.selectionStart || 0);
  if (!queryState) return;

  const before = input.value.slice(0, queryState.start);
  const after = input.value.slice(queryState.end);
  const mentionText = `@${member.mentionHandle} `;
  input.value = `${before}${mentionText}${after}`;
  const caretPosition = before.length + mentionText.length;
  input.focus();
  input.setSelectionRange(caretPosition, caretPosition);
  closeMentionSuggestions();
}

function getMentionMessages() {
  const handles = getMentionHandlesForCurrentUser();
  if (!handles.length) return [];

  return appData.groups.flatMap(group =>
    getGroupMessages(group)
      .filter(message => getMentionTargets(message.text).some(target => handles.includes(target)))
      .map(message => ({ ...message, groupName: group.name }))
  );
}

function getTodayMessages() {
  const today = new Date().toISOString().slice(0, 10);
  return appData.groups.flatMap(group =>
    getGroupMessages(group)
      .filter(message => message.date === today)
      .map(message => ({ ...message, groupName: group.name }))
  );
}

function getDailySummarySource(group = getActiveGroup()) {
  if (!group) {
    return {
      messages: [],
      badgeLabel: 'No messages',
      scopeLabel: 'No group selected'
    };
  }

  const sortedMessages = getGroupMessages(group)
    .slice()
    .sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
  const today = new Date().toISOString().slice(0, 10);
  const todayMessages = sortedMessages.filter(message => message.date === today);

  if (todayMessages.length) {
    return {
      messages: todayMessages,
      badgeLabel: `${todayMessages.length} messages today`,
      scopeLabel: 'Today'
    };
  }

  const recentMessages = sortedMessages.slice(-12);
  return {
    messages: recentMessages,
    badgeLabel: `${recentMessages.length} recent messages`,
    scopeLabel: 'Recent activity'
  };
}

function getDailySummaryCacheKey(group = getActiveGroup()) {
  if (!group) return '';
  const { messages } = getDailySummarySource(group);
  const signature = messages.map(message => [
    message.channelId || '',
    message.sender || '',
    message.text || '',
    message.createdAt || '',
    message.date || '',
    message.time || ''
  ].join('|')).join('||');
  return `${group.id}:${messages.length}:${signature}`;
}

function formatMessagePreview(text, maxLength = 90) {
  const compact = String(text || '').replace(/\s+/g, ' ').trim();
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, maxLength - 1)}…`;
}

function getActiveGroupSummary(group = getActiveGroup()) {
  if (!group) return 'Create a group chat to start building a daily summary.';

  const { messages, scopeLabel } = getDailySummarySource(group);
  if (!messages.length) return `${group.name} has no messages yet.`;

  const latestDate = messages[messages.length - 1]?.date;
  const recentMessages = messages;
  const senders = [...new Set(recentMessages.map(message => message.sender).filter(Boolean))];
  const channels = [...new Set(recentMessages.map(message => message.channelName).filter(Boolean))];
  const mentions = recentMessages.filter(message => getMentionTargets(message.text).length > 0).length;
  const latestMessage = recentMessages[recentMessages.length - 1];

  const sentences = [
    `${group.name} had ${recentMessages.length} ${scopeLabel.toLowerCase()} message${recentMessages.length === 1 ? '' : 's'}${latestDate ? ` on ${formatShortDate(latestDate)}` : ''}.`,
    senders.length ? `${senders.join(', ')} contributed to the discussion.` : '',
    channels.length ? `Conversation happened in ${channels.map(channel => `# ${channel}`).join(', ')}.` : '',
    mentions ? `${mentions} message${mentions === 1 ? '' : 's'} included an @mention.` : '',
    latestMessage ? `Latest update: ${latestMessage.sender} said "${formatMessagePreview(latestMessage.text, 80)}"` : ''
  ].filter(Boolean);

  return sentences.join(' ');
}

function extractApiSummaryText(payload) {
  if (!payload || typeof payload !== 'object') return '';
  if (typeof payload.summary === 'string') return payload.summary.trim();
  return '';
}

async function fetchDailySummaryForGroup(group = getActiveGroup()) {
  if (!group) return '';

  const cacheKey = getDailySummaryCacheKey(group);
  if (cacheKey && dailySummaryCache[cacheKey]) {
    dailySummaryError = '';
    dailySummaryFailedKey = '';
    return dailySummaryCache[cacheKey];
  }

  const { messages } = getDailySummarySource(group);
  if (!messages.length) return `${group.name} has no messages yet.`;

  dailySummaryLoading = true;
  dailySummaryError = '';
  dailySummaryFailedKey = '';
  renderChatUtilityPanel();

  try {
    const response = await fetch('/api/daily-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        groupName: group.name,
        scope: getDailySummarySource(group).scopeLabel,
        messages: messages.map(message => ({
          sender: message.sender,
          text: message.text,
          channelName: message.channelName,
          time: message.time,
          date: message.date
        }))
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error || 'Daily summary is unavailable right now.');
    }

    const summary = extractApiSummaryText(payload);
    if (!summary) {
      throw new Error('The summary service returned an empty result.');
    }

    if (cacheKey) dailySummaryCache[cacheKey] = summary;
    return summary;
  } catch (error) {
    dailySummaryError = error.message || 'Daily summary is unavailable right now.';
    dailySummaryFailedKey = cacheKey;
    return '';
  } finally {
    dailySummaryLoading = false;
    renderChatUtilityPanel();
  }
}

function ensureDailySummary() {
  if (activeChatUtility !== 'summary') return;
  const activeGroup = getActiveGroup();
  if (!activeGroup || dailySummaryLoading) return;

  const cacheKey = getDailySummaryCacheKey(activeGroup);
  if (cacheKey && dailySummaryCache[cacheKey]) {
    dailySummaryError = '';
    return;
  }
  if (cacheKey && cacheKey === dailySummaryFailedKey) return;

  fetchDailySummaryForGroup(activeGroup);
}

function syncChatModeVisibility() {
  $('#chatMainView').classList.toggle('hidden', activeChatUtility !== 'chat');
}

function renderChat() {
  const activeGroup = getActiveGroup();
  const groupMessages = getGroupMessages(activeGroup);
  $('#openAddMemberBtn').disabled = !activeGroup;

  if (chatLoadError) {
    $('#groupList').innerHTML = `<p class="muted">${escapeHtml(chatLoadError)}</p>`;
    $('#chatTitle').textContent = 'Group Chat';
    $('#chatGroupLabel').textContent = 'Database connection needs attention';
    $('#messageCountBadge').textContent = '0 messages';
    $('#chatMessages').innerHTML = `<p class="muted">Check your Supabase chat tables and policies, then refresh.</p>`;
    renderChatUtilityPanel();
    syncChatUtilityButtons();
    syncChatModeVisibility();
    return;
  }

  if (chatLoading && supabaseClient && !appData.groups.length) {
    $('#groupList').innerHTML = '<p class="muted">Loading groups...</p>';
    $('#chatTitle').textContent = 'Group Chat';
    $('#chatGroupLabel').textContent = 'Loading Supabase messages';
    $('#messageCountBadge').textContent = '0 messages';
    $('#chatMessages').innerHTML = '<p class="muted">Fetching messages...</p>';
    renderChatUtilityPanel();
    syncChatUtilityButtons();
    syncChatModeVisibility();
    return;
  }

  if (!activeGroup) {
    $('#groupList').innerHTML = '<p class="muted">No groups yet. Create one to start chatting.</p>';
    $('#chatTitle').textContent = 'No group selected';
    $('#chatGroupLabel').textContent = 'Create a group to begin';
    $('#messageCountBadge').textContent = '0 messages';
    $('#chatMessages').innerHTML = '<p class="muted">Messages will appear here after a group is created.</p>';
    renderChatUtilityPanel();
    syncChatUtilityButtons();
    syncChatModeVisibility();
    return;
  }

  $('#groupList').innerHTML = appData.groups.map(group => `
    <button class="group-item ${group.id === activeGroupId ? 'active' : ''}" data-group-id="${group.id}">
      <strong>${escapeHtml(group.name)}</strong><br />
      <small class="muted">${getGroupMessages(group).length} messages</small>
    </button>
  `).join('');

  $('#chatTitle').textContent = activeGroup.name;
  $('#chatGroupLabel').textContent = 'All group messages';
  $('#messageCountBadge').textContent = `${groupMessages.length} messages`;
  $('#chatMessages').innerHTML = groupMessages.map(msg => `
    <div class="message ${isCurrentUserSender(msg.sender) ? 'self' : ''}">
      <span class="message-channel"># ${escapeHtml(msg.channelName)}</span>
      <strong>${escapeHtml(msg.sender)}</strong>
      <div>${escapeHtml(msg.text)}</div>
      <small>${escapeHtml(msg.time)}</small>
    </div>
  `).join('');
  renderChatUtilityPanel();
  syncChatUtilityButtons();
  syncChatModeVisibility();

  $all('.group-item').forEach(btn => {
    btn.addEventListener('click', () => {
      activeGroupId = btn.dataset.groupId;
      activeChannelId = getActiveGroup()?.channels[0]?.id || null;
      loadedCallsGroupId = null;
      loadedTasksGroupId = null;
      selectedCallId = null;
      renderChat();
      loadTeamMembersForActiveGroup();
      loadGroupCallsForActiveGroup();
      loadTasksForActiveGroup();
    });
  });
}

function renderChatUtilityPanel() {
  const panel = $('#chatUtilityPanel');
  const activeGroup = getActiveGroup();

  if (activeChatUtility === 'chat') {
    panel.innerHTML = '';
    panel.classList.add('hidden');
    return;
  }

  panel.classList.remove('hidden');

  if (!activeGroup) {
    panel.innerHTML = `
      <div class="chat-utility-card">
        <p class="chat-utility-summary">Create a group chat to use reminders and summaries.</p>
      </div>
    `;
    return;
  }

  if (activeChatUtility === 'summary') {
    const { badgeLabel } = getDailySummarySource(activeGroup);
    const cacheKey = getDailySummaryCacheKey(activeGroup);
    const cachedSummary = cacheKey ? dailySummaryCache[cacheKey] : '';
    const summaryText = cachedSummary || getActiveGroupSummary(activeGroup);
    const helperText = dailySummaryLoading
      ? 'Writing the summary with ChatGPT…'
      : dailySummaryError
        ? `${dailySummaryError} Showing the local summary instead.`
        : 'Generated from the latest group chat activity.';
    panel.innerHTML = `
      <div class="chat-utility-card">
        <div class="chat-utility-header">
          <strong>Daily Summary</strong>
          <span class="badge">${escapeHtml(badgeLabel)}</span>
        </div>
        <p class="chat-utility-meta">${escapeHtml(helperText)}</p>
        <p class="chat-utility-summary">
          ${escapeHtml(summaryText)}
        </p>
      </div>
    `;
    ensureDailySummary();
    return;
  }

  const reminders = getMentionMessages().filter(message => message.groupName === activeGroup.name);
  panel.innerHTML = `
    <div class="chat-utility-card">
      <div class="chat-utility-header">
        <strong>Personal Reminder</strong>
        <span class="badge">${reminders.length} mentions</span>
      </div>
      <div class="chat-utility-list">
        ${reminders.length ? reminders.map(message => `
          <div class="chat-utility-item">
            <div class="chat-utility-meta">${escapeHtml(message.groupName)} · # ${escapeHtml(message.channelName)} · ${escapeHtml(message.time)}</div>
            <div><strong>${escapeHtml(message.sender)}:</strong> ${escapeHtml(message.text)}</div>
          </div>
        `).join('') : '<div class="chat-utility-item">No reminders yet. Messages that mention you with @name will appear here.</div>'}
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
  const input = $('#chatInput');

  input.addEventListener('input', () => {
    mentionSelectionIndex = 0;
    updateMentionSuggestions();
  });

  input.addEventListener('click', () => {
    updateMentionSuggestions();
  });

  input.addEventListener('keydown', e => {
    if (!mentionSuggestions.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      mentionSelectionIndex = (mentionSelectionIndex + 1) % mentionSuggestions.length;
      renderMentionSuggestions();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      mentionSelectionIndex = (mentionSelectionIndex - 1 + mentionSuggestions.length) % mentionSuggestions.length;
      renderMentionSuggestions();
      return;
    }

    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      applyMentionSuggestion(mentionSuggestions[mentionSelectionIndex]);
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      closeMentionSuggestions();
    }
  });

  $('#mentionSuggestions').addEventListener('mousedown', e => {
    const button = e.target.closest('[data-mention-index]');
    if (!button) return;
    e.preventDefault();
    applyMentionSuggestion(mentionSuggestions[Number(button.dataset.mentionIndex)]);
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.chat-input-wrap')) {
      closeMentionSuggestions();
    }
  });

  $('#chatForm').addEventListener('submit', async e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    if (supabaseClient && currentUser) {
      ensureActiveChatSelection();
      const activeGroup = getActiveGroup();
      const activeChannel = getActiveChannel();

      if (!activeGroup || !activeChannel) {
        chatLoadError = 'Create or select a group before sending a message.';
        renderChat();
        return;
      }

      try {
        await performBackendAction('send_message', {
          groupId: activeGroup.id,
          channelId: activeChannel.id,
          body: text
        });
      } catch (error) {
        chatLoadError = error.message;
        renderChat();
        return;
      }
      input.value = '';
      closeMentionSuggestions();
      chatLoadError = '';
      await loadBackendState();
      return;
    }

    getActiveChannel().messages.push({
      sender: currentUser ? currentUser.name : 'You',
      text,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      date: '2026-04-01'
    });
    input.value = '';
    closeMentionSuggestions();
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

function startOfWeek(referenceDate = new Date()) {
  const date = new Date(referenceDate);
  date.setHours(0, 0, 0, 0);
  const weekday = date.getDay();
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday;
  date.setDate(date.getDate() + mondayOffset);
  return date;
}

function buildHeatmapWeekDates() {
  const monday = startOfWeek(new Date());
  return WEEKDAYS.map((_, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    return day;
  });
}

function parseDateOnly(dateStr) {
  if (!dateStr) return null;
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

/** Days until due from this date. Blue ≥4 days away, yellow 1–3 days, due = red, after due = free. */
function heatmapDayState(deadlineDate, dayDate) {
  if (!deadlineDate) return 'free';
  const dayMs = 24 * 60 * 60 * 1000;
  const daysUntil = Math.round((deadlineDate.getTime() - dayDate.getTime()) / dayMs);
  if (daysUntil < 0) return 'free';
  if (daysUntil === 0) return 'due';
  if (daysUntil >= 4) return 'far';
  return 'urgent';
}

function renderHeatmap() {
  const members = getActiveTeamMembers();
  const activeGroup = getActiveGroup();

  if (supabaseClient && !activeGroup) {
    $('#heatmapCalendar').innerHTML = '<p class="muted">Select a team chat first to see the real deadline heatmap.</p>';
    $('#memberTimetables').innerHTML = '<p class="muted">Team workload will appear here once a team is selected.</p>';
    return;
  }

  const weekDates = buildHeatmapWeekDates();
  const headerCells = weekDates.map((day, index) => `
    <div class="heatmap-head">${WEEKDAYS[index]}, ${day.toLocaleDateString([], { day: 'numeric', month: 'short' })}</div>
  `).join('');
  const rows = members.map(member => {
    const deadlineDate = parseDateOnly(member.deadline);
    const cells = weekDates.map(dayDate => {
      const state = heatmapDayState(deadlineDate, dayDate);
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

  if (!members.length) {
    $('#heatmapCalendar').innerHTML = '<p class="muted">No team members available for this heatmap yet.</p>';
    $('#memberTimetables').innerHTML = '<p class="muted">No team workload data yet.</p>';
    return;
  }

  $('#heatmapCalendar').innerHTML = `
    <div class="heatmap-table">
      <div class="heatmap-row heatmap-row-head">
        <div class="heatmap-corner muted">Member</div>
        ${headerCells}
      </div>
      ${rows}
    </div>
  `;

  $('#memberTimetables').innerHTML = members.map(member => {
    const width = member.workload === 'High' ? 88 : member.workload === 'Medium' ? 60 : member.workload === 'Low' ? 32 : 16;
    const className = ['high', 'medium', 'low'].includes(String(member.workload).toLowerCase()) ? member.workload.toLowerCase() : 'neutral';
    return `
      <div class="timetable-card">
        <h4>${member.name}</h4>
        <p class="muted">Current task: ${member.currentTask || 'Not set'}</p>
        <div class="timetable-bars">
          <div>Workload this week</div>
          <div class="bar-track"><div class="bar-fill ${className}" style="width:${width}%"></div></div>
          <small>Deadline: ${formatShortDate(member.deadline)} · ${member.workload || 'Not set'}</small>
        </div>
      </div>
    `;
  }).join('') || '<p class="muted">No team workload data yet.</p>';
}

function bindMeeting() {
  $('#confirmMeeting').addEventListener('click', () => {
    const suggestion = computeSuggestedMeeting();
    $('#meetingFeedback').textContent = suggestion.score > 0
      ? `Meeting confirmed for ${suggestion.labelFull}.`
      : 'Add more availability before confirming a meeting.';
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
  $('#availabilityGrid').addEventListener('click', async e => {
    const cell = e.target.closest('.availability-cell.editable-cell');
    if (!cell || !meetingEditMode) return;

    const day = $('#meetingDaySelect').value || MEETING_DAYS[0];
    const slot = cell.dataset.slot;
    const editableMember = getEditableMeetingMemberName();
    const slots = meetingAvailability[day]?.[editableMember] || [];
    const nextSlots = slots.includes(slot)
      ? slots.filter(value => value !== slot)
      : [...slots, slot].sort((a, b) => timeSlots.indexOf(a) - timeSlots.indexOf(b));

    meetingAvailability[day][editableMember] = nextSlots;
    $('#meetingFeedback').textContent = `Saving your availability for ${day}...`;
    try {
      await saveCurrentUserAvailability(day, nextSlots);
      $('#meetingFeedback').textContent = `Updated your availability for ${day}.`;
    } catch (error) {
      $('#meetingFeedback').textContent = error.message || `Could not update your availability for ${day}.`;
    }
    renderAvailabilityGrid();
  });
}

function renderMeeting() {
  const days = MEETING_DAYS;
  const currentDay = $('#meetingDaySelect').value;
  $('#meetingDaySelect').innerHTML = days.map(day => `<option value="${day}">${day}</option>`).join('');
  $('#meetingDaySelect').value = days.includes(currentDay) ? currentDay : days[0];
  renderAvailabilityGrid();
  syncMeetingEditState();
}

function renderAvailabilityGrid() {
  const activeGroup = getActiveGroup();
  if (supabaseClient && !activeGroup) {
    $('#availabilityGrid').innerHTML = '<p class="muted">Select a team chat first to compare real meeting availability.</p>';
    updateMeetingSuggestion();
    return;
  }

  if (meetingAvailabilityLoading) {
    $('#availabilityGrid').innerHTML = '<p class="muted">Loading team availability...</p>';
    updateMeetingSuggestion();
    return;
  }

  const day = $('#meetingDaySelect').value || MEETING_DAYS[0];
  const dayData = meetingAvailability[day] || {};
  const editableMember = getEditableMeetingMemberName();
  const memberNames = Object.keys(dayData).sort((a, b) => {
    if (a === editableMember) return 1;
    if (b === editableMember) return -1;
    return 0;
  });

  if (!memberNames.length) {
    $('#availabilityGrid').innerHTML = '<p class="muted">No team members available yet.</p>';
    updateMeetingSuggestion();
    return;
  }

  const overlaps = timeSlots.filter(slot => memberNames.every(name => dayData[name].includes(slot)));

  let html = `<div class="availability-header"><div class="availability-cell member-label">Member</div>${timeSlots.map(slot => `<div class="availability-cell">${slotStartLabel(slot)}</div>`).join('')}</div>`;
  html += memberNames.map(name => `
    <div class="availability-row ${name === editableMember ? 'editable-member-row' : ''}">
      <div class="availability-cell member-label">${name}</div>
      ${timeSlots.map(slot => {
        const isSelected = dayData[name].includes(slot);
        const isOverlap = overlaps.includes(slot);
        const isEditable = name === editableMember && meetingEditMode;
        return `<div class="availability-cell ${isOverlap ? 'overlap' : isSelected ? 'selected' : ''} ${isEditable ? 'editable-cell' : ''}" data-slot="${slot}">${isOverlap ? '✓' : ''}</div>`;
      }).join('')}
    </div>
  `).join('');
  $('#availabilityGrid').innerHTML = html;
  $('#availabilityGrid').classList.toggle('is-editing', meetingEditMode);
  updateMeetingSuggestion();
}

function computeSuggestedMeeting() {
  const days = Object.keys(meetingAvailability);
  let best = { day: days[0] || 'Wednesday', slot: '4-5', score: 0 };
  for (const [day, memberData] of Object.entries(meetingAvailability)) {
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
  syncMeetingAvailabilityMembers();
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
  $('#callForm').addEventListener('submit', async e => {
    e.preventDefault();
    const activeGroup = getActiveGroup();
    const topic = $('#callTitle').value.trim();
    const date = $('#callDate').value;
    const time = $('#callTime').value;
    const feedback = $('#callFormFeedback');

    if (!activeGroup) {
      feedback.textContent = 'Select a group before starting a call.';
      return;
    }

    if (!topic || !date || !time) {
      feedback.textContent = 'Enter a topic, date, and time.';
      return;
    }

    const participants = getActiveTeamMembers();
    const participantNames = participants.map(member => member.name).filter(Boolean);

    feedback.textContent = 'Generating meeting questions...';
    const { questions, warning } = await generateCallQuestionsForTopic({
      topic,
      groupName: activeGroup.name,
      participantNames,
      scheduledDate: date,
      scheduledTime: time
    });

    if (supabaseClient && currentUser) {
      feedback.textContent = 'Starting the call and saving it...';

      try {
        await performBackendAction('create_call', {
          groupId: activeGroup.id,
          topic,
          date,
          time,
          generatedQuestions: questions
        });
      } catch (error) {
        feedback.textContent = error.message;
        return;
      }

      e.target.reset();
      selectedCallId = null;
      feedback.textContent = warning || 'Call started and saved.';
      await loadBackendState();
      return;
    }

    appData.scheduledCalls.push({
      id: Date.now(),
      groupId: activeGroup.id,
      title: topic,
      date,
      time,
      participantNames,
      generatedQuestions: questions
    });
    e.target.reset();
    selectedCallId = null;
    feedback.textContent = warning || 'Call saved locally.';
    renderCalls();
  });
}

function renderCalls() {
  const activeGroup = getActiveGroup();
  const calls = getCallsForActiveGroup();
  const participants = getActiveTeamMembers().map(member => member.name).filter(Boolean);
  const note = $('#callParticipantsNote');
  const feedback = $('#callFormFeedback');

  note.textContent = activeGroup
    ? `${participants.length || 0} group member${participants.length === 1 ? '' : 's'} will be included automatically.`
    : 'Select a group to start a team call.';

  if (!activeGroup) {
    $('#scheduledCalls').innerHTML = '<p class="muted">Select a group chat first, then start a team call here.</p>';
    $('#callCalendar').innerHTML = '';
    if (!feedback.textContent) feedback.textContent = '';
    return;
  }

  if (supabaseClient && loadedCallsGroupId !== activeGroup.id && !callsLoading) {
    loadGroupCallsForActiveGroup();
  }

  if (callsLoading) {
    $('#scheduledCalls').innerHTML = '<p class="muted">Loading team calls...</p>';
  } else if (callsError) {
    $('#scheduledCalls').innerHTML = `<p class="muted">${escapeHtml(callsError)}</p>`;
  } else if (!calls.length) {
    $('#scheduledCalls').innerHTML = '<p class="muted">No calls yet for this team. Start one below.</p>';
  } else {
    $('#scheduledCalls').innerHTML = calls.map(call => `
      <button class="call-item ${String(call.id) === String(selectedCallId) ? 'active' : ''}" data-call-id="${call.id}">
        <h4>${escapeHtml(call.title)}</h4>
        <div>${formatShortDate(call.date)} · ${formatTime(call.time)}</div>
        <small class="muted">${call.participantCount || call.participantNames.length} participant${(call.participantCount || call.participantNames.length) === 1 ? '' : 's'}</small>
        <div class="call-participants">${call.participantNames.map(name => `<span class="call-chip">${escapeHtml(name)}</span>`).join('')}</div>
        <div class="call-questions">
          <strong>AI questions</strong>
          <ul>
            ${call.generatedQuestions.map(question => `<li>${escapeHtml(question)}</li>`).join('')}
          </ul>
        </div>
      </button>
    `).join('');
  }

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const calendarDays = Array.from({ length: 14 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });

  $('#callCalendar').innerHTML = calendarDays.map(day => {
    const dateKey = day.toISOString().slice(0, 10);
    const matching = calls.filter(call => call.date === dateKey);
    const isSelected = matching.some(call => String(call.id) === String(selectedCallId));
    return `
      <div class="call-calendar-day ${isSelected ? 'selected' : ''}" data-date="${dateKey}">
        <strong>${day.getDate()}</strong>
        <div class="muted">${day.toLocaleDateString([], { weekday: 'short' })}</div>
        ${matching.map(call => `<div class="call-chip">${escapeHtml(call.title)}</div>`).join('')}
      </div>
    `;
  }).join('');

  $all('.call-item').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCallId = btn.dataset.callId;
      renderCalls();
    });
  });
}

async function loadTasksForActiveGroup(force = false) {
  const activeGroup = getActiveGroup();
  if (!supabaseClient || !activeGroup) {
    groupTasks = activeGroup
      ? appData.tasks
        .filter(task => String(task.groupId || activeGroup.id) === String(activeGroup.id))
        .map(normalizeTaskRecord)
      : [];
    tasksLoading = false;
    tasksError = '';
    loadedTasksGroupId = activeGroup?.id || null;
    renderTasks();
    renderDashboard();
    renderCatchupHighlights();
    return;
  }

  if (force) {
    await loadBackendState();
    return;
  }

  syncDerivedStateFromActiveGroup();
  renderTasks();
  renderDashboard();
  renderCatchupHighlights();
}

async function saveTaskStatus(taskId, status) {
  const activeGroup = getActiveGroup();
  if (!supabaseClient || !activeGroup) {
    const localTask = appData.tasks.find(task => String(task.id) === String(taskId));
    if (localTask) localTask.status = status;
    return;
  }

  await performBackendAction('update_task_status', {
    groupId: activeGroup.id,
    taskId,
    status
  });
}

function bindTasks() {
  syncMemberDependentInputs();
  $('#taskForm').addEventListener('submit', async e => {
    e.preventDefault();
    const activeGroup = getActiveGroup();
    const assignee = $('#taskAssignee').value;
    const title = $('#taskTitle').value.trim();
    const priorityRank = Number($('#taskPriority').value);
    const durationDays = Math.max(1, Number($('#taskDuration').value) || 1);
    const assigneeMember = getActiveTeamMembers().find(member => member.name === assignee);

    if (!activeGroup) {
      return;
    }

    if (supabaseClient && currentUser) {
      try {
        await performBackendAction('create_task', {
          groupId: activeGroup.id,
          title,
          assignee,
          assigneeUserId: assignee === 'N/A' ? null : assigneeMember?.id || null,
          priorityRank,
          durationDays
        });
      } catch (error) {
        tasksError = error.message;
        renderTasks();
        return;
      }

      e.target.reset();
      $('#taskPriority').value = '3';
      $('#taskDuration').value = '3';
      tasksError = '';
      await loadBackendState();
      return;
    }

    appData.tasks.push({
      id: Date.now(),
      groupId: activeGroup.id,
      title,
      assignee,
      priorityRank,
      durationDays,
      status: assignee === 'N/A' ? 'Not Assigned' : 'Not Started'
    });
    e.target.reset();
    $('#taskPriority').value = '3';
    $('#taskDuration').value = '3';
    renderTasks();
    renderDashboard();
    renderCatchupHighlights();
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
  const activeGroup = getActiveGroup();
  const tasks = getTasksForActiveGroup();

  if (supabaseClient && !activeGroup) {
    container.innerHTML = '<p class="muted">Select a team chat first to manage that team\'s tasks.</p>';
    return;
  }

  if (supabaseClient && loadedTasksGroupId !== activeGroup?.id && !tasksLoading) {
    loadTasksForActiveGroup();
  }

  if (tasksLoading) {
    container.innerHTML = '<p class="muted">Loading tasks...</p>';
    return;
  }

  if (tasksError) {
    container.innerHTML = `<p class="muted">${escapeHtml(tasksError)}</p>`;
    return;
  }

  if (!tasks.length) {
    container.innerHTML = '<p class="muted">No tasks yet. Add one on the left.</p>';
    return;
  }

  const filtered = tasks.filter(t => checklistStatusFilter === null || t.status === checklistStatusFilter);
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
    sel.addEventListener('change', async () => {
      const task = tasks.find(t => String(t.id) === String(sel.dataset.taskId));
      if (!task) return;

      if (supabaseClient) {
        try {
          await saveTaskStatus(task.id, sel.value);
          task.status = sel.value;
          groupTasks = groupTasks.map(item => String(item.id) === String(task.id) ? { ...item, status: sel.value } : item);
        } catch (error) {
          tasksError = error.message || 'Could not update the task status.';
        }
      } else {
        const localTask = appData.tasks.find(t => String(t.id) === String(task.id));
        if (localTask) localTask.status = sel.value;
      }
      renderTasks();
      renderDashboard();
      renderCatchupHighlights();
    });
  });
}

function bindCatchup() {
  syncMemberDependentInputs();
  $('#generateCatchup').addEventListener('click', async () => {
    await renderCatchupSummary();
  });
}

function getRecentMessagesForCatchup(group = getActiveGroup(), limit = 12) {
  return getGroupMessages(group)
    .slice()
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, limit);
}

function buildLocalCatchupSummary(memberName) {
  const activeGroup = getActiveGroup();
  const tasks = getTasksForActiveGroup();
  const calls = getCallsForActiveGroup();
  const memberTasks = tasks.filter(task => task.assignee === memberName).slice(0, 3);
  const recentMessages = getRecentMessagesForCatchup(activeGroup, 5);
  const nextCall = calls[0];
  const recentSenders = [...new Set(recentMessages.map(message => message.sender).filter(Boolean))];

  return [
    `${memberName} is currently catching up with ${activeGroup?.name || 'the team'}.`,
    memberTasks.length
      ? `Their active tasks include ${memberTasks.map(task => `${task.title} (${task.status})`).join(', ')}.`
      : 'No tasks are currently assigned to them in this team.',
    recentSenders.length
      ? `Recent chat activity involved ${recentSenders.join(', ')}.`
      : 'There has not been any recent chat activity yet.',
    nextCall
      ? `The next scheduled call is ${nextCall.title} on ${formatShortDate(nextCall.date)} at ${formatTime(nextCall.time)}.`
      : 'There is no scheduled team call yet.'
  ].join(' ');
}

async function renderCatchupSummary() {
  const member = $('#catchupMember').value;
  if (!member) {
    $('#catchupSummary').innerHTML = '<div class="summary-card"><p>Select a team member to generate a summary.</p></div>';
    return;
  }

  const activeGroup = getActiveGroup();
  const memberRecord = getActiveTeamMembers().find(item => item.name === member);
  const tasks = getTasksForActiveGroup();
  const calls = getCallsForActiveGroup();
  const messages = getRecentMessagesForCatchup(activeGroup, 12);

  catchupLoading = true;
  catchupError = '';
  $('#catchupSummary').innerHTML = `
    <div class="summary-card">
      <h4>Catch-up for ${escapeHtml(member)}</h4>
      <p>Writing the catch-up with ChatGPT...</p>
    </div>
  `;

  try {
    const response = await fetch('/api/catchup-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        memberName: member,
        memberEmail: memberRecord?.email || '',
        groupName: activeGroup?.name || '',
        tasks: tasks.map(task => ({
          title: task.title,
          assignee: task.assignee,
          priorityRank: task.priorityRank,
          durationDays: task.durationDays,
          status: task.status
        })),
        calls: calls.map(call => ({
          title: call.title,
          date: call.date,
          time: call.time,
          participantNames: call.participantNames,
          generatedQuestions: call.generatedQuestions
        })),
        messages: messages.map(message => ({
          sender: message.sender,
          text: message.text,
          channelName: message.channelName,
          date: message.date,
          time: message.time
        }))
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error || 'Could not generate the catch-up summary.');
    }

    const summary = String(payload?.summary || '').trim();
    if (!summary) {
      throw new Error('The catch-up service returned an empty summary.');
    }

    $('#catchupSummary').innerHTML = `
      <div class="summary-card">
        <h4>Catch-up for ${escapeHtml(member)}</h4>
        <p>${escapeHtml(summary)}</p>
      </div>
    `;
  } catch (error) {
    catchupError = error.message || 'Could not generate the catch-up summary.';
    $('#catchupSummary').innerHTML = `
      <div class="summary-card">
        <h4>Catch-up for ${escapeHtml(member)}</h4>
        <p>${escapeHtml(catchupError)} Showing the local summary instead.</p>
        <p>${escapeHtml(buildLocalCatchupSummary(member))}</p>
      </div>
    `;
  } finally {
    catchupLoading = false;
  }
}

function renderCatchupHighlights() {
  const activeGroup = getActiveGroup();
  const tasks = getTasksForActiveGroup();
  const calls = getCallsForActiveGroup();
  const messages = getRecentMessagesForCatchup(activeGroup, 4);
  const highlightedTask = tasks.find(task => task.status === 'In Progress') || tasks[0];
  const highlightedCall = calls[0];
  const latestMessage = messages[0];

  $('#recentHighlights').innerHTML = `
    <div class="insight-item"><strong>Chat summary:</strong> ${latestMessage ? `${escapeHtml(latestMessage.sender)} recently said "${escapeHtml(formatMessagePreview(latestMessage.text, 90))}" in # ${escapeHtml(latestMessage.channelName)}.` : 'No recent team chat yet.'}</div>
    <div class="insight-item"><strong>Task movement:</strong> ${highlightedTask ? `${escapeHtml(highlightedTask.title)} is ${escapeHtml(highlightedTask.status.toLowerCase())} with priority ${highlightedTask.priorityRank}.` : 'No tasks have been added for this team yet.'}</div>
    <div class="insight-item"><strong>Meeting note:</strong> ${highlightedCall ? `${escapeHtml(highlightedCall.title)} is scheduled for ${formatShortDate(highlightedCall.date)} at ${formatTime(highlightedCall.time)}.` : 'No team calls have been scheduled yet.'}</div>
    <div class="insight-item"><strong>Reminder logic:</strong> ${getMentionMessages().filter(message => message.groupName === activeGroup?.name).length} message${getMentionMessages().filter(message => message.groupName === activeGroup?.name).length === 1 ? '' : 's'} currently mention someone in this group.</div>
  `;
}

function bindGroupModal() {
  const openers = ['#openCreateGroupInline'];
  openers.forEach(id => $(id).addEventListener('click', () => {
    renderGroupMemberPicker();
    $('#groupModal').classList.remove('hidden');
  }));
  $('#closeGroupModal').addEventListener('click', () => $('#groupModal').classList.add('hidden'));
  $('#groupModal').addEventListener('click', e => {
    if (e.target.id === 'groupModal') $('#groupModal').classList.add('hidden');
  });
  $('#groupForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name = $('#groupNameInput').value.trim();
    const topic = $('#groupTopicInput').value.trim() || 'General';

    if (supabaseClient && currentUser) {
      const selectedMemberIds = [
        ...$all('.group-member-checkbox:checked').map(input => input.value)
      ].filter(Boolean);

      try {
        const payload = await performBackendAction('create_group', {
          name,
          topic,
          memberIds: selectedMemberIds
        });
        activeGroupId = payload.groupId || null;
        activeChannelId = payload.channelId || null;
      } catch (error) {
        chatLoadError = error.message;
        renderChat();
        return;
      }
      chatLoadError = '';
      ensureActiveChatSelection();
      e.target.reset();
      $('#groupModal').classList.add('hidden');
      await loadBackendState();
      return;
    }

    const newGroup = {
      id: Date.now(),
      name,
      createdBy: currentUser?.id || null,
      leaderId: currentUser?.id || null,
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

function bindAddMemberModal() {
  $('#openAddMemberBtn').addEventListener('click', () => {
    openAddMemberModal();
  });
  $('#openAddMemberFromTeam').addEventListener('click', () => {
    openAddMemberModal();
  });

  $('#closeAddMemberModal').addEventListener('click', () => $('#addMemberModal').classList.add('hidden'));
  $('#addMemberModal').addEventListener('click', e => {
    if (e.target.id === 'addMemberModal') $('#addMemberModal').classList.add('hidden');
  });

  $('#addMemberForm').addEventListener('submit', async e => {
    e.preventDefault();
    const activeGroup = getActiveGroup();
    const email = $('#addMemberEmail').value.trim().toLowerCase();

    if (!currentUser || !activeGroup) {
      $('#addMemberFeedback').textContent = 'Select a group and sign in before adding members.';
      return;
    }

    $('#addMemberFeedback').textContent = 'Adding member...';

    if (!supabaseClient) {
      const localUser = getDemoUsers().find(user => user.email.toLowerCase() === email);
      if (!localUser) {
        $('#addMemberFeedback').textContent = 'No demo user found with that email.';
        return;
      }

      const alreadyPresent = appData.members.some(member => member.email.toLowerCase() === email);
      if (!alreadyPresent) {
        appData.members.push(normalizeTeamMember(localUser));
      }

      $('#addMemberFeedback').textContent = `${localUser.name} added.`;
      $('#addMemberForm').reset();
      renderMemberDrivenViews();
      window.setTimeout(() => {
        $('#addMemberModal').classList.add('hidden');
        $('#addMemberFeedback').textContent = '';
      }, 700);
      return;
    }

    try {
      const addedMember = await performBackendAction('add_member_by_email', {
        groupId: activeGroup.id,
        email
      });
      $('#addMemberFeedback').textContent = `${addedMember?.added_full_name || addedMember?.added_email || email} added.`;
    } catch (error) {
      $('#addMemberFeedback').textContent = error.message || 'Could not add that member.';
      return;
    }
    $('#addMemberForm').reset();
    await loadBackendState();
    window.setTimeout(() => {
      $('#addMemberModal').classList.add('hidden');
      $('#addMemberFeedback').textContent = '';
    }, 700);
  });
}

function openAddMemberModal() {
    const activeGroup = getActiveGroup();
    if (!activeGroup) {
      chatLoadError = 'Create or select a group before adding members.';
      renderChat();
      return;
    }

    $('#addMemberFeedback').textContent = '';
    $('#addMemberModal').classList.remove('hidden');
}

function bindMembersDirectory() {
  $('#memberDirectory').addEventListener('click', async e => {
    const button = e.target.closest('[data-action]');
    if (!button) return;

    const form = button.closest('.member-editor');
    if (!form) return;

    const feedback = form.querySelector('.member-save-feedback');
    const memberId = form.dataset.memberId;
    const activeGroup = getActiveGroup();

    if (!supabaseClient || !currentUser || !activeGroup) {
      feedback.textContent = 'Open a real group to manage team members.';
      return;
    }

    if (button.dataset.action === 'set-leader') {
      feedback.textContent = 'Updating leader...';
      try {
        await performBackendAction('set_leader', {
          groupId: activeGroup.id,
          userId: memberId
        });
      } catch (error) {
        feedback.textContent = error.message;
        return;
      }

      await loadBackendState();
      feedback.textContent = 'Leader updated.';
      return;
    }

    if (button.dataset.action === 'remove-member') {
      feedback.textContent = 'Removing member...';
      try {
        await performBackendAction('remove_member', {
          groupId: activeGroup.id,
          userId: memberId
        });
      } catch (error) {
        feedback.textContent = error.message;
        return;
      }

      await loadBackendState();
      feedback.textContent = 'Member removed.';
    }
  });

  $('#memberDirectory').addEventListener('submit', async e => {
    const form = e.target.closest('.member-editor');
    if (!form) return;
    e.preventDefault();

    const feedback = form.querySelector('.member-save-feedback');
    const memberId = form.dataset.memberId;
    const members = getActiveTeamMembers();
    const member = members.find(item => String(item.id) === String(memberId));

    if (!member) {
      feedback.textContent = 'Could not find that team member.';
      return;
    }

    const payload = {
      role: form.elements.role.value.trim(),
      currentTask: form.elements.currentTask.value.trim(),
      stage: form.elements.stage.value,
      workload: form.elements.workload.value,
      deadline: form.elements.deadline.value
    };

    feedback.textContent = 'Saving...';

    if (!supabaseClient || !currentUser) {
      const target = appData.members.find(item => String(item.id) === String(memberId));
      if (target) Object.assign(target, payload);
      feedback.textContent = 'Saved locally.';
      renderMemberDrivenViews();
      return;
    }

    const activeGroup = getActiveGroup();
    if (!activeGroup) {
      feedback.textContent = 'Select a team before saving member details.';
      return;
    }

    try {
      await performBackendAction('save_member_profile', {
        groupId: activeGroup.id,
        userId: memberId,
        role: payload.role,
        currentTask: payload.currentTask,
        stage: payload.stage,
        workload: payload.workload,
        deadline: payload.deadline || null
      });
      await loadBackendState();
      feedback.textContent = 'Saved.';
      renderMemberDrivenViews();
    } catch (error) {
      feedback.textContent = error.message;
      return;
    }
  });
}

function formatShortDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
}
function formatChatTimestamp(dateStr) {
  if (!dateStr) return 'Now';
  return new Date(dateStr).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
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
