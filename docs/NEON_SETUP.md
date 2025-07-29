# Neon Database Setup Guide

This guide will help you set up a Neon PostgreSQL database for the unv3iled application.

## Step 1: Create a Neon Account

1. Go to [Neon Console](https://console.neon.tech)
2. Sign up for a free account
3. Create a new project called "unv3iled"

## Step 2: Get Your Database URL

1. In your Neon project dashboard, go to the "Connection Details" section
2. Copy the connection string that looks like:
   \`\`\`
   postgresql://username:password@hostname/database?sslmode=require
   \`\`\`

## Step 3: Set Environment Variables

Add these to your `.env.local` file:

\`\`\`bash
# Neon Database
NEON_DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"
NEON_DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"
\`\`\`

## Step 4: Run Database Migrations

1. Open the Neon SQL Editor in your dashboard
2. Copy and paste the contents of `scripts/001-create-database-schema.sql`
3. Execute the script to create all tables and indexes

## Step 5: Test the Connection

1. Start your development server: `npm run dev`
2. Visit: `http://localhost:3000/api/health/database`
3. You should see: `{"status": "healthy", "message": "Database connection successful"}`

## Step 6: Optional - Seed Sample Data

If you want to test with sample data:

1. In the Neon SQL Editor, run the contents of `scripts/002-seed-sample-data.sql`
2. Replace `'sample_user_id'` with an actual user ID after creating a user

## Troubleshooting

### Connection Issues
- Make sure your connection string includes `?sslmode=require`
- Check that your IP is allowed (Neon allows all IPs by default)
- Verify the database name, username, and password are correct

### Permission Issues
- Ensure your database user has CREATE, INSERT, UPDATE, DELETE permissions
- The default Neon user should have all necessary permissions

### Migration Issues
- Run migrations one at a time if you encounter errors
- Check the Neon logs for detailed error messages
- Make sure you're using a PostgreSQL-compatible syntax

## Database Schema Overview

The database includes these main tables:

- `users` - User profiles from Clerk
- `platform_connections` - Connected platforms (Spotify, YouTube, etc.)
- `taste_profiles` - User taste data from platforms
- `predictions` - AI-generated predictions
- `chat_messages` - Geoffrey AI conversations
- `taste_influences` - Cultural influences analysis
- `serendipity_recommendations` - Lucky recommendations
- `user_settings` - User preferences
- `user_analytics` - Usage tracking

## Next Steps

After setting up the database:

1. Configure Clerk webhooks to create users automatically
2. Test the authentication flow
3. Connect platform APIs for data collection
4. Deploy to Vercel with the same environment variables
