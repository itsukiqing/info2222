const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = 'gpt-5-nano';

function extractOutputText(payload) {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const outputs = Array.isArray(payload?.output) ? payload.output : [];
  const textParts = outputs.flatMap(item => Array.isArray(item?.content) ? item.content : [])
    .filter(content => content?.type === 'output_text' && typeof content.text === 'string')
    .map(content => content.text.trim())
    .filter(Boolean);

  return textParts.join('\n').trim();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'OPENAI_API_KEY is not configured on the server.' });
    return;
  }

  const model = process.env.OPENAI_CATCHUP_MODEL || process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const {
    memberName = 'Team member',
    memberEmail = '',
    groupName = 'Group Chat',
    tasks = [],
    calls = [],
    messages = []
  } = req.body || {};

  const prompt = [
    `Team: ${groupName}`,
    `Selected member: ${memberName}${memberEmail ? ` (${memberEmail})` : ''}`,
    '',
    'Write a concise catch-up for the selected team member.',
    'Use the tasks, calls, and recent messages below.',
    'Focus on what they should know now: active work, blockers, recent decisions, and the next meeting.',
    'Keep it to 4-6 sentences and do not invent facts.',
    '',
    `Tasks: ${JSON.stringify(tasks)}`,
    `Calls: ${JSON.stringify(calls)}`,
    `Messages: ${JSON.stringify(messages)}`
  ].join('\n');

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: 'developer',
            content: [
              {
                type: 'input_text',
                text: 'You write clear catch-up summaries for student project teams. Be accurate, concise, and practical.'
              }
            ]
          },
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: prompt
              }
            ]
          }
        ]
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ error: payload?.error?.message || 'OpenAI request failed.' });
      return;
    }

    const summary = extractOutputText(payload);
    if (!summary) {
      res.status(502).json({ error: 'OpenAI returned an empty catch-up summary.' });
      return;
    }

    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not generate the catch-up summary.' });
  }
};
