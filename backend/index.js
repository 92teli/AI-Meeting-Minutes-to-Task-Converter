require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.post('/api/extract-tasks', async (req, res) => {
  const { transcript } = req.body;
  if (!transcript) {
    return res.status(400).json({ error: 'No transcript provided' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  const prompt = `
Analyze the following meeting transcript and extract actionable tasks. For each task, identify:
1. A clear, specific description of what needs to be done
2. Who is assigned to complete the task
3. When it's due (if mentioned, otherwise set as "No deadline")
4. Priority level (P1 for urgent/critical, P2 for important, P3 for normal)

Return ONLY a valid JSON array with this structure, and nothing else:
[
  {
    "description": "Task description",
    "assignee": "Person's name",
    "dueDate": "Due date or 'No deadline'",
    "priority": "P1" | "P2" | "P3"
  }
]

Meeting Transcript:
${transcript}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Gemini response:', generatedText);
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Gemini did not return a valid JSON array. Response was: ' + generatedText });
    }

    const tasks = JSON.parse(jsonMatch[0]);
    res.json({ tasks });
  } catch (error) {
    console.error('Error in extract-tasks proxy:', error);
    res.status(500).json({ error: error.message, tasks: [] });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
}); 