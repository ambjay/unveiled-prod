# unv3iled - AI-Powered Taste Prediction Platform

Discover what you'll love before you know you love it.

## 🚀 Quick Start

1. **Clone and install**:
   \`\`\`bash
   git clone <repo>
   cd unv3iled
   npm install
   \`\`\`

2. **Set up core services**:
   - **Clerk**: [Get API keys](https://dashboard.clerk.com/last-active?path=api-keys)
   - **Supabase**: [Create project](https://supabase.com/dashboard)
   - **Groq**: [Get API key](https://console.groq.com/keys)

3. **Environment variables**:
   \`\`\`bash
   cp .env.example .env.local
   # Fill in your API keys
   \`\`\`

4. **Database setup**:
   - Run `scripts/001-create-supabase-schema.sql` in Supabase SQL Editor

5. **Start development**:
   \`\`\`bash
   npm run dev
   \`\`\`

## ✅ Core Features (Live)

- **Geoffrey AI Assistant**: Lightning-fast chat powered by Groq
- **Future Predictions**: AI-generated content predictions
- **Cultural DNA Analysis**: Deep taste pattern analysis
- **Time Machine**: Historical taste projections
- **Serendipity Engine**: Unexpected perfect recommendations
- **Platform Integration**: Connect Spotify, YouTube, Steam, Twitter/X

## 🔜 Coming Soon

- **Social Features**: Taste compatibility, communities, sharing
- **Advanced Analytics**: Detailed prediction accuracy tracking
- **Voice Features**: Talk to Geoffrey with voice commands

## 🔧 Platform Integrations

### Required (Core Platform)
- ✅ **Clerk**: User authentication
- ✅ **Supabase**: Database and real-time features  
- ✅ **Groq**: Fast AI responses (10x faster than OpenAI)

### Optional (Enhanced Features)
- 🔌 **Spotify**: Music streaming data
- 🔌 **YouTube**: Video consumption patterns
- 🔌 **Twitter/X**: Social media engagement
- 🔌 **Steam**: Gaming preferences

## 🏗️ Architecture

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Authentication**: Clerk (with Supabase RLS)
- **Database**: Supabase PostgreSQL
- **AI**: Vercel AI SDK with Groq (Llama 3.1 70B)
- **Deployment**: Vercel

## 📊 Performance

- **Geoffrey responses**: ~200ms (vs 2-3s with OpenAI)
- **Database queries**: Sub-100ms with Supabase edge
- **Predictions**: Generated in real-time using structured output

## 🔐 Security

- Row Level Security (RLS) ensures users only access their data
- API keys are properly scoped and secured
- All platform integrations use OAuth 2.0

## 🚀 Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The app will automatically show setup instructions for missing services.
