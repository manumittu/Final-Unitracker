# UI Screenshots and Visual Guide

## 1. Signup Page - Student/Faculty

### Before Changes
```
┌────────────────────────────────────────────────┐
│                   Sign Up                      │
│                                                │
│  Full Name: [________________]                │
│                                                │
│  Email: [________________]                    │
│                                                │
│  Password: [________________]                 │
│                                                │
│  Confirm Password: [________________]         │
│                                                │
│  Role: [Student ▼]                            │
│        Student                                 │
│        Professor                               │
│        Admin                                   │
│                                                │
│          [      Sign Up      ]                │
│                                                │
│  Already have an account? Login               │
└────────────────────────────────────────────────┘
```

### After Changes - Success State for Student/Faculty
```
┌────────────────────────────────────────────────┐
│                   Sign Up                      │
│                                                │
│  Full Name: [________________]                │
│                                                │
│  Email: [________________]                    │
│                                                │
│  Password: [________________]                 │
│                                                │
│  Confirm Password: [________________]         │
│                                                │
│  Role: [Student ▼]                            │
│        Student                                 │
│        Professor                               │
│        Admin                                   │
│        Canteen Staff                          │
│        Bus Staff                              │
│                                                │
│  ✅ Access request submitted successfully.    │
│     Please wait for admin approval to login.  │
│                                                │
│          [      Sign Up      ]                │
│                                                │
│  Already have an account? Login               │
└────────────────────────────────────────────────┘
```

## 2. Login Page - Pending User

### Error State
```
┌────────────────────────────────────────────────┐
│                    Login                       │
│                                                │
│  Email: [john@example.com____]                │
│                                                │
│  Password: [••••••••________]                 │
│                                                │
│  ❌ Your account is pending admin approval.   │
│     Please wait for approval before logging   │
│     in.                                        │
│                                                │
│          [       Login       ]                │
│                                                │
│  Don't have an account? Sign Up               │
└────────────────────────────────────────────────┘
```

## 3. Login Page - Rejected User

### Error State
```
┌────────────────────────────────────────────────┐
│                    Login                       │
│                                                │
│  Email: [jane@example.com____]                │
│                                                │
│  Password: [••••••••________]                 │
│                                                │
│  ❌ Your account request has been rejected    │
│     by the admin.                             │
│                                                │
│          [       Login       ]                │
│                                                │
│  Don't have an account? Sign Up               │
└────────────────────────────────────────────────┘
```

## 4. Admin Dashboard - With Access Requests Module

```
┌──────────────────────────────────────────────────────────────┐
│  UniTracker                            👤 Admin User ▼ Logout│
└──────────────────────────────────────────────────────────────┘

  Welcome back, Admin User!
  Select a module below to get started

┌─────────────┬─────────────┬─────────────┬─────────────┐
│   📅        │    ❓       │    💬       │    🔍      │
│ Timetable   │   Quiz      │  Feedback   │Lost & Found│
│ Management  │ Management  │             │            │
│             │             │             │            │
└─────────────┴─────────────┴─────────────┴─────────────┘

┌─────────────┬─────────────┬─────────────┬─────────────┐
│   💡        │    🚌       │    ⚠️       │    📚      │
│  Project    │    Bus      │   Grade     │   Course   │
│   Ideas     │ Reservation │  Appeals    │ Management │
│             │             │             │            │
└─────────────┴─────────────┴─────────────┴─────────────┘

┌─────────────┬─────────────┐
│   🍽️        │    ✅       │
│  Canteen    │   Access    │
│ Management  │  Requests   │  ← NEW MODULE
│             │             │
└─────────────┴─────────────┘
```

## 5. Access Requests Module - Pending Tab

