# User Deletion Feature - UI Changes

## Access Requests Module - Before vs After

### BEFORE (No Delete Option)
```
┌──────────────────────────────────────────────────────────────┐
│ Access Requests                                              │
├──────────────────────────────────────────────────────────────┤
│  [Pending] [Approved] [Rejected] [All]                       │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  John Doe                            [Student] [Pending] │  │
│  │  john@example.com                                       │  │
│  │                                                         │  │
│  │  Requested: 1/15/2024, 2:30 PM                        │  │
│  │                                                         │  │
│  │  [  Approve  ] [  Reject  ]                           │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Jane Smith                       [Professor] [Approved]│  │
│  │  jane@example.com                                       │  │
│  │                                                         │  │
│  │  Requested: 1/10/2024, 10:15 AM                       │  │
│  │  Updated: 1/10/2024, 3:20 PM                          │  │
│  │                                                         │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### AFTER (With Delete Option)
```
┌──────────────────────────────────────────────────────────────┐
│ Access Requests                                              │
├──────────────────────────────────────────────────────────────┤
│  [Pending] [Approved] [Rejected] [All]                       │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  John Doe                            [Student] [Pending] │  │
│  │  john@example.com                                       │  │
│  │                                                         │  │
│  │  Requested: 1/15/2024, 2:30 PM                        │  │
│  │                                                         │  │
│  │  [  Approve  ] [  Reject  ]                           │  │
│  │  ─────────────────────────────────                     │  │
│  │  [           Delete User           ] ← NEW!           │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Jane Smith                       [Professor] [Approved]│  │
│  │  jane@example.com                                       │  │
│  │                                                         │  │
│  │  Requested: 1/10/2024, 10:15 AM                       │  │
│  │  Updated: 1/10/2024, 3:20 PM                          │  │
│  │  ─────────────────────────────────                     │  │
│  │  [           Delete User           ] ← NEW!           │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Key UI Changes

### 1. Delete Button Placement
- **Location**: Below the Approve/Reject buttons (for pending users) or at the bottom of the card (for approved/rejected users)
- **Styling**: Full-width, red background (destructive action)
- **Visibility**: Appears for all users EXCEPT admins
- **Text**: "Delete User"

### 2. Delete Button Appearance by User Status

#### Pending Users
```
┌─────────────────────────────────┐
│  [  Approve  ] [  Reject  ]     │
│  ────────────────────────────   │
│  [      Delete User      ]      │
└─────────────────────────────────┘
```

#### Approved/Rejected Users
```
┌─────────────────────────────────┐
│  ────────────────────────────   │
│  [      Delete User      ]      │
└─────────────────────────────────┘
```

#### Admin Users
```
┌─────────────────────────────────┐
│  (No delete button shown)       │
│  Admins cannot be deleted       │
└─────────────────────────────────┘
```

### 3. Confirmation Dialog
When clicking "Delete User", a browser confirmation dialog appears:

```
┌───────────────────────────────────────────────────────┐
│  This page says:                                      │
│                                                       │
│  Are you sure you want to permanently delete user    │
│  "John Doe"? This action cannot be undone.          │
│                                                       │
│              [ Cancel ]  [ OK ]                       │
└───────────────────────────────────────────────────────┘
```

### 4. Success/Error Messages

#### Success
```
┌───────────────────────────────────────────────────────┐
│  This page says:                                      │
│                                                       │
│  User deleted successfully                            │
│                                                       │
│                    [ OK ]                             │
└───────────────────────────────────────────────────────┘
```

#### Error (Cannot delete admin)
```
┌───────────────────────────────────────────────────────┐
│  This page says:                                      │
│                                                       │
│  Cannot delete admin users                            │
│                                                       │
│                    [ OK ]                             │
└───────────────────────────────────────────────────────┘
```

## User Flow

1. Admin logs in to the system
2. Navigates to "Access Requests" from the dashboard
3. Views list of users (can filter by pending/approved/rejected/all)
4. Sees "Delete User" button on each user card (except for admin users)
5. Clicks "Delete User" button
6. Confirmation dialog appears with user's name
7. Admin confirms deletion
8. User is permanently deleted from the system
9. List refreshes automatically
10. Success message is displayed

## Button States

### Normal State
- Background: Red (#DC2626)
- Text: White
- Width: Full width of card
- Padding: Standard button padding

### Hover State
- Background: Darker Red (#B91C1C)
- Cursor: Pointer

### Loading State (during API call)
- Button disabled
- May show loading indicator

## Responsive Design

The button maintains full width on all screen sizes and is positioned consistently across different viewport sizes.

## Accessibility

- Button has clear, descriptive text ("Delete User")
- Destructive action is indicated by red color
- Confirmation dialog prevents accidental deletions
- Error messages are clear and actionable
- Success feedback is provided
