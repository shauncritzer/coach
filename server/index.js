const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const { SYSTEM_PROMPT } = require('./prompts');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Recovery Coach API is running' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Create streaming response
    const stream = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: messages,
      stream: true,
    });

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream the response
    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        if (event.delta.type === 'text_delta') {
          res.write(`data: ${JSON.stringify({ type: 'text', content: event.delta.text })}\n\n`);
        }
      } else if (event.type === 'message_stop') {
        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      }
    }

    res.end();
  } catch (error) {
    console.error('Error in chat endpoint:', error);

    // Handle specific error types
    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid API key. Please check your Anthropic API key configuration.' });
    }

    res.status(500).json({
      error: 'An error occurred while processing your request',
      details: error.message
    });
  }
});

// Start server (only if not in Vercel serverless environment)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Recovery Coach server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
