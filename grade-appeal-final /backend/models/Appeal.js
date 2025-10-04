import mongoose from 'mongoose';

const appealSchema = new mongoose.Schema({
  studentId: { type: String, required: true, trim: true },
  studentName: { type: String, required: true, trim: true },
  courseCode: { type: String, required: true, trim: true },
  courseName: { type: String, required: true, trim: true },
  receivedGrade: { type: String, enum: ['A+','A','B+','B','C','D','F'], required: true },
  expectedGrade: { type: String, enum: ['A+','A','B+','B','C','D','F'], required: true },
  reason: { type: String, required: true, minlength: 10 },
  appealDate: { type: Date, required: true },
  declaration: { type: Boolean, required: true, default: false }
}, { timestamps: true });

export default mongoose.model('Appeal', appealSchema);
