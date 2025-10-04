const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  subject: { type: String, required: true , unique: true},
  code: { type: String, required: true,unique: true },
  midsem: { type: Number, default: 0 },
  quizzes: { type: Number, default: 0 },
  assignments: { type: Number, default: 0 },
  casestudy: { type: Number, default: 0 },
  endsem: { type: Number, default: 0 },
  units: { type: Number, default: 0 },
  syllabus: [String]
});

module.exports = mongoose.model("Course", courseSchema);
