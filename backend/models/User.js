import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: function() {
        return !this.isLogin;
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'professor', 'admin'],
      default: 'student',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
