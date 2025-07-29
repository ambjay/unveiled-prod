-- Insert sample predictions for demo purposes
-- Note: This will only work after users are created via the application

-- Sample taste influences data
INSERT INTO taste_influences (user_id, influence_type, influence_name, influence_strength, influence_data) VALUES
('sample_user_id', 'genre', 'Indie Rock', 0.85, '{"description": "Strong preference for independent rock music", "examples": ["Arctic Monkeys", "The Strokes", "Vampire Weekend"]}'),
('sample_user_id', 'era', '2000s Alternative', 0.78, '{"description": "Nostalgic connection to 2000s alternative music", "peak_years": ["2003", "2007"]}'),
('sample_user_id', 'social', 'Music Discovery Communities', 0.65, '{"platforms": ["Reddit", "Last.fm"], "influence_level": "moderate"}');

-- Sample user settings
INSERT INTO user_settings (user_id, setting_key, setting_value) VALUES
('sample_user_id', 'notification_preferences', '{"email": true, "push": false, "prediction_alerts": true}'),
('sample_user_id', 'privacy_settings', '{"share_taste_profile": false, "anonymous_analytics": true}'),
('sample_user_id', 'prediction_preferences', '{"confidence_threshold": 0.7, "categories": ["music", "gaming", "video"]}');
