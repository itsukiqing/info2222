const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = 'gpt-5-mini';

function buildTranscript(messages = []) {
  return messages
    .map((message, index) => {
      const sender = String(message.sender || 'Unknown');
      const channel = String(message.channelName || 'General');
      const time = String(message.time || '');
      const date = String(message.date || '');
      const text = String(message.text || '').replace(/\s+/g, ' ').trim();
      return `${index + 1}. [${date} ${time}] #${channel} ${sender}: ${text}`;
    })
    .join('\n');
}

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

  const model = process.env.OPENAI_DAILY_SUMMARY_MODEL || process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const { groupName = 'Group Chat', scope = 'Recent activity', messages = [] } = req.body || {};
  const safeMessages = Array.isArray(messages) ? messages.slice(-25) : [];

  if (!safeMessages.length) {
    res.status(200).json({ summary: `${groupName} has no messages yet.` });
    return;
  }

  const transcript = buildTranscript(safeMessages);
  const prompt = [
    `Team: ${groupName}`,
    `Scope: ${scope}`,
    '',
    'Write a concise daily summary for a student team workspace.',
    'Focus on decisions, tasks, blockers, follow-ups, and any @mentions that look actionable.',
    'Keep it to 3-5 sentences in plain English.',
    'Do not invent facts that are not in the transcript.',
    '',
    'Transcript:',
    transcript
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
                text: 'You summarise small team group chats. Be accurate, concise, and useful.'
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
      const message = payload?.error?.message || 'OpenAI request failed.';
      res.status(response.status).json({ error: message });
      return;
    }

    const summary = extractOutputText(payload);
    if (!summary) {
      res.status(502).json({ error: 'OpenAI returned an empty summary.' });
      return;
    }

    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not generate a daily summary.' });
  }
};
