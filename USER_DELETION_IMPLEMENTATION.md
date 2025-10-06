# User Deletion Feature Implementation

## Overview
This document describes the implementation of the user deletion feature that allows administrators to delete student and professor accounts.

## Problem Statement
Admin should have the access to delete users like students and professors.

## Implementation Details

### 1. Backend Changes

#### File: `backend/routes/auth.js`
Added a new DELETE endpoint that allows admins to delete users:

**Endpoint:** `DELETE /api/auth/users/:userId`

**Features:**
- ✅ Admin-only access (requires authentication and admin role)
- ✅ Prevents deletion of admin users (safety measure)
- ✅ Prevents admins from deleting their own account (safety measure)
- ✅ Returns detailed error messages for validation failures
- ✅ Returns confirmation with deleted user details

**Request:**
```
DELETE /api/auth/users/:userId
Authorization: Bearer <admin-token>
```

**Response (Success):**
```json
{
  "msg": "User deleted successfully",
  "deletedUser": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "student"
  }
}
```

**Error Responses:**
- 401: No token or invalid token
- 403: Access denied (not an admin)
- 404: User not found
- 400: Cannot delete admin users
- 400: Cannot delete your own account

### 2. Frontend Changes

#### File: `frontend/src/utils/api.js`
Added a new API method in the authAPI object:

```javascript
deleteUser: (userId) => api.delete(`/auth/users/${userId}`)
```

#### File: `frontend/src/modules/accessRequests/AccessRequestsModule.jsx`
Added delete functionality to the Access Requests Module:

**New Function:** `handleDelete(userId, userName)`
- Displays a confirmation dialog with the user's name
- Calls the delete API endpoint
- Refreshes the user list after successful deletion
- Shows appropriate error messages if deletion fails

**UI Changes:**
- Added "Delete User" button for all non-admin users
- Button appears in all tabs (pending, approved, rejected, all)
- Button is styled with red color to indicate destructive action
- Proper spacing and layout to maintain UI consistency

## Security Measures

1. **Role-Based Access Control:** Only users with admin role can delete users
2. **Admin Protection:** Admin users cannot be deleted
3. **Self-Protection:** Admins cannot delete their own account
4. **Confirmation Dialog:** Users must confirm before deletion
5. **Error Handling:** Comprehensive error messages for all failure scenarios

## Usage

### As an Admin:
1. Navigate to the Access Requests module
2. Find the user you want to delete (in any status tab)
3. Click the "Delete User" button (appears for students, professors, canteen, and bus users)
4. Confirm the deletion in the dialog box
5. The user will be permanently removed from the system

### Restrictions:
- Cannot delete admin users
- Cannot delete your own account
- Only accessible to admin role

## Testing Recommendations

1. **Test as Admin:**
   - Delete a student user ✅
   - Delete a professor user ✅
   - Try to delete an admin user (should fail) ✅
   - Try to delete yourself (should fail) ✅

2. **Test as Non-Admin:**
   - Try to access delete endpoint (should return 403) ✅

3. **Edge Cases:**
   - Delete non-existent user (should return 404) ✅
   - Delete with invalid token (should return 401) ✅

## Files Modified

1. `backend/routes/auth.js` - Added DELETE endpoint
2. `frontend/src/utils/api.js` - Added deleteUser API method
3. `frontend/src/modules/accessRequests/AccessRequestsModule.jsx` - Added delete button and handler

## API Endpoints Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| DELETE | `/api/auth/users/:userId` | Admin only | Delete a user account |

## Compliance with Requirements

✅ Admin has access to delete users
✅ Can delete students
✅ Can delete professors
✅ Protected against accidental admin deletion
✅ Proper error handling and user feedback
✅ Minimal changes to existing code
✅ Follows existing code patterns and conventions
