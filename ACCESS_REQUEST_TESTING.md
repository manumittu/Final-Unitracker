# Access Request System Testing Guide

## Prerequisites

1. **MongoDB**: Ensure MongoDB is running on `localhost:27017`
2. **Node.js**: Version 16 or higher
3. **npm**: Latest version

## Setup Instructions

### 1. Install Dependencies
```bash
# Install root dependencies
npm run install:all

# Or install separately
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment
```bash
# Backend .env file already created
# Default configuration:
# - PORT: 5001
# - MONGODB_URI: mongodb://localhost:27017/unitracker
# - JWT_SECRET: your-secret-key-change-this-in-production
```

### 3. Start the Application
```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## Test Cases

### Test Case 1: Student Signup (Pending Flow)

**Steps:**
1. Navigate to http://localhost:3000/auth
2. Click "Sign Up" toggle
3. Fill in the form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "password123"
   - Confirm Password: "password123"
   - Role: "Student"
4. Click "Sign Up" button

**Expected Result:**
- ✅ Success message appears: "Access request submitted successfully. Please wait for admin approval to login."
- ✅ Form is cleared
- ✅ User remains on auth page (not auto-logged in)

### Test Case 2: Login with Pending Account

**Steps:**
1. Navigate to http://localhost:3000/auth
2. Ensure "Login" mode is selected
3. Enter credentials:
   - Email: "john@example.com"
   - Password: "password123"
4. Click "Login" button

**Expected Result:**
- ❌ Error message appears: "Your account is pending admin approval. Please wait for approval before logging in."
- ❌ User remains on login page
- ❌ Not redirected to dashboard

### Test Case 3: Admin Signup (Auto-Approve)

**Steps:**
1. Navigate to http://localhost:3000/auth
2. Click "Sign Up" toggle
3. Fill in the form:
   - Name: "Admin User"
   - Email: "admin@example.com"
   - Password: "admin123"
   - Confirm Password: "admin123"
   - Role: "Admin"
4. Click "Sign Up" button

**Expected Result:**
- ✅ User is automatically logged in
- ✅ Redirected to http://localhost:3000/dashboard
- ✅ "Access Requests" module card is visible
- ✅ All other modules are visible

### Test Case 4: View Access Requests

**Prerequisites:** Must be logged in as admin

**Steps:**
1. From dashboard, click "Access Requests" module card
2. Verify you're on http://localhost:3000/modules/access-requests

**Expected Result:**
- ✅ "Pending" tab shows John Doe's request
- ✅ User card displays:
  - Name: "John Doe"
  - Email: "john@example.com"
  - Role badge: "Student" (blue)
  - Status badge: "Pending" (yellow)
  - Request timestamp
  - [Approve] and [Reject] buttons

### Test Case 5: Approve User Request

**Prerequisites:** Must be logged in as admin

**Steps:**
1. Navigate to Access Requests module
2. Find John Doe's pending request
3. Click [Approve] button
4. Wait for confirmation alert

**Expected Result:**
- ✅ Alert appears: "User access approved successfully!"
- ✅ Request list refreshes
- ✅ John Doe no longer appears in "Pending" tab
- ✅ John Doe appears in "Approved" tab with green badge

### Test Case 6: Login After Approval

**Steps:**
1. Logout from admin account
2. Navigate to http://localhost:3000/auth
3. Login with John Doe's credentials:
   - Email: "john@example.com"
   - Password: "password123"
4. Click "Login" button

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to http://localhost:3000/dashboard
- ✅ User sees dashboard with student modules
- ✅ "Access Requests" module is NOT visible (student role)

### Test Case 7: Reject User Request

**Prerequisites:** 
- Logged in as admin
- Create another pending user (e.g., jane@example.com)

**Steps:**
1. Navigate to Access Requests module
2. Find the new pending request
3. Click [Reject] button
4. Confirm rejection in dialog

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ After confirmation, alert: "User access rejected"
- ✅ Request list refreshes
- ✅ User moves to "Rejected" tab with red badge
- ✅ User removed from "Pending" tab

### Test Case 8: Login with Rejected Account

**Steps:**
1. Logout
2. Try to login with rejected user credentials
3. Click "Login" button

**Expected Result:**
- ❌ Error message: "Your account request has been rejected by the admin."
- ❌ User remains on login page
- ❌ Cannot access the system

### Test Case 9: Filter Tabs

**Prerequisites:** Must be logged in as admin with multiple users in different states

**Steps:**
1. Navigate to Access Requests module
2. Click each tab:
   - Pending
   - Approved
   - Rejected
   - All

**Expected Result:**
- ✅ Each tab shows count in parentheses
- ✅ Active tab is highlighted in blue
- ✅ Pending tab: Only shows pending users
- ✅ Approved tab: Only shows approved users
- ✅ Rejected tab: Only shows rejected users
- ✅ All tab: Shows all users

### Test Case 10: Non-Admin Access Protection

**Prerequisites:** Logged in as student or professor

**Steps:**
1. Try to navigate directly to http://localhost:3000/modules/access-requests

**Expected Result:**
- ✅ Frontend: Shows "Access denied. This module is only available to administrators."
- ✅ API: Returns 403 with message "Access denied. Admin only."

## API Testing with curl

### 1. Signup (Student)
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testadmin@example.com",
    "password": "admin123"
  }'
```

### 3. Get Access Requests (Admin)
```bash
curl -H "Authorization: Bearer <TOKEN>" \
     http://localhost:5001/api/auth/access-requests
```

### 4. Approve User
```bash
curl -X PUT \
     -H "Authorization: Bearer <ADMIN_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"status":"approved"}' \
     http://localhost:5001/api/auth/access-requests/<USER_ID>
```

### 5. Reject User
```bash
curl -X PUT \
     -H "Authorization: Bearer <ADMIN_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"status":"rejected"}' \
     http://localhost:5001/api/auth/access-requests/<USER_ID>
```

## Success Criteria

All test cases should pass with:
- ✅ Students/faculty signup creates pending accounts
- ✅ Pending users cannot login
- ✅ Admin signup auto-approves and logs in
- ✅ Admin can view all access requests
- ✅ Admin can approve/reject requests
- ✅ Approved users can login successfully
- ✅ Rejected users cannot login
- ✅ Non-admins cannot access the module
- ✅ All UI elements display correctly
- ✅ No console errors
- ✅ Database updates correctly
