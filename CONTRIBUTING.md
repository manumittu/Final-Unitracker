# Contributing to UniTracker

Thank you for your interest in contributing to UniTracker! This guide will help you add new modules or improve existing ones.

## Project Structure

```
unitracker-monorepo/
├── frontend/                 # Vite + React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── ui/          # ShadCN UI components
│   │   │   └── ModuleLayout.jsx
│   │   ├── pages/           # Main pages (Landing, Auth, Dashboard)
│   │   ├── modules/         # Feature modules
│   │   │   ├── courses/
│   │   │   ├── feedback/
│   │   │   └── ...
│   │   ├── utils/           # Utilities (API, AuthContext)
│   │   └── App.jsx          # Main router
│   └── package.json
│
├── backend/                  # Express + MongoDB backend
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── middleware/          # Auth middleware
│   ├── server.js            # Entry point
│   └── package.json
│
└── package.json             # Root package.json
```

## Adding a New Module

Follow these steps to add a new module to UniTracker:

### 1. Create the Database Model

Create a new model file in `backend/models/YourModule.js`:

```javascript
import mongoose from 'mongoose';

const yourModuleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Add your fields here
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('YourModule', yourModuleSchema);
```

### 2. Create API Routes

Create routes in `backend/routes/yourModule.js`:

```javascript
import express from 'express';
import YourModule from '../models/YourModule.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const items = await YourModule.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create item (admin only example)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const newItem = new YourModule({
      ...req.body,
      createdBy: req.user.id,
    });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add more routes as needed

export default router;
```

### 3. Register Routes in Server

Add your routes to `backend/server.js`:

```javascript
import yourModuleRoutes from './routes/yourModule.js';

// ... existing code ...

app.use('/api/your-module', yourModuleRoutes);
```

### 4. Add API Functions

Add API helper functions in `frontend/src/utils/api.js`:

```javascript
// Your Module API
export const yourModuleAPI = {
  getAll: () => api.get('/your-module'),
  getById: (id) => api.get(`/your-module/${id}`),
  create: (data) => api.post('/your-module', data),
  update: (id, data) => api.put(`/your-module/${id}`, data),
  delete: (id) => api.delete(`/your-module/${id}`),
};
```

### 5. Create the Frontend Module

Create a new directory `frontend/src/modules/yourModule/` and add `YourModule.jsx`:

```javascript
import React, { useState, useEffect } from 'react';
import ModuleLayout from '../../components/ModuleLayout';
import { useAuth } from '../../utils/AuthContext';
import { yourModuleAPI } from '../../utils/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const YourModule = () => {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await yourModuleAPI.getAll();
      setItems(response.data);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModuleLayout title="Your Module">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Module Title</h2>
        
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <Card key={item._id}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

export default YourModule;
```

### 6. Register the Module in App.jsx

Add your module to `frontend/src/App.jsx`:

```javascript
import YourModule from './modules/yourModule/YourModule';

// In the Routes section:
<Route
  path="/modules/your-module"
  element={
    <ProtectedRoute>
      <YourModule />
    </ProtectedRoute>
  }
/>
```

### 7. Add Module Card to Dashboard

Update `frontend/src/pages/DashboardPage.jsx`:

```javascript
const modules = [
  // ... existing modules ...
  {
    id: 'your-module',
    title: 'Your Module',
    description: 'Description of your module',
    icon: <YourIcon size={40} />,
    path: '/modules/your-module',
    color: 'from-cyan-500 to-cyan-600',
    access: ['admin', 'student', 'professor'], // Adjust based on who can access
  },
];
```

## Role-Based Access Patterns

### Admin-Only Features

```javascript
{isAdmin() && (
  <Button onClick={handleAdminAction}>
    Admin Only Action
  </Button>
)}
```

### Different Views for Different Roles

```javascript
<h2>
  {isAdmin() 
    ? 'Admin View Title' 
    : 'User View Title'}
</h2>
```

### API-Level Authorization

```javascript
// In backend routes
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  // Only admins can access this endpoint
});
```

## UI Components

Use existing ShadCN components from `frontend/src/components/ui/`:

- `Button` - Buttons with variants (default, outline, destructive, etc.)
- `Card` - Card containers with Header, Content, Footer
- `Input` - Text inputs
- `Label` - Form labels
- More components can be added from [ShadCN UI](https://ui.shadcn.com/)

## Styling Guidelines

### Use Tailwind CSS Classes

```javascript
<div className="space-y-6">
  <h2 className="text-2xl font-bold text-gray-800">Title</h2>
  <Button className="bg-blue-500 hover:bg-blue-600">Action</Button>
</div>
```

### Common Patterns

```javascript
// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Spacing
<div className="space-y-4">  // Vertical spacing
<div className="space-x-4">  // Horizontal spacing

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Status badges
<span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
  Active
</span>
```

## Best Practices

### 1. Error Handling

Always handle errors gracefully:

```javascript
try {
  const response = await api.get('/endpoint');
  setData(response.data);
} catch (err) {
  setError(err.response?.data?.error || 'Something went wrong');
}
```

### 2. Loading States

Show loading indicators:

```javascript
{loading ? (
  <div className="text-center py-8">Loading...</div>
) : (
  // Your content
)}
```

### 3. Empty States

Handle empty data:

```javascript
{items.length === 0 ? (
  <Card>
    <CardContent className="py-8 text-center text-gray-500">
      No items found.
    </CardContent>
  </Card>
) : (
  // Show items
)}
```

### 4. Form Validation

Validate forms before submission:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.title.trim()) {
    setError('Title is required');
    return;
  }
  
  try {
    await api.post('/endpoint', formData);
    // Success
  } catch (err) {
    setError('Failed to submit');
  }
};
```

## Testing Your Changes

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test with Different Roles

Log in as:
- Admin: `admin@unitracker.com` / `password123`
- Student: `student@unitracker.com` / `password123`

### 3. Test All CRUD Operations

- Create new items
- Read/view items
- Update items
- Delete items

### 4. Test Edge Cases

- Empty states
- Error scenarios
- Long text/content
- Missing data

## Code Style

### JavaScript

- Use ES6+ features (arrow functions, destructuring, async/await)
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### React

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components focused on a single responsibility
- Use proper prop destructuring

### Example

```javascript
// Good
const handleSubmit = async (formData) => {
  try {
    const response = await api.post('/endpoint', formData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Avoid
function handleSubmit(formData) {
  return api.post('/endpoint', formData).then(function(response) {
    return response.data;
  }).catch(function(error) {
    console.log(error);
  });
}
```

## Submitting Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-module-name
```

### 2. Make Your Changes

Follow the guidelines above.

### 3. Test Thoroughly

- Test all functionality
- Test with different roles
- Check for console errors

### 4. Commit Your Changes

```bash
git add .
git commit -m "Add YourModule with role-based access"
```

### 5. Push and Create PR

```bash
git push origin feature/your-module-name
```

Then create a Pull Request on GitHub.

## Questions?

If you have questions or need help:

1. Check existing modules for reference
2. Review the README.md and SETUP.md
3. Open an issue on GitHub
4. Contact the maintainers

---

Happy coding! 🚀
