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

  const model = process.env.OPENAI_CALL_QUESTIONS_MODEL || process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const {
    topic = 'Team meeting',
    groupName = 'Group Chat',
    participantNames = [],
    scheduledDate = '',
    scheduledTime = ''
  } = req.body || {};

  const teamLine = Array.isArray(participantNames) && participantNames.length
    ? participantNames.join(', ')
    : 'the current team';

  const prompt = [
    `Team: ${groupName}`,
    `Meeting topic: ${topic}`,
    `Participants: ${teamLine}`,
    `Scheduled for: ${scheduledDate} ${scheduledTime}`.trim(),
    '',
    'Generate 4 short, practical discussion questions for this meeting.',
    'The questions should help a student project team make decisions, assign work, and surface blockers.',
    'Return only the questions, one per line, without numbering or extra commentary.'
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
                text: 'You generate concise discussion questions for team meetings. Be practical and specific to the topic.'
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

    const text = extractOutputText(payload);
    const questions = text.split('\n')
      .map(line => line.replace(/^\s*[-\d.)]+\s*/, '').trim())
      .filter(Boolean)
      .slice(0, 6);

    if (!questions.length) {
      res.status(502).json({ error: 'OpenAI returned an empty question list.' });
      return;
    }

    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not generate meeting questions.' });
  }
};
