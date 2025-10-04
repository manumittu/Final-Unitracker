import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './form.css';

const gradeOptions = ['A+','A','B+','B','C','D','F'];

export default function GradeForm(){
  const [form, setForm] = useState({
    studentId:'', studentName:'', courseCode:'', courseName:'', receivedGrade:'', expectedGrade:'', reason:'', appealDate:'', declaration:false
  });
  const [appeals, setAppeals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [q, setQ] = useState('');

  const load = async () => {
    const res = await axios.get('http://localhost:5000/api/appeals' + (q ? '?q=' + q : ''));
    setAppeals(res.data);
  };
  useEffect(()=>{ load(); }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type==='checkbox' ? checked : value }));
  };

  const validate = () => {
    if(!form.studentId || !form.studentName || !form.courseCode || !form.courseName || !form.receivedGrade || !form.expectedGrade || !form.reason || !form.appealDate) {
      alert('Please fill all required fields');
      return false;
    }
    if(!form.declaration) {
      alert('Please accept declaration');
      return false;
    }
    if(form.reason.length < 10) {
      alert('Reason must be at least 10 chars');
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if(!validate()) return;
    try{
      if(editingId){
        await axios.put('http://localhost:5000/api/appeals/' + editingId, form);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/appeals', form);
      }
      setForm({studentId:'', studentName:'', courseCode:'', courseName:'', receivedGrade:'', expectedGrade:'', reason:'', appealDate:'', declaration:false});
      load();
    }catch(err){
      alert('Error saving: ' + err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      studentId: item.studentId,
      studentName: item.studentName,
      courseCode: item.courseCode,
      courseName: item.courseName,
      receivedGrade: item.receivedGrade,
      expectedGrade: item.expectedGrade,
      reason: item.reason,
      appealDate: item.appealDate ? item.appealDate.split('T')[0] : '',
      declaration: item.declaration
    });
    window.scrollTo(0,0);
  };

  const handleDelete = async id => {
    if(!window.confirm('Delete this appeal?')) return;
    await axios.delete('http://localhost:5000/api/appeals/' + id);
    load();
  };

  const handleSearch = async () => {
    const res = await axios.get('http://localhost:5000/api/appeals' + (q ? '?q=' + q : ''));
    setAppeals(res.data);
  };

  return (
    <div className="form-container container">
      <h2>{editingId ? 'Edit Appeal' : 'New Grade Appeal'}</h2>
      <form onSubmit={handleSubmit} className="appeal-form">
        <div className="form-group">
          <label>Student ID</label>
          <input name="studentId" value={form.studentId} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Student Name</label>
          <input name="studentName" value={form.studentName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Course Code</label>
          <input name="courseCode" value={form.courseCode} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Course Name</label>
          <input name="courseName" value={form.courseName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Received Grade</label>
          <select name="receivedGrade" value={form.receivedGrade} onChange={handleChange}>
            <option value="">Select</option>
            {gradeOptions.map(g=> <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Expected Grade</label>
          <select name="expectedGrade" value={form.expectedGrade} onChange={handleChange}>
            <option value="">Select</option>
            {gradeOptions.map(g=> <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Reason</label>
          <textarea name="reason" value={form.reason} onChange={handleChange} rows="4" />
        </div>
        <div className="form-group">
          <label>Appeal Date</label>
          <input type="date" name="appealDate" value={form.appealDate} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label><input type="checkbox" name="declaration" checked={form.declaration} onChange={handleChange} /> I declare that the details are correct</label>
        </div>

        <button className="submit-btn" type="submit">{editingId ? 'Update' : 'Submit'}</button>
      </form>

      <div className="table-container">
        <h3>Submitted Appeals</h3>
        <div className="search-row">
          <input placeholder="Search studentId or courseCode" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="cta-button" onClick={handleSearch}>Search</button>
          <button className="cta-button" onClick={load}>Refresh</button>
        </div>

        <table>
          <thead><tr><th>Student</th><th>Roll</th><th>Course</th><th>Recv</th><th>Exp</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {appeals.map(a=> (
              <tr key={a._id}>
                <td>{a.studentName}</td>
                <td>{a.studentId}</td>
                <td>{a.courseCode}</td>
                <td>{a.receivedGrade}</td>
                <td>{a.expectedGrade}</td>
                <td>{new Date(a.appealDate).toLocaleDateString()}</td>
                <td>
                  <button className="action-btn edit" onClick={()=>handleEdit(a)}>Edit</button>
                  <button className="action-btn delete" onClick={()=>handleDelete(a._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
