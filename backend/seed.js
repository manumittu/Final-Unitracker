import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Course from './models/Course.js';
import { BusRoute } from './models/Bus.js';
import { Quiz } from './models/Quiz.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await BusRoute.deleteMany({});
    await Quiz.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@unitracker.com',
      password: hashedPassword,
      role: 'admin',
      status: 'approved',
    });

    const student = await User.create({
      name: 'John Student',
      email: 'student@unitracker.com',
      password: hashedPassword,
      role: 'student',
      status: 'approved',
    });

    const professor = await User.create({
      name: 'Dr. Smith',
      email: 'professor@unitracker.com',
      password: hashedPassword,
      role: 'professor',
      status: 'approved',
    });

    console.log('✅ Created users:');
    console.log('   - admin@unitracker.com (password: password123)');
    console.log('   - student@unitracker.com (password: password123)');
    console.log('   - professor@unitracker.com (password: password123)');

    // Create courses
    const courses = await Course.create([
      {
        code: 'CS101',
        name: 'Introduction to Programming',
        credits: 3,
        department: 'Computer Science',
        description: 'Learn the fundamentals of programming using Python',
        instructor: 'Dr. Smith',
      },
      {
        code: 'CS201',
        name: 'Data Structures and Algorithms',
        credits: 4,
        department: 'Computer Science',
        description: 'Advanced programming concepts and algorithms',
        instructor: 'Dr. Johnson',
      },
      {
        code: 'MATH101',
        name: 'Calculus I',
        credits: 4,
        department: 'Mathematics',
        description: 'Introduction to differential and integral calculus',
        instructor: 'Prof. Williams',
      },
      {
        code: 'ENG101',
        name: 'English Composition',
        credits: 3,
        department: 'English',
        description: 'Improve your writing and communication skills',
        instructor: 'Dr. Brown',
      },
      {
        code: 'PHY101',
        name: 'Physics I',
        credits: 4,
        department: 'Physics',
        description: 'Classical mechanics and thermodynamics',
        instructor: 'Prof. Davis',
      },
    ]);

    console.log(`✅ Created ${courses.length} sample courses`);

    // Create bus routes
    const busRoutes = await BusRoute.create([
      {
        routeName: 'Campus Express',
        from: 'Main Gate',
        to: 'Engineering Block',
        departureTime: '08:00 AM',
        availableSeats: 40,
        fare: 5,
      },
      {
        routeName: 'City Shuttle',
        from: 'Campus',
        to: 'City Center',
        departureTime: '05:00 PM',
        availableSeats: 50,
        fare: 10,
      },
      {
        routeName: 'Hostel Line',
        from: 'Academic Block',
        to: 'Hostel Area',
        departureTime: '09:00 PM',
        availableSeats: 30,
        fare: 3,
      },
    ]);

    console.log(`✅ Created ${busRoutes.length} bus routes`);

    // Create sample quizzes
    const quizzes = await Quiz.create([
      {
        name: 'Introduction to Computer Science',
        createdBy: professor._id,
        questions: [
          {
            question: 'What does CPU stand for?',
            options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Central Processor Usage'],
            correct: 0,
          },
          {
            question: 'Which programming language is known as the "mother of all languages"?',
            options: ['Java', 'C', 'Python', 'Assembly'],
            correct: 1,
          },
          {
            question: 'What is the binary representation of decimal number 10?',
            options: ['1010', '1100', '1001', '1110'],
            correct: 0,
          },
          {
            question: 'Which data structure uses LIFO (Last In First Out) principle?',
            options: ['Queue', 'Stack', 'Array', 'Linked List'],
            correct: 1,
          },
          {
            question: 'What does RAM stand for?',
            options: ['Read Access Memory', 'Random Access Memory', 'Rapid Access Memory', 'Real Access Memory'],
            correct: 1,
          },
        ],
      },
      {
        name: 'Mathematics Fundamentals',
        createdBy: professor._id,
        questions: [
          {
            question: 'What is the value of π (pi) approximately?',
            options: ['3.14159', '2.71828', '1.41421', '1.73205'],
            correct: 0,
          },
          {
            question: 'What is the derivative of x²?',
            options: ['x', '2x', 'x²', '2x²'],
            correct: 1,
          },
          {
            question: 'What is the square root of 144?',
            options: ['10', '11', '12', '13'],
            correct: 2,
          },
          {
            question: 'What is 15% of 200?',
            options: ['20', '25', '30', '35'],
            correct: 2,
          },
          {
            question: 'In a right triangle, if one angle is 90°, what is the sum of the other two angles?',
            options: ['45°', '60°', '90°', '180°'],
            correct: 2,
          },
          {
            question: 'What is the area of a circle with radius 5?',
            options: ['25π', '10π', '5π', '50π'],
            correct: 0,
          },
        ],
      },
      {
        name: 'General Knowledge Quiz',
        createdBy: admin._id,
        questions: [
          {
            question: 'What is the capital of France?',
            options: ['London', 'Berlin', 'Paris', 'Madrid'],
            correct: 2,
          },
          {
            question: 'Which planet is known as the Red Planet?',
            options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
            correct: 1,
          },
          {
            question: 'Who painted the Mona Lisa?',
            options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
            correct: 2,
          },
          {
            question: 'What is the largest ocean on Earth?',
            options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
            correct: 3,
          },
          {
            question: 'In which year did World War II end?',
            options: ['1943', '1944', '1945', '1946'],
            correct: 2,
          },
          {
            question: 'What is the chemical symbol for gold?',
            options: ['Go', 'Gd', 'Au', 'Ag'],
            correct: 2,
          },
          {
            question: 'Which country has the largest population?',
            options: ['India', 'USA', 'China', 'Indonesia'],
            correct: 2,
          },
        ],
      },
      {
        name: 'Physics Basics',
        createdBy: professor._id,
        questions: [
          {
            question: 'What is the speed of light in vacuum?',
            options: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10⁷ m/s', '3 × 10⁹ m/s'],
            correct: 0,
          },
          {
            question: 'What is Newton\'s first law of motion?',
            options: ['F = ma', 'Every action has an equal and opposite reaction', 'An object in motion stays in motion', 'Energy cannot be created or destroyed'],
            correct: 2,
          },
          {
            question: 'What is the SI unit of force?',
            options: ['Joule', 'Newton', 'Watt', 'Pascal'],
            correct: 1,
          },
          {
            question: 'What is the acceleration due to gravity on Earth?',
            options: ['8.8 m/s²', '9.8 m/s²', '10.8 m/s²', '11.8 m/s²'],
            correct: 1,
          },
          {
            question: 'Which of the following is a vector quantity?',
            options: ['Speed', 'Mass', 'Velocity', 'Temperature'],
            correct: 2,
          },
        ],
      },
    ]);

    console.log(`✅ Created ${quizzes.length} sample quizzes with questions`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📚 Sample Quizzes Created:');
    quizzes.forEach((quiz) => {
      console.log(`   - ${quiz.name} (${quiz.questions.length} questions)`);
    });
    console.log('\nYou can now login with any of these accounts:');
    console.log('Email: admin@unitracker.com | Password: password123 | Role: Admin');
    console.log('Email: student@unitracker.com | Password: password123 | Role: Student');
    console.log('Email: professor@unitracker.com | Password: password123 | Role: Professor');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
