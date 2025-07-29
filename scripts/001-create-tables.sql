-- Users table (extends Clerk user data)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Platform connections
CREATE TABLE IF NOT EXISTS platform_connections (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  platform_name TEXT NOT NULL,
  platform_user_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  connected_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, platform_name)
);

-- User preferences and taste data
CREATE TABLE IF NOT EXISTS taste_profiles (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  category TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Predictions from Qloo
CREATE TABLE IF NOT EXISTS predictions (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  entity_name TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  confidence_score DECIMAL(3,2) NOT NULL,
  predicted_timeframe TEXT,
  reasoning TEXT,
  qloo_prediction_id TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  is_viewed BOOLEAN DEFAULT FALSE
);

-- User interactions with predictions
CREATE TABLE IF NOT EXISTS prediction_interactions (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  prediction_id INTEGER REFERENCES predictions(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- 'like', 'dislike', 'share', 'explore'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages with Geoffrey
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_platform_connections_user_platform ON platform_connections(user_id, platform_name);
CREATE INDEX IF NOT EXISTS idx_taste_profiles_user_platform ON taste_profiles(user_id, platform);
CREATE INDEX IF NOT EXISTS idx_predictions_user_created ON predictions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_created ON chat_messages(user_id, created_at DESC);
