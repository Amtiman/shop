# ⚡ Login Fix - Quick Reference Card

## 🎯 TL;DR (Too Long; Didn't Read)

Your login isn't working because the Supabase database isn't set up.

**Fix in 3 commands:** Copy these into Supabase SQL Editor and run them.

---

## Step 1: Setup Database (Run this first)

**File:** `PUBLIC_USERS_SETUP.sql` 
- Open and copy the ENTIRE file
- Paste into Supabase → SQL Editor
- Click RUN

---

## Step 2: Create User

**Supabase → Authentication → Users → Add User**
```
Email: ndj92@yahoo.com
Password: Test@12345
```
Click Create User

---

## Step 3: Make Admin

**Supabase → SQL Editor → New Query**
Paste and run:
```sql
UPDATE public.users SET is_admin = true WHERE email = 'ndj92@yahoo.com';
```

---

## Step 4: Test in App

1. Click ⚙️ Settings (bottom-left)
2. Enter: `ndj92@yahoo.com` / `Test@12345`
3. Click Login
4. ✅ Admin panel opens!

---

## ❌ If it fails, check:

1. **SQL error?** → Run `PUBLIC_USERS_SETUP.sql` completely
2. **Can't create user?** → Delete old one first in Supabase
3. **Login still fails?** → Open F12, look for red errors in Console

---

## 📁 Quick Links

| File | Purpose |
|------|---------|
| `LOGIN_FIX_CHECKLIST.md` | Step-by-step with checkboxes |
| `LOGIN_ISSUE_DIAGNOSTIC.md` | Detailed explanation |
| `LOGIN_DEBUG_GUIDE.md` | Troubleshooting & errors |
| `PUBLIC_USERS_SETUP.sql` | Database setup SQL |

---

## 💬 Credentials Reference

```
Email:    ndj92@yahoo.com
Password: Test@12345
Role:     Admin (after Step 3)
```

---

## ⏱️ Time Estimate

- Setup: 10 minutes
- Test: 2 minutes  
- Done: ✅

