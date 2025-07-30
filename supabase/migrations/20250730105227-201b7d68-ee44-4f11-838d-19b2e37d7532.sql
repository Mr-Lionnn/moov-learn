-- Check current triggers
SELECT 
    schemaname,
    tablename, 
    triggername,
    actiontiming,
    actionstatement
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname IN ('auth', 'public');

-- Critical Issue Found: The trigger is missing!
-- Create the missing trigger that should automatically create profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also ensure proper RLS policies exist
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';