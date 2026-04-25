const { requireSessionProfile, supabaseRest } = require('./_lib/custom-auth');

async function getGroupForUser(groupId, userId) {
  const groups = await supabaseRest(`chat_groups?select=id,name,created_by,leader_id&id=eq.${groupId}&limit=1`);
  const group = groups[0];
  if (!group) throw new Error('That group does not exist.');

  const memberships = await supabaseRest(`chat_group_members?select=id&group_id=eq.${groupId}&user_id=eq.${userId}&limit=1`);
  if (!memberships[0]) throw new Error('You are not a member of this team.');

  return group;
}

async function canManageGroup(groupId, userId) {
  const groups = await supabaseRest(`chat_groups?select=id,created_by,leader_id&id=eq.${groupId}&limit=1`);
  const group = groups[0];
  if (!group) return false;
  return String(group.created_by) === String(userId) || String(group.leader_id || group.created_by) === String(userId);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const currentProfile = await requireSessionProfile(req, res);
  if (!currentProfile) return;

  const action = req.body?.action;

  try {
    if (action === 'send_message') {
      const { groupId, channelId, body } = req.body || {};
      await getGroupForUser(groupId, currentProfile.id);
      await supabaseRest('chat_messages', {
        method: 'POST',
        body: {
          group_id: groupId,
          channel_id: channelId,
          sender_id: currentProfile.id,
          sender_name: currentProfile.full_name || currentProfile.username || currentProfile.email,
          body
        }
      });
      res.status(200).json({ ok: true });
      return;
    }

    if (action === 'create_group') {
      const { name, topic, memberIds = [] } = req.body || {};
      const createdGroups = await supabaseRest('chat_groups', {
        method: 'POST',
        body: {
          name,
          created_by: currentProfile.id,
          leader_id: currentProfile.id
        }
      });
      const group = createdGroups[0];

      const allMemberIds = [...new Set([currentProfile.id, ...memberIds].filter(Boolean))];
      await Promise.all(allMemberIds.map(userId => supabaseRest('chat_group_members', {
        method: 'POST',
        body: {
          group_id: group.id,
          user_id: userId,
          added_by: currentProfile.id
        },
        prefer: 'resolution=ignore-duplicates,return=minimal'
      })));

      const createdChannels = await supabaseRest('chat_channels', {
        method: 'POST',
        body: {
          group_id: group.id,
          name: topic || 'General'
        }
      });
      const channel = createdChannels[0];
      await supabaseRest('chat_messages', {
        method: 'POST',
        body: {
          group_id: group.id,
          channel_id: channel.id,
          sender_id: currentProfile.id,
          sender_name: 'System',
          body: `Welcome to ${name}.`
        }
      });
      res.status(200).json({ groupId: group.id, channelId: channel.id });
      return;
    }

    if (action === 'add_member_by_email') {
      const { groupId, email } = req.body || {};
      if (!(await canManageGroup(groupId, currentProfile.id))) {
        throw new Error('Only the team leader or creator can add members.');
      }
      const profiles = await supabaseRest(`profiles?select=id,email,full_name&email=ilike.${encodeURIComponent(email)}&limit=1`);
      const target = profiles[0];
      if (!target) throw new Error('No user found with that email.');
      await supabaseRest('chat_group_members', {
        method: 'POST',
        body: {
          group_id: groupId,
          user_id: target.id,
          added_by: currentProfile.id
        },
        prefer: 'resolution=ignore-duplicates,return=minimal'
      });
      res.status(200).json({ added_email: target.email, added_full_name: target.full_name || target.email, added_user_id: target.id });
      return;
    }

    if (action === 'set_leader') {
      const { groupId, userId } = req.body || {};
      if (!(await canManageGroup(groupId, currentProfile.id))) {
        throw new Error('Only the team leader or creator can change the leader.');
      }
      await supabaseRest(`chat_groups?id=eq.${groupId}`, {
        method: 'PATCH',
        body: { leader_id: userId }
      });
      res.status(200).json({ ok: true });
      return;
    }

    if (action === 'remove_member') {
      const { groupId, userId } = req.body || {};
      const groups = await supabaseRest(`chat_groups?select=id,created_by,leader_id&id=eq.${groupId}&limit=1`);
      const group = groups[0];
      if (!group) throw new Error('That group does not exist.');
      if (!(await canManageGroup(groupId, currentProfile.id))) {
        throw new Error('Only the team leader or creator can remove members.');
      }
      if (String(userId) === String(group.created_by)) {
        throw new Error('The group creator cannot be removed.');
      }
      if (String(userId) === String(group.leader_id || group.created_by)) {
        await supabaseRest(`chat_groups?id=eq.${groupId}`, {
          method: 'PATCH',
          body: { leader_id: group.created_by }
        });
      }
      await Promise.all([
        supabaseRest(`chat_group_member_profiles?group_id=eq.${groupId}&user_id=eq.${userId}`, { method: 'DELETE', prefer: 'return=minimal' }),
        supabaseRest(`chat_group_member_availability?group_id=eq.${groupId}&user_id=eq.${userId}`, { method: 'DELETE', prefer: 'return=minimal' }),
        supabaseRest(`chat_group_members?group_id=eq.${groupId}&user_id=eq.${userId}`, { method: 'DELETE', prefer: 'return=minimal' })
      ]);
      res.status(200).json({ ok: true });
      return;
    }

    if (action === 'save_member_profile') {
      const { groupId, userId, role, currentTask, stage, workload, deadline } = req.body || {};
      await getGroupForUser(groupId, currentProfile.id);
      await supabaseRest('chat_group_member_profiles', {
        method: 'POST',
        body: {
          group_id: groupId,
          user_id: userId,
          role: role || null,
          current_task: currentTask || null,
          stage: stage || 'Not set',
          workload: workload || 'Not set',
          deadline: deadline || null,
          updated_by: currentProfile.id,
          updated_at: new Date().toISOString()
        },
        prefer: 'resolution=merge-duplicates,return=minimal'
      });
      res.status(200).json({ ok: true });
      return;
    }

    if (action === 'save_availability') {
      const { groupId, day, slots } = req.body || {};
      await getGroupForUser(groupId, currentProfile.id);
      await supabaseRest('chat_group_member_availability', {
        method: 'POST',
        body: {
          group_id: groupId,
          user_id: currentProfile.id,
          day_name: day,
          slots: Array.isArray(slots) ? slots : [],
          updated_at: new Date().toISOString()
        },
        prefer: 'resolution=merge-duplicates,return=minimal'
      });
      res.status(200).json({ ok: true });
      return;
    }

    if (action === 'create_call') {
      const { groupId, topic, date, time, generatedQuestions = [] } = req.body || {};
      await getGroupForUser(groupId, currentProfile.id);
      const createdCalls = await supabaseRest('chat_group_calls', {
        method: 'POST',
        body: {
          group_id: groupId,
          topic,
          scheduled_date: date,
          scheduled_time: time,
          created_by: currentProfile.id,
          generated_questions: generatedQuestions
        }
      });
      const call = createdCalls[0];
      const members = await supabaseRest(`chat_group_members?select=user_id&group_id=eq.${groupId}`);
      await Promise.all(members.map(member => supabaseRest('chat_group_call_participants', {
        method: 'POST',
        body: {
          call_id: call.id,
          user_id: member.user_id
        },
        prefer: 'resolution=ignore-duplicates,return=minimal'
      })));
      res.status(200).json({ ok: true, callId: call.id });
      return;
    }

    if (action === 'create_task') {
      const { groupId, title, assignee, assigneeUserId, priorityRank, durationDays } = req.body || {};
      await getGroupForUser(groupId, currentProfile.id);
      await supabaseRest('chat_group_tasks', {
        method: 'POST',
        body: {
          group_id: groupId,
          title,
          assignee_name: assignee || 'N/A',
          assignee_user_id: assigneeUserId || null,
          priority_rank: priorityRank,
          duration_days: durationDays,
          status: assignee === 'N/A' ? 'Not Assigned' : 'Not Started',
          created_by: currentProfile.id
        }
      });
      res.status(200).json({ ok: true });
      return;
    }

    if (action === 'update_task_status') {
      const { groupId, taskId, status } = req.body || {};
      await getGroupForUser(groupId, currentProfile.id);
      await supabaseRest(`chat_group_tasks?id=eq.${taskId}&group_id=eq.${groupId}`, {
        method: 'PATCH',
        body: { status }
      });
      res.status(200).json({ ok: true });
      return;
    }

    res.status(400).json({ error: 'Unknown action.' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Action failed.' });
  }
};
