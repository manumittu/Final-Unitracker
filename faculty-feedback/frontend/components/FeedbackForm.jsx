import React, { useState } from "react";
import axios from "axios";

export default function FeedbackForm() {
  const [facultyName, setFacultyName] = useState("");
  const [subject, setSubject] = useState("");
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/feedback", {
        facultyName, subject, rating, comments
      });
      alert("Feedback submitted successfully!");
      setFacultyName("");
      setSubject("");
      setRating("");
      setComments("");
    } catch (error) {
      alert("Error submitting feedback");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Faculty Name:</label>
      <input type="text" value={facultyName} onChange={(e) => setFacultyName(e.target.value)} required />

      <label>Subject:</label>
      <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />

      <label>Rating (1-5):</label>
      <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} required />

      <label>Comments:</label>
      <textarea value={comments} onChange={(e) => setComments(e.target.value)} />

      <button type="submit">Submit Feedback</button>
    </form>
  );
}
