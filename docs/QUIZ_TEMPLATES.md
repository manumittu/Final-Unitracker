# Default Quiz Templates

This document describes the default quiz templates that are created when running the database seed script.

## Overview

The seed script (`backend/seed.js`) now includes 4 sample quizzes with multiple-choice questions. These quizzes are automatically created when you run:

```bash
npm run seed
```

## Sample Quizzes

### 1. Introduction to Computer Science
- **Number of Questions:** 5
- **Created By:** Professor (Dr. Smith)
- **Topics Covered:**
  - CPU architecture
  - Programming language history
  - Binary number systems
  - Data structures (Stack)
  - Computer memory (RAM)

### 2. Mathematics Fundamentals
- **Number of Questions:** 6
- **Created By:** Professor (Dr. Smith)
- **Topics Covered:**
  - Mathematical constants (π)
  - Calculus (derivatives)
  - Basic arithmetic (square roots, percentages)
  - Geometry (triangle angles, circle area)

### 3. General Knowledge Quiz
- **Number of Questions:** 7
- **Created By:** Admin User
- **Topics Covered:**
  - World capitals
  - Astronomy (planets)
  - Art history
  - Geography (oceans)
  - World history (WWII)
  - Chemistry (chemical symbols)
  - Demographics

### 4. Physics Basics
- **Number of Questions:** 5
- **Created By:** Professor (Dr. Smith)
- **Topics Covered:**
  - Speed of light
  - Newton's laws of motion
  - SI units
  - Gravitational acceleration
  - Vector quantities

## Quiz Structure

Each quiz follows this structure:

```javascript
{
  name: String,           // Quiz name
  createdBy: ObjectId,    // Reference to User (professor or admin)
  questions: [
    {
      question: String,   // Question text
      options: [String],  // Array of 4 answer options
      correct: Number     // Index of correct option (0-3)
    }
  ]
}
```

## Benefits

1. **Immediate Testing:** Students can test the quiz functionality immediately after seeding
2. **Learning Examples:** Provides examples for professors creating new quizzes
3. **Quality Assurance:** Helps test the quiz module with realistic data
4. **Demo-Ready:** Makes the application demo-ready with meaningful content

## Customization

To add more default quizzes or modify existing ones:

1. Open `backend/seed.js`
2. Locate the quiz creation section (around line 133)
3. Add new quiz objects to the array or modify existing ones
4. Each quiz should have:
   - A descriptive name
   - A `createdBy` field referencing `admin._id` or `professor._id`
   - An array of questions with 4 options each
   - A correct answer index (0-3) for each question

## Example: Adding a New Quiz

```javascript
{
  name: 'Biology Basics',
  createdBy: professor._id,
  questions: [
    {
      question: 'What is the powerhouse of the cell?',
      options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Apparatus'],
      correct: 1,
    },
    // Add more questions...
  ],
}
```

## Testing

After seeding, you can:

1. Login as a student (student@unitracker.com / password123)
2. Navigate to the Quiz module
3. See all 4 default quizzes available
4. Attempt any quiz to test functionality

Or:

1. Login as a professor/admin (professor@unitracker.com / password123)
2. View quiz management interface
3. See all created quizzes
4. Edit or create new quizzes based on the templates

## Notes

- All default quizzes have exactly 4 options per question (standard multiple choice)
- The correct answer is stored as an index (0 = first option, 1 = second, etc.)
- Students can only attempt each quiz once (unless admin resets it)
- Professors and admins can view leaderboards for each quiz
