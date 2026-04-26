# 🔧 Login Debugging Guide - Step by Step

## How to Diagnose Login Issues

### Step 1: Open Browser Developer Tools

1. **In your browser, press**: `F12`
2. Click on the **"Console"** tab
3. **Leave it open** while testing login

---

## Step 2: Clear Browser Cache

1. **Close the app completely**
2. Press **Ctrl + Shift + Delete** (Windows) or **Cmd + Shift + Delete** (Mac)
3. Select **"All time"** for Time range
4. Check: ✅ Cookies, ✅ Cached images and files
5. Click **"Clear data"**
6. **Reopen the app** in your browser

---

## Step 3: Try Login and Monitor Console

### What to look for:

**✅ SUCCESS - You should see:**
```
🔧 Supabase Config:
  URL: ✅ Set
  Key: ✅ Set
✅ Supabase client created successfully
i18next: initialized
useProducts hook initialized
🔐 Login attempt started for: ndj92@yahoo.com
✅ Auth sign-in successful for user: [UUID]
✅ User data found in public.users, is_admin: true
```

Then the login modal should **close** and **Admin Panel opens**.

---

## ❌ If You See Errors - Common Issues & Solutions

### ❌ Error: "Invalid login credentials"
```
Error: Invalid login credentials
```
**Solution:**
- Email doesn't exist in Supabase Authentication
- Password is wrong
- **Fix:** Re-create the user in Supabase → Authentication → Users → Add User
  - Email: `ndj92@yahoo.com`
  - Password: (create new password)

---

### ❌ Error: "404 Not Found" or "Relation does not exist"
```
Error: relation "public.users" does not exist
```
**Solution:**
- The `public.users` table was NOT created
- **Fix:** Run `PUBLIC_USERS_SETUP.sql` in Supabase SQL Editor
  1. Open Supabase Dashboard
  2. Go to SQL Editor
  3. Paste entire contents from `PUBLIC_USERS_SETUP.sql`
  4. Click RUN

---

### ❌ Error: "User not found in public.users"
```
⚠️ User not found in public.users table, creating entry...
```
**What it means:** 
- User authenticated successfully in Supabase Auth
- But their record doesn't exist in `public.users` table
- The system will try to auto-create it

**If it keeps appearing:**
- There might be a permissions issue
- **Fix:** Run this SQL in Supabase:
  ```sql
  INSERT INTO public.users (id, email, is_admin)
  SELECT id, email, false FROM auth.users WHERE email = 'ndj92@yahoo.com';
  ```

---

### ❌ Error: "Access denied" or permission errors
```
PostgreSQL error: new row violates row-level security policy
```
**Solution:**
- Row Level Security (RLS) is blocking access
- Make sure you ran the full `PUBLIC_USERS_SETUP.sql` (it includes RLS policies)
- **Fix:** Re-run `PUBLIC_USERS_SETUP.sql` completely

---

### ❌ Error: "Supabase environment variables missing"
```
Missing Supabase environment variables!
```
**Solution:**
- `.env` file is missing or not configured
- Check: `.env` file has these lines:
  ```
  VITE_SUPABASE_URL=https://eqbvtbmdwwyrziuvknpn.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Fix:** Copy from `.env.example` if needed
- Restart the dev server

---

## Step 4: Verify Database State

### Check 1: Does public.users table exist?

In Supabase SQL Editor, run:
```sql
SELECT * FROM public.users;
```

**Expected result:**
- Shows table with columns: id, email, is_admin, created_at, updated_at
- Should have your user: `ndj92@yahoo.com` with `is_admin = true`

**If error "table does not exist":**
→ Run `PUBLIC_USERS_SETUP.sql`

---

### Check 2: Does the user exist in auth?

In Supabase SQL Editor, run:
```sql
SELECT email, created_at FROM auth.users WHERE email = 'ndj92@yahoo.com';
```

**Expected result:**
- Shows: `ndj92@yahoo.com` with a created_at date

**If no results:**
→ Create the user in Supabase Authentication → Users → Add User

---

### Check 3: Is the user marked as admin?

In Supabase SQL Editor, run:
```sql
SELECT email, is_admin FROM public.users WHERE email = 'ndj92@yahoo.com';
```

**Expected result:**
- Shows: `ndj92@yahoo.com` with `is_admin = true`

**If is_admin is false:**
```sql
UPDATE public.users SET is_admin = true WHERE email = 'ndj92@yahoo.com';
```

---

## Step 5: Test Login Sequence

### Complete test flow:

1. ✅ **Open app in browser**
2. ✅ **Click ⚙️ Settings button** (bottom-left)
3. ✅ **Login form appears**
4. ✅ **Enter email:** `ndj92@yahoo.com`
5. ✅ **Enter password:** (the password you created)
6. ✅ **Click Login button**
7. ⏳ **Wait 2 seconds**
8. ✅ **Login form closes**
9. ✅ **Admin Panel opens** with products list

---

## 🆘 Still Not Working?

### Gather Information & Contact Support

**Take a screenshot of:**
1. The login form with error message (if any)
2. The browser console (F12 → Console tab) with error text
3. The Supabase SQL Editor showing:
   ```sql
   SELECT * FROM public.users WHERE email = 'ndj92@yahoo.com';
   ```
   And the result

**Send to:** alafdal.group@gmail.com

Include:
- Screenshots of errors
- Email being tested: `ndj92@yahoo.com`
- Steps you've already tried
- Whether `PUBLIC_USERS_SETUP.sql` was run successfully

---

## 📚 Reference Files

- `PUBLIC_USERS_SETUP.sql` - Database migration
- `ADMIN_SQL_SETUP.md` - SQL reference
- `EXECUTION_CHECKLIST.md` - Setup steps
- `.env` - Supabase credentials (don't share!)

