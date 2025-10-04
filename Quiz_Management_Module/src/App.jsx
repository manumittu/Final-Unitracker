import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis
} from "recharts";

import "./App.css";

const API = "http://localhost:5000/api/quizzes";

function App() {
  const [view, setView] = useState(null);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(null);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState([]);
  const [form, setForm] = useState({ question: "", options: ["", "", "", ""], correct: 0 });
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [direction, setDirection] = useState("next");
  const [newQuizName, setNewQuizName] = useState("");
  const [editingQuizId, setEditingQuizId] = useState(null);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(API);
      setAllQuizzes(res.data);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleChange = (e, index = null) => {
    if (index !== null) {
      const newOptions = [...form.options];
      newOptions[index] = e.target.value;
      setForm({ ...form, options: newOptions });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addOrUpdateQuestion = () => {
    if (!form.question.trim() || form.options.some(opt => !opt.trim())) {
      alert("Fill all fields!");
      return;
    }
    const updatedQuestions = [...currentQuizQuestions];
    if (editingIndex !== null) {
      updatedQuestions[editingIndex] = form;
      setEditingIndex(null);
    } else {
      updatedQuestions.push(form);
      setCurrentQIndex(updatedQuestions.length - 1);
    }
    setCurrentQuizQuestions(updatedQuestions);
    setForm({ question: "", options: ["", "", "", ""], correct: 0 });
  };

  const deleteQuestion = (i) => {
    const updatedQuestions = currentQuizQuestions.filter((_, idx) => idx !== i);
    setCurrentQuizQuestions(updatedQuestions);
    if (currentQIndex >= updatedQuestions.length) setCurrentQIndex(updatedQuestions.length - 1);
  };

  const editQuestion = (i) => {
    setForm(currentQuizQuestions[i]);
    setEditingIndex(i);
    setCurrentQIndex(i);
  };

  const handleAnswer = (optIndex) => {
    setAnswers({ ...answers, [currentQIndex]: optIndex });
  };

  const nextQuestion = (mode = "attempt") => {
    if (currentQIndex < currentQuizQuestions.length - 1) {
      setDirection("next");
      setCurrentQIndex(currentQIndex + 1);
      if (mode === "create") setForm(currentQuizQuestions[currentQIndex + 1]);
    } else if (mode === "create") {
      setForm({ question: "", options: ["", "", "", ""], correct: 0 });
    }
  };

  const prevQuestion = (mode = "attempt") => {
    if (currentQIndex > 0) {
      setDirection("prev");
      setCurrentQIndex(currentQIndex - 1);
      if (mode === "create") setForm(currentQuizQuestions[currentQIndex - 1]);
    }
  };

  const saveQuiz = async () => {
    if (!newQuizName.trim()) {
      alert("Enter quiz name!");
      return;
    }

    try {
      if (editingQuizId) {
        await axios.put(`${API}/${editingQuizId}`, {
          name: newQuizName,
          questions: currentQuizQuestions
        });
      } else {
        await axios.post(API, {
          name: newQuizName,
          questions: currentQuizQuestions
        });
      }

      setNewQuizName("");
      setCurrentQuizQuestions([]);
      setEditingQuizId(null);
      setView(null);
      fetchQuizzes();
    } catch (err) {
      console.error("Error saving quiz:", err);
    }
  };

  const submitQuiz = () => {
    let s = 0;
    currentQuizQuestions.forEach((q, i) => { if (answers[i] === q.correct) s++; });
    setScore(s);
    setView("score");
  };

  const resetCurrentQuiz = () => {
    setCurrentQuizQuestions([]);
    setForm({ question: "", options: ["", "", "", ""], correct: 0 });
    setEditingIndex(null);
    setAnswers({});
    setScore(null);
    setCurrentQIndex(0);
    setNewQuizName("");
    setEditingQuizId(null);
    setView("nameQuiz");
  };

  if (!view) return (
    <div className="landing-container">
      <div className="hero">
        <h1>Welcome to Professor Module</h1>
        <h2>Create or Attempt Quizzes</h2>
        <div className="cta-section">
          <button className="cta-button" onClick={() => { setCurrentQuizQuestions([]); setView("nameQuiz"); }}>Create Quiz</button>
          <button className="cta-button" onClick={() => setView("selectQuiz")}>Attempt/Edit Quiz</button>
        </div>
      </div>
    </div>
  );

  if (view === "nameQuiz") return (
    <div className="landing-container">
      <div className="hero">
        <h2>Name Your Quiz</h2>
        <input type="text" placeholder="Quiz Name" value={newQuizName} onChange={e => setNewQuizName(e.target.value)} />
        <div className="mt-2 flex-center">
          <button className="cta-button" onClick={() => setView("create")}>Start Adding Questions</button>
          <button className="cta-button" onClick={() => setView(null)}>Cancel</button>
        </div>
      </div>
    </div>
  );

  if (view === "selectQuiz") return (
    <div className="landing-container">
      <div className="hero">
        <h2>Select a Quiz</h2>
        {allQuizzes.length === 0 ? <p>No quizzes available.</p> :
          allQuizzes.map((quiz, idx) => (
            <div key={quiz._id} className="question-card">
              <p>{quiz.name}</p>
              <button className="cta-button small" onClick={() => {
                setCurrentQuizIndex(idx);
                setCurrentQuizQuestions(quiz.questions);
                setCurrentQIndex(0);
                setAnswers({});
                setScore(null);
                setView("attempt");
              }}>Attempt</button>
              <button className="cta-button small" onClick={() => {
                setCurrentQuizIndex(idx);
                setCurrentQuizQuestions([...quiz.questions]);
                setCurrentQIndex(0);
                setNewQuizName(quiz.name);
                setEditingQuizId(quiz._id);
                setView("create");
              }}>Edit</button>
            </div>
          ))
        }
        <div className="mt-2 flex-center">
          <button className="cta-button" onClick={() => setView(null)}>Back</button>
        </div>
      </div>
    </div>
  );

  if (view === "create") {
    return (
      <div className="landing-container">
        <div className="hero quiz-container">
          <button className="cta-button" onClick={saveQuiz}>{editingQuizId ? "Update Quiz" : "Save Quiz"}</button>
          <h2>{editingIndex !== null ? "Edit Question" : "Add Question"}</h2>

          <div className={`floating-input slide-${direction}`} key={currentQIndex}>
            <input
              type="text"
              name="question"
              placeholder="Question"
              value={form.question}
              onChange={handleChange}
              className="uniform-input"
            />
          </div>

          {form.options.map((opt, i) => (
            <div key={i} className={`floating-input flex-center slide-${direction}`}>
              <input
                type="text"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => handleChange(e, i)}
                className="uniform-input"
              />
              <label>
                <input
                  type="radio"
                  name="correct"
                  checked={form.correct === i}
                  onChange={() => setForm({ ...form, correct: i })}
                />
                Correct
              </label>
            </div>
          ))}

          {currentQuizQuestions.length > 0 && (
            <div className="existing-questions">
              <h3>Questions</h3>
              {currentQuizQuestions.map((q, i) => (
                <div key={i} className="question-card">
                  <p>{i + 1}. {q.question}</p>
                  <button className="cta-button small" onClick={() => editQuestion(i)}>Edit</button>
                  <button className="cta-button small danger" onClick={() => deleteQuestion(i)}>Delete</button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-2 flex-center">
            <button className="cta-button" onClick={prevQuestion.bind(null, "create")} disabled={currentQIndex === 0}>Previous</button>
            <button className="cta-button" onClick={addOrUpdateQuestion}>Add/Update</button>
            <button className="cta-button" onClick={nextQuestion.bind(null, "create")}>Next</button>
            <button className="cta-button" onClick={resetCurrentQuiz}>Reset Quiz</button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "attempt") {
    if (currentQuizQuestions.length === 0) return (
      <div className="landing-container">
        <div className="hero">
          <button className="cta-button" onClick={() => setView(null)}>Back to Home</button>
          <p>No questions available.</p>
        </div>
      </div>
    );

    const q = currentQuizQuestions[currentQIndex];

    return (
      <div className="landing-container">
        <div className="hero quiz-container">
          <button className="cta-button" onClick={() => setView(null)}>Back to Home</button>
          <h2>Attempt Quiz</h2>
          <div className={`feature-card slide-${direction}`} key={currentQIndex}>
            <h4>{currentQIndex + 1}. {q.question}</h4>
            {q.options.map((opt, j) => (
              <label key={j} className="option-label">
                <input
                  type="radio"
                  name={`q${currentQIndex}`}
                  checked={answers[currentQIndex] === j}
                  onChange={() => handleAnswer(j)}
                />
                {opt}
              </label>
            ))}
          </div>
          <div className="mt-2 flex-center">
            <button className="cta-button" onClick={prevQuestion} disabled={currentQIndex === 0}>Previous</button>
            {currentQIndex < currentQuizQuestions.length - 1
              ? <button className="cta-button" onClick={nextQuestion}>Next</button>
              : <button className="cta-button" onClick={submitQuiz}>Submit Quiz</button>
            }
          </div>
        </div>
      </div>
    );
  }

  if (view === "score") {
    const correctCount = score;
    const incorrectCount = currentQuizQuestions.length - score;

    const pieData = [
      { name: "Correct", value: correctCount },
      { name: "Incorrect", value: incorrectCount },
    ];

    const barData = currentQuizQuestions.map((q, i) => ({
      name: `Q${i + 1}`,
      correct: answers[i] === q.correct ? 1 : 0,
    }));

    return (
      <div className="landing-container">
        <div className="hero">
          <h2>Your Score: {score} / {currentQuizQuestions.length}</h2>

          <div style={{ width: "100%", height: 300 }}>
            <h3>Overall Performance</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell key="Correct" fill="#4caf50" />
                  <Cell key="Incorrect" fill="#f44336" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ width: "100%", height: 300, marginTop: "2rem" }}>
            <h3>Question-wise Performance</h3>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Bar dataKey="correct" fill="#2196f3">
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.correct ? "#4caf50" : "#f44336"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex-center">
            <button
              className="cta-button"
              onClick={() => {
                setView("attempt");
                setScore(null);
                setAnswers({});
                setCurrentQIndex(0);
              }}
            >
              Retry Quiz
            </button>
            <button className="cta-button" onClick={() => setView(null)}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
