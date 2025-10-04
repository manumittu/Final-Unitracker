import React, { useState, useEffect, useRef } from "react";

import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line,
  Legend, ResponsiveContainer
} from "recharts";

// Random colors for charts
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#d88484", "#84d8c9"];

function DashboardPage({ timetable, classrooms, subjectMap, onBack }) {
  // Extract data from timetable
  const days = Object.keys(timetable || {});

  // Flatten all slots
  let allSlots = [];
  days.forEach(day => {
    Object.entries(timetable[day] || {}).forEach(([period, slot]) => {
      if (slot?.subject && slot?.teacher && slot?.classroom) {
        allSlots.push(slot);
      }
    });
  });

  // Teacher workload count
  const teacherWorkload = {};
  allSlots.forEach(slot => {
    teacherWorkload[slot.teacher] = (teacherWorkload[slot.teacher] || 0) + 1;
  });
  const teacherData = Object.entries(teacherWorkload).map(([name, value]) => ({
    name, value
  }));

  // Subject frequency count
  const subjectFreq = {};
  allSlots.forEach(slot => {
    subjectFreq[slot.subject] = (subjectFreq[slot.subject] || 0) + 1;
  });
  const subjectData = Object.entries(subjectFreq).map(([name, value]) => ({
    name, value
  }));

  // Classroom utilization
  const classroomUse = {};
  allSlots.forEach(slot => {
    classroomUse[slot.classroom] = (classroomUse[slot.classroom] || 0) + 1;
  });
  const classroomData = Object.entries(classroomUse).map(([name, value]) => ({
    name, value
  }));

  // Daily sessions
  const dailySessions = days.map(day => ({
    day,
    sessions: Object.keys(timetable[day] || {}).length
  }));

  return (
    <div className="landing-container">
      <h1 className="page-title">Dashboard Analysis</h1>

      <div className="grid grid-cols-2 gap-8">
        {/* Teacher Workload Pie */}
        <div className="chart-card">
          <h3>Teacher Workload Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={teacherData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
              >
                {teacherData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Frequency Bar */}
        <div className="chart-card">
          <h3>Subject Frequency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Classroom Utilization */}
        <div className="chart-card">
          <h3>Classroom Utilization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classroomData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Sessions */}
        <div className="chart-card">
          <h3>Daily Sessions Count</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailySessions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sessions" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button className="cta-button" style={{ marginTop: "20px" }} onClick={onBack}>
        Back to Timetable
      </button>
    </div>
  );
}

export default DashboardPage;
