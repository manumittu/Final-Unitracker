import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Grid, TextField, Button, MenuItem, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function FoodBooking(){
  const [menuItems,setMenuItems]=useState([]);
  const [bookings,setBookings]=useState([]);
  const [form,setForm]=useState({studentId:'',name:'',date:'',timeSlot:'',foodItem:'',quantity:1,paymentMode:'Cash',specialInstructions:'',confirmed:false});
  const [editId,setEditId]=useState(null);

  useEffect(()=>{ fetchMenu(); fetchBookings(); },[]);
  const fetchMenu=()=>axios.get('http://localhost:5000/menu').then(r=>setMenuItems(r.data));
  const fetchBookings=()=>axios.get('http://localhost:5000/booking').then(r=>setBookings(r.data));

  const handleChange=(e)=>setForm({...form,[e.target.name]: e.target.value});
  const handleSubmit=async(e)=>{ e.preventDefault(); if(editId) await axios.put(`http://localhost:5000/booking/${editId}`,form); else await axios.post('http://localhost:5000/booking',form); setForm({studentId:'',name:'',date:'',timeSlot:'',foodItem:'',quantity:1,paymentMode:'Cash',specialInstructions:'',confirmed:false}); setEditId(null); fetchBookings(); }

  const editBooking=(b)=>{ setForm({...b, date: b.date ? new Date(b.date).toISOString().substring(0,10) : ''}); setEditId(b._id); window.scrollTo({top:0,behavior:'smooth'}); }
  const deleteBooking=async(id)=>{ if(window.confirm('Delete booking?')){ await axios.delete(`http://localhost:5000/booking/${id}`); fetchBookings(); } }

  return (
    <div>
      <Card sx={{mb:3}}><CardContent>
        <Typography variant="h6">Food Pre-Booking</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{mt:1}}>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Student ID" name="studentId" value={form.studentId} onChange={handleChange} required/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange} required/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth type="date" InputLabelProps={{shrink:true}} name="date" value={form.date} onChange={handleChange} required/></Grid>
            <Grid item xs={12} sm={4}><TextField select fullWidth label="Time Slot" name="timeSlot" value={form.timeSlot} onChange={handleChange}><MenuItem value="Breakfast">Breakfast</MenuItem><MenuItem value="Lunch">Lunch</MenuItem><MenuItem value="Dinner">Dinner</MenuItem></TextField></Grid>
            <Grid item xs={12} sm={4}><TextField select fullWidth label="Food Item" name="foodItem" value={form.foodItem} onChange={handleChange}>{menuItems.map(m=>(<MenuItem key={m._id} value={m.itemName}>{m.itemName}</MenuItem>))}</TextField></Grid>
            <Grid item xs={12} sm={2}><TextField fullWidth type="number" label="Qty" name="quantity" value={form.quantity} onChange={handleChange}/></Grid>
            <Grid item xs={12} sm={2}><TextField select fullWidth label="Payment" name="paymentMode" value={form.paymentMode} onChange={handleChange}><MenuItem value="Cash">Cash</MenuItem><MenuItem value="UPI">UPI</MenuItem><MenuItem value="Card">Card</MenuItem></TextField></Grid>
            <Grid item xs={12}><TextField fullWidth label="Special Instructions" name="specialInstructions" value={form.specialInstructions} onChange={handleChange}/></Grid>
            <Grid item xs={12}><Button variant="contained" type="submit">{editId? 'Update' : 'Book'}</Button></Grid>
          </Grid>
        </form>
      </CardContent></Card>

      <Card><CardContent>
        <Typography variant="h6" gutterBottom>Bookings</Typography>
        <Table>
          <TableHead><TableRow><TableCell>Student</TableCell><TableCell>Item</TableCell><TableCell>Qty</TableCell><TableCell>Date</TableCell><TableCell>Time</TableCell><TableCell>Payment</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>{bookings.map(b=>(<TableRow key={b._id}><TableCell>{b.name}</TableCell><TableCell>{b.foodItem}</TableCell><TableCell>{b.quantity}</TableCell><TableCell>{b.date? new Date(b.date).toLocaleDateString() : ''}</TableCell><TableCell>{b.timeSlot}</TableCell><TableCell>{b.paymentMode}</TableCell><TableCell><Button size="small" onClick={()=>editBooking(b)}>Edit</Button><Button size="small" color="error" onClick={()=>deleteBooking(b._id)}>Delete</Button></TableCell></TableRow>))}</TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