```
┌──────────────────────────────────────────────────────────────┐
│  ← Dashboard                        Access Requests           │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Pending (2) | Approved (5) | Rejected (1) | All (8)         │
└──────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  John Doe                                                  │
│  john@example.com                                          │
│                                                            │
│  🔵 Student        🟡 Pending                             │
│                                                            │
│  Requested: 12/15/2024, 10:30 AM                          │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐                      │
│  │   Approve    │  │    Reject    │                      │
│  └──────────────┘  └──────────────┘                      │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Jane Smith                                                │
│  jane@example.com                                          │
│                                                            │
│  🟣 Professor      🟡 Pending                             │
│                                                            │
│  Requested: 12/15/2024, 09:15 AM                          │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐                      │
│  │   Approve    │  │    Reject    │                      │
│  └──────────────┘  └──────────────┘                      │
└────────────────────────────────────────────────────────────┘
```

## 6. Access Requests Module - Approved Tab

```
┌──────────────────────────────────────────────────────────────┐
│  ← Dashboard                        Access Requests           │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Pending (2) | Approved (5) | Rejected (1) | All (8)         │
└──────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Alice Johnson                                             │
│  alice@example.com                                         │
│                                                            │
│  🔵 Student        ✅ Approved                            │
│                                                            │
│  Requested: 12/14/2024, 02:00 PM                          │
│  Updated: 12/14/2024, 02:15 PM                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Bob Williams                                              │
│  bob@example.com                                           │
│                                                            │
│  🟣 Professor      ✅ Approved                            │
│                                                            │
│  Requested: 12/14/2024, 11:30 AM                          │
│  Updated: 12/14/2024, 11:45 AM                            │
└────────────────────────────────────────────────────────────┘
```

## 7. Access Requests Module - Rejected Tab

```
┌──────────────────────────────────────────────────────────────┐
│  ← Dashboard                        Access Requests           │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Pending (2) | Approved (5) | Rejected (1) | All (8)         │
└──────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Charlie Brown                                             │
│  charlie@example.com                                       │
│                                                            │
│  🔵 Student        ❌ Rejected                            │
│                                                            │
│  Requested: 12/13/2024, 03:45 PM                          │
│  Updated: 12/13/2024, 04:00 PM                            │
└────────────────────────────────────────────────────────────┘
```

## 8. Access Requests Module - Empty State

```
┌──────────────────────────────────────────────────────────────┐
│  ← Dashboard                        Access Requests           │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Pending (0) | Approved (5) | Rejected (1) | All (6)         │
└──────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                                                            │
│                   No pending access requests found.        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Color Coding

### Status Badges
- 🟡 **Pending**: Yellow background (bg-yellow-100, text-yellow-700)
- ✅ **Approved**: Green background (bg-green-100, text-green-700)
- ❌ **Rejected**: Red background (bg-red-100, text-red-700)

### Role Badges
- 🔵 **Student**: Blue background (bg-blue-100, text-blue-700)
- 🟣 **Professor**: Purple background (bg-purple-100, text-purple-700)
- 🔴 **Admin**: Red background (bg-red-100, text-red-700)
- 🟠 **Canteen**: Orange background (bg-orange-100, text-orange-700)
- 🟢 **Bus**: Teal background (bg-teal-100, text-teal-700)

### Module Card
- **Access Requests**: Cyan gradient (from-cyan-500 to-cyan-600)
- **Icon**: FaUserCheck (✓ with user icon)

## Responsive Design

The module is fully responsive:
- **Desktop**: Cards in full grid layout
- **Tablet**: Cards stack appropriately
- **Mobile**: Single column layout with full-width cards

## Accessibility Features

1. **Color Contrast**: All text meets WCAG AA standards
2. **Keyboard Navigation**: All interactive elements are keyboard accessible
3. **Screen Readers**: Proper ARIA labels for status badges and actions
4. **Focus Indicators**: Clear focus rings on all interactive elements
5. **Error Messages**: Clear, descriptive error messages for all states

## User Feedback

1. **Success Messages**: Green color with checkmark
2. **Error Messages**: Red color with X icon
3. **Loading States**: "Please wait..." text on buttons
4. **Confirmation Dialogs**: "Are you sure?" prompt before rejection
5. **Success Alerts**: "User access approved successfully!"
