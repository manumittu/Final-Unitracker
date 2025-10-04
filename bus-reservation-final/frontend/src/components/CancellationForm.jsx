import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, TextField, Grid, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function CancellationForm(){
  const [cancellations,setCancellations]=useState([]);
  const [form,setForm]=useState({cancellationId:'',reservationId:'',studentId:'',name:'',date:'',reason:''});

  useEffect(()=>{ fetchCancellations(); },[]);
  const fetchCancellations=()=>axios.get('http://localhost:5001/cancellations').then(r=>setCancellations(r.data));

  const handleChange=(e)=>setForm({...form,[e.target.name]: e.target.value});
  const handleSubmit=async(e)=>{ e.preventDefault(); await axios.post('http://localhost:5001/cancellations',form); setForm({cancellationId:'',reservationId:'',studentId:'',name:'',date:'',reason:''}); fetchCancellations(); }
  const deleteCancellation=async(id)=>{ if(window.confirm('Delete cancellation?')){ await axios.delete(`http://localhost:5001/cancellations/${id}`); fetchCancellations(); } }

  return (
    <div>
      <Card sx={{mb:3}}><CardContent>
        <Typography variant="h6">Cancellation</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{mt:1}}>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Cancellation ID" name="cancellationId" value={form.cancellationId} onChange={handleChange} required/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Reservation ID" name="reservationId" value={form.reservationId} onChange={handleChange} required/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Student ID" name="studentId" value={form.studentId} onChange={handleChange} required/></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange}/></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth type="date" InputLabelProps={{shrink:true}} name="date" value={form.date} onChange={handleChange} required/></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Reason" name="reason" value={form.reason} onChange={handleChange}/></Grid>
            <Grid item xs={12}><Button variant="contained" type="submit">Submit Cancellation</Button></Grid>
          </Grid>
        </form>
      </CardContent></Card>

      <Card><CardContent>
        <Typography variant="h6">Cancellations</Typography>
        <Table>
          <TableHead><TableRow><TableCell>Cancel ID</TableCell><TableCell>Reservation ID</TableCell><TableCell>Student</TableCell><TableCell>Date</TableCell><TableCell>Reason</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>{cancellations.map(c=>(<TableRow key={c._id}><TableCell>{c.cancellationId}</TableCell><TableCell>{c.reservationId}</TableCell><TableCell>{c.name}</TableCell><TableCell>{c.date? new Date(c.date).toLocaleDateString() : ''}</TableCell><TableCell>{c.reason}</TableCell><TableCell><Button size="small" color="error" onClick={()=>deleteCancellation(c._id)}>Delete</Button></TableCell></TableRow>))}</TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
