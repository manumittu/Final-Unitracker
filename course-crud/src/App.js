import React, { Component } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./App.css";

ChartJS.register(ArcElement, Tooltip, Legend);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      editingIndex: null,
      error: "",
      showForm: false,
      showCourses: false,
      formData: {
        subject: "",
        code: "",
        midsem: "",
        quizzes: "",
        assignments: "",
        casestudy: "",
        endsem: "",
        units: "",
        syllabus: []
      }
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/api/courses")
      .then((res) => this.setState({ courses: res.data }))
      .catch((err) => console.error("Error fetching courses:", err));
  }

  handleChange = (e) => {
    let { name, value } = e.target;

    if (["midsem", "quizzes", "assignments", "casestudy", "endsem"].includes(name)) {
      if (value < 0) value = 0;
    }

    if (name === "subject" && /[^a-zA-Z\s]/.test(value)) {
      return;
    }

    this.setState((prevState) => ({
      formData: { ...prevState.formData, [name]: value }
    }));
  };

  handleUnitChange = (index, value) => {
    this.setState((prevState) => {
      const updatedSyllabus = [...prevState.formData.syllabus];
      updatedSyllabus[index] = value;
      return { formData: { ...prevState.formData, syllabus: updatedSyllabus } };
    });
  };

  handleUnitsCount = (e) => {
    const count = parseInt(e.target.value) || 0;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        units: count,
        syllabus: Array(count).fill("")
      }
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ error: "" });

    const { formData, editingIndex, courses } = this.state;

    const internal =
      Number(formData.midsem) +
      Number(formData.quizzes) +
      Number(formData.assignments) +
      Number(formData.casestudy);
    const external = Number(formData.endsem);

    if (internal + external !== 100) {
      this.setState({ error: "❌ Total marks (Internal + External) must equal 100!" });
      return;
    }

    if (editingIndex !== null) {
      const id = courses[editingIndex]._id;
      axios
        .put(`http://localhost:5000/api/courses/${id}`, formData)
        .then((res) => {
          const updatedCourses = [...courses];
          updatedCourses[editingIndex] = res.data;
          this.setState({
            courses: updatedCourses,
            editingIndex: null,
            showForm: false,
            formData: {
              subject: "",
              code: "",
              midsem: "",
              quizzes: "",
              assignments: "",
              casestudy: "",
              endsem: "",
              units: "",
              syllabus: []
            }
          });
        })
        .catch((err) => console.error("Error updating course:", err));
    } else {
      axios
        .post("http://localhost:5000/api/courses", formData)
        .then((res) => {
          this.setState((prevState) => ({
            courses: [...prevState.courses, res.data],
            showForm: false,
            formData: {
              subject: "",
              code: "",
              midsem: "",
              quizzes: "",
              assignments: "",
              casestudy: "",
              endsem: "",
              units: "",
              syllabus: []
            }
          }));
        })
        .catch((err) => console.error("Error adding course:", err));
    }
  };

  handleEdit = (index) => {
    this.setState({
      formData: this.state.courses[index],
      editingIndex: index,
      showForm: true
    });
  };

  handleDelete = (index) => {
    const id = this.state.courses[index]._id;
    axios
      .delete(`http://localhost:5000/api/courses/${id}`)
      .then(() => {
        this.setState((prevState) => ({
          courses: prevState.courses.filter((_, i) => i !== index)
        }));
      })
      .catch((err) => console.error("Error deleting course:", err));
  };

  render() {
    const { courses, formData, showForm, showCourses, error, editingIndex } =
      this.state;

    return (
      <div className="app-container">
        <div className="floating-window">
          <h1 className="title">Course Information Manager</h1>

          <div className="button-container">
            <button
              className="view-btn"
              onClick={() => this.setState({ showCourses: !showCourses })}
            >
              {showCourses ? "Hide Courses" : "View Courses"}
            </button>

            <button
              className="toggle-btn"
              onClick={() => this.setState({ showForm: !showForm })}
            >
              {showForm ? "✖ Close Form" : "+ Add Course"}
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          {showForm && (
            <form onSubmit={this.handleSubmit} className="form form-section">
              <div className="form-grid">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject Name (letters only)"
                  value={formData.subject}
                  onChange={this.handleChange}
                  required
                />
                <input
                  type="text"
                  name="code"
                  placeholder="Course Code"
                  value={formData.code}
                  onChange={this.handleChange}
                  required
                />
              </div>

              <h3 className="section-title">Internal Marks</h3>
              <div className="form-grid">
                <input
                  type="number"
                  name="midsem"
                  placeholder="Midsem"
                  value={formData.midsem}
                  onChange={this.handleChange}
                />
                <input
                  type="number"
                  name="quizzes"
                  placeholder="Quizzes"
                  value={formData.quizzes}
                  onChange={this.handleChange}
                />
                <input
                  type="number"
                  name="assignments"
                  placeholder="Assignments"
                  value={formData.assignments}
                  onChange={this.handleChange}
                />
                <input
                  type="number"
                  name="casestudy"
                  placeholder="Case Study"
                  value={formData.casestudy}
                  onChange={this.handleChange}
                />
              </div>

              <h3 className="section-title">External Marks</h3>
              <input
                type="number"
                name="endsem"
                placeholder="Endsem"
                value={formData.endsem}
                onChange={this.handleChange}
              />

              <h3 className="section-title">Syllabus</h3>
              <input
                type="number"
                placeholder="Number of Units"
                value={formData.units}
                onChange={this.handleUnitsCount}
              />
              <div className="syllabus-inputs">
                {formData.syllabus.map((unit, idx) => (
                  <textarea
                    key={idx}
                    placeholder={`Unit ${idx + 1} syllabus`}
                    value={unit}
                    onChange={(e) => this.handleUnitChange(idx, e.target.value)}
                  />
                ))}
              </div>

              <div className="submit-container">
                <button type="submit" className="submit-btn">
                  {editingIndex !== null ? "Update Course" : "Add Course"}
                </button>
              </div>
            </form>
          )}

          {showCourses && (
            <div className="course-list">
              {courses.length === 0 ? (
                <p className="empty"> No courses available.</p>
              ) : (
                courses.map((course, index) => {
                  const internal =
                    Number(course.midsem) +
                    Number(course.quizzes) +
                    Number(course.assignments) +
                    Number(course.casestudy);
                  const external = Number(course.endsem);

                  const chartData = {
                    labels: ["Midsem", "Quizzes", "Assignments", "Case Study", "Endsem"],
                    datasets: [
                      {
                        data: [
                          Number(course.midsem),
                          Number(course.quizzes),
                          Number(course.assignments),
                          Number(course.casestudy),
                          external
                        ],
                        backgroundColor: [
                          "#4e79a7",
                          "#59a14f",
                          "#f28e2b",
                          "#e15759",
                          "#76b7b2"
                        ]
                      }
                    ]
                  };

                  return (
                    <div key={course._id || index} className="course-card">
                      <div>
                        <h2 className="course-title">
                          {course.subject} ({course.code})
                        </h2>
                        <p className="course-details">
                          <strong>Internal:</strong> {internal} (Midsem {course.midsem},{" "}
                          Quizzes {course.quizzes}, Assignments {course.assignments}, Case Study{" "}
                          {course.casestudy}) | <strong>External:</strong> {external}
                        </p>
                        <div className="syllabus">
                          <strong>Syllabus:</strong>
                          <ul>
                            {course.syllabus.map((u, i) => (
                              <li key={i}>
                                Unit {i + 1}: {u}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="chart">
                        <Pie data={chartData} />
                        <p className="ratio">
                          Internal : External = {internal} : {external}
                        </p>
                      </div>

                      <div className="actions">
                        <button
                          onClick={() => this.handleEdit(index)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => this.handleDelete(index)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
