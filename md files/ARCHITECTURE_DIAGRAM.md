# 📊 Admin Panel Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     LUXURY SHOP APP                          │
└─────────────────────────────────────────────────────────────┘
                              ↑
                    ┌─────────┴─────────┐
                    │                   │
            ┌───────▼──────┐    ┌──────▼────────┐
            │  User Clicks  │    │  App Renders  │
            │   Settings ⚙️ │    │  Login Form   │
            └───────┬──────┘    └──────┬────────┘
                    │                   │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Login Component   │
                    │ (AdminLogin.jsx)   │
                    └─────────┬──────────┘
                              │
                ┌─────────────┴─────────────┐
                │  User enters:            │
                │  - Email                 │
                │  - Password              │
                └─────────────┬─────────────┘
                              │
                    ┌─────────▼──────────────┐
                    │  AuthContext.login()   │
                    │  (AuthContext.jsx)     │
                    └─────────┬──────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
    ┌────────────┐     ┌─────────────┐    ┌─────────────┐
    │ Supabase   │     │  Verify    │     │  Fetch     │
    │   Auth     │────▶│ Credentials │──▶ │  User      │
    │(auth.users)│     │   ✅ OK    │     │  Profile   │
    └────────────┘     └─────────────┘    └─────┬──────┘
                                               │
                                    ┌──────────▼────────────┐
                                    │   Supabase Query      │
                                    │  public.users table   │
                                    │  SELECT * WHERE id=?  │
                                    └──────────┬────────────┘
                                               │
                                    ┌──────────▼────────────┐
                                    │  Check is_admin       │
                                    │  Column               │
                                    └──────────┬────────────┘
                                               │
                          ┌────────────────────┴────────────────┐
                          │                                     │
                ┌─────────▼──────────┐         ┌──────────▼──────────┐
                │  is_admin = true   │         │ is_admin = false   │
                │       ✅           │         │       ❌           │
                └─────────┬──────────┘         └──────────┬──────────┘
                          │                               │
            ┌─────────────▼──────────────┐   ┌───────────▼──────────┐
            │  Show Admin Panel          │   │ Show Access Denied   │
            │ ┌──────────────────────┐   │   │    Message           │
            │ │ 📦 Products Tab      │   │   │ ┌──────────────────┐ │
            │ │ 👥 Users Tab         │   │   │ │ ⛔ Access Denied │ │
            │ │ 📊 Analytics Tab     │   │   │ │                  │ │
            │ │ ⚙️  Settings Tab     │   │   │ │ [Logout Button]  │ │
            │ │ [Logout Button]      │   │   │ └──────────────────┘ │
            │ └──────────────────────┘   │   └──────────────────────┘
            └──────────────────────────┘
                         ↓
              User can now CRUD products
              - Add products
              - Edit products
              - Delete products
              - Manage users
              - View analytics
```

---

## Database Schema

```
┌─────────────────────────────────────┐
│          Supabase Project           │
└──────────────────┬──────────────────┘
                   │
    ┌──────────────┴──────────────┐
    │                             │
    ▼                             ▼
┌──────────────────┐      ┌──────────────────┐
│   auth.users     │      │  public.users    │
│  (Managed by     │      │  (Custom table)  │
│  Supabase Auth)  │      │                  │
├──────────────────┤      ├──────────────────┤
│ id       (UUID)  │──────│ id       (FK)    │
│ email    (text)  │┐     │ email    (text)  │
│ password (hash)  ││     │ full_name(text)  │
│ created_at       ││     │ avatar_url(text) │
│ updated_at       │└────▶│ is_admin (bool)  │ ← KEY FIELD
│                  │      │ created_at       │
│ Trigger:         │      │ updated_at       │
│ When new user    │      │                  │
│ signs up:        │      │ RLS Policies:    │
│ ├─ INSERT into   │      │ ├─ Users read    │
│ │  public.users  │      │ │  their own     │
│ │  automatically │      │ ├─ Admins can    │
│ └─ Set email     │      │ │  read all      │
│    from auth     │      │ ├─ Users update  │
│                  │      │ │  their own     │
│                  │      │ └─ Admins update │
│                  │      │    anyone       │
└──────────────────┘      └──────────────────┘
```

---

## Admin Authentication Flow - Detailed

```
START: User clicks ⚙️
   │
   ├─▶ Is user authenticated?
   │   ├─ NO  ──▶ Show LoginForm
   │   │         User enters: email + password
   │   │         │
   │   │         ▼
   │   │      AuthContext.login(email, password)
   │   │      │
   │   │      ├─▶ supabase.auth.signInWithPassword()
   │   │      │   │
   │   │      │   ├─ Success? ──▶ ✅ Token issued
   │   │      │   │
   │   │      │   └─ Fail?    ──▶ ❌ Show error: "Invalid credentials"
   │   │      │                   Return to login form
   │   │      │
   │   │      ├─▶ GET user from public.users
   │   │      │   WHERE id = auth.user.id
   │   │      │   │
   │   │      │   ├─ Found? ──▶ Read is_admin column
   │   │      │   │              │
   │   │      │   │              ├─ is_admin = true
   │   │      │   │              │  └─▶ ✅ Set state: isAdmin = true
   │   │      │   │              │
   │   │      │   │              └─ is_admin = false
   │   │      │   │                 └─▶ ❌ Set state: isAdmin = false
   │   │      │   │
   │   │      │   └─ Not found? ──▶ ❌ isAdmin = false (default)
   │   │      │
   │   │      └─▶ Return to component
   │   │
   │   └─ YES ──▶ User authenticated!
   │             │
   │             ├─ Is user admin?
   │             │   ├─ YES ──▶ Show AdminPanel ✅
   │             │   │          ├─ Products tab
   │             │   │          ├─ Users tab
   │             │   │          ├─ Analytics tab
   │             │   │          ├─ Settings tab
   │             │   │          └─ Logout button
   │             │   │
   │             │   └─ NO  ──▶ Show AccessDenied ❌
   │             │              ├─ Error message
   │             │              └─ Logout button
   │
   └─▶ Wait for user action
       (Logout or use admin panel)
