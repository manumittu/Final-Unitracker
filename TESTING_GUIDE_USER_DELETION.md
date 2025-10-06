# How to Test the User Deletion Feature

## Prerequisites
1. MongoDB running locally or connection string configured
2. Backend server running on port 5001
3. Frontend server running on port 5173 (or configured port)
4. At least one admin account in the database

## Setup Test Environment

### 1. Start MongoDB
```bash
# If using local MongoDB
mongod --dbpath /path/to/data

# Or use MongoDB Atlas connection string in backend/.env
```

### 2. Configure Environment
```bash
cd backend
cp .env.example .env
# Edit .env to set MONGODB_URI and JWT_SECRET
```

### 3. Install Dependencies and Start Servers
```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Or start separately:
# Backend: cd backend && npm run dev
# Frontend: cd frontend && npm run dev
```

## Testing Steps

### Test 1: Delete a Student User

1. **Login as Admin**
   - Navigate to `http://localhost:5173/auth`
   - Login with admin credentials
   
2. **Navigate to Access Requests**
   - Click on "Access Requests" from the dashboard
   - Or go directly to `http://localhost:5173/access-requests`

3. **Find a Student User**
   - Look for a user with "Student" role badge
   - Can be in any tab (Pending, Approved, Rejected, All)

4. **Click Delete User Button**
   - Scroll to bottom of the user card
   - Click the red "Delete User" button

5. **Confirm Deletion**
   - A confirmation dialog will appear
   - Verify the user's name is shown in the dialog
   - Click "OK" to confirm

6. **Verify Result**
   - Success message should appear
   - User list should refresh automatically
   - User should no longer appear in the list

### Test 2: Delete a Professor User

Follow the same steps as Test 1, but select a user with "Professor" role badge.

### Test 3: Try to Delete an Admin User

1. **Find an Admin User** (if visible in the list)
   - Admin users should NOT have a delete button
   - This is a UI-level protection

2. **Attempt API Call Directly** (optional advanced test)
   ```bash
   # Get admin token from localStorage in browser
   # Then test with curl:
   curl -X DELETE \
     http://localhost:5001/api/auth/users/<admin-user-id> \
     -H "Authorization: Bearer <admin-token>"
   ```
   
3. **Expected Result**
   - Should receive 400 Bad Request
   - Error message: "Cannot delete admin users"

### Test 4: Try to Delete Your Own Account

1. **Attempt API Call** (UI won't allow this, but API should block it)
   ```bash
   # Get your own user ID and token
   curl -X DELETE \
     http://localhost:5001/api/auth/users/<your-user-id> \
     -H "Authorization: Bearer <your-token>"
   ```

2. **Expected Result**
   - Should receive 400 Bad Request
   - Error message: "Cannot delete your own account"

### Test 5: Non-Admin Access

1. **Login as Student or Professor**
   - Logout from admin account
   - Login with a student or professor account

2. **Try to Access Delete Endpoint**
   ```bash
   curl -X DELETE \
     http://localhost:5001/api/auth/users/<any-user-id> \
     -H "Authorization: Bearer <student-token>"
   ```

3. **Expected Result**
   - Should receive 403 Forbidden
   - Error message: "Access denied. Admin only."

### Test 6: Unauthenticated Access

1. **Try Without Token**
   ```bash
   curl -X DELETE \
     http://localhost:5001/api/auth/users/<any-user-id>
   ```

2. **Expected Result**
   - Should receive 401 Unauthorized
   - Error message: "No token, authorization denied"

### Test 7: Non-existent User

1. **Try with Invalid User ID**
   ```bash
   curl -X DELETE \
     http://localhost:5001/api/auth/users/invalid-id-123 \
     -H "Authorization: Bearer <admin-token>"
   ```

2. **Expected Result**
   - Should receive 404 Not Found
   - Error message: "User not found"

## Expected UI Behavior

### Delete Button Visibility
- ✅ Shows for: Student, Professor, Canteen, Bus users
- ❌ Hidden for: Admin users

### Button Location
- For pending users: Below Approve/Reject buttons
- For approved/rejected users: At bottom of card with top border

### Button Styling
- Full width
- Red background (#DC2626)
- Darker red on hover (#B91C1C)
- White text
- "Delete User" label

### Confirmation Dialog
- Shows user's name
- Warning about permanent action
- Cancel and OK buttons

### Success Feedback
- Alert: "User deleted successfully"
- List automatically refreshes
- Deleted user removed from view

### Error Feedback
- Alert with specific error message
- Error banner at top of page
- User list remains unchanged

## API Testing with Postman/Insomnia

### Request
```
DELETE http://localhost:5001/api/auth/users/:userId
Headers:
  Authorization: Bearer <admin-jwt-token>
  Content-Type: application/json
```

### Success Response (200)
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

### Error Responses

#### 401 - No Authentication
```json
{
  "msg": "No token, authorization denied"
}
```

#### 403 - Not Admin
```json
{
  "msg": "Access denied. Admin only."
}
```

#### 404 - User Not Found
```json
{
  "msg": "User not found"
}
```

#### 400 - Cannot Delete Admin
```json
{
  "msg": "Cannot delete admin users"
}
```

#### 400 - Cannot Delete Self
```json
{
  "msg": "Cannot delete your own account"
}
```

## Troubleshooting

### Issue: Delete button not showing
- **Solution**: Check if user is admin (button should not show for admins)
- **Solution**: Verify you're logged in as admin
- **Solution**: Check browser console for JavaScript errors

### Issue: Getting 401 error
- **Solution**: Check if JWT token is valid and not expired
- **Solution**: Try logging out and logging back in
- **Solution**: Check browser localStorage for token

### Issue: Getting 403 error
- **Solution**: Verify you're logged in as admin user
- **Solution**: Check user role in JWT token payload
- **Solution**: Verify admin status in database

### Issue: User not deleted
- **Solution**: Check browser console for errors
- **Solution**: Check backend logs for error messages
- **Solution**: Verify MongoDB connection is active
- **Solution**: Check if user ID is valid

## Database Verification

### Check if user was deleted
```javascript
// In MongoDB shell or Compass
db.users.findOne({ email: "deleted-user@example.com" })
// Should return null if successfully deleted
```

### List all users
```javascript
db.users.find({}, { name: 1, email: 1, role: 1 })
```

## Clean Up After Testing

If you created test users for deletion testing:

1. **Restore from backup** (if you made one before testing)
2. **Re-run seed script** to recreate initial data
   ```bash
   cd backend
   npm run seed
   ```

## Notes

- Deletion is permanent - there is no undo
- Always confirm you're deleting the correct user
- Admin users cannot be deleted by design
- You cannot delete your own account
- Consider implementing soft delete in production for audit purposes

## Support

For issues or questions:
1. Check the implementation documentation: `USER_DELETION_IMPLEMENTATION.md`
2. Review UI changes documentation: `UI_CHANGES_DELETE_USER.md`
3. Check verification checklist: `IMPLEMENTATION_VERIFICATION.md`
4. Review complete summary: `USER_DELETION_FEATURE_SUMMARY.md`
