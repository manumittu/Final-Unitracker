import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  facultyName: { type: String, required: true },
  subject: { type: String, required: true },
  rating: { type: Number, required: true },
  comments: { type: String }
});

export default mongoose.model("Feedback", feedbackSchema);
