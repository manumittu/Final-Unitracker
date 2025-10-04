import React from "react";
import FeedbackForm from "../components/FeedbackForm";
import "./App.css";

export default function App() {
  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Faculty Feedback Form</h1>
      <FeedbackForm/>
    </div>
  );
}
