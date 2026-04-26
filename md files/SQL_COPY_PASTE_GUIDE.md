# Copy-Paste Ready SQL Commands

## 🚀 Main Migration (Run First)

**File:** `PUBLIC_USERS_SETUP.sql` - Copy all and paste into Supabase SQL Editor

Location in project: `/PUBLIC_USERS_SETUP.sql`

Steps:
1. Go to Supabase Dashboard
2. Click SQL Editor
3. Click New Query
4. Open `/PUBLIC_USERS_SETUP.sql` in your editor
5. Select all (Ctrl+A) and copy
6. Paste into Supabase SQL Editor
7. Click RUN
8. Wait for ✅ green checkmark

---

## Step 2: Create Test User

**In Supabase Dashboard:**
- Go to: Authentication → Users
- Click: Add User
- Email: `admin@test.com`
- Password: `Test123!@#` (strong password)
- Click: Create User

---

## Step 3: Make Admin (Copy-Paste This SQL)

```sql
UPDATE public.users SET is_admin = true WHERE email = 'admin@test.com';
```

**In Supabase SQL Editor:**
1. Click New Query
2. Paste the SQL above
3. Replace `admin@test.com` if using different email
4. Click RUN
5. Should show "1 row updated"

---

## Step 4: Verify Setup

```sql
SELECT * FROM public.users WHERE email = 'admin@test.com';
```

**Expected Output:**
```
id          | email           | full_name | avatar_url | is_admin | created_at
------------|-----------------|-----------|------------|----------|------------------
[UUID]      | admin@test.com  | [null]    | [null]     | true     | 2026-01-22
```

---

## Additional Useful Commands

### See All Admins
```sql
SELECT email, is_admin FROM public.users WHERE is_admin = true;
```

### Remove Admin Status
```sql
UPDATE public.users SET is_admin = false WHERE email = 'admin@test.com';
```

### List All Users
```sql
SELECT email, is_admin, created_at FROM public.users ORDER BY created_at DESC;
```

### Delete a User (Admin Only)
```sql
DELETE FROM public.users WHERE email = 'admin@test.com';
```

### Check Table Structure
```sql
\d public.users
```

---

## Troubleshooting Commands

### Check if table exists
```sql
SELECT * FROM public.users;
```

If you get error "relation 'public.users' does not exist":
- Run the main migration from `PUBLIC_USERS_SETUP.sql`

### Check if trigger is working
```sql
SELECT * FROM public.users WHERE email = 'admin@test.com';
```

### Check RLS policies
```sql
SELECT * FROM pg_policies WHERE tablename = 'users';
```

Should show 5 policies:
1. Users can read their own data
2. Authenticated users can read all users
3. Users can update their own data
4. Admins can update any user
5. Admins can delete any user

---

## In Your React App

After SQL setup:

1. Click ⚙️ Settings (bottom-left corner)
2. Login form appears
3. Enter: `admin@test.com` / `Test123!@#`
4. Click LOGIN
5. Should see Admin Panel ✅

If still getting 404:
- Refresh browser (F5)
- Check browser DevTools (F12) → Console for errors
- Verify SQL ran without errors in Supabase

---

## That's It!

You're done with SQL setup. The app should now:
- ✅ Show login form when clicking Settings
- ✅ Accept admin credentials
- ✅ Display admin panel
- ✅ Allow CRUD operations on products

**Next:** Read [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for detailed walkthrough