```

---

## Component Hierarchy

```
App (main component)
│
├─ AuthProvider (context wrapper)
│  │
│  ├─ AuthContext.jsx
│  │  └─ Manages:
│  │     ├─ user state
│  │     ├─ isAdmin state
│  │     ├─ login function
│  │     ├─ logout function
│  │     └─ error handling
│  │
│  └─ Navbar.jsx
│     │
│     ├─ Settings button ⚙️
│     │
│     └─ onClick ──▶ Show AdminPage modal
│
└─ AdminPage.jsx (modal component)
   │
   ├─ useAuth() hook
   │  └─ Get: user, isAdmin, isAuthenticated
   │
   ├─ Check: isAuthenticated?
   │  │
   │  ├─ NO  ──▶ Show AdminLogin.jsx
   │  │         ├─ Email input
   │  │         ├─ Password input
   │  │         ├─ Login button
   │  │         └─ Error messages
   │  │
   │  └─ YES ──▶ Check: isAdmin?
   │             │
   │             ├─ YES ──▶ Show AdminProductCRUD.jsx
   │             │         ├─ Products list/grid
   │             │         ├─ Add product form
   │             │         ├─ Edit product modal
   │             │         ├─ Delete confirmation
   │             │         ├─ Search & filter
   │             │         ├─ Sidebar menu
   │             │         └─ Logout button
   │             │
   │             └─ NO  ──▶ Show AccessDenied
   │                      ├─ Error icon
   │                      ├─ Message
   │                      └─ Logout button
```

---

## File Relationships

```
src/context/
├─ AuthContext.jsx
   ├─ Imports: supabase
   ├─ Exports: useAuth hook
   └─ Used by: AdminPage, AdminLogin, many components
   
src/components/
├─ Navbar.jsx
│  ├─ Uses: useAuth()
│  └─ Shows: Settings button ⚙️
│
├─ AdminPage.jsx
│  ├─ Uses: useAuth()
│  ├─ Shows: AdminLogin OR AdminProductCRUD OR AccessDenied
│  └─ Props: onClose, products, addProduct, updateProduct, deleteProduct
│
├─ AdminLogin.jsx (NEW)
│  ├─ Uses: useAuth()
│  ├─ Calls: auth.login(email, password)
│  └─ Emits: onLoginSuccess
│
├─ AdminProductCRUD.jsx (UPDATED)
│  ├─ Props: products, addProduct, updateProduct, deleteProduct, loadProducts
│  ├─ Tabs: Products, Users, Analytics, Settings
│  └─ Features: Add, Edit, Delete, Search, Filter

src/services/
├─ api.js
│  └─ API calls for products
│
└─ usersService.ts (NEW - optional)
   └─ API calls for user management

src/lib/
├─ supabase.ts
│  └─ Supabase client initialization
   
data/
└─ products.js
   └─ Product data (static or from API)
```

---

## Security Layers

```
┌─────────────────────────────────────────────┐
│         Security Implementation             │
└─────────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    
  Layer 1         Layer 2         Layer 3
  Frontend        Supabase        Database
  
  ┌──────────┐  ┌──────────┐   ┌──────────┐
  │Frontend  │  │ Supabase │   │   RLS    │
  │          │  │   Auth   │   │Policies  │
  │1. Check  │  │          │   │          │
  │  login   │  │1. Verify │   │1. Users  │
  │  form    │  │  password│   │  read    │
  │          │  │          │   │  own     │
  │2. Call   │  │2. Issue  │   │          │
  │  auth    │  │  JWT     │   │2. Admins │
  │  login   │  │  token   │   │  read    │
  │          │  │          │   │  all     │
  │3. Show   │  │3. Only   │   │          │
  │  admin   │  │  verified│   │3. Admins │
  │  panel   │  │  users   │   │  update  │
  │  if      │  │  access  │   │  any     │
  │  isAdmin │  │  data    │   │          │
  └──────────┘  └──────────┘   └──────────┘
```

---

## State Management

```
App
  │
  └─ AuthProvider
     │
     └─ AuthContext State:
        │
        ├─ user: {
        │    id: "uuid",
        │    email: "admin@test.com",
        │    user_metadata: { is_admin: true },
        │    ...
        │ }
        │
        ├─ isAuthenticated: true/false
        │
        ├─ isAdmin: true/false
        │  └─ Derived from: user.user_metadata.is_admin
        │                   OR public.users.is_admin
        │
        ├─ loading: true/false
        │
        └─ error: null/"error message"
```

---

## Summary

✅ **Three-tier security:**
1. Frontend checks (instant feedback)
2. Supabase Auth (passwords never sent to app)
3. Database RLS (server-side enforcement)

✅ **Two tables working together:**
1. auth.users (Supabase managed, authentication)
2. public.users (custom, user data + admin flag)

✅ **Auto-sync via PostgreSQL trigger:**
- New signup in auth.users
- Automatically creates row in public.users
- No manual sync needed

✅ **Result:**
- Secure authentication
- Role-based access control
- Clean, maintainable code
