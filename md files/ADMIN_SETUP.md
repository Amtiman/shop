# Administrator Panel - Authentication Guide

## Overview

The admin panel is now secured with a comprehensive authentication system. Users must log in with valid credentials to access the administrator window and manage products.

## Features

### 1. **Authentication System**
- ✅ Supabase authentication integration
- ✅ Email/password login
- ✅ Session management
- ✅ Admin role verification
- ✅ Automatic logout on session expiry

### 2. **Access Control**
- **Unauthenticated Users**: Shown login form
- **Authenticated Non-Admins**: Access denied message
- **Admin Users**: Full access to product management panel

### 3. **Multi-Language Support**
- 🇺🇸 English
- 🇫🇷 French  
- 🇸🇦 Arabic

---

## How It Works

### Authentication Flow

```
User Clicks Settings Button
         ↓
   [AdminPage]
         ↓
   Is Authenticated? ──NO──→ [AdminLogin]
         │
         YES
         ↓
   Is Admin? ──NO──→ [Access Denied]
         │
         YES
         ↓
   [AdminProductCRUD] ← Full Access
```

### Components

#### 1. **AuthContext** (`src/context/AuthContext.jsx`)
Central authentication context providing:
- `useAuth()` hook for accessing auth state
- `user` - Current logged-in user
- `isAuthenticated` - Boolean flag
- `isAdmin` - Check if user has admin privileges
- `login(email, password)` - Login function
- `logout()` - Logout function
- `signup(email, password)` - Register function

#### 2. **AdminLogin** (`src/components/AdminLogin.jsx`)
Login form component with:
- Email and password inputs
- Error handling and display
- Loading states
- Password masking
- i18n support for multiple languages

#### 3. **AdminPage** (`src/components/AdminPage.jsx`)
Authorization wrapper that:
- Checks if user is authenticated
- Verifies admin role
- Shows appropriate screens (login, denied, or admin panel)
- Displays logged-in user info
- Provides logout button

#### 4. **AdminProductCRUD** (`src/components/AdminProductCRUD.jsx`)
Updated to:
- Accept products and CRUD functions as props
- Display protected admin panel
- Manage product inventory
- Only renders when admin is authenticated

---

## Setting Up Admin Accounts

### In Supabase Console:

1. **Create an admin user:**
   ```sql
   -- Navigate to Authentication → Users in Supabase dashboard
   -- Create a new user with email and password
   ```

2. **Grant admin privileges:**
   ```sql
   -- Go to SQL Editor and run:
   UPDATE auth.users 
   SET user_metadata = jsonb_set(
     COALESCE(user_metadata, '{}'::jsonb), 
     '{is_admin}', 
     'true'
   )
   WHERE email = 'admin@example.com';
   ```

3. **Verify the setup:**
   ```sql
   SELECT email, user_metadata FROM auth.users 
   WHERE email = 'admin@example.com';
   ```

---

## Login Credentials

Ask your administrator for:
- Email address
- Password

Once provided, you can access the admin panel by:

1. Clicking the **Settings** icon (bottom-left corner)
2. Entering your credentials in the login form
3. Clicking **Login**

---

## Usage

### Accessing the Admin Panel

1. **Click the Settings button** (bottom-left, appears as gear icon)
2. **Admin Login modal appears**
3. **Enter your email and password**
4. **Click Login**
5. **Full product management panel opens**

### Admin Functions

Once logged in, you can:
- ✏️ **Add new products**
- ✏️ **Edit existing products**
- 🗑️ **Delete products**
- 🔍 **Filter and search products**
- 📊 **View inventory** 
- 🎯 **Manage categories**
- 💰 **Set prices and discounts**

### Logout

Click the **Logout** button in the top-right corner of the admin panel to exit.

---

## Security Features

### 1. **Secure Authentication**
- Password hashing by Supabase
- Session tokens
- Automatic expiry

### 2. **Role-Based Access**
- Only users with `is_admin = true` can access the panel
- Non-admin authenticated users are blocked

### 3. **Session Management**
- Real-time authentication state tracking
- Automatic session restoration on page refresh
- Secure logout function

### 4. **Error Handling**
- Clear error messages for invalid credentials
- Network error handling
- Validation feedback

---

## Troubleshooting

### "Login failed" error
- Verify email and password are correct
- Check if your account is active
- Ensure Supabase credentials are configured

### "Access Denied" error
- Your account is not an admin
- Contact your administrator for admin privileges

### Can't see login form
- Ensure you clicked the Settings icon
- Check browser console for errors
- Verify JavaScript is enabled

---

## Environment Configuration

The app uses Supabase environment variables. Ensure these are set in `.env`:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## File Structure

```
src/
├── context/
│   └── AuthContext.jsx          ← Authentication context
├── components/
│   ├── AdminLogin.jsx           ← Login form
│   ├── AdminPage.jsx            ← Auth wrapper
│   ├── AdminProductCRUD.jsx     ← Admin panel
│   └── ...
├── App.jsx                       ← Updated to use AdminPage
└── main.jsx                      ← Wrapped with AuthProvider
```

---

## Next Steps

1. **Contact your administrator** to get login credentials
2. **Bookmark the admin login** (click Settings icon)
3. **Test the system** with provided credentials
4. **Report any issues** to the development team

---

## Support

For issues or questions:
- Email: alafdal.group@gmail.com
- Contact the development team

---

**Last Updated:** January 22, 2026
**Version:** 1.0
