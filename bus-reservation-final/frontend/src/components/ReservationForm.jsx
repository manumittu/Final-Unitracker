import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Grid, TextField, Button, MenuItem, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function ReservationForm(){
  const [routes,setRoutes]=useState([]);
  const [reservations,setReservations]=useState([]);
  const [form,setForm]=useState({reservationId:'',studentId:'',name:'',routeId:'',seatNumber:1,date:'',paymentMode:'Cash',confirmed:false});
  const [editId,setEditId]=useState(null);

  useEffect(()=>{ fetchRoutes(); fetchReservations(); },[]);
  const fetchRoutes=()=>axios.get('http://localhost:5001/routes').then(r=>setRoutes(r.data));
  const fetchReservations=()=>axios.get('http://localhost:5001/reservations').then(r=>setReservations(r.data));

  const handleChange=(e)=>setForm({...form,[e.target.name]: e.target.value});
  const handleSubmit=async(e)=>{ e.preventDefault(); if(editId) await axios.put(`http://localhost:5001/reservations/${editId}`,form); else await axios.post('http://localhost:5001/reservations',form); setForm({reservationId:'',studentId:'',name:'',routeId:'',seatNumber:1,date:'',paymentMode:'Cash',confirmed:false}); setEditId(null); fetchReservations(); }

  const editReservation=(r)=>{ setForm({...r, date: r.date ? new Date(r.date).toISOString().substring(0,10) : ''}); setEditId(r._id); window.scrollTo({top:0,behavior:'smooth'}); }
  const deleteReservation=async(id)=>{ if(window.confirm('Cancel reservation?')){ await axios.delete(`http://localhost:5001/reservations/${id}`); fetchReservations(); } }

  return (
    <div>
      <Card sx={{mb:3}}><CardContent>
        <Typography variant="h6">Seat Reservation</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{mt:1}}>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Reservation ID" name="reservationId" value={form.reservationId} onChange={handleChange} required/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Student ID" name="studentId" value={form.studentId} onChange={handleChange} required/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange} required/></Grid>
            <Grid item xs={12} sm={4}><TextField select fullWidth label="Route" name="routeId" value={form.routeId} onChange={handleChange}>{routes.map(r=>(<MenuItem key={r._id} value={r.routeId}>{r.routeId} - {r.startPoint} to {r.endPoint}</MenuItem>))}</TextField></Grid>
            <Grid item xs={12} sm={2}><TextField fullWidth type="number" label="Seat No" name="seatNumber" value={form.seatNumber} onChange={handleChange}/></Grid>
            <Grid item xs={12} sm={3}><TextField fullWidth type="date" InputLabelProps={{shrink:true}} name="date" value={form.date} onChange={handleChange} required/></Grid>
            <Grid item xs={12} sm={3}><TextField select fullWidth label="Payment" name="paymentMode" value={form.paymentMode} onChange={handleChange}><MenuItem value="Cash">Cash</MenuItem><MenuItem value="UPI">UPI</MenuItem><MenuItem value="Card">Card</MenuItem></TextField></Grid>
            <Grid item xs={12}><Button variant="contained" type="submit">{editId? 'Update' : 'Reserve'}</Button></Grid>
          </Grid>
        </form>
      </CardContent></Card>

      <Card><CardContent>
        <Typography variant="h6" gutterBottom>Reservations</Typography>
        <Table>
          <TableHead><TableRow><TableCell>Res ID</TableCell><TableCell>Student</TableCell><TableCell>Route</TableCell><TableCell>Seat</TableCell><TableCell>Date</TableCell><TableCell>Payment</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>{reservations.map(r=>(<TableRow key={r._id}><TableCell>{r.reservationId}</TableCell><TableCell>{r.name}</TableCell><TableCell>{r.routeId}</TableCell><TableCell>{r.seatNumber}</TableCell><TableCell>{r.date? new Date(r.date).toLocaleDateString() : ''}</TableCell><TableCell>{r.paymentMode}</TableCell><TableCell><Button size="small" onClick={()=>editReservation(r)}>Edit</Button><Button size="small" color="error" onClick={()=>deleteReservation(r._id)}>Cancel</Button></TableCell></TableRow>))}</TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
