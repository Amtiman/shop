# 📊 Public Users Table Setup

## Overview

Your application uses a **public.users** table that is **linked to auth.users**. This allows you to:
- Store additional user metadata
- Track admin status
- Manage user profiles separately
- Implement Row Level Security (RLS)

---

## ⚡ Quick Setup

### Step 1: Run the SQL Migration

1. Open **Supabase Dashboard** → **SQL Editor**
2. Create a new query
3. Copy and paste the entire content from: `SQL_MIGRATIONS/001_create_users_table.sql`
4. Click **Run**

This will:
- ✅ Create the `public.users` table
- ✅ Link it to `auth.users`
- ✅ Set up Row Level Security (RLS)
- ✅ Create automatic sync trigger
- ✅ Create indexes for performance

### Step 2: Make First User an Admin

After running the migration, run this SQL command:

```sql
UPDATE public.users 
SET is_admin = true 
WHERE email = 'YOUR_EMAIL@example.com';
```

Replace `YOUR_EMAIL@example.com` with your actual admin email.

---

## 🔗 How It Works

### Automatic User Sync

When a user signs up in `auth.users`:
1. ✅ Auth user is created
2. ✅ Trigger automatically creates entry in `public.users`
3. ✅ User profile is synced

### Database Structure

```
auth.users (Supabase Auth)
    ↓ (Foreign Key)
public.users (Your App)
    ├── id (UUID) - Links to auth.users
    ├── email - User's email
    ├── full_name - User's name
    ├── avatar_url - User's avatar
    ├── is_admin - Admin status ✅
    ├── created_at - Account creation date
    └── updated_at - Last update date
```

---

## 🔐 Row Level Security (RLS)

The table has RLS enabled with these policies:

| Policy | Who | Action | Condition |
|--------|-----|--------|-----------|
| Read Own Profile | Authenticated | SELECT | `auth.uid() = id` |
| Update Own Profile | Authenticated | UPDATE | `auth.uid() = id` |
| Read All Profiles | Authenticated | SELECT | Always |
| Admin Update | Authenticated | UPDATE | Is Admin |
| Admin Delete | Authenticated | DELETE | Is Admin |

---

## 👥 User Management

### Get All Users
```typescript
import { usersService } from '@/services/usersService';

const users = await usersService.getAllUsers();
```

### Get Single User
```typescript
const user = await usersService.getUserById(userId);
```

### Get User by Email
```typescript
const user = await usersService.getUserByEmail('email@example.com');
```

### Create Admin User
```typescript
// In Supabase SQL Editor:
UPDATE public.users 
SET is_admin = true 
WHERE email = 'admin@example.com';
```

### Remove Admin Privileges
```typescript
// In Supabase SQL Editor:
UPDATE public.users 
SET is_admin = false 
WHERE email = 'admin@example.com';
```

---

## 📝 Available Services

All functions in `src/services/usersService.ts`:

```typescript
// Get all users
usersService.getAllUsers()

// Get user by ID
usersService.getUserById(id)

// Get user by email
usersService.getUserByEmail(email)

// Create user profile
usersService.createUserProfile(userId, userData)

// Update user profile
usersService.updateUserProfile(userId, updates)

// Grant admin
usersService.grantAdminPrivileges(userId)

// Revoke admin
usersService.revokeAdminPrivileges(userId)

// Delete user
usersService.deleteUserProfile(userId)

// Get admin users only
usersService.getAdminUsers()

// Check if user is admin
usersService.isUserAdmin(userId)
```

---

## 🧪 Test It

### Step 1: Create Test Users in Supabase
1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Create 2 test users:
   - `admin@test.com` / `Password123`
   - `user@test.com` / `Password123`

### Step 2: Make One User Admin
In **SQL Editor**, run:
```sql
UPDATE public.users 
SET is_admin = true 
WHERE email = 'admin@test.com';
```

### Step 3: Test Login
1. Click **Settings ⚙️** (bottom-left)
2. Login as `admin@test.com`
3. You should see the **Admin Panel**
4. Logout and try `user@test.com`
5. You should see **Access Denied**

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] SQL migration ran successfully
- [ ] `public.users` table exists in Supabase
- [ ] First user is marked as admin
- [ ] New signups automatically create `public.users` entry
- [ ] Admin login shows admin panel
- [ ] Non-admin login shows access denied
- [ ] Can read all user profiles (authenticated users)
- [ ] Can update own profile
- [ ] Admins can update any profile

---

## 🆘 Troubleshooting

### Users table doesn't exist
**Solution:** Run the SQL migration from `SQL_MIGRATIONS/001_create_users_table.sql`

### Login doesn't work
**Solution:** Check that user exists in `public.users` table in Supabase

### Admin panel doesn't show
**Solution:** Make sure user has `is_admin = true` in `public.users`

### Can't update user
**Solution:** Check RLS policies are enabled and correct

### Automatic sync not working
**Solution:** Verify trigger was created successfully in SQL Editor

---

## 📚 More Info

- [Supabase Users & Auth](https://supabase.io/docs/guides/auth)
- [Row Level Security](https://supabase.io/docs/guides/auth/row-level-security)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/triggers.html)

---

## 🎯 Next Steps

1. ✅ Run the SQL migration
2. ✅ Create test users
3. ✅ Make one user admin
4. ✅ Test the login/access control
5. ✅ Use the usersService in your app

**Your app is now ready to manage users with public.users!** 🚀

---

**Last Updated:** January 22, 2026
**Version:** 1.0
