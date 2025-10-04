import React, { useState, useEffect } from "react";
import "./App.css";
import DashboardPage from "./DashboardPage";
import { getTimetable, saveTimetable, deleteTimetable } from "./api";

function SetupPage({ onSubmit }) {
  const [classrooms, setClassrooms] = useState(1);
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");
  const [subjectMap, setSubjectMap] = useState({});

  const handleAdd = () => {
    if (!subject || !teacher) return;
    setSubjectMap((prev) => {
      const updated = { ...prev };
      if (!updated[subject]) updated[subject] = [];
      if (!updated[subject].includes(teacher)) {
        updated[subject].push(teacher);
      }
      return updated;
    });
    setTeacher("");
  };

  return (
    <div className="landing-container">
      <h1 className="page-title">Setup Subjects & Teachers</h1>
      <div className="form-container">
        <div className="form-row">
          <label>Total Classrooms:</label>
          <input
            type="number"
            value={classrooms}
            onChange={(e) => setClassrooms(parseInt(e.target.value) || 1)}
            min="1"
          />
        </div>

        <div className="form-row">
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject name"
          />
        </div>

        <div className="form-row">
          <label>Teacher:</label>
          <input
            type="text"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            placeholder="Enter teacher name"
          />
        </div>

        <button className="cta-button" onClick={handleAdd}>
          Add Mapping
        </button>

        <h3>Current Mappings:</h3>
        <ul>
          {Object.entries(subjectMap).map(([subj, teachers]) => (
            <li key={subj}>
              <strong>{subj}:</strong> {teachers.join(", ")}
            </li>
          ))}
        </ul>

        <div className="button-group">
          <button
            className="cta-button"
            onClick={() => onSubmit({ classrooms, subjectMap })}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function TimetablePage({ classrooms, subjectMap, timetable, setTimetable, onFinish }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const periods = [
    "9:00 - 9:50",
    "10:00 - 10:50",
    "11:00 - 11:50",
    "12:00 - 12:50",
    "1:30 - 2:20",
    "2:30 - 3:20",
    "3:30 - 4:20",
  ];

  const handleChange = (day, period, field, value) => {
    setTimetable((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [period]: {
          ...prev[day]?.[period],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="landing-container">
      <h1 className="page-title">Interactive Timetable</h1>

      <div className="timetable-wrapper">
        <table className="timetable-grid">
          <thead>
            <tr>
              <th>Day / Period</th>
              {periods.map((p) => (
                <th key={p}>{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td>{day}</td>
                {periods.map((period) => (
                  <td key={period}>
                    <select
                      value={timetable[day]?.[period]?.subject || ""}
                      onChange={(e) =>
                        handleChange(day, period, "subject", e.target.value)
                      }
                    >
                      <option value="">Select Subject</option>
                      {Object.keys(subjectMap).map((subj) => (
                        <option key={subj} value={subj}>
                          {subj}
                        </option>
                      ))}
                    </select>

                    <select
                      value={timetable[day]?.[period]?.teacher || ""}
                      onChange={(e) =>
                        handleChange(day, period, "teacher", e.target.value)
                      }
                      disabled={!timetable[day]?.[period]?.subject}
                    >
                      <option value="">Select Teacher</option>
                      {timetable[day]?.[period]?.subject &&
                        subjectMap[timetable[day][period].subject].map(
                          (teacher) => (
                            <option key={teacher} value={teacher}>
                              {teacher}
                            </option>
                          )
                        )}
                    </select>

                    <select
                      value={timetable[day]?.[period]?.classroom || ""}
                      onChange={(e) =>
                        handleChange(day, period, "classroom", e.target.value)
                      }
                    >
                      <option value="">Classroom</option>
                      {Array.from({ length: classrooms }, (_, i) => (
                        <option key={i + 1} value={`Room ${i + 1}`}>
                          Room {i + 1}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="cta-button"
        style={{ marginTop: "20px" }}
        onClick={async () => {
          await saveTimetable({ classrooms, subjectMap, timetable });
          onFinish(timetable);
        }}
      >
        Finish Timetable
      </button>

      <div className="footer">© 2025 College Timetable System</div>
    </div>
  );
}

function ReadOnlyTimetablePage({ timetable, classrooms, subjectMap, onEdit, onBackToEdit, onViewDashboard }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const periods = [
    "9:00 - 9:50",
    "10:00 - 10:50",
    "11:00 - 11:50",
    "12:00 - 12:50",
    "1:30 - 2:20",
    "2:30 - 3:20",
    "3:30 - 4:20",
  ];

  const handleDeleteSlot = async (day, period) => {
    const updated = { ...timetable };
    delete updated[day][period];
    onEdit(updated);
    await saveTimetable({ classrooms, subjectMap, timetable: updated });
  };

  const handleClearAll = async () => {
    onEdit({});
    await deleteTimetable();
  };

  return (
    <div className="landing-container">
      <h1 className="page-title">Final Timetable</h1>

      <div className="timetable-wrapper">
        <table className="timetable-grid">
          <thead>
            <tr>
              <th>Day / Period</th>
              {periods.map((p) => (
                <th key={p}>{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td>{day}</td>
                {periods.map((period) => {
                  const slot = timetable[day]?.[period];
                  return (
                    <td key={period}>
                      {slot ? (
                        <>
                          <div>
                            <b>{slot.subject}</b>
                          </div>
                          <div>{slot.teacher}</div>
                          <div>{slot.classroom}</div>
                          <button
                            className="cta-button"
                            style={{ marginTop: "5px" }}
                            onClick={() => handleDeleteSlot(day, period)}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="button-group" style={{ marginTop: "20px" }}>
        <button className="cta-button" onClick={handleClearAll}>
          Delete Entire Timetable
        </button>
        <button className="cta-button" onClick={onBackToEdit}>
          Edit Timetable
        </button>
        <button className="cta-button" onClick={onViewDashboard}>
          View Dashboard
        </button>
      </div>
    </div>
  );
}

function App() {
  const [step, setStep] = useState("setup");
  const [data, setData] = useState(null);
  const [timetable, setTimetable] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const saved = await getTimetable();
      if (saved) {
        setData({ classrooms: saved.classrooms, subjectMap: saved.subjectMap });
        setTimetable(saved.timetable || {});
        setStep(saved.timetable ? "readonly" : "setup");
      }
    };
    fetchData();
  }, []);

  if (step === "setup") {
    return (
      <SetupPage
        onSubmit={(setupData) => {
          setData(setupData);
          setStep("timetable");
        }}
      />
    );
  }

  if (step === "timetable") {
    return (
      <TimetablePage
        classrooms={data.classrooms}
        subjectMap={data.subjectMap}
        timetable={timetable}
        setTimetable={setTimetable}
        onFinish={(filledTable) => {
          setTimetable(filledTable);
          setStep("readonly");
        }}
      />
    );
  }

  if (step === "readonly") {
    return (
      <ReadOnlyTimetablePage
        timetable={timetable}
        classrooms={data.classrooms}
        subjectMap={data.subjectMap}
        onEdit={setTimetable}
        onBackToEdit={() => setStep("timetable")}
        onViewDashboard={() => setStep("dashboard")}
      />
    );
  }

  if (step === "dashboard") {
    return (
      <DashboardPage
        timetable={timetable}
        classrooms={data.classrooms}
        subjectMap={data.subjectMap}
        onBack={() => setStep("readonly")}
      />
    );
  }

  return null;
}

export default App;
