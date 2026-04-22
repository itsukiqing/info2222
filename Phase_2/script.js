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
let teamMembers = [];
let teamMembersLoading = false;
let teamMembersError = '';
let loadedTeamMembersGroupId = null;

const TASK_STATUSES = ['Not Started', 'In Progress', 'Done', 'Not Assigned'];
const MEMBER_STAGES = ['Not set', 'To Do', 'In Progress', 'Review', 'Done'];
const MEMBER_WORKLOADS = ['Not set', 'Low', 'Medium', 'High'];

let checklistSortBy = 'priority';
let checklistSortAscending = true;
let checklistStatusFilter = null;
let checklistFilterMenuOpen = false;
let meetingEditMode = false;
let activeChatUtility = 'chat';
const editableMeetingMember = 'You';

const sectionsMeta = {
  dashboard: ['Dashboard', 'Overview of members, workload, and current progress.'],
  members: ['Team Members', 'Contact details for the current project team.'],
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
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
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
    navigateToSection('dashboard');
    syncAuthView();
  });

  $('#toggleAuthMode').addEventListener('click', () => {
    authFormMode = authFormMode === 'login' ? 'register' : 'login';
    $('#loginFeedback').textContent = '';
    syncAuthFormMode();
  });
}

function initSupabaseClient() {
  const config = window.UNIGROUP_SUPABASE_CONFIG || {};
  const hasRealConfig =
    config.url &&
    config.anonKey &&
    config.url !== SUPABASE_PLACEHOLDER_URL &&
    config.anonKey !== SUPABASE_PLACEHOLDER_ANON_KEY;

  if (!hasRealConfig || !window.supabase) {
    authMode = 'demo';
    return;
  }

  supabaseClient = window.supabase.createClient(config.url, config.anonKey);
  authMode = 'supabase';
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    console.debug(`[auth] state changed: ${_event}`);

    window.setTimeout(async () => {
      const profile = session ? await getProfileForUserId(session.user.id) : null;
      currentUser = getUserFromSupabaseSession(session, profile);
      if (currentUser) initDatabaseChat();
      else teardownDatabaseChat();
      renderChat();
      syncAuthView();
    }, 0);
  });
}

async function signInWithSupabase(email, password) {
  $('#loginFeedback').textContent = 'Signing in...';
  let authTimerRunning = false;
  let profileTimerRunning = false;

  try {
    console.time('auth:signInWithPassword');
    authTimerRunning = true;
    const { data, error } = await withTimeout(
      supabaseClient.auth.signInWithPassword({ email, password }),
      SUPABASE_AUTH_TIMEOUT_MS,
      'Sign in timed out. Check your internet connection and Supabase project settings.'
    );
    console.timeEnd('auth:signInWithPassword');
    authTimerRunning = false;

    if (error) {
      $('#loginFeedback').textContent = error.message;
      return;
    }

    if (!data.session) {
      $('#loginFeedback').textContent = 'Sign in did not return a session. Check Supabase Auth settings.';
      return;
    }

    console.time('auth:profileFetch');
    profileTimerRunning = true;
    const profile = await withTimeout(
      getProfileForUserId(data.session.user.id),
      SUPABASE_AUTH_TIMEOUT_MS,
      'Profile lookup timed out. Check the profiles table policy.'
    );
    console.timeEnd('auth:profileFetch');
    profileTimerRunning = false;
    currentUser = getUserFromSupabaseSession(data.session, profile);
    $('#loginForm').reset();
    $('#loginFeedback').textContent = '';
    renderChat();
    syncAuthView();
    initDatabaseChat();
  } catch (error) {
    if (authTimerRunning) console.timeEnd('auth:signInWithPassword');
    if (profileTimerRunning) console.timeEnd('auth:profileFetch');
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
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName,
        email
      }
    }
  });

  if (error) {
    $('#loginFeedback').textContent = error.message;
    return;
  }

  $('#loginForm').reset();

  if (!data.session) {
    $('#loginFeedback').textContent = 'Account created, but Supabase email confirmation is still enabled. Turn off Confirm email to auto-login after register.';
    authFormMode = 'login';
    syncAuthFormMode();
    return;
  }

  const profileSaved = await saveSupabaseProfile(data.user.id, username, email, fullName);
  if (!profileSaved) {
    $('#loginFeedback').textContent = 'Account created, but the profile was not saved. Check the profiles table policies.';
    return;
  }

  currentUser = getUserFromSupabaseSession(data.session, {
    id: data.user.id,
    username,
    email,
    full_name: fullName,
    role: 'Team member'
  });
  $('#loginFeedback').textContent = '';
  renderChat();
  syncAuthView();
  initDatabaseChat();
}

