# Quick Start Guide for New Modules

## Quiz Management Module

### Access Control
- **Professors & Admins**: Can create, edit, and delete quizzes
- **Students**: Can attempt quizzes and view results

### How to Use

#### As Admin/Professor:
1. Navigate to Dashboard → Quiz Management
2. Click "Create Quiz" button
3. Enter quiz name
4. Add questions with 4 options each
5. Mark the correct answer for each question
6. Click "Add Question" to add more questions
7. Click "Create Quiz" when done

#### As Student:
1. Navigate to Dashboard → Quiz Management
2. Browse available quizzes
3. Click "Attempt Quiz" on any quiz card
4. Select answers by clicking on options
5. Use "Next" and "Previous" to navigate
6. Click "Submit Quiz" after answering all questions
7. View your score and percentage

### Features
- Multiple-choice questions with 4 options
- Question navigation (Previous/Next)
- Instant score calculation
- Quiz editing for creators
- Result history tracking

---

## Timetable Management Module

### Access Control
- **Admins**: Can create and edit timetables
- **Students & Professors**: Read-only view

### How to Use

#### As Admin:
1. Navigate to Dashboard → Timetable Management
2. Click "Create Timetable" or "Edit Timetable"
3. Fill in each cell with:
   - Subject name
   - Teacher name
   - Room number
4. Click "Save" to persist changes
5. Click "Delete" to remove entire timetable

#### As Student/Professor:
1. Navigate to Dashboard → Timetable Management
2. View the weekly schedule
3. See subjects, teachers, and rooms for each period

### Features
- Weekly view (Monday-Friday)
- 6 periods per day
- Subject, Teacher, and Room information
- Clean table layout
- Editable by admins only

---

## Bus Reservation Module

### Access Control
- **Admins**: Can manage routes (add, edit, delete) and view all bookings
- **All Users**: Can book tickets and cancel their bookings

### How to Use

#### As Admin - Managing Routes:
1. Navigate to Dashboard → Bus Reservation
2. Click "Add Route" button
3. Fill in route details:
   - Route Name (e.g., "Campus Express")
   - From location
   - To location
   - Departure time
   - Available seats
   - Fare
4. Click "Add Route" to save
5. Use "Edit" or "Delete" buttons on route cards to modify

#### As Any User - Booking Tickets:
1. Navigate to Dashboard → Bus Reservation
2. Browse available routes
3. Click "Book Ticket" on desired route
4. Select travel date (current date or future)
5. Enter number of seats
6. Review total amount
7. Click "Confirm Booking"

#### Viewing and Canceling Bookings:
1. Scroll down to "My Bookings" section
2. View all your bookings with:
   - Route details
   - Travel date
   - Number of seats
   - Status (Confirmed/Cancelled)
3. Click "Cancel" to cancel a confirmed booking

### Features
- Route management (Admin only)
- Available seat tracking
- Booking with date selection
- Total fare calculation
- Booking history
- Cancel bookings
- Status tracking

---

## Testing the Modules

### Required Setup
1. Ensure MongoDB is running
2. Backend server running on port 5001
3. Frontend running on port 3000

### Test Accounts (from seed data)
- **Admin**: admin@unitracker.com / password123
- **Professor**: professor@unitracker.com / password123
- **Student**: student@unitracker.com / password123

### Test Scenarios

#### Quiz Module:
1. Login as Professor → Create a quiz with 3 questions
2. Login as Student → Attempt the quiz
3. Login as Admin → View the quiz and create another one
4. Login as Student → Attempt both quizzes

#### Timetable Module:
1. Login as Admin → Create a timetable with sample data
2. Login as Student → View the timetable (should be read-only)
3. Login as Admin → Edit the timetable
4. Login as Professor → View the timetable (should be read-only)

#### Bus Reservation Module:
1. Login as Admin → Add 2 bus routes
2. Login as Student → Book tickets on one route
3. Login as Professor → Book tickets on another route
4. Login as Admin → View all bookings
5. Login as Student → Cancel your booking

---

## Common Issues and Solutions

### Issue: "Cannot read property 'role' of undefined"
**Solution**: Make sure you're logged in. The modules require authentication.

### Issue: "Access denied" or 403 error
**Solution**: Check that you're using the correct user role for the operation:
- Quiz creation requires Admin or Professor
- Timetable editing requires Admin
- Route management requires Admin

### Issue: "Failed to fetch data"
**Solution**: Ensure backend server is running on port 5001 and MongoDB is connected.

### Issue: Module shows "Loading..." indefinitely
**Solution**: Check browser console for errors. Verify API endpoints are accessible.

---

## API Endpoints Quick Reference

### Quiz Management
```
GET    /api/quizzes              - Get all quizzes
POST   /api/quizzes              - Create quiz (Admin/Professor)
PUT    /api/quizzes/:id          - Update quiz (Admin/Professor)
DELETE /api/quizzes/:id          - Delete quiz (Admin/Professor)
POST   /api/quizzes/:id/submit   - Submit answers
GET    /api/quizzes/:id/results  - Get user results
```

### Timetable Management
```
GET    /api/timetable   - Get timetable
POST   /api/timetable   - Save/Update timetable (Admin)
DELETE /api/timetable   - Delete timetable (Admin)
```

### Bus Reservation
```
GET    /api/bus/routes         - Get all routes
POST   /api/bus/routes         - Create route (Admin)
PUT    /api/bus/routes/:id     - Update route (Admin)
DELETE /api/bus/routes/:id     - Delete route (Admin)
GET    /api/bus/bookings       - Get bookings
POST   /api/bus/bookings       - Create booking
DELETE /api/bus/bookings/:id   - Cancel booking
```

---

## Support

For issues or questions:
1. Check the MODULE_INTEGRATION_SUMMARY.md for detailed technical documentation
2. Review the README.md for setup and configuration
3. Check browser console for frontend errors
4. Check backend terminal for API errors
