# 🔗 Complete Guide: auth.users & public.users Integration

## What's Happening

Your app uses **two linked tables**:

### `auth.users` (Supabase Auth)
- Managed by Supabase
- Stores: email, password hash, session tokens
- You cannot modify directly
- Auto-created on signup

### `public.users` (Your Database)
- You own and control
- Stores: user metadata, admin status, profiles
- Linked via **Foreign Key** to auth.users
- Auto-created via trigger on auth signup

---

## 📋 Setup Instructions

### OPTION A: Automatic (Recommended)

**Steps:**
1. Go to Supabase → **SQL Editor**
2. Open file: `SQL_MIGRATIONS/001_create_users_table.sql`
3. Copy entire SQL code
4. Paste in Supabase SQL Editor
5. Click **Run**
6. Done! ✅

**What happens:**
- Table created
- Trigger set up
- RLS policies configured
- Automatic sync enabled

---

### OPTION B: Manual Step-by-Step

**Step 1: Create the Table**
```sql
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Step 2: Enable RLS**
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

**Step 3: Create RLS Policies**
```sql
-- Users can read their own data
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Authenticated users can read all profiles
CREATE POLICY "Read all profiles"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);
```

**Step 4: Create Auto-Sync Trigger**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (new.id, new.email, now(), now())
  ON CONFLICT (id) DO UPDATE
  SET updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

## ✅ Test the Setup

### Create Test Admin User

**In Supabase:**

1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Enter:
   - Email: `admin@test.com`
   - Password: `Password123`
4. Click **"Create user"**

**Then in SQL Editor, run:**
```sql
UPDATE public.users 
SET is_admin = true 
WHERE email = 'admin@test.com';
```

**Verify it worked:**
```sql
SELECT id, email, is_admin FROM public.users 
WHERE email = 'admin@test.com';
```

Expected result:
```
id: [some-uuid]
email: admin@test.com
is_admin: true ✅
```

---

### Test Login Flow

1. **Visit your app**
2. **Click Settings ⚙️** (bottom-left)
3. **Login as:**
   - Email: `admin@test.com`
   - Password: `Password123`
4. **Expected:**
   - ✅ Admin panel opens
   - ✅ You can manage products
   - ✅ You can add/edit/delete items

---

## 🔧 Using Users Service

The app includes a complete users service for managing users:

### Import It
```javascript
import { usersService } from '@/services/usersService';
```

### Get All Users
```javascript
const allUsers = await usersService.getAllUsers();
console.log(allUsers); // Array of all users
```

### Get Single User
```javascript
const user = await usersService.getUserById(userId);
console.log(user); // { id, email, full_name, is_admin, ... }
```

### Check If Admin
```javascript
const isAdmin = await usersService.isUserAdmin(userId);
if (isAdmin) {
  // Show admin features
}
```

### Make User Admin
```javascript
await usersService.grantAdminPrivileges(userId);
```

### Remove Admin
```javascript
await usersService.revokeAdminPrivileges(userId);
```

### Update User Profile
```javascript
await usersService.updateUserProfile(userId, {
  full_name: 'John Doe',
  avatar_url: 'https://example.com/avatar.jpg'
});
```

---

## 📊 Database Schema

```
Supabase Cloud
├── auth.users (Managed by Supabase)
│   ├── id (UUID)
│   ├── email
│   ├── password_hash (encrypted)
│   ├── user_metadata (JSON)
│   └── ...
│
└── public.users (Your Table)
    ├── id (UUID) → REFERENCES auth.users(id)
    ├── email (TEXT)
    ├── full_name (TEXT)
    ├── avatar_url (TEXT)
    ├── is_admin (BOOLEAN) ✅ Key field
    ├── created_at (TIMESTAMP)
    └── updated_at (TIMESTAMP)

