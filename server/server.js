import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { initDatabase, saveConversation, saveEmail } from './database.js';
import { getRecoveryCoachPrompt } from './prompts.js';
import validator from 'validator';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
initDatabase();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window
  message: 'Too many requests, please try again later.'
});

const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 email submissions per hour
  message: 'Too many email submissions, please try again later.'
});

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Recovery Coach API is running' });
});

// Get crisis resources
app.get('/api/crisis-resources', (req, res) => {
  res.json({
    resources: [
      {
        name: 'National Suicide Prevention Lifeline',
        phone: '988',
        description: '24/7 free and confidential support',
        type: 'crisis'
      },
      {
        name: 'Crisis Text Line',
        text: '741741',
        description: 'Text HOME to 741741',
        type: 'crisis'
      },
      {
        name: 'SAMHSA National Helpline',
        phone: '1-800-662-4357',
        description: 'Substance abuse and mental health services',
        type: 'support'
      },
      {
        name: 'Emergency Services',
        phone: '911',
        description: 'For immediate life-threatening emergencies',
        type: 'emergency'
      }
    ]
  });
});

// Chat endpoint
app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    const { messages, sessionId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Detect crisis keywords
    const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'want to die', 'overdose'];
    const isCrisis = crisisKeywords.some(keyword => lastUserMessage.includes(keyword));

    if (isCrisis) {
      return res.json({
        response: "I'm really concerned about what you're sharing. Please reach out to someone who can help right now:\n\n🆘 National Suicide Prevention Lifeline: 988\n📱 Crisis Text Line: Text HOME to 741741\n🚨 Emergency Services: 911\n\nYou deserve immediate support from trained crisis professionals. Please contact them right now. Your life matters.",
        crisis: true,
        requiresEscalation: true
      });
    }

    // Call Claude API with recovery coach system prompt
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: getRecoveryCoachPrompt(),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    });

    const assistantMessage = response.content[0].text;

    // Save conversation to database
    if (sessionId) {
      saveConversation(sessionId, messages[messages.length - 1].content, assistantMessage);
    }

    res.json({
      response: assistantMessage,
      crisis: false,
      requiresEscalation: false
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Unable to process your message. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Email collection endpoint
app.post('/api/collect-email', emailLimiter, async (req, res) => {
  try {
    const { email, name, sessionId } = req.body;

    // Validate email
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Sanitize inputs
    const sanitizedEmail = validator.normalizeEmail(email);
    const sanitizedName = name ? validator.escape(name.trim()) : null;

    // Save to database
    saveEmail(sanitizedEmail, sanitizedName, sessionId);

    res.json({
      success: true,
      message: 'Thank you! We\'ll be in touch soon.'
    });

  } catch (error) {
    console.error('Email collection error:', error);
    res.status(500).json({
      error: 'Unable to save your information. Please try again.'
    });
  }
});

// Breathing exercise endpoint
app.get('/api/breathing-exercise/:type', (req, res) => {
  const { type } = req.params;

  const exercises = {
    'box': {
      name: 'Box Breathing',
      description: 'A calming 4-4-4-4 breathing pattern used by Navy SEALs',
      steps: [
        { action: 'Breathe in', duration: 4, instruction: 'Slowly inhale through your nose' },
        { action: 'Hold', duration: 4, instruction: 'Hold your breath gently' },
        { action: 'Breathe out', duration: 4, instruction: 'Exhale slowly through your mouth' },
        { action: 'Hold', duration: 4, instruction: 'Hold your breath gently' }
      ],
      cycles: 4
    },
    '4-7-8': {
      name: '4-7-8 Breathing',
      description: 'A relaxation technique to calm your nervous system',
      steps: [
        { action: 'Breathe in', duration: 4, instruction: 'Inhale quietly through your nose' },
        { action: 'Hold', duration: 7, instruction: 'Hold your breath' },
        { action: 'Breathe out', duration: 8, instruction: 'Exhale completely through your mouth' }
      ],
      cycles: 4
    },
    'calm': {
      name: 'Calming Breath',
      description: 'Simple deep breathing to reduce anxiety',
      steps: [
        { action: 'Breathe in', duration: 5, instruction: 'Breathe in deeply through your nose' },
        { action: 'Breathe out', duration: 5, instruction: 'Release slowly through your mouth' }
      ],
      cycles: 6
    }
  };

  const exercise = exercises[type] || exercises['calm'];
  res.json(exercise);
});

app.listen(PORT, () => {
  console.log(`🌱 Recovery Coach API running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});
