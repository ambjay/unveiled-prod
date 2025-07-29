# Supabase Setup Guide

This guide will help you set up Supabase for the unv3iled application.

## Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Name your project "unv3iled"
5. Create a strong database password
6. Select a region close to your users
7. Click "Create new project"

## Step 2: Get Your API Keys

1. In your project dashboard, go to Settings → API
2. Copy these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon (public) key**: `eyJ...` (starts with eyJ)
   - **Service role key**: `eyJ...` (starts with eyJ, keep this secret!)

## Step 3: Set Environment Variables

Add these to your `.env.local` file:

\`\`\`bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
\`\`\`

## Step 4: Run Database Schema

1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `scripts/001-create-supabase-schema.sql`
3. Click "Run" to create all tables and policies

## Step 5: Test the Connection

1. Start your development server: `npm run dev`
2. Visit: `http://localhost:3000/api/health/database`
3. You should see: `{"status": "healthy", "message": "Database connection successful"}`

## Step 6: Configure Row Level Security (RLS)

The schema automatically sets up RLS policies so users can only access their own data. This is already configured in the SQL script.

## Why Supabase?

- **Easier setup** than Neon (no connection string complexity)
- **Built-in authentication** (though we use Clerk)
- **Real-time features** for future enhancements
- **Automatic backups** and scaling
- **Great developer experience** with dashboard

## Troubleshooting

### Connection Issues
- Make sure your project URL is correct (no trailing slash)
- Verify your anon key is the public one, not the service role key
- Check that your project is not paused (free tier pauses after inactivity)

### Permission Issues
- RLS policies are automatically created by the schema
- Make sure you're using the correct user ID format (Clerk user ID)

### Schema Issues
- Run the SQL script in the Supabase SQL Editor
- Check the logs in the dashboard for any errors
- Make sure all tables were created successfully

## Next Steps

After setting up Supabase:

1. Configure Clerk webhooks to create users automatically
2. Test the authentication flow
3. Add platform API keys for data collection
4. Deploy to Vercel with the same environment variables
