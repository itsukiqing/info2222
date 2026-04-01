document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navigation li');
    const contentSections = document.querySelectorAll('.content-section');
    const currentSectionTitle = document.getElementById('current-section-title');

    // Sidebar Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');

            const targetSection = link.dataset.section;
            contentSections.forEach(section => {
                if (section.id.startsWith(targetSection)) {
                    section.classList.add('active');
                    currentSectionTitle.textContent = link.querySelector('a').textContent;
                } else {
                    section.classList.remove('active');
                }
            });
            if (targetSection === 'dashboard') {
                renderTaskStatusChart();
            }
            if (targetSection === 'heatmap') {
                renderDeadlineHeatmap();
            }
            if (targetSection === 'tasks') {
                renderTaskAssignmentList();
                populateTaskFilters();
            }
        });
    });

    // --- Chat Section Logic ---
    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.querySelector('.btn-send');
    const chatTopicsList = document.getElementById('chat-topics');
    let currentTopic = 't_general'; // Default topic

    const getMemberName = (id) => MOCK_DATA.members.find(m => m.id === id)?.name || 'Unknown';
    const getMemberAvatar = (id) => MOCK_DATA.members.find(m => m.id === id)?.avatar || 'https://i.pravatar.cc/150?img=0'; // Default avatar

    const formatTimestamp = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('en-AU', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            month: 'short',
            day: 'numeric'
        });
    };

    const renderChatMessages = (topicId) => {
        chatMessagesContainer.innerHTML = '';
        const filteredMessages = MOCK_DATA.messages.filter(msg => msg.topic_id === topicId);

        filteredMessages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.innerHTML = `
                <img src="${getMemberAvatar(msg.sender_id)}" alt="${getMemberName(msg.sender_id)} Avatar" class="message-avatar">
                <div class="message-content">
                    <div class="message-info">
                        <span class="message-sender">${getMemberName(msg.sender_id)}</span>
                        <span class="message-timestamp">${formatTimestamp(msg.timestamp)}</span>
                    </div>
                    <p class="message-text">${msg.content}</p>
                </div>
            `;
            chatMessagesContainer.appendChild(messageElement);
        });
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; // Scroll to bottom
    };

    chatTopicsList.addEventListener('click', (e) => {
        const topicItem = e.target.closest('li');
        if (topicItem) {
            chatTopicsList.querySelectorAll('li').forEach(item => item.classList.remove('active'));
            topicItem.classList.add('active');
            currentTopic = topicItem.dataset.topic;
            renderChatMessages(currentTopic);
        }
    });

    sendButton.addEventListener('click', () => {
        const messageText = chatInput.value.trim();
        if (messageText) {
            const newMessage = {
                id: `msg${MOCK_DATA.messages.length + 1}`,
                topic_id: currentTopic,
                sender_id: 'm8', // Assuming 'You (Guest)' is m8
                timestamp: new Date().toISOString(),
                content: messageText
            };
            MOCK_DATA.messages.push(newMessage);
            renderChatMessages(currentTopic);
            chatInput.value = '';
        }
    });
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' &&!e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    // "Catch Me Up" button logic
    const catchMeUpBtn = document.getElementById('catch-me-up-btn');
    catchMeUpBtn.addEventListener('click', () => {
        alert('Catch Me Up feature would summarize recent messages for the selected member, showing key decisions and action items related to them!');
        // In a real app, this would involve NLP to process messages,
        // identify mentions/tasks for a selected member, and summarize.
        // For this mock, it's a placeholder.
    });

    // --- Dashboard Section Logic ---
    const memberList = document.getElementById('member-list');

    const renderMemberList = () => {
        memberList.innerHTML = '';
        MOCK_DATA.members.forEach(member => {
            const memberItem = document.createElement('li');
            memberItem.innerHTML = `
                <img src="${member.avatar}" alt="${member.name} Avatar" class="member-avatar">
                <div class="member-details">
                    <span class="member-name">${member.name}</span>
                    <span class="member-email">${member.email}</span>
                </div>
            `;
            memberList.appendChild(memberItem);
        });
    };

    let taskStatusChartInstance = null;
    const renderTaskStatusChart = () => {
        const ctx = document.getElementById('taskStatusChart').getContext('2d');
        const statusCounts = MOCK_DATA.tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});

        const data = {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    '#FF5252', // To Do (Red)
                    '#FFC107', // In Progress (Amber)
                    '#B2FF59' // Done (Green)
                ],
                hoverOffset: 4
            }]
        };

        if (taskStatusChartInstance) {
            taskStatusChartInstance.destroy();
        }

        taskStatusChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: false,
                        text: 'Task Status Overview'
                    }
                }
            }
        });
    };

    // --- Deadline Heatmap Section Logic ---
    const deadlineCalendar = document.getElementById('deadline-calendar');
    const currentWeekDisplay = document.getElementById('current-week-display');

    const renderDeadlineHeatmap = () => {
        deadlineCalendar.innerHTML = '';
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0? -6 : 1))); // Monday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        currentWeekDisplay.textContent = `${startOfWeek.toLocaleDateString('en-AU', { month: 'long', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-AU', { month: 'long', day: 'numeric' })}, ${startOfWeek.getFullYear()}`;

        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        dayNames.forEach(dayName => {
            const header = document.createElement('div');
            header.classList.add('calendar-day-header');
            header.textContent = dayName;
            deadlineCalendar.appendChild(header);
        });

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            const dayString = day.toISOString().split('T')[0];

            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            if (dayString === new Date().toISOString().split('T')[0]) {
                dayElement.classList.add('current-day');
            }

            const dayNumber = document.createElement('div');
            dayNumber.classList.add('day-number');
            dayNumber.textContent = day.getDate();
            dayElement.appendChild(dayNumber);

            const deadlinesForDay = MOCK_DATA.heatmap_deadlines.filter(dl => dl.date === dayString);
            const memberDeadlines = {};
            deadlinesForDay.forEach(dl => {
                memberDeadlines[dl.member_id] = (memberDeadlines[dl.member_id] || 0) + 1;
                const deadlineItem = document.createElement('div');
                deadlineItem.classList.add('deadline-item');
                deadlineItem.classList.add(`deadline-${dl.workload}`);
                deadlineItem.textContent = `${getMemberName(dl.member_id)} - ${dl.workload} workload`; // Example workload
                dayElement.appendChild(deadlineItem);
            });

            // Check for deadline clashes (more than one member with a deadline)
            const membersWithDeadlines = Object.keys(memberDeadlines).length;
            if (membersWithDeadlines > 1) {
                dayElement.style.boxShadow = `inset 0 0 0 2px #880E4F`; // Clash color
            }

            deadlineCalendar.appendChild(dayElement);
        }

        // Meeting suggestion logic (simplified)
        const meetingSuggestionText = document.getElementById('meeting-suggestion-text');
        // Find days with minimal deadlines across all members
        const workloadByDay = {};
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            const dayString = day.toISOString().split('T')[0];
            const deadlinesOnDay = MOCK_DATA.heatmap_deadlines.filter(dl => dl.date === dayString);
            workloadByDay[dayString] = deadlinesOnDay.length;
        }

        const lowestWorkloadDays = Object.keys(workloadByDay).filter(day => workloadByDay[day] === 0);
        if (lowestWorkloadDays.length > 0) {
            const firstLowDay = new Date(lowestWorkloadDays[0]);
            meetingSuggestionText.innerHTML = `Great news! <span style="color: var(--green-low); font-weight: 600;">${firstLowDay.toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' })}</span> appears to be a low-stress day for everyone.`;
        } else {
            meetingSuggestionText.innerHTML = 'It looks like a busy week for the team. Consider short, focused meetings or check-ins as needed.';
        }
    };

    // --- Task Assignment Section Logic ---
    const taskAssignmentList = document.getElementById('task-assignment-list');
    const taskMemberFilter = document.getElementById('task-member-filter');
    const taskStatusFilter = document.getElementById('task-status-filter');

    const renderTaskAssignmentList = () => {
        taskAssignmentList.innerHTML = '';
        let filteredTasks = MOCK_DATA.tasks;

        const selectedMember = taskMemberFilter.value;
        const selectedStatus = taskStatusFilter.value;

        if (selectedMember!== 'all') {
            filteredTasks = filteredTasks.filter(task => task.member_id === selectedMember);
        }
        if (selectedStatus!== 'all') {
            filteredTasks = filteredTasks.filter(task => task.status === selectedStatus);
        }

        if (filteredTasks.length === 0) {
            taskAssignmentList.innerHTML = '<p style="text-align: center; color: var(--text-light);">No tasks match your current filters.</p>';
            return;
        }

        filteredTasks.forEach(task => {
            const member = MOCK_DATA.members.find(m => m.id === task.member_id);
            const taskCard = document.createElement('div');
            taskCard.classList.add('task-card', `status-${task.status.toLowerCase().replace(' ', '-')}`); // for dynamic border color
            taskCard.innerHTML = `
                <div class="task-card-header">
                    <h4>${task.description}</h4>
                    <span class="task-status-badge status-badge-${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span>
                </div>
                <p class="task-description">Assigned for the main project module. Ensure all requirements are met.</p>
                <div class="task-details">
                    <div class="task-assigned-to">
                        <img src="${member.avatar}" alt="${member.name} Avatar">
                        <span>${member.name}</span>
                    </div>
                    <div class="task-due-date">
                        <i class="fas fa-calendar-alt"></i> ${task.due_date}
                    </div>
                </div>
            `;
            taskAssignmentList.appendChild(taskCard);
        });
    };

    const populateTaskFilters = () => {
        // Populate member filter
        taskMemberFilter.innerHTML = '<option value="all">All Members</option>';
        MOCK_DATA.members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.name;
            taskMemberFilter.appendChild(option);
        });
    };

    taskMemberFilter.addEventListener('change', renderTaskAssignmentList);
    taskStatusFilter.addEventListener('change', renderTaskAssignmentList);

    // Initial renders
    renderChatMessages(currentTopic);
    renderMemberList();

    // Set initial active section to chat
    document.querySelector('.navigation li[data-section="chat"]').click();
});