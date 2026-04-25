const { formatUser, requireSessionProfile, supabaseRest } = require('./_lib/custom-auth');

function inFilter(values) {
  return `in.(${values.join(',')})`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const currentProfile = await requireSessionProfile(req, res);
  if (!currentProfile) return;

  try {
    const memberDirectory = await supabaseRest('profiles?select=id,username,email,full_name,role&order=full_name.asc');
    const memberships = await supabaseRest(`chat_group_members?select=group_id,user_id,added_by&user_id=eq.${currentProfile.id}`);
    const groupIds = [...new Set(memberships.map(row => row.group_id).filter(Boolean))];

    if (!groupIds.length) {
      res.status(200).json({
        user: formatUser(currentProfile),
        memberDirectory,
        groups: []
      });
      return;
    }

    const groupFilter = inFilter(groupIds);
    const [groups, channels, messages, groupMembers, memberProfiles, availabilityRows, calls, tasks] = await Promise.all([
      supabaseRest(`chat_groups?select=id,name,created_by,leader_id,created_at&id=${groupFilter}&order=created_at.asc`),
      supabaseRest(`chat_channels?select=id,group_id,name,created_at&group_id=${groupFilter}&order=created_at.asc`),
      supabaseRest(`chat_messages?select=id,group_id,channel_id,sender_id,sender_name,body,created_at&group_id=${groupFilter}&order=created_at.asc`),
      supabaseRest(`chat_group_members?select=group_id,user_id,added_by&group_id=${groupFilter}`),
      supabaseRest(`chat_group_member_profiles?select=group_id,user_id,role,current_task,stage,workload,deadline&group_id=${groupFilter}`),
      supabaseRest(`chat_group_member_availability?select=group_id,user_id,day_name,slots&group_id=${groupFilter}`),
      supabaseRest(`chat_group_calls?select=id,group_id,topic,scheduled_date,scheduled_time,created_by,generated_questions,created_at&group_id=${groupFilter}&order=scheduled_date.desc,scheduled_time.desc`),
      supabaseRest(`chat_group_tasks?select=id,group_id,title,assignee_name,assignee_user_id,priority_rank,duration_days,status,created_by,created_at&group_id=${groupFilter}&order=priority_rank.asc,created_at.desc`)
    ]);

    const allUserIds = [...new Set(groupMembers.map(row => row.user_id).filter(Boolean))];
    const callIds = [...new Set(calls.map(call => call.id).filter(Boolean))];

    const [memberRows, callParticipants] = await Promise.all([
      allUserIds.length
        ? supabaseRest(`profiles?select=id,username,email,full_name,role&id=${inFilter(allUserIds)}`)
        : Promise.resolve([]),
      callIds.length
        ? supabaseRest(`chat_group_call_participants?select=call_id,user_id&call_id=${inFilter(callIds)}`)
        : Promise.resolve([])
    ]);

    const profilesById = new Map(memberRows.map(profile => [String(profile.id), profile]));
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
    const membersByGroup = groupMembers.reduce((acc, membership) => {
      if (!acc[membership.group_id]) acc[membership.group_id] = [];
      acc[membership.group_id].push(membership);
      return acc;
    }, {});
    const memberProfilesByKey = new Map(memberProfiles.map(profile => [`${profile.group_id}:${profile.user_id}`, profile]));
    const availabilityByGroup = availabilityRows.reduce((acc, row) => {
      const groupKey = String(row.group_id);
      if (!acc[groupKey]) acc[groupKey] = {};
      const memberName = profilesById.get(String(row.user_id))?.full_name || profilesById.get(String(row.user_id))?.username || profilesById.get(String(row.user_id))?.email;
      if (!memberName) return acc;
      if (!acc[groupKey][row.day_name]) acc[groupKey][row.day_name] = {};
      acc[groupKey][row.day_name][memberName] = Array.isArray(row.slots) ? row.slots : [];
      return acc;
    }, {});
    const callParticipantsByCall = callParticipants.reduce((acc, row) => {
      if (!acc[row.call_id]) acc[row.call_id] = [];
      acc[row.call_id].push(row.user_id);
      return acc;
    }, {});
    const callsByGroup = calls.reduce((acc, call) => {
      if (!acc[call.group_id]) acc[call.group_id] = [];
      acc[call.group_id].push({
        id: call.id,
        groupId: call.group_id,
        title: call.topic,
        date: call.scheduled_date,
        time: String(call.scheduled_time || '').slice(0, 5),
        createdBy: call.created_by,
        createdAt: call.created_at,
        generatedQuestions: call.generated_questions || [],
        participantNames: (callParticipantsByCall[call.id] || [])
          .map(userId => {
            const profile = profilesById.get(String(userId));
            return profile?.full_name || profile?.username || profile?.email || '';
          })
          .filter(Boolean),
        participantCount: (callParticipantsByCall[call.id] || []).length
      });
      return acc;
    }, {});
    const tasksByGroup = tasks.reduce((acc, task) => {
      if (!acc[task.group_id]) acc[task.group_id] = [];
      acc[task.group_id].push({
        id: task.id,
        groupId: task.group_id,
        title: task.title,
        assignee: task.assignee_name,
        assigneeUserId: task.assignee_user_id,
        priorityRank: task.priority_rank,
        durationDays: task.duration_days,
        status: task.status,
        createdBy: task.created_by,
        createdAt: task.created_at
      });
      return acc;
    }, {});

    const stateGroups = groups.map(group => {
      const groupMemberRows = membersByGroup[group.id] || [];
      return {
        id: group.id,
        name: group.name,
        createdBy: group.created_by,
        leaderId: group.leader_id || group.created_by,
        channels: (channelsByGroup[group.id] || []).map(channel => ({
          id: channel.id,
          name: channel.name,
          messages: (messagesByChannel[channel.id] || []).map(message => ({
            id: message.id,
            senderId: message.sender_id,
            sender: message.sender_name,
            text: message.body,
            createdAt: message.created_at
          }))
        })),
        members: groupMemberRows.map(membership => {
          const profile = profilesById.get(String(membership.user_id)) || {};
          const memberProfile = memberProfilesByKey.get(`${group.id}:${membership.user_id}`) || {};
          return {
            id: membership.user_id,
            username: profile.username || '',
            email: profile.email || '',
            full_name: profile.full_name || profile.username || profile.email || 'Team member',
            role: memberProfile.role || profile.role || 'Team member',
            current_task: memberProfile.current_task || '',
            stage: memberProfile.stage || 'Not set',
            workload: memberProfile.workload || 'Not set',
            deadline: memberProfile.deadline || '',
            is_leader: membership.user_id === (group.leader_id || group.created_by),
            is_creator: membership.user_id === group.created_by
          };
        }),
        availability: availabilityByGroup[String(group.id)] || {},
        calls: callsByGroup[group.id] || [],
        tasks: tasksByGroup[group.id] || []
      };
    });

    res.status(200).json({
      user: formatUser(currentProfile),
      memberDirectory,
      groups: stateGroups
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not load the app state.' });
  }
};
