# Architecture Diagram - Canteen Integration

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React + Vite)                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      Authentication Page                         │  │
│  │  - Login Form (email, password)                                 │  │
│  │  - Signup Form (name, email, password, confirmPassword, role)   │  │
│  │  - Role Dropdown (5 options - ONLY on signup)                   │  │
│  │    • Student                                                     │  │
│  │    • Professor                                                   │  │
│  │    • Admin                                                       │  │
│  │    • Canteen Staff                                              │  │
│  │    • Bus Staff                                                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                  ↓                                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                         Dashboard Page                           │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │  │
│  │  │Course│ │Time- │ │ Quiz │ │Feed- │ │Lost &│ │Canteen│ ...    │  │
│  │  │      │ │table │ │      │ │back  │ │Found │ │  NEW  │         │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘         │  │
│  │                                          ↓         ↓               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                              ↓         ↓                 │
│  ┌──────────────────────────────┐  ┌────────────────────────────────┐ │
│  │  Lost & Found Module         │  │   Canteen Module (NEW)          │ │
│  │  ─────────────────────       │  │   ───────────────────           │ │
│  │  UPDATED FEATURES:           │  │                                 │ │
│  │  • Show all items in         │  │   ┌─────────────────────────┐  │ │
│  │    "Found Items" view        │  │   │   Admin View            │  │ │
│  │  • Added "Claim Item"        │  │   │   ─────────────────     │  │ │
│  │    button                    │  │   │   • Add Menu Items      │  │ │
│  │  • Shows contact info        │  │   │   • Edit Menu Items     │  │ │
│  │  • Downloads item details    │  │   │   • Delete Menu Items   │  │ │
│  │                              │  │   │   • View All Orders     │  │ │
│  │  [All Items]                 │  │   │   • Cancel Any Order    │  │ │
│  │  [Lost Items]                │  │   └─────────────────────────┘  │ │
│  │  [Found Items] ← Shows ALL   │  │                                 │ │
│  │                              │  │   ┌─────────────────────────┐  │ │
│  │  Item Cards:                 │  │   │   User View             │  │ │
│  │  ┌─────────────────────┐     │  │   │   ─────────────────     │  │ │
│  │  │ Blue Backpack [LOST]│     │  │   │   • Browse Menu         │  │ │
│  │  │ Description...      │     │  │   │   • Place Orders        │  │ │
│  │  │ 📍 Location         │     │  │   │   • View My Orders      │  │ │
│  │  │ 📅 Date             │     │  │   │   • Cancel My Orders    │  │ │
│  │  │ 📞 Contact          │     │  │   └─────────────────────────┘  │ │
│  │  │ Posted by: Name     │     │  │                                 │ │
│  │  │ [Claim Item] ← NEW  │     │  │   Menu Items Grid:              │ │
│  │  │ [📥 Download]       │     │  │   ┌──────┐ ┌──────┐ ┌──────┐  │ │
│  │  └─────────────────────┘     │  │   │Samosa│ │Dosa  │ │Tea   │  │ │
│  └──────────────────────────────┘  │   │₹20   │ │₹40   │ │₹10   │  │ │
│                                     │   │[Order]│ │[Order]│ │[Order]│  │ │
│                                     │   └──────┘ └──────┘ └──────┘  │ │
│                                     └────────────────────────────────┘ │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     API Client (utils/api.js)                    │  │
│  │  • canteenAPI.getMenu()                                          │  │
│  │  • canteenAPI.createMenuItem()                                   │  │
│  │  • canteenAPI.updateMenuItem()                                   │  │
│  │  • canteenAPI.deleteMenuItem()                                   │  │
│  │  • canteenAPI.getBookings()                                      │  │
│  │  • canteenAPI.createBooking()                                    │  │
│  │  • canteenAPI.updateBooking()                                    │  │
│  │  • canteenAPI.deleteBooking()                                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                     ↓                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                      ↓
                              JWT Token in Headers
                                      ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express + MongoDB)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      Auth Routes (existing)                      │  │
