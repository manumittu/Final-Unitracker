import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, TextField, Grid, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow, MenuItem } from '@mui/material';

export default function FeedbackForm(){
  const [feedbacks,setFeedbacks]=useState([]);
  const [form,setForm]=useState({studentId:'',rating:5,comments:'',date:'',staff:''});

  useEffect(()=>{ fetchFeedbacks(); },[]);
  const fetchFeedbacks=()=>axios.get('http://localhost:5000/feedback').then(r=>setFeedbacks(r.data));
  const handleChange=(e)=>setForm({...form,[e.target.name]: e.target.value});
  const handleSubmit=async(e)=>{ e.preventDefault(); await axios.post('http://localhost:5000/feedback',form); setForm({studentId:'',rating:5,comments:'',date:'',staff:''}); fetchFeedbacks(); }
  const deleteFeedback=async(id)=>{ if(window.confirm('Delete feedback?')){ await axios.delete(`http://localhost:5000/feedback/${id}`); fetchFeedbacks(); } }

  return (
    <div>
      <Card sx={{mb:3}}><CardContent>
        <Typography variant="h6">Feedback</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{mt:1}}>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Student ID" name="studentId" value={form.studentId} onChange={handleChange} required/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth type="date" InputLabelProps={{shrink:true}} name="date" value={form.date} onChange={handleChange} required/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Staff" name="staff" value={form.staff} onChange={handleChange}/></Grid>
            <Grid item xs={12} sm={4}><TextField select fullWidth label="Rating" name="rating" value={form.rating} onChange={handleChange}>{[1,2,3,4,5].map(n=>(<MenuItem key={n} value={n}>{n}</MenuItem>))}</TextField></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Comments" name="comments" value={form.comments} onChange={handleChange}/></Grid>
            <Grid item xs={12}><Button variant="contained" type="submit">Submit</Button></Grid>
          </Grid>
        </form>
      </CardContent></Card>

      <Card><CardContent>
        <Typography variant="h6">Feedback List</Typography>
        <Table>
          <TableHead><TableRow><TableCell>Student</TableCell><TableCell>Rating</TableCell><TableCell>Staff</TableCell><TableCell>Date</TableCell><TableCell>Comments</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>{feedbacks.map(f=>(<TableRow key={f._id}><TableCell>{f.studentId}</TableCell><TableCell>{f.rating}</TableCell><TableCell>{f.staff}</TableCell><TableCell>{f.date? new Date(f.date).toLocaleDateString() : ''}</TableCell><TableCell>{f.comments}</TableCell><TableCell><Button size="small" color="error" onClick={()=>deleteFeedback(f._id)}>Delete</Button></TableCell></TableRow>))}</TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
