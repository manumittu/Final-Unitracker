# Access Request System Implementation

## Overview
Implemented a user access request system where students and faculty must request access from an admin before they can use the system. Only admins can auto-approve their own accounts.

## Changes Made

### Backend Changes

#### 1. User Model (`backend/models/User.js`)
- Added `status` field with enum values: `['pending', 'approved', 'rejected']`
- Default status is `'pending'`
- Updated role enum to include: `['student', 'professor', 'admin', 'canteen', 'bus']`

#### 2. Auth Routes (`backend/routes/auth.js`)

**Signup Endpoint (`POST /api/auth/signup`)**
- Users with role `'admin'` are automatically approved (status: `'approved'`)
- All other users are created with status `'pending'`
- Returns different success messages based on user type:
  - Admin: "Admin account registered successfully. You can now login."
  - Others: "Access request submitted successfully. Please wait for admin approval to login."

**Login Endpoint (`POST /api/auth/login`)**
- Checks user status before allowing login
- Returns 403 error with appropriate message for:
  - `'pending'` status: "Your account is pending admin approval..."
  - `'rejected'` status: "Your account request has been rejected..."
- Only `'approved'` users can login successfully

**New Admin Endpoints:**
- `GET /api/auth/access-requests?status=<status>`: Get all user access requests (admin only)
  - Query parameter `status` is optional (pending, approved, rejected)
  - Returns all users if no status filter
  - Excludes password field
  - Sorted by creation date (newest first)

- `PUT /api/auth/access-requests/:userId`: Approve or reject user request (admin only)
  - Request body: `{ status: 'approved' | 'rejected' }`
  - Cannot modify admin user status
  - Returns updated user information

### Frontend Changes

#### 1. Auth Context (`frontend/src/utils/AuthContext.jsx`)
- Updated `signup` function to return status information
- Returns `{ success, message, status }` on successful signup

#### 2. Auth Page (`frontend/src/pages/AuthPage.jsx`)
- Modified signup flow to handle pending status
- Shows success message (green) when signup creates a pending request
- Shows error message (red) for actual errors
- For admin signup, auto-login is attempted after signup
- For non-admin signup, shows success message and clears form
- Improved error handling for login with status-based messages

#### 3. API Utils (`frontend/src/utils/api.js`)
- Added `getAccessRequests(status)` function
- Added `updateAccessRequest(userId, status)` function

#### 4. New Access Requests Module (`frontend/src/modules/accessRequests/AccessRequestsModule.jsx`)
- Admin-only module to manage user access requests
- Features:
  - Filter tabs: Pending, Approved, Rejected, All
  - Display user information: name, email, role, request date
  - Status badges with color coding
  - Role badges with color coding
  - Approve/Reject buttons for pending requests
  - Real-time list updates after approval/rejection
  - Access denied message for non-admin users

#### 5. App Routes (`frontend/src/App.jsx`)
- Added route for Access Requests module: `/modules/access-requests`
- Imported `AccessRequestsModule` component

#### 6. Dashboard (`frontend/src/pages/DashboardPage.jsx`)
- Added "Access Requests" module card
- Only visible to admin users
- Icon: `FaUserCheck` (user with checkmark)
- Color: cyan gradient
- Description: "Approve or reject user access requests"

## User Flow

### For Students/Faculty:
1. Go to signup page
2. Fill in name, email, password, and select role
3. Submit signup form
4. See success message: "Access request submitted successfully. Please wait for admin approval to login."
5. Cannot login until admin approves
6. If login attempted, see error: "Your account is pending admin approval..."
7. Once approved by admin, can login normally

### For Admins:
1. Go to signup page
2. Fill in name, email, password, and select "Admin" role
3. Submit signup form
4. Automatically approved and logged in
5. Can access "Access Requests" module from dashboard
6. Can view all pending/approved/rejected requests
7. Can approve or reject pending requests with one click

## Testing Recommendations

### Manual Testing Steps:
1. **Test Student Signup:**
   - Sign up as a student
   - Verify success message is shown
   - Try to login - should see "pending approval" error
   - Have admin approve the request
   - Login should now work

2. **Test Admin Signup:**
   - Sign up as admin
   - Should auto-login after signup
   - Verify "Access Requests" module appears in dashboard

3. **Test Access Requests Module:**
   - Login as admin
   - Navigate to Access Requests module
   - Verify pending requests appear
   - Test approve functionality
   - Test reject functionality
   - Verify filters work (Pending, Approved, Rejected, All)

4. **Test Login Restrictions:**
   - Create user with pending status
   - Attempt login - should fail with pending message
   - Reject the user as admin
   - Attempt login - should fail with rejected message
   - Approve the user as admin
   - Login should now succeed

## Security Notes
- Admin users cannot have their status changed via the API
- Only authenticated admins can access access-request endpoints
- Password is never exposed in API responses
- JWT tokens are used for authentication
- Status is checked on every login attempt

## Database Schema
```javascript
User {
  name: String (required for signup),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (enum: ['student', 'professor', 'admin', 'canteen', 'bus']),
  status: String (enum: ['pending', 'approved', 'rejected'], default: 'pending'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## API Endpoints Summary

### Public Endpoints
- `POST /api/auth/signup` - Create new user account (pending approval for non-admins)
- `POST /api/auth/login` - Login (only approved users)

### Protected Endpoints (Admin Only)
- `GET /api/auth/access-requests` - List all user access requests
- `GET /api/auth/access-requests?status=pending` - List pending requests
- `PUT /api/auth/access-requests/:userId` - Approve/reject request

## Future Enhancements
- Email notifications when user is approved/rejected
- Batch approve/reject functionality
- Search/filter by name or email
- Export access requests to CSV
- Activity log for admin actions
- User profile pictures
- Reason field when rejecting users
