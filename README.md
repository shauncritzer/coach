# Recovery Coach AI Chatbot 🌱

A compassionate AI-powered recovery coach providing trauma-informed support for addiction recovery, nervous system regulation, and healing.

## Features

### Core Functionality
- **Web-based Chat Interface**: Clean, calming design optimized for mobile and desktop
- **AI-Powered Conversations**: Uses Claude AI trained on recovery methodology and trauma-informed care
- **Trauma-Informed Approach**: Gentle, non-judgmental language that validates experiences
- **Nervous System Regulation**: Teaches grounding techniques and somatic practices
- **Recovery Wisdom**: 12-step principles without dogma, adaptable to individual paths

### Interactive Features
- **Guided Breathing Exercises**: Box breathing, 4-7-8, and calming breath techniques
- **Crisis Detection**: Automatic detection of crisis keywords with immediate resource provision
- **Email Collection**: Connect users with human recovery coaches for follow-up
- **Session Persistence**: Conversations stored for continuity and improvement

### Safety Features
- **Comprehensive Disclaimer**: Clear explanation of what the tool does and doesn't provide
- **Crisis Resources**: Prominently displayed emergency contact information
- **Automatic Escalation**: Detects crisis situations and provides immediate professional resources
- **No Medical Advice**: Explicitly avoids diagnosis, prescription, or medical treatment

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework with custom calming color palette
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Claude AI (Anthropic SDK)** - Advanced language model for compassionate responses
- **SQLite (better-sqlite3)** - Lightweight database for conversation storage
- **Helmet** - Security middleware
- **Express Rate Limit** - API rate limiting

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Anthropic API Key from https://console.anthropic.com/

### Installation

```bash
# Install all dependencies
npm run install:all

# Copy environment template
cp .env.example .env

# Edit .env and add your Anthropic API key
# ANTHROPIC_API_KEY=your_api_key_here

# Run the application
npm run dev
```

Visit http://localhost:5173 to use the chatbot!

## Project Structure

```
coach/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
├── server/                 # Express backend
│   ├── server.js          # Main server file
│   ├── database.js        # Database operations
│   ├── prompts.js         # AI system prompts
│   └── package.json
├── .env.example
└── README.md
```

## API Endpoints

- `POST /api/chat` - Send messages to the AI coach
- `GET /api/crisis-resources` - Get emergency contact information
- `GET /api/breathing-exercise/:type` - Get breathing exercise configurations
- `POST /api/collect-email` - Collect user email for follow-up
- `GET /api/health` - Health check endpoint

## Deployment

### Building for Production

```bash
cd client && npm run build
```

### Deployment Options
1. **VPS/Cloud**: Deploy with PM2 + Nginx
2. **Vercel + Railway**: Frontend on Vercel, backend on Railway/Render
3. **Docker**: Use included Dockerfile

See full deployment guide in the documentation below.

## Customization

### AI System Prompt
Edit `server/prompts.js` to customize the AI's personality and knowledge

### Color Theme
Modify `client/tailwind.config.js` to change the calming color palette

### Breathing Exercises
Add new exercises in `server/server.js` breathing exercise endpoint

## Safety & Ethics

This tool:
- ✅ Provides compassionate support and education
- ✅ Teaches nervous system regulation techniques
- ✅ Connects users to professional crisis resources
- ❌ Does NOT provide medical advice or diagnosis
- ❌ Does NOT replace therapy or professional treatment
- ❌ Does NOT handle acute crisis situations alone

**Crisis Resources:**
- National Suicide Prevention Lifeline: **988**
- Crisis Text Line: Text **HOME** to **741741**
- SAMHSA Helpline: **1-800-662-4357**
- Emergency Services: **911**

## Documentation

For detailed setup, deployment, and customization instructions, see sections below.

---

## Detailed Setup Guide

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required
ANTHROPIC_API_KEY=your_claude_api_key_here

# Optional (defaults shown)
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_PATH=./data/conversations.sqlite
CRISIS_HOTLINE=988
CRISIS_TEXT_LINE=741741
```

### Running Individual Services

```bash
# Backend only
npm run server

# Frontend only
npm run client

# Both (development)
npm run dev
```

## Production Deployment Guide

### Option 1: Traditional Server (VPS, DigitalOcean, AWS EC2)

1. **Prepare the server**:
```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2
```

2. **Build and deploy**:
```bash
# Build frontend
cd client && npm run build

