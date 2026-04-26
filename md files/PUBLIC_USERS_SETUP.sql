-- ═══════════════════════════════════════════════════════════════════════════
-- PUBLIC.USERS TABLE SETUP
-- ═══════════════════════════════════════════════════════════════════════════
-- This SQL migration creates the public.users table linked to Supabase Auth
-- Copy the entire contents and paste into Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- 1️⃣ CREATE public.users TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  is_admin boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2️⃣ ENABLE ROW LEVEL SECURITY
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3️⃣ CREATE ROW LEVEL SECURITY POLICIES

-- Policy 1: Users can read their own data
CREATE POLICY "Users can read their own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Authenticated users can read other users' public data (non-admin info)
CREATE POLICY "Authenticated users can read all users"
  ON public.users
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy 3: Users can update their own data
CREATE POLICY "Users can update their own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy 4: Admins can update any user
CREATE POLICY "Admins can update any user"
  ON public.users
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
  ));

-- Policy 5: Admins can delete any user
CREATE POLICY "Admins can delete any user"
  ON public.users
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
  ));

-- 4️⃣ CREATE TRIGGER FUNCTION FOR AUTO-SYNC

-- Function to handle new users from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5️⃣ CREATE TRIGGER
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6️⃣ CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS users_is_admin_idx ON public.users(is_admin) WHERE is_admin = true;

-- 7️⃣ GRANT PERMISSIONS
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- NEXT STEPS AFTER RUNNING THIS SQL:
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Create a test user in Supabase Authentication console:
--    Go to: Dashboard → Authentication → Users → Add User
--    Email: admin@test.com
--    Password: (create a strong password)

-- 2. Make the user an admin with this SQL:
--    UPDATE public.users SET is_admin = true WHERE email = 'admin@test.com';

-- 3. Verify the setup:
--    SELECT * FROM public.users WHERE email = 'admin@test.com';
--    (Should show: is_admin = true)

-- 4. Test the login in your app:
--    Click the Settings ⚙️ icon
--    Login with admin@test.com and the password you created
--    You should see the admin panel

-- ═══════════════════════════════════════════════════════════════════════════
-- TROUBLESHOOTING
-- ═══════════════════════════════════════════════════════════════════════════

-- Check if table was created:
-- SELECT * FROM public.users;

-- Check if trigger is working:
-- SELECT * FROM public.users WHERE email = 'admin@test.com';

-- Check RLS is enabled:
-- SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename='users';

-- Check policies exist:
-- SELECT * FROM pg_policies WHERE tablename = 'users';

-- List all admins:
-- SELECT email, is_admin FROM public.users WHERE is_admin = true;
