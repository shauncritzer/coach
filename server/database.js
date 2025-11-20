import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

const DB_PATH = process.env.DATABASE_PATH || './data/conversations.sqlite';

// Ensure data directory exists
try {
  mkdirSync(dirname(DB_PATH), { recursive: true });
} catch (err) {
  console.error('Error creating data directory:', err);
}

let db;

export function initDatabase() {
  try {
    db = new Database(DB_PATH);

    // Create conversations table
    db.exec(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        user_message TEXT NOT NULL,
        assistant_message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_session (session_id)
      )
    `);

    // Create emails table
    db.exec(`
      CREATE TABLE IF NOT EXISTS emails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        session_id TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      )
    `);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

export function saveConversation(sessionId, userMessage, assistantMessage) {
  try {
    const stmt = db.prepare(`
      INSERT INTO conversations (session_id, user_message, assistant_message)
      VALUES (?, ?, ?)
    `);
    stmt.run(sessionId, userMessage, assistantMessage);
  } catch (error) {
    console.error('Error saving conversation:', error);
  }
}

export function saveEmail(email, name, sessionId) {
  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO emails (email, name, session_id)
      VALUES (?, ?, ?)
    `);
    stmt.run(email, name, sessionId);
  } catch (error) {
    console.error('Error saving email:', error);
    throw error;
  }
}

export function getConversationHistory(sessionId, limit = 50) {
  try {
    const stmt = db.prepare(`
      SELECT user_message, assistant_message, timestamp
      FROM conversations
      WHERE session_id = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `);
    return stmt.all(sessionId, limit);
  } catch (error) {
    console.error('Error retrieving conversation history:', error);
    return [];
  }
}

export function closeDatabase() {
  if (db) {
    db.close();
  }
}
