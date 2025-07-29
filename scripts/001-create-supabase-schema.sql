-- Enable UUID extension for better ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Clerk user data)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform connections
CREATE TABLE IF NOT EXISTS platform_connections (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  platform_name TEXT NOT NULL,
  platform_user_id TEXT,
  platform_username TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  connection_data JSONB DEFAULT '{}',
  UNIQUE(user_id, platform_name)
);

-- User preferences and taste data from platforms
CREATE TABLE IF NOT EXISTS taste_profiles (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  category TEXT NOT NULL, -- 'music', 'gaming', 'video', 'social'
  data JSONB NOT NULL,
  confidence_score DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform, category)
);

-- Predictions from Qloo or our AI system
CREATE TABLE IF NOT EXISTS predictions (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  entity_name TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'song', 'album', 'artist', 'game', 'movie', 'show', 'book'
  entity_id TEXT,
  entity_metadata JSONB DEFAULT '{}',
  confidence_score DECIMAL(3,2) NOT NULL,
  predicted_timeframe TEXT,
  reasoning TEXT,
  prediction_source TEXT DEFAULT 'internal', -- 'qloo', 'internal', 'hybrid'
  qloo_prediction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_viewed BOOLEAN DEFAULT FALSE,
  is_accurate BOOLEAN, -- User feedback on prediction accuracy
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5)
);

-- User interactions with predictions
CREATE TABLE IF NOT EXISTS prediction_interactions (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  prediction_id INTEGER REFERENCES predictions(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- 'like', 'dislike', 'share', 'explore', 'save', 'dismiss'
  interaction_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, prediction_id, interaction_type)
);

-- Chat messages with Geoffrey
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT,
  message_type TEXT DEFAULT 'chat', -- 'chat', 'recommendation_request', 'feedback'
  context_data JSONB DEFAULT '{}',
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User taste influences and cultural DNA
CREATE TABLE IF NOT EXISTS taste_influences (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  influence_type TEXT NOT NULL, -- 'artist', 'genre', 'era', 'social', 'seasonal'
  influence_name TEXT NOT NULL,
  influence_strength DECIMAL(3,2) NOT NULL, -- 0.0 to 1.0
  influence_data JSONB DEFAULT '{}',
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Time machine historical projections
CREATE TABLE IF NOT EXISTS historical_projections (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  era TEXT NOT NULL, -- '1960s', '1970s', etc.
  projection_data JSONB NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Serendipity recommendations
CREATE TABLE IF NOT EXISTS serendipity_recommendations (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  recommendation_data JSONB NOT NULL,
  algorithm_version TEXT DEFAULT 'v1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_feedback TEXT, -- 'loved', 'liked', 'disliked', 'not_interested'
  feedback_at TIMESTAMP WITH TIME ZONE
);

-- User settings and preferences
CREATE TABLE IF NOT EXISTS user_settings (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, setting_key)
);

-- Analytics and usage tracking
CREATE TABLE IF NOT EXISTS user_analytics (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE INDEX IF NOT EXISTS idx_platform_connections_user_platform ON platform_connections(user_id, platform_name);
CREATE INDEX IF NOT EXISTS idx_platform_connections_active ON platform_connections(user_id, is_active);

CREATE INDEX IF NOT EXISTS idx_taste_profiles_user_platform ON taste_profiles(user_id, platform);
CREATE INDEX IF NOT EXISTS idx_taste_profiles_category ON taste_profiles(user_id, category);

CREATE INDEX IF NOT EXISTS idx_predictions_user_created ON predictions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_user_viewed ON predictions(user_id, is_viewed);
CREATE INDEX IF NOT EXISTS idx_predictions_confidence ON predictions(confidence_score DESC);

CREATE INDEX IF NOT EXISTS idx_prediction_interactions_user ON prediction_interactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prediction_interactions_prediction ON prediction_interactions(prediction_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_created ON chat_messages(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_taste_influences_user_active ON taste_influences(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_taste_influences_strength ON taste_influences(influence_strength DESC);

CREATE INDEX IF NOT EXISTS idx_historical_projections_user_era ON historical_projections(user_id, era);

CREATE INDEX IF NOT EXISTS idx_serendipity_user_created ON serendipity_recommendations(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_settings_user_key ON user_settings(user_id, setting_key);

CREATE INDEX IF NOT EXISTS idx_user_analytics_user_event ON user_analytics(user_id, event_type, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE taste_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE taste_influences ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_projections ENABLE ROW LEVEL SECURITY;
ALTER TABLE serendipity_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (users can only access their own data)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Users can view own platform connections" ON platform_connections FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can view own taste profiles" ON taste_profiles FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can view own predictions" ON predictions FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can view own prediction interactions" ON prediction_interactions FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can view own chat messages" ON chat_messages FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can view own taste influences" ON taste_influences FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can view own historical projections" ON historical_projections FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can view own serendipity recommendations" ON serendipity_recommendations FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can view own settings" ON user_settings FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can view own analytics" ON user_analytics FOR ALL USING (auth.uid()::text = user_id);
