# Admin Setup - SQL Scripts

## � IMPORTANT: Run This FIRST!

**You must create the `public.users` table before admin login will work!**

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Run SQL Migration

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Open the file: `PUBLIC_USERS_SETUP.sql` (in your project root)
4. Copy and paste the entire SQL into the editor
5. Click **Run** button

**Wait 5-10 seconds for the query to complete.**

---

### Step 2: Create Test Admin User

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **Add User** button
3. Enter:
   - **Email:** `admin@test.com` (or your email)
   - **Password:** Create a strong password (you'll need this to login)
4. Click **Create User**

---

### Step 3: Make User an Admin

1. Go back to **SQL Editor**
2. Paste this command:

```sql
UPDATE public.users SET is_admin = true WHERE email = 'admin@test.com';
```

3. Replace `admin@test.com` with the email you used in Step 2
4. Click **Run**

---

## ✅ Verify Setup Works

Run this SQL to check:

```sql
SELECT * FROM public.users WHERE email = 'admin@test.com';
```

**Expected Result:**
```
id       | email           | is_admin | created_at
---------|-----------------|----------|------------------
[UUID]   | admin@test.com  | true     | 2026-01-22
```

---

## 🧪 Test Login

1. In your app, click the **Settings ⚙️** icon (bottom-left)
2. You should see a **Login Form**
3. Enter:
   - Email: `admin@test.com`
   - Password: (the password you created)
4. Click **Login**
5. You should see the **Admin Panel** with Products, Users, Analytics, etc.

---

## 🔧 Troubleshooting

### ❌ Still seeing "404" error on login?

**The table might not exist yet.**

1. Go to Supabase SQL Editor
2. Run: `SELECT * FROM public.users;`
3. If you see an error saying "table does not exist", run the full SQL from `PUBLIC_USERS_SETUP.sql`

### ❌ "Access Denied" after login?

**The user is authenticated but not an admin.**

Run this SQL:

```sql
UPDATE public.users SET is_admin = true WHERE email = 'admin@test.com';
```

Then try logging in again.

### ❌ Login fails with wrong credentials?

1. Make sure you're using the email and password from Step 2
2. Check in Supabase: Dashboard → Authentication → Users
3. Verify the user exists and is "Confirmed"

### ❌ Can't find SQL Editor?

Go to your Supabase Dashboard:
1. Click your project name
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

---

## 📚 What This Setup Does

1. **Creates `public.users` table** - Stores user profiles linked to auth
2. **Enables Row Level Security** - Controls who can access what
3. **Creates Auto-Sync Trigger** - New users are automatically added to `public.users`
4. **Sets Up Indexes** - Makes queries fast
5. **Creates Admin Policies** - Allows admins to manage other users

---

## 🎯 Next Steps After Verification

Once login works:

1. ✅ Create 2-3 test admin users for testing
2. ✅ Create 2-3 regular users for testing
3. ✅ Test adding/editing products
4. ✅ Test logout and login again
5. ✅ Deploy to production

---

## 🚀 Production Setup

Before going live:

1. Create real admin accounts for your team
2. Update email addresses in your system
3. Set strong passwords
4. Store credentials securely
5. Test all flows end-to-end
6. Backup your database

---

## 📞 Need Help?

If something isn't working:

1. Check the **Troubleshooting** section above
2. Verify the SQL ran without errors (green checkmark)
3. Check browser console for error messages (press F12)
4. Contact: alafdal.group@gmail.com

---

**Status:** ⏳ Waiting for you to run the SQL!

**Next action:** Copy `PUBLIC_USERS_SETUP.sql` content and paste it into Supabase SQL Editor
