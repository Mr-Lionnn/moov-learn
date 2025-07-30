-- Check current triggers with correct syntax
SELECT 
    n.nspname as schema_name,
    c.relname as table_name, 
    t.tgname as trigger_name,
    CASE t.tgtype & 2 
        WHEN 2 THEN 'BEFORE'
        ELSE 'AFTER'
    END as timing
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname IN ('auth', 'public')
AND NOT t.tgisinternal;

-- CRITICAL FIX: Create the missing trigger
-- This is why registration fails - users are created in auth.users but no profile is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();