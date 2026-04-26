# 📊 Admin Panel Architecture & Flow Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                   REACT APPLICATION                    │   │
│  │                                                        │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │         AuthProvider (Context)               │    │   │
│  │  │  - Manages authentication state              │    │   │
│  │  │  - Provides useAuth() hook                   │    │   │
│  │  │  - Handles session persistence               │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  │                        ↓                             │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │              App Component                    │    │   │
│  │  │  - Main shopping interface                   │    │   │
│  │  │  - Settings button triggers admin            │    │   │
│  │  │  - Renders AdminPage when admin opens        │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  │                        ↓                             │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │            AdminPage Component                │    │   │
│  │  │  - Authentication check                       │    │   │
│  │  │  - Authorization check                        │    │   │
│  │  │  - Routes to Login/Denied/Panel               │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  │                        ↓                             │   │
│  │  ┌─────────────────┬──────────────┬────────────┐    │   │
│  │  │                 │              │            │    │   │
│  │  ↓                 ↓              ↓            ↓    │   │
│  │ AdminLogin    AccessDenied   AdminProductCRUD Panel │   │
│  │ (Login Form)   (Error)        (Full Admin)         │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↕
        ┌───────────────────────────────────────┐
        │     SUPABASE (Backend Services)       │
        ├───────────────────────────────────────┤
        │  • Authentication & Auth Tokens       │
        │  • User Metadata (is_admin)           │
        │  • Session Management                 │
        │  • Database (Products, Orders, etc)   │
        └───────────────────────────────────────┘
```

---

## 🔄 Authentication Flow

```
START: User clicks Settings icon ⚙️
│
├─→ Is Admin modal already open?
│   ├─→ YES: Close it, return to main
│   └─→ NO: Continue
│
├─→ AuthProvider checks session
│   ├─→ Session exists?
│   │   ├─→ YES: Restore user from token
│   │   └─→ NO: User = null
│   │
│   └─→ Listen for auth state changes
│
├─→ AdminPage renders
│   │
│   ├─→ Check: Is user authenticated?
│   │   ├─→ NO: Render AdminLogin component
│   │   │   ├─→ User enters email & password
│   │   │   ├─→ Click Login button
│   │   │   │
│   │   │   ├─→ useAuth().login(email, password)
│   │   │   │   │
│   │   │   │   ├─→ Send to Supabase
│   │   │   │   │
│   │   │   │   ├─→ Credentials valid?
│   │   │   │   │   ├─→ NO: Show error ❌
│   │   │   │   │   │   └─→ User can retry
│   │   │   │   │   │
│   │   │   │   │   └─→ YES: Get session token
│   │   │   │   │
│   │   │   │   └─→ Update auth state
│   │   │   │
│   │   │   └─→ Re-render with new user state
│   │   │
│   │   └─→ YES: Continue (user is authenticated)
│   │
│   └─→ Check: Is user admin? (is_admin = true?)
│       ├─→ NO: Render AccessDenied
│       │   └─→ Show message + logout button
│       │
│       └─→ YES: Render AdminProductCRUD
│           │
│           ├─→ Display admin panel
│           ├─→ Load products
│           ├─→ Show user email in header
│           ├─→ Admin can:
│           │   ├─→ Add products
│           │   ├─→ Edit products
│           │   ├─→ Delete products
│           │   └─→ Search/filter
│           │
│           └─→ Logout button
│               ├─→ Click logout
│               ├─→ Call useAuth().logout()
│               ├─→ Clear session
│               └─→ Return to AdminLogin
│
END: User logged out or closed panel
```

---

## 🔐 Authorization Decision Tree

```
                    START: User logged in
                              │
                    ┌─────────┴─────────┐
                    │                   │
          Has user_metadata?      No metadata?
                    │                   │
                   YES                  │
                    │          ┌────────┴─────┐
                    │          │              │
              Check is_admin   Create empty   Set to false
                    │          metadata       │
            ┌───────┴───────┐               │
            │               │               │
        is_admin?      is_admin?       is_admin?
        = true         = false      = null/undefined
            │               │               │
            │               │               │
        ✅ ADMIN        ❌ DENIED       ❌ DENIED
        PANEL           MESSAGE         MESSAGE
            │               │               │
        Can:            See:            See:
        • Add items     "Access         "Access
        • Edit items    Denied"         Denied"
        • Delete items                  
        • Manage inv                Can:
        • View all                  • Logout
                                    • Close
                                    • Contact admin
```

---

## 🌐 Request Flow Diagram

```
USER ACTION
    │
    ├─ Click Settings ⚙️
    │     ↓
    └─→ AdminPage opens
            ↓
        useAuth() hook
            ↓
        Check Supabase
            ↓
        ┌───────────────────────────┐
        │  Session exists?          │
        ├───────────────────────────┤
        │ YES → Get user data       │
        │ NO  → user = null         │
        └───────────────────────────┘
            ↓
        ┌───────────────────────────┐
        │  isAuthenticated?         │
        ├───────────────────────────┤
        │ NO  → Show AdminLogin     │
        │ YES → Check is_admin      │
        └───────────────────────────┘
            ↓
        ┌───────────────────────────┐
        │  is_admin = true?         │
        ├───────────────────────────┤
        │ NO  → Show AccessDenied   │
        │ YES → Show AdminProductCRUD
        └───────────────────────────┘
            ↓
        RENDER APPROPRIATE SCREEN
