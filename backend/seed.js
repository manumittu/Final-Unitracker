import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Course from './models/Course.js';
import { BusRoute } from './models/Bus.js';

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
    console.log('🗑️  Cleared existing data');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@unitracker.com',
      password: hashedPassword,
      role: 'admin',
    });

    const student = await User.create({
      name: 'John Student',
      email: 'student@unitracker.com',
      password: hashedPassword,
      role: 'student',
    });

    const professor = await User.create({
      name: 'Dr. Smith',
      email: 'professor@unitracker.com',
      password: hashedPassword,
      role: 'professor',
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

    console.log('\n🎉 Database seeded successfully!');
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