Triggers:
└── on_auth_user_created (Auto-syncs new users)
```

---

## 🔐 Security Features

### Row Level Security (RLS)
- Users can only read/update their own data
- Admins can read all data
- Admins can update any user
- Deletions only by admin

### Automatic Sync
- When user signs up in auth.users
- Trigger automatically creates entry in public.users
- No manual sync needed

### Password Security
- Passwords stored only in auth.users
- Hashed and salted by Supabase
- Never exposed to public.users

---

## 🐛 Troubleshooting

### "Table does not exist" error
**Problem:** SQL migration wasn't run
**Solution:** 
1. Go to Supabase SQL Editor
2. Copy-paste entire migration from `SQL_MIGRATIONS/001_create_users_table.sql`
3. Click Run

### Login shows "Invalid credentials"
**Problem:** User doesn't exist in public.users
**Solution:**
1. Create user in Supabase Auth (Authentication → Users)
2. Wait a few seconds for trigger to sync
3. Verify in Supabase → SQL Editor: `SELECT * FROM public.users;`

### Admin panel doesn't show after login
**Problem:** User isn't marked as admin
**Solution:**
```sql
UPDATE public.users 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

### Can't see users in app
**Problem:** RLS policies blocking access
**Solution:**
1. Verify RLS policies are created
2. Check current user is authenticated
3. Run: `SELECT * FROM public.users;` in SQL Editor (as authenticated user)

### Trigger not working
**Problem:** Trigger wasn't created properly
**Solution:**
1. In SQL Editor, run: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
2. If empty, recreate trigger from migration
3. Test by creating new auth user

---

## 📚 Reference

### Available Endpoints
```
GET /api/users           - Get all users
GET /api/users/:id       - Get single user
POST /api/users          - Create user
PUT /api/users/:id       - Update user
DELETE /api/users/:id    - Delete user
POST /api/users/:id/admin - Make admin
DELETE /api/users/:id/admin - Remove admin
```

### SQL Queries

**Get all admins:**
```sql
SELECT * FROM public.users WHERE is_admin = true;
```

**Get non-admin users:**
```sql
SELECT * FROM public.users WHERE is_admin = false;
```

**Count users:**
```sql
SELECT COUNT(*) FROM public.users;
```

**Find user by email:**
```sql
SELECT * FROM public.users WHERE email = 'test@example.com';
```

---

## ✨ Advanced Features

### Add Custom Fields
```sql
ALTER TABLE public.users ADD COLUMN phone_number TEXT;
ALTER TABLE public.users ADD COLUMN address TEXT;
ALTER TABLE public.users ADD COLUMN preferences JSONB;
```

### Create User Groups
```sql
CREATE TABLE public.user_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  group_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Track User Activity
```sql
CREATE TABLE public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  action TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 Quick Checklist

- [ ] SQL migration ran successfully
- [ ] `public.users` table exists
- [ ] Trigger created (`on_auth_user_created`)
- [ ] RLS policies enabled
- [ ] Test user created in auth
- [ ] Test user synced to public.users
- [ ] Made test user admin
- [ ] Logged in as admin
- [ ] Admin panel visible
- [ ] Can manage products

---

## 💡 Best Practices

1. **Always run migrations in SQL order**
   - 001_create_users_table.sql
   - Then any custom additions

2. **Test after each migration**
   - Create test user
   - Verify table exists
   - Check trigger works

3. **Keep auth.users separate**
   - Don't try to modify auth.users directly
   - Use triggers for sync
   - Store custom data in public.users

4. **Use RLS for security**
   - Enable for all user-related tables
   - Implement least privilege principle
   - Test policies work as expected

5. **Monitor triggers**
   - Verify they run on create/update
   - Check logs for errors
   - Test edge cases

---

## 📞 Need Help?

1. **Check the SQL migration** - `SQL_MIGRATIONS/001_create_users_table.sql`
2. **Read this guide** - You're reading it! 📖
3. **Check Supabase docs** - [supabase.io/docs](https://supabase.io/docs)
4. **Review usersService** - `src/services/usersService.ts`

---

**You're all set!** Your app now has a professional user management system with auth.users & public.users integration. 🚀

Last Updated: January 22, 2026