```

---

## 📱 Component Hierarchy

```
App (Root)
│
├── AuthProvider (Context Provider)
│   ├── Provides auth state to all children
│   └── Manages Supabase connection
│
├── Navbar (Navigation)
│   └── Settings button opens admin
│
├── Hero (Hero section)
│
├── ProductCard (Product listing)
│   └── Map over filtered products
│
├── CartSidebar (Shopping cart)
│   └── Cart management
│
├── Footer (Footer)
│
├── AdminPage (When isAdminOpen = true)
│   ├── Check: isAuthenticated?
│   │   ├── NO → AdminLogin
│   │   └── YES → Check: isAdmin?
│   │       ├── NO → AccessDenied
│   │       └── YES → AdminProductCRUD
│   │
│   ├── AdminLogin (Rendering conditionally)
│   │   ├── Email input
│   │   ├── Password input
│   │   ├── Error display
│   │   └── Submit button
│   │
│   ├── AccessDenied (Rendering conditionally)
│   │   ├── Error icon
│   │   ├── Error message
│   │   └── Logout button
│   │
│   └── AdminProductCRUD (Rendering conditionally)
│       ├── Sidebar (Navigation)
│       ├── Header (User info & controls)
│       ├── Main content (Product list/form)
│       │   ├── Product search
│       │   ├── Product filter
│       │   ├── Add product form
│       │   ├── Edit product form
│       │   └── Product display
│       └── Toast notifications
```

---

## 🔑 Key Data Flows

### Login Flow
```
User Form Input
    ↓
useAuth().login()
    ↓
supabase.auth.signInWithPassword()
    ↓
Supabase API
    ↓
Valid? Check database
    ↓
├─ NO: Return error
│  └─ Display error message
│
└─ YES: Create session token
   ├─ Return user data
   ├─ Update auth state
   └─ Re-render components
```

### Admin Check Flow
```
User authenticated
    ↓
Check user_metadata
    ↓
Get is_admin value
    ↓
├─ true  → Admin access granted ✅
├─ false → Access denied ❌
└─ null  → Access denied ❌
```

### Logout Flow
```
Click Logout button
    ↓
useAuth().logout()
    ↓
supabase.auth.signOut()
    ↓
Clear session token
    ↓
Update auth state
    ↓
user = null
    ↓
Re-render AdminPage
    ↓
Show AdminLogin again
```

---

## 🚦 State Management

```
┌─────────────────────────────────────────────┐
│         AuthContext State                   │
├─────────────────────────────────────────────┤
│ • user: User object or null                 │
│ • loading: boolean                          │
│ • error: string or null                     │
│ • isAuthenticated: boolean                  │
│ • isAdmin: boolean                          │
│                                             │
│ Methods:                                    │
│ • login(email, password)                    │
│ • logout()                                  │
│ • signup(email, password)                   │
└─────────────────────────────────────────────┘
         ↕ Consumed by
┌─────────────────────────────────────────────┐
│      AdminPage Component                    │
├─────────────────────────────────────────────┤
│ const { user, isAuthenticated, isAdmin }    │
│        = useAuth()                          │
│                                             │
│ Decides what to render based on values      │
└─────────────────────────────────────────────┘
         ↕ Updates
┌─────────────────────────────────────────────┐
│      Supabase Auth Service                  │
├─────────────────────────────────────────────┤
│ • Handles login/logout                      │
│ • Manages session tokens                    │
│ • Validates credentials                     │
│ • Stores session in localStorage            │
└─────────────────────────────────────────────┘
```

---

## 📊 Decision Points

```
START
  │
  └─→ Admin button clicked?
      ├─ NO: Continue on main page
      └─ YES:
          ├─→ Check authentication
          │   ├─ Session valid?
          │   ├─ NO: Show login
          │   └─ YES: Continue
          │
          ├─→ Check admin status
          │   ├─ is_admin = true?
          │   ├─ NO: Show access denied
          │   └─ YES: Show admin panel
          │
          └─→ Render appropriate component
              ├─ AdminLogin
              ├─ AccessDenied
              └─ AdminProductCRUD
```

---

## 🔄 Session Lifecycle

```
PAGE LOAD
    ↓
useEffect in AuthContext
    ↓
supabase.auth.getSession()
    ↓
Session exists?
├─ YES: Restore user from token
│       └─ User can access admin
└─ NO:  user = null
        └─ User must login first

THROUGHOUT SESSION
    ↓
Listen for auth state changes
    ↓
User login?         User logout?        Session expire?
├─ YES:             ├─ YES:             ├─ YES:
│  Update state     │  Clear user       │  Redirect to
│  Update UI        │  Clear session    │  login screen
└─                  └─                  └─

USER CLOSES BROWSER
    ↓
Session stored in localStorage
    ↓
On next page load → Session restored
```

---

## 🎯 Error Handling Flow

```
USER ACTION
    ↓
Try operation
    ↓
Catch error
    ↓
├─ Authentication error?
│  └─ Show "Invalid credentials"
│
├─ Network error?
│  └─ Show "Connection failed"
│
├─ Permission error?
│  └─ Show "Access denied"
│
├─ Validation error?
│  └─ Show specific validation message
│
└─ Unknown error?
   └─ Show generic error + details

ERROR DISPLAYED
    ↓
User can:
├─ Retry action
├─ Fix input
└─ Contact support
```

---

## 📈 Scalability

```
Current Setup (Single Admin Role)
├─ is_admin: true/false
└─ Works for basic admin panel

Future Enhancement (Multiple Roles)
├─ roles: ['admin', 'editor', 'viewer']
├─ permissions: [...]
└─ More granular access control
```

---

**This architecture ensures:**
- ✅ Secure authentication
- ✅ Proper authorization
- ✅ Clean data flow
- ✅ Easy maintenance
- ✅ Scalability
- ✅ Error handling

---

Last Updated: January 22, 2026
