import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, TextField, Grid, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function StaffReportForm(){
  const [reports,setReports]=useState([]);
  const [form,setForm]=useState({staffId:'',name:'',shift:'',tasksCompleted:0,issuesFaced:'',date:''});
  const [editId,setEditId]=useState(null);

  useEffect(()=>{ fetchReports(); },[]);
  const fetchReports=()=>axios.get('http://localhost:5000/staffreport').then(r=>setReports(r.data));
  const handleChange=(e)=>setForm({...form,[e.target.name]: e.target.value});
  const handleSubmit=async(e)=>{ e.preventDefault(); if(editId) await axios.put(`http://localhost:5000/staffreport/${editId}`,form); else await axios.post('http://localhost:5000/staffreport',form); setForm({staffId:'',name:'',shift:'',tasksCompleted:0,issuesFaced:'',date:''}); setEditId(null); fetchReports(); }
  const editReport=(r)=>{ setForm({...r, date: r.date ? new Date(r.date).toISOString().substring(0,10) : ''}); setEditId(r._id); window.scrollTo({top:0,behavior:'smooth'}); }
  const deleteReport=async(id)=>{ if(window.confirm('Delete report?')){ await axios.delete(`http://localhost:5000/staffreport/${id}`); fetchReports(); } }

  return (
    <div>
      <Card sx={{mb:3}}><CardContent>
        <Typography variant="h6">Staff Report</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{mt:1}}>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Staff ID" name="staffId" value={form.staffId} onChange={handleChange} required/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange}/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Shift" name="shift" value={form.shift} onChange={handleChange}/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth type="number" label="Tasks Completed" name="tasksCompleted" value={form.tasksCompleted} onChange={handleChange}/></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Issues Faced" name="issuesFaced" value={form.issuesFaced} onChange={handleChange}/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth type="date" InputLabelProps={{shrink:true}} name="date" value={form.date} onChange={handleChange}/></Grid>
            <Grid item xs={12}><Button variant="contained" type="submit">{editId? 'Update' : 'Add Report'}</Button></Grid>
          </Grid>
        </form>
      </CardContent></Card>

      <Card><CardContent>
        <Typography variant="h6">Reports</Typography>
        <Table>
          <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Shift</TableCell><TableCell>Tasks</TableCell><TableCell>Issues</TableCell><TableCell>Date</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>{reports.map(r=>(<TableRow key={r._id}><TableCell>{r.name}</TableCell><TableCell>{r.shift}</TableCell><TableCell>{r.tasksCompleted}</TableCell><TableCell>{r.issuesFaced}</TableCell><TableCell>{r.date? new Date(r.date).toLocaleDateString() : ''}</TableCell><TableCell><Button size="small" onClick={()=>editReport(r)}>Edit</Button><Button size="small" color="error" onClick={()=>deleteReport(r._id)}>Delete</Button></TableCell></TableRow>))}</TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
