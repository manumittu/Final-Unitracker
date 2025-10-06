# Testing Guide for New Features

This document describes the changes made and how to test them.

## Changes Made

### 1. Canteen Management Module Integration

**Backend Changes:**
- Created `backend/routes/canteen.js` with full CRUD operations for menu items and bookings
- Created `backend/models/Menu.js` for menu item schema
- Created `backend/models/Booking.js` for food order schema
- Added canteen routes to `backend/server.js`

**Frontend Changes:**
- Created `frontend/src/modules/canteen/CanteenModule.jsx` with:
  - Menu management (Admin only)
  - Food ordering (Students, Professors, Canteen Staff)
  - Order history viewing
- Added canteen API methods to `frontend/src/utils/api.js`
- Added canteen module to `frontend/src/App.jsx` routing
- Added canteen card to dashboard in `frontend/src/pages/DashboardPage.jsx`

**Features:**
- **Admin Users:**
  - Add new menu items
  - Edit existing menu items (name, category, price, availability, prep time, image)
  - Delete menu items
  - View all orders from all users
  - Cancel any order

- **Students/Professors/Canteen Staff:**
  - View available menu items
  - Place food orders with:
    - Student/Staff ID
    - Date selection
    - Time slot (Breakfast, Lunch, Snacks, Dinner)
    - Quantity selection
    - Payment mode (Cash, UPI, Card)
    - Special instructions
  - View their own order history
  - Cancel their own orders

### 2. Lost & Found Improvements

**Changes:**
- Updated `frontend/src/modules/lostFound/LostFoundModule.jsx`:
  - Lost items are now visible in the "Found Items" view
  - Added "Claim Item" button when viewing found items
  - Claim button shows contact information and allows downloading item details

**Features:**
- When users click on "Found Items", they can see ALL items (both lost and found)
- Users can claim any item by clicking the "Claim Item" button
- Claiming an item shows contact information and downloads item details

### 3. Role Selection Fix

**Changes:**
- Updated `frontend/src/pages/AuthPage.jsx`:
  - Role dropdown now only appears during signup (not during login)
  - Added "Canteen Staff" and "Bus Staff" role options
  - Role is properly saved during user registration

**Roles Available:**
- Student
- Professor
- Admin
- Canteen Staff
- Bus Staff

## Testing Instructions

### Prerequisites
1. Ensure MongoDB is running
2. Install dependencies: `npm run install:all` from root directory
3. Start backend: `cd backend && npm run dev`
4. Start frontend: `cd frontend && npm run dev`

### Test 1: Role Selection During Signup
1. Navigate to the signup page
2. Verify that the Role dropdown is visible during signup
3. Verify that all 5 roles are available: Student, Professor, Admin, Canteen Staff, Bus Staff
4. Create a test account with each role
5. Verify that upon login, the role is correctly displayed in the dashboard

### Test 2: Canteen Management (Admin)
1. Login as Admin
2. Click on "Canteen Management" from the dashboard
3. Click "Add Menu Item"
4. Fill in the form:
   - Item Name: "Samosa"
   - Category: "Snacks"
   - Price: 20
   - Prep Time: "10 mins"
   - Availability: Checked
5. Click "Add Menu Item"
6. Verify the item appears in the menu list
7. Click "Edit" on the item
8. Change the price to 25
9. Click "Update Menu Item"
10. Verify the price is updated
11. Click "Delete" on the item
12. Confirm deletion
13. Verify the item is removed

### Test 3: Food Ordering (Student/Professor)
1. Login as Student or Professor
2. Click on "Canteen Management" from the dashboard
3. Verify you can see menu items but NOT the "Add Menu Item" button
4. Click "Order" on any available item
5. Fill in the order form:
   - Student/Staff ID: "STU001"
   - Name: "Test User"
   - Date: Select today's date
   - Time Slot: "Lunch (12:00 PM - 2:00 PM)"
   - Quantity: 2
   - Payment Mode: "UPI"
   - Special Instructions: "Less spicy"
6. Verify the total price is calculated correctly
7. Click "Place Order"
8. Verify the order appears in "My Orders" section
9. Click "Cancel Order" on the order
10. Confirm cancellation
11. Verify the order is removed

### Test 4: Lost & Found Item Claiming
1. Login as any user
2. Click on "Lost & Found" from the dashboard
3. Click "Report Item"
4. Create a lost item:
   - Type: "Lost Item"
   - Item Name: "Blue Backpack"
   - Location: "Library 2nd Floor"
   - Date: Today's date
   - Contact Info: "test@email.com"
   - Description: "Blue backpack with laptop inside"
5. Click "Submit"
6. Click on "Found Items" filter
7. Verify you can see ALL items including the lost item you just created
8. Click "Claim Item" on any item
9. Verify the contact information is displayed
10. Verify the item details are downloaded

### Test 5: Admin View of All Orders
1. Login as Admin
2. Click on "Canteen Management"
3. Verify you can see orders from all users in the "All Orders" section
4. Verify each order shows the user's name and email
5. Verify you can cancel any order

### Test 6: Role-Based Access
1. Create accounts with different roles
2. Verify each role has access to appropriate modules:
   - Student: Can order food, cannot manage menu
   - Professor: Can order food, cannot manage menu
   - Admin: Can manage menu, can order food, can see all orders
   - Canteen Staff: Can order food, cannot manage menu
   - Bus Staff: No special canteen access

## Expected Results

1. ✅ Role dropdown shows 5 options during signup
2. ✅ Role is saved and displayed correctly after login
3. ✅ Admin can perform full CRUD operations on menu items
4. ✅ Students/Professors can order food items
5. ✅ Orders are associated with the correct user
6. ✅ Lost items are visible in the found items section
7. ✅ Users can claim items and see contact information
8. ✅ Admin can see all orders from all users
9. ✅ Users can only see their own orders (except admin)
10. ✅ Canteen Staff and Bus Staff roles are properly supported

## API Endpoints

### Canteen API
- `GET /api/canteen/menu` - Get all menu items
- `POST /api/canteen/menu` - Create menu item (Admin only)
- `PUT /api/canteen/menu/:id` - Update menu item (Admin only)
- `DELETE /api/canteen/menu/:id` - Delete menu item (Admin only)
- `GET /api/canteen/booking` - Get bookings (own bookings or all if admin)
- `POST /api/canteen/booking` - Create booking
- `PUT /api/canteen/booking/:id` - Update booking
- `DELETE /api/canteen/booking/:id` - Delete booking

All endpoints require authentication via JWT token.
