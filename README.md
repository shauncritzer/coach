# REWIRED Recovery Coach

AI-powered recovery coach using Shaun Critzer's REWIRED methodology - a trauma-informed, nervous system-centered approach to addiction recovery.

## About REWIRED

This coach supports individuals struggling with addiction and compulsive behaviors through five core principles:

1. **Nervous System First** - All compulsive behaviors are nervous system dysregulation attempts
2. **Process Addictions** - Addresses substances AND behaviors (porn, affairs, work, fitness, bodybuilding)
3. **Trauma-Informed** - Healing requires processing stored trauma, not just managing symptoms
4. **Practical Tools** - Breathwork, morning routines, sponsorship, and service
5. **No Shame Approach** - Addiction is adaptation, not moral failure

## Tech Stack

- **Backend**: Node.js + Express
- **AI**: Anthropic Claude 3.5 Sonnet
- **Deployment**: Vercel (serverless)
- **Frontend**: Vanilla HTML/CSS/JavaScript

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

## Deployment to Vercel

### Step-by-Step Deployment Instructions

1. **Install Vercel CLI (optional)**
   ```bash
   npm install -g vercel
   ```

2. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

3. **Deploy via Vercel Dashboard**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: Other
     - Root Directory: ./
     - Build Command: (leave empty)
     - Output Directory: public

4. **Add Environment Variable**
   - In Vercel project settings, go to "Environment Variables"
   - Add: `ANTHROPIC_API_KEY` with your API key
   - Apply to: Production, Preview, and Development

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Visit your live URL!

### Alternative: Deploy via CLI

```bash
vercel
# Follow prompts, then add environment variable:
vercel env add ANTHROPIC_API_KEY
# Redeploy:
vercel --prod
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Yes |

Get your API key at: https://console.anthropic.com/

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/chat` - Chat with the AI coach (streaming)

## Project Structure

```
coach/
├── server/
│   ├── index.js      # Express server & API routes
│   └── prompts.js    # AI system prompt with REWIRED methodology
├── public/
│   └── index.html    # Frontend interface
├── package.json      # Dependencies
├── vercel.json       # Vercel configuration
└── README.md         # This file
```

## License

MIT

## Author

Shaun Critzer