async function saveSupabaseProfile(id, username, email, fullName) {
  const { error } = await supabaseClient
    .from('profiles')
    .upsert(
      {
        id,
        username,
        email,
        full_name: fullName
      },
      { onConflict: 'id' }
    );

  if (error) {
    console.warn('Could not save profile after signup:', error.message);
    return false;
  }

  return true;
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
    const { data, error } = await supabaseClient.auth.getSession();
    const profile = !error && data.session ? await getProfileForUserId(data.session.user.id) : null;
    currentUser = error ? null : getUserFromSupabaseSession(data.session, profile);
    if (currentUser) initDatabaseChat();
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

async function getProfileForUserId(id) {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('id, username, email, full_name, role')
    .eq('id', id)
    .maybeSingle();

  if (error) return null;
  return data || null;
}

function getUserFromSupabaseSession(session, profile = null) {
  if (!session || !session.user) return null;
  const user = session.user;
  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Student';

  return {
    id: user.id,
    username: profile?.username || user.user_metadata?.username || '',
    name: displayName,
    email: profile?.email || user.email || 'Signed in',
    role: profile?.role || user.user_metadata?.role || 'Team member'
  };
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

  if (authMode === 'supabase') {
    hint.innerHTML = `
      <strong>Supabase Auth</strong>
      <span>Log in or register with email and password.</span>
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

  const rpcPayload = {
    p_group_id: activeGroup.id,
    p_user_id: currentUser.id,
    p_role: activeMember?.role || '',
    p_current_task: activeMember?.currentTask || '',
    p_stage: activeMember?.stage || 'Not set',
    p_workload: activeMember?.workload || 'Not set',
    p_deadline: normalizedDeadline
  };

  const { data, error } = await supabaseClient.rpc('upsert_chat_group_member_profile', rpcPayload);

  if (error) {
    const { error: fallbackError } = await supabaseClient
      .from('chat_group_member_profiles')
      .upsert({
        group_id: activeGroup.id,
        user_id: currentUser.id,
        role: activeMember?.role || null,
        current_task: activeMember?.currentTask || null,
        stage: activeMember?.stage || 'Not set',
        workload: activeMember?.workload || 'Not set',
        deadline: normalizedDeadline,
        updated_by: currentUser.id,
        updated_at: new Date().toISOString()
      }, { onConflict: 'group_id,user_id' });

    if (fallbackError) {
      throw error;
    }

    await loadTeamMembersForActiveGroup();
    return;
  }

  const savedMember = normalizeTeamMember(Array.isArray(data) ? data[0] : data);
  teamMembers = teamMembers.map(member => String(member.id) === String(currentUser.id) ? savedMember : member);
}

function renderDashboard() {
  const members = getActiveTeamMembers();
  const activeGroup = getActiveGroup();

  $('#statMembers').textContent = members.length;
  $('#statTasks').textContent = appData.tasks.length;
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

  $('#taskSnapshot').innerHTML = appData.tasks.slice(0, 5).map(task => `
    <div class="snapshot-item">
      <strong>${task.title}</strong>
      <p class="muted">${task.assignee} · ${task.status} · P${task.priorityRank}</p>
      <small>Duration: ${task.durationDays} days</small>
    </div>
  `).join('');
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
  console.time('chat:init');
  try {
    await loadChatMemberDirectory();
    await loadChatFromDatabase();
    subscribeToChatChanges();
  } finally {
    chatInitInProgress = false;
    console.timeEnd('chat:init');
  }
}

async function loadTeamMembersForActiveGroup() {
  if (!supabaseClient || !currentUser) {
    teamMembers = [...appData.members];
    teamMembersError = '';
    teamMembersLoading = false;
    loadedTeamMembersGroupId = null;
    renderMemberDrivenViews();
    return;
  }

  const activeGroup = getActiveGroup();
  if (!activeGroup) {
    teamMembers = [];
    teamMembersError = '';
    teamMembersLoading = false;
    loadedTeamMembersGroupId = null;
    renderMemberDrivenViews();
    return;
  }

  teamMembersLoading = true;
  teamMembersError = '';
  loadedTeamMembersGroupId = activeGroup.id;
  renderMemberDrivenViews();

  const { data, error } = await supabaseClient.rpc('get_chat_group_members', {
    target_group_id: activeGroup.id
  });

  if (error) {
    if (isMissingRpcError(error, 'get_chat_group_members')) {
      try {
        const fallbackMembers = await loadTeamMembersFromTables(activeGroup.id);
        if (loadedTeamMembersGroupId !== activeGroup.id) return;
        teamMembers = fallbackMembers;
        teamMembersError = fallbackMembers.length
          ? ''
          : 'Team members RPC is not installed yet. Showing what could be read from the current tables.';
        teamMembersLoading = false;
        renderMemberDrivenViews();
        return;
      } catch (fallbackError) {
        teamMembers = [];
        teamMembersError = 'Team members RPC is missing in Supabase, and the fallback table query also failed.';
        teamMembersLoading = false;
        renderMemberDrivenViews();
        return;
      }
    }

    teamMembers = [];
    teamMembersError = error.message || 'Could not load team members.';
    teamMembersLoading = false;
    renderMemberDrivenViews();
    return;
  }

  if (loadedTeamMembersGroupId !== activeGroup.id) return;

  teamMembers = (data || []).map(normalizeTeamMember);
  teamMembersLoading = false;
  teamMembersError = '';
  renderMemberDrivenViews();
}

async function loadChatMemberDirectory() {
  if (!supabaseClient || !currentUser) return;

  const { data, error } = await supabaseClient
    .from('profiles')
    .select('id, username, full_name, email')
    .order('full_name', { ascending: true });

  if (error) {
    console.warn('Could not load chat member directory:', error.message);
    availableChatMembers = [];
    renderGroupMemberPicker();
    return;
  }

  availableChatMembers = data || [];
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
    picker.innerHTML = '<p class="member-picker-empty">No other users found yet.</p>';
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
  if (!supabaseClient || !chatSubscription) return;
  supabaseClient.removeChannel(chatSubscription);
  chatSubscription = null;
}

function subscribeToChatChanges() {
  if (!supabaseClient || chatSubscription) return;

  const reloadChat = debounce(() => {
    loadChatFromDatabase();
  }, 250);

  chatSubscription = supabaseClient
    .channel('unigroup-chat-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_groups' }, reloadChat)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_group_members' }, reloadChat)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_group_member_profiles' }, reloadChat)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_channels' }, reloadChat)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, reloadChat)
    .subscribe();
}

async function loadChatFromDatabase() {
  if (!supabaseClient || !currentUser) return;

  const loadVersion = ++chatLoadVersion;
  chatLoading = true;
  chatLoadError = '';
  console.time('chat:loadFromDatabase');

  try {
    const { data: chatState, error: chatStateError } = await supabaseClient.rpc('get_my_chat_state');
    if (chatStateError) throw chatStateError;

    const groups = chatState?.groups || [];
    const channels = chatState?.channels || [];
    const messages = chatState?.messages || [];

    if (!groups.length) {
      if (loadVersion !== chatLoadVersion) return;
      appData.groups = [];
      activeGroupId = null;
      activeChannelId = null;
      await loadTeamMembersForActiveGroup();
      return;
    }

    if (loadVersion !== chatLoadVersion) return;
    appData.groups = mapChatRowsToGroups(groups, channels, messages);
    ensureActiveChatSelection();
    await loadTeamMembersForActiveGroup();
  } catch (error) {
    if (loadVersion !== chatLoadVersion) return;
    chatLoadError = error.message || 'Could not load chat from Supabase.';
    console.error('Chat load failed:', error);
  } finally {
    if (loadVersion !== chatLoadVersion) return;
    chatLoading = false;
    console.timeEnd('chat:loadFromDatabase');
    renderChat();
  }
}

function mapChatRowsToGroups(groups, channels, messages) {
  const channelsByGroup = channels.reduce((acc, channel) => {
    if (!acc[channel.group_id]) acc[channel.group_id] = [];
    acc[channel.group_id].push(channel);
    return acc;
  }, {});

  const messagesByChannel = messages.reduce((acc, message) => {
    if (!acc[message.channel_id]) acc[message.channel_id] = [];
    acc[message.channel_id].push(message);
    return acc;
  }, {});

  return groups.map(group => ({
    id: group.id,
    name: group.name,
    createdBy: group.created_by || null,
    leaderId: group.leader_id || group.created_by || null,
    channels: (channelsByGroup[group.id] || []).map(channel => ({
      id: channel.id,
      name: channel.name,
      messages: (messagesByChannel[channel.id] || []).map(message => ({
        id: message.id,
        senderId: message.sender_id,
        sender: message.sender_name,
        text: message.body,
        time: formatChatTimestamp(message.created_at),
        date: message.created_at.slice(0, 10),
        createdAt: message.created_at
      }))
    }))
  }));
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
  if (!group) return 'Create a group chat to start building a daily summary.';
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
      renderChat();
      loadTeamMembersForActiveGroup();
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
    const todayMessages = getTodayMessages().filter(message => message.groupName === activeGroup.name);
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

  const reminders = getMentionMessages().filter(message => message.groupName === activeGroup.name);
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
  $('#chatForm').addEventListener('submit', async e => {
    e.preventDefault();
    const input = $('#chatInput');
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

      const { data: messageData, error } = await supabaseClient.rpc('send_chat_message', {
        target_group_id: activeGroup.id,
        target_channel_id: activeChannel.id,
        message_body: text,
        sender_display_name: currentUser.name
      });

      if (error) {
        chatLoadError = error.message;
        renderChat();
        return;
      }

      const createdMessage = Array.isArray(messageData) ? messageData[0] : messageData;
      chatLoadVersion += 1;
      activeChannel.messages.push({
        id: createdMessage?.message_id || `local-${Date.now()}`,
        senderId: currentUser.id,
        sender: currentUser.name,
        text,
        time: formatChatTimestamp(createdMessage?.created_at || new Date().toISOString()),
        date: (createdMessage?.created_at || new Date().toISOString()).slice(0, 10),
        createdAt: createdMessage?.created_at || new Date().toISOString(),
        channelId: activeChannel.id,
        channelName: activeChannel.name
      });
      input.value = '';
      chatLoadError = '';
      renderChat();
      loadChatFromDatabase();
      return;
    }

    getActiveChannel().messages.push({
      sender: currentUser ? currentUser.name : 'You',
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
  syncMemberDependentInputs();
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
  syncMemberDependentInputs();
  $('#generateCatchup').addEventListener('click', renderCatchupSummary);
}

function renderCatchupSummary() {
  const member = $('#catchupMember').value;
  if (!member) {
    $('#catchupSummary').innerHTML = '<div class="summary-card"><p>Select a team member to generate a summary.</p></div>';
    return;
  }
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
    const topic = $('#groupTopicInput').value.trim();

    if (supabaseClient && currentUser) {
      const selectedMemberIds = [
        ...$all('.group-member-checkbox:checked').map(input => input.value)
      ].filter(Boolean);

      const { data: groupData, error: groupError } = await supabaseClient.rpc('create_chat_group', {
        group_name: name,
        first_channel_name: topic,
        member_ids: selectedMemberIds
      });

      if (groupError) {
        chatLoadError = groupError.message;
        renderChat();
        return;
      }

      const createdGroup = Array.isArray(groupData) ? groupData[0] : groupData;
      chatLoadVersion += 1;
      appData.groups.unshift({
        id: createdGroup?.group_id,
        name,
        createdBy: currentUser.id,
        leaderId: currentUser.id,
        channels: [
          {
            id: createdGroup?.channel_id,
            name: topic,
            messages: [
              {
                id: `local-${Date.now()}`,
                senderId: currentUser.id,
                sender: 'System',
                text: `Welcome to ${name}.`,
                time: 'Now',
                date: new Date().toISOString().slice(0, 10),
                createdAt: new Date().toISOString()
              }
            ]
          }
        ]
      });

      activeGroupId = createdGroup?.group_id || null;
      activeChannelId = createdGroup?.channel_id || null;
      chatLoadError = '';
      ensureActiveChatSelection();
      e.target.reset();
      $('#groupModal').classList.add('hidden');
      renderChat();
      await loadChatFromDatabase();
      ensureActiveChatSelection();
      await loadTeamMembersForActiveGroup();
      renderChat();
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

    let addedMember = null;

    try {
      const { data, error } = await supabaseClient.rpc('add_chat_group_member_by_email', {
        target_group_id: activeGroup.id,
        member_email: email
      });

      if (error) {
        if (isMissingRpcError(error, 'add_chat_group_member_by_email')) {
          addedMember = await addMemberByEmailFallback(activeGroup.id, email);
        } else {
          throw error;
        }
      } else {
        addedMember = Array.isArray(data) ? data[0] : data;
      }
    } catch (error) {
      $('#addMemberFeedback').textContent = error.message || 'Could not add that member.';
      return;
    }

    $('#addMemberFeedback').textContent = `${addedMember?.added_full_name || addedMember?.added_email || email} added.`;
    $('#addMemberForm').reset();
    chatLoadVersion += 1;
    loadChatMemberDirectory();
    await loadChatFromDatabase();
    await loadTeamMembersForActiveGroup();
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
      const { error } = await supabaseClient.rpc('set_chat_group_leader', {
        target_group_id: activeGroup.id,
        target_user_id: memberId
      });

      if (error) {
        if (isMissingRpcError(error, 'set_chat_group_leader')) {
          feedback.textContent = 'Leader management is not installed in Supabase yet. Re-run supabase-chat-schema.sql.';
          return;
        }
        feedback.textContent = error.message;
        return;
      }

      await loadChatFromDatabase();
      await loadTeamMembersForActiveGroup();
      feedback.textContent = 'Leader updated.';
      return;
    }

    if (button.dataset.action === 'remove-member') {
      feedback.textContent = 'Removing member...';
      const { error } = await supabaseClient.rpc('remove_chat_group_member', {
        target_group_id: activeGroup.id,
        target_user_id: memberId
      });

      if (error) {
        if (isMissingRpcError(error, 'remove_chat_group_member')) {
          feedback.textContent = 'Member removal is not installed in Supabase yet. Re-run supabase-chat-schema.sql.';
          return;
        }
        feedback.textContent = error.message;
        return;
      }

      await loadChatFromDatabase();
      await loadTeamMembersForActiveGroup();
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

    const { data, error } = await supabaseClient.rpc('upsert_chat_group_member_profile', {
      p_group_id: activeGroup.id,
      p_user_id: memberId,
      p_role: payload.role,
      p_current_task: payload.currentTask,
      p_stage: payload.stage,
      p_workload: payload.workload,
      p_deadline: payload.deadline || null
    });

    if (error) {
      if (isMissingRpcError(error, 'upsert_chat_group_member_profile')) {
        feedback.textContent = 'The save RPC is not installed in Supabase yet. Re-run supabase-chat-schema.sql, then try again.';
        return;
      }
      feedback.textContent = error.message;
      return;
    }

    const savedMember = normalizeTeamMember(Array.isArray(data) ? data[0] : data);
    teamMembers = teamMembers.map(item => String(item.id) === String(memberId) ? savedMember : item);
    feedback.textContent = 'Saved.';
    renderMemberDrivenViews();
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
