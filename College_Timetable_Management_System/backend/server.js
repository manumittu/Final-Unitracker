const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

const TimetableSchema = new mongoose.Schema({
  classrooms: Number,
  subjectMap: Object,
  timetable: Object,
}, { timestamps: true });

const Timetable = mongoose.model("Timetable", TimetableSchema);

app.post("/api/timetable", async (req, res) => {
  const { classrooms, subjectMap, timetable } = req.body;
  try {
    let existing = await Timetable.findOne({});
    if (existing) {
      existing.classrooms = classrooms;
      existing.subjectMap = subjectMap;
      existing.timetable = timetable;
      await existing.save();
      return res.json(existing);
    }
    const newEntry = new Timetable({ classrooms, subjectMap, timetable });
    await newEntry.save();
    res.json(newEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/timetable", async (req, res) => {
  try {
    const data = await Timetable.findOne({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/timetable", async (req, res) => {
  try {
    await Timetable.deleteMany({});
    res.json({ message: "Timetable deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
