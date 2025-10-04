const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const courseRoutes = require("./routes/courseRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/courses", courseRoutes);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(" MongoDB connected");
    app.listen(5000, () => console.log(" Server running on port 5000"));
  })
  .catch((err) => console.error(" DB Connection Error:", err));
