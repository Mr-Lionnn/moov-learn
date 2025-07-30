-- Create a more robust trigger that handles errors better
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Use explicit SECURITY DEFINER to bypass RLS
  INSERT INTO public.profiles (
    user_id, 
    full_name, 
    email, 
    phone,
    role,
    team,
    site,
    department
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data ->> 'phone',
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student'),
    NEW.raw_user_meta_data ->> 'team',
    NEW.raw_user_meta_data ->> 'site',
    NEW.raw_user_meta_data ->> 'department'
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error in detail but don't block user creation
    RAISE WARNING 'Error creating profile for user %: % - %', NEW.id, SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();