│  │  POST /api/auth/signup                                          │  │
│  │    • Accepts 5 role types: student, professor, admin,           │  │
│  │      canteen, bus                                               │  │
│  │  POST /api/auth/login                                           │  │
│  │  GET  /api/auth/me                                              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                   Canteen Routes (NEW)                           │  │
│  │  ────────────────────────────────────                           │  │
│  │  Menu Management:                                                │  │
│  │    GET    /api/canteen/menu          [authenticated]            │  │
│  │    POST   /api/canteen/menu          [admin only]               │  │
│  │    PUT    /api/canteen/menu/:id      [admin only]               │  │
│  │    DELETE /api/canteen/menu/:id      [admin only]               │  │
│  │                                                                  │  │
│  │  Booking Management:                                             │  │
│  │    GET    /api/canteen/booking       [authenticated]            │  │
│  │           → Returns own bookings or all if admin                │  │
│  │    POST   /api/canteen/booking       [authenticated]            │  │
│  │    PUT    /api/canteen/booking/:id   [owner/admin]              │  │
│  │    DELETE /api/canteen/booking/:id   [owner/admin]              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     Middleware Stack                             │  │
│  │  • express.json()                                                │  │
│  │  • cors()                                                        │  │
│  │  • authenticateToken (JWT verification)                          │  │
│  │  • isAdmin (role check)                                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                     ↓                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                         MongoDB Database                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐   │
│  │      Users Collection        │  │    Menu Collection (NEW)     │   │
│  │      ────────────────────     │  │    ─────────────────────     │   │
│  │  {                           │  │  {                           │   │
│  │    name: String,             │  │    itemName: String*,        │   │
│  │    email: String,            │  │    category: String,         │   │
│  │    password: String (hashed),│  │    price: Number,            │   │
│  │    role: String,             │  │    availability: Boolean,    │   │
│  │         ↑                    │  │    prepTime: String,         │   │
│  │    Updated to support:       │  │    imageUrl: String,         │   │
│  │    • student                 │  │    timestamps: true          │   │
│  │    • professor               │  │  }                           │   │
│  │    • admin                   │  └──────────────────────────────┘   │
│  │    • canteen                 │                                      │
│  │    • bus                     │  ┌──────────────────────────────┐   │
│  │  }                           │  │  Bookings Collection (NEW)   │   │
│  └──────────────────────────────┘  │  ──────────────────────────   │   │
│                                     │  {                           │   │
│  ┌──────────────────────────────┐  │    userId: ObjectId*,        │   │
│  │  LostFound Collection        │  │    studentId: String,        │   │
│  │  ─────────────────────────    │  │    name: String,             │   │
│  │  {                           │  │    date: Date,               │   │
│  │    type: String,             │  │    timeSlot: String,         │   │
│  │    itemName: String,         │  │    foodItem: String*,        │   │
│  │    description: String,      │  │    quantity: Number,         │   │
│  │    location: String,         │  │    paymentMode: String,      │   │
│  │    date: Date,               │  │    specialInstructions: ..., │   │
│  │    contactInfo: String,      │  │    confirmed: Boolean,       │   │
│  │    postedBy: ObjectId        │  │    timestamps: true          │   │
│  │  }                           │  │  }                           │   │
│  │  No schema changes           │  └──────────────────────────────┘   │
│  │  (logic updated in frontend) │                                      │
│  └──────────────────────────────┘                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

Legend:
  * = Required field
  [authenticated] = Requires JWT token
  [admin only] = Requires admin role
  [owner/admin] = Requires resource owner or admin
  NEW = Newly created
  UPDATED = Modified existing component
```

## Data Flow Examples

### 1. Admin Adding Menu Item
```
Admin clicks "Add Menu Item"
  ↓
Fills form (name, category, price, etc.)
  ↓
Submits form
  ↓
canteenAPI.createMenuItem(data)
  ↓
POST /api/canteen/menu with JWT token
  ↓
authenticateToken middleware verifies token
  ↓
isAdmin middleware checks role
  ↓
Menu.save() to database
  ↓
Returns new menu item
  ↓
Frontend refreshes menu list
```

### 2. Student Ordering Food
```
Student clicks "Order" on menu item
  ↓
Fills order form (date, time slot, quantity, etc.)
  ↓
Total price calculated (price × quantity)
  ↓
Submits order
  ↓
canteenAPI.createBooking(data)
  ↓
POST /api/canteen/booking with JWT token
  ↓
authenticateToken middleware verifies token
  ↓
Booking.save() with userId from token
  ↓
Returns new booking
  ↓
Frontend shows order in "My Orders"
```

### 3. User Claiming Lost Item
```
User browsing "Found Items" section
  ↓
Sees all items (lost + found)
  ↓
Clicks "Claim Item" on a lost item
  ↓
Confirm dialog shows contact info
  ↓
User confirms
  ↓
Alert shows contact details
  ↓
Item details auto-downloaded as .txt
```

## Key Integration Points

1. **Authentication**: JWT token passed in all API calls
2. **Authorization**: Role-based access control at route level
3. **Data Association**: Bookings linked to users via userId
4. **UI Consistency**: Follows existing card/grid patterns
5. **Error Handling**: Try-catch blocks with user-friendly messages
6. **State Management**: React hooks (useState, useEffect)
7. **API Layer**: Centralized axios instance with interceptors
