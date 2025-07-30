-- Test if we can manually create a user profile
-- First, let's check the current auth settings
SELECT 
  raw_app_meta_data,
  raw_user_meta_data,
  email_confirmed_at,
  confirmation_sent_at
FROM auth.users 
LIMIT 1;