# Start server with PM2
cd ../server
pm2 start server.js --name recovery-coach
pm2 save
pm2 startup
```

3. **Configure Nginx**:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /path/to/coach/client/dist;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **Enable HTTPS with Let's Encrypt**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Option 2: Serverless (Vercel + Railway)

**Frontend on Vercel:**
1. Push to GitHub
2. Import project in Vercel
3. Configure:
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
   - Root Directory: leave empty
4. Add environment variable: `VITE_API_URL` (your backend URL)

**Backend on Railway:**
1. Create new project from GitHub repo
2. Configure:
   - Start Command: `cd server && npm install && npm start`
   - Root Directory: leave empty
3. Add environment variables (ANTHROPIC_API_KEY, etc.)
4. Deploy

### Option 3: Docker

**Dockerfile** (create in root):
```dockerfile
FROM node:18-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm run install:all

# Copy source code
COPY . .

# Build frontend
RUN cd client && npm run build

# Expose port
EXPOSE 3001

# Start server
CMD ["npm", "run", "server"]
```

**Docker Compose** (optional):
```yaml
version: '3.8'
services:
  recovery-coach:
    build: .
    ports:
      - "3001:3001"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
```

Build and run:
```bash
docker build -t recovery-coach .
docker run -p 3001:3001 --env-file .env recovery-coach
```

## Embedding the Chatbot

### As an iframe

```html
<iframe
  src="https://your-domain.com"
  width="100%"
  height="600px"
  frameborder="0"
  style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
  title="Recovery Coach"
></iframe>
```

### As a popup widget

```html
<button id="recovery-coach-btn" style="
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
">
  🌱 Talk to Recovery Coach
</button>

<script>
document.getElementById('recovery-coach-btn').addEventListener('click', () => {
  const popup = window.open(
    'https://your-domain.com',
    'Recovery Coach',
    'width=400,height=700,scrollbars=no,resizable=no'
  );
});
</script>
```

## Database Schema

### Conversations Table
```sql
CREATE TABLE conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  assistant_message TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Emails Table
```sql
CREATE TABLE emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  session_id TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **HTTPS**: Always use HTTPS in production
3. **API Keys**: Rotate API keys regularly
4. **Rate Limiting**: Current limits are:
   - Chat: 50 requests per 15 minutes
   - Email: 5 submissions per hour
5. **Input Validation**: All inputs are sanitized
6. **CORS**: Configure for your specific domain in production

## Troubleshooting

### Port already in use
```bash
# Find process using port 3001
lsof -i :3001
# Kill the process
kill -9 <PID>
```

### Database locked error
- Ensure only one instance of the server is running
- Check file permissions on `./data/` directory

### API connection errors
- Verify `ANTHROPIC_API_KEY` is set correctly
- Check API key has sufficient credits
- Ensure network allows outbound HTTPS connections

### Build fails
```bash
# Clear all caches and reinstall
rm -rf node_modules client/node_modules server/node_modules
rm -rf client/dist
npm run install:all
```

## Monitoring & Maintenance

### View Logs (PM2)
```bash
pm2 logs recovery-coach
pm2 monit
```

### Database Maintenance
```bash
# Backup database
cp ./data/conversations.sqlite ./data/backup-$(date +%Y%m%d).sqlite

# View database size
du -h ./data/conversations.sqlite
```

### Performance Monitoring
- Monitor API response times
- Track database size growth
- Set up error logging (consider Sentry or similar)

## Contributing

Contributions welcome! Guidelines:
1. Maintain trauma-informed language
2. Prioritize user safety
3. Include tests for new features
4. Update documentation
5. Follow existing code style

## License

MIT License - Free to use and modify with attribution

## Acknowledgments

Built with compassion for those on the recovery journey.

Special thanks to:
- Anthropic for Claude AI
- The recovery community for shared wisdom
- Trauma researchers and practitioners

## Resources

**For Users:**
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- SAMHSA National Helpline: 1-800-662-4357
- Alcoholics Anonymous: https://www.aa.org
- Narcotics Anonymous: https://www.na.org

**For Developers:**
- Anthropic Claude: https://docs.anthropic.com/
- React: https://react.dev/
- Express: https://expressjs.com/
- Tailwind CSS: https://tailwindcss.com/

---

🌱 **Remember**: Healing is possible. You are not alone. You deserve support.

This tool is one bridge on the path to wholeness. May it serve with compassion.