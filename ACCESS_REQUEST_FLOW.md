# Access Request System Flow Diagram

## Student/Faculty Signup Flow
```
┌─────────────────────────────────────────────────────────────┐
│                    STUDENT/FACULTY SIGNUP                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   User fills signup form:         │
        │   - Name                          │
        │   - Email                         │
        │   - Password                      │
        │   - Role (student/professor)      │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   POST /api/auth/signup           │
        │   - Hash password                 │
        │   - Create user with              │
        │     status: 'pending'             │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   Show success message:           │
        │   "Access request submitted.      │
        │    Wait for admin approval"       │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   User tries to login             │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   POST /api/auth/login            │
        │   - Check credentials             │
        │   - Check status                  │
        └───────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
    ┌─────────────────┐      ┌─────────────────┐
    │ Status: pending │      │ Status: rejected│
    │ ❌ Login denied │      │ ❌ Login denied │
    └─────────────────┘      └─────────────────┘
                            
            (Wait for admin approval)
                            │
                            ▼
                ┌─────────────────────┐
                │ Admin approves user │
                │ Status → 'approved' │
                └─────────────────────┘
                            │
                            ▼
                ┌─────────────────────┐
                │ User tries login    │
                │ ✅ Login successful │
                │ → Redirect to       │
                │    Dashboard        │
                └─────────────────────┘
```

## Admin Signup Flow
```
┌─────────────────────────────────────────────────────────────┐
│                      ADMIN SIGNUP                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   User fills signup form:         │
        │   - Name                          │
        │   - Email                         │
        │   - Password                      │
        │   - Role: admin                   │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   POST /api/auth/signup           │
        │   - Hash password                 │
        │   - Create user with              │
        │     status: 'approved'            │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   Auto-login after signup         │
        │   POST /api/auth/login            │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   ✅ Redirect to Dashboard        │
        │   (Access Requests module         │
        │    visible in dashboard)          │
        └───────────────────────────────────┘
```

## Admin Access Request Management Flow
```
┌─────────────────────────────────────────────────────────────┐
│              ADMIN - ACCESS REQUESTS MODULE                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   Admin clicks "Access Requests"  │
        │   module from dashboard           │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   GET /api/auth/access-requests   │
        │   ?status=pending                 │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   Display list of pending users:  │
        │   ┌─────────────────────────────┐ │
        │   │ John Doe                    │ │
        │   │ john@example.com            │ │
        │   │ Role: Student | Status: 🟡  │ │
        │   │ [Approve] [Reject]          │ │
        │   └─────────────────────────────┘ │
        │   ┌─────────────────────────────┐ │
        │   │ Jane Smith                  │ │
        │   │ jane@example.com            │ │
        │   │ Role: Professor | Status: 🟡│ │
        │   │ [Approve] [Reject]          │ │
        │   └─────────────────────────────┘ │
        └───────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
    ┌─────────────────────┐  ┌─────────────────────┐
    │ Admin clicks        │  │ Admin clicks        │
    │ [Approve]           │  │ [Reject]            │
    └─────────────────────┘  └─────────────────────┘
                │                       │
                ▼                       ▼
    ┌─────────────────────┐  ┌─────────────────────┐
    │ PUT /access-        │  │ PUT /access-        │
    │ requests/:userId    │  │ requests/:userId    │
    │ { status:           │  │ { status:           │
    │   'approved' }      │  │   'rejected' }      │
    └─────────────────────┘  └─────────────────────┘
                │                       │
                ▼                       ▼
    ┌─────────────────────┐  ┌─────────────────────┐
    │ User status updated │  │ User status updated │
    │ ✅ Can login now    │  │ ❌ Cannot login     │
    └─────────────────────┘  └─────────────────────┘
                │                       │
                └───────────┬───────────┘
                            ▼
                ┌─────────────────────┐
                │ Refresh request list│
                │ Show updated status │
                └─────────────────────┘
```

## Status Flow Diagram
```
┌──────────────────────────────────────────────────────────────┐
│                    USER STATUS LIFECYCLE                      │
└──────────────────────────────────────────────────────────────┘

    NEW USER SIGNUP
          │
          ▼
    ┌──────────┐
    │ Is Admin?│
    └──────────┘
          │
    ┌─────┴─────┐
    │           │
   YES         NO
    │           │
    ▼           ▼
┌─────────┐  ┌─────────┐
│APPROVED │  │ PENDING │◄────┐
│  (Auto) │  │         │     │
└─────────┘  └─────────┘     │
                │             │
                │             │
        Admin   │             │
        Action  │             │
                │             │
        ┌───────┴───────┐     │
        ▼               ▼     │
    ┌─────────┐    ┌─────────┐
    │APPROVED │    │REJECTED │
    │         │    │         │
    └─────────┘    └─────────┘
        │               │
        │               │
        ▼               ▼
  ✅ Can Login    ❌ Cannot Login
```

## Database Status Values
```
┌─────────────────────────────────────────────────────────────┐
│                    USER.STATUS FIELD                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │  'pending'                                        │      │
│  │  - Default for non-admin users                   │      │
│  │  - Cannot login                                   │      │
│  │  - Waiting for admin approval                    │      │
│  └──────────────────────────────────────────────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │  'approved'                                       │      │
│  │  - Default for admin users                       │      │
│  │  - Set by admin for others                       │      │
│  │  - Can login                                      │      │
│  └──────────────────────────────────────────────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │  'rejected'                                       │      │
│  │  - Set by admin                                   │      │
│  │  - Cannot login                                   │      │
│  │  - Request was denied                            │      │
│  └──────────────────────────────────────────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Module Access Control
```
┌─────────────────────────────────────────────────────────────┐
│                  MODULE VISIBILITY BY ROLE                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Dashboard Modules:                                         │
│                                                              │
│  ┌────────────────────┬─────────┬──────────┬────────┐      │
│  │ Module             │ Student │Professor │ Admin  │      │
│  ├────────────────────┼─────────┼──────────┼────────┤      │
│  │ Timetable          │    ✓    │    ✓     │   ✓    │      │
│  │ Quiz               │    ✓    │    ✓     │   ✓    │      │
│  │ Feedback           │    ✓    │    ✓     │   ✓    │      │
│  │ Lost & Found       │    ✓    │    ✓     │   ✓    │      │
│  │ Projects           │    ✓    │    ✓     │   ✓    │      │
│  │ Bus Reservation    │    ✓    │    ✓     │   ✓    │      │
│  │ Grade Appeals      │    ✓    │    ✓     │   ✓    │      │
│  │ Courses            │    ✓    │    ✓     │   ✓    │      │
│  │ Canteen            │    ✓    │    ✓     │   ✓    │      │
│  │ Access Requests    │    ✗    │    ✗     │   ✓    │      │
│  └────────────────────┴─────────┴──────────┴────────┘      │
│                                                              │
│  ✓ = Visible and Accessible                                │
│  ✗ = Not Visible                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
