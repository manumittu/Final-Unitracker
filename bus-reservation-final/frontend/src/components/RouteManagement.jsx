import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, TextField, Grid, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function RouteManagement(){
  const [routes,setRoutes]=useState([]);
  const [form,setForm]=useState({routeId:'',busNumber:'',driverName:'',startPoint:'',endPoint:'',departureTime:'',arrivalTime:'',seatsAvailable:40});
  const [editId,setEditId]=useState(null);

  useEffect(()=>{ fetchRoutes(); },[]);
  const fetchRoutes=()=>axios.get('http://localhost:5001/routes').then(r=>setRoutes(r.data));

  const handleChange=(e)=>setForm({...form,[e.target.name]: e.target.value});
  const handleSubmit=async(e)=>{ e.preventDefault(); if(editId) await axios.put(`http://localhost:5001/routes/${editId}`,form); else await axios.post('http://localhost:5001/routes',form); setForm({routeId:'',busNumber:'',driverName:'',startPoint:'',endPoint:'',departureTime:'',arrivalTime:'',seatsAvailable:40}); setEditId(null); fetchRoutes(); }

  const editRoute=(r)=>{ setForm(r); setEditId(r._id); window.scrollTo({top:0,behavior:'smooth'}); }
  const deleteRoute=async(id)=>{ if(window.confirm('Delete route?')){ await axios.delete(`http://localhost:5001/routes/${id}`); fetchRoutes(); } }

  return (
    <div>
      <Card sx={{mb:3}}><CardContent>
        <Typography variant="h6">Bus Route Management</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{mt:1}}>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Route ID" name="routeId" value={form.routeId} onChange={handleChange} required/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Bus Number" name="busNumber" value={form.busNumber} onChange={handleChange}/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Driver Name" name="driverName" value={form.driverName} onChange={handleChange}/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Start Point" name="startPoint" value={form.startPoint} onChange={handleChange}/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="End Point" name="endPoint" value={form.endPoint} onChange={handleChange}/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Departure Time" name="departureTime" value={form.departureTime} onChange={handleChange}/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Arrival Time" name="arrivalTime" value={form.arrivalTime} onChange={handleChange}/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth type="number" label="Seats Available" name="seatsAvailable" value={form.seatsAvailable} onChange={handleChange}/></Grid>
            <Grid item xs={12}><Button variant="contained" type="submit">{editId? 'Update Route' : 'Add Route'}</Button></Grid>
          </Grid>
        </form>
      </CardContent></Card>

      <Card><CardContent>
        <Typography variant="h6">Routes</Typography>
        <Table>
          <TableHead><TableRow><TableCell>Route ID</TableCell><TableCell>Bus No</TableCell><TableCell>Driver</TableCell><TableCell>From</TableCell><TableCell>To</TableCell><TableCell>Depart</TableCell><TableCell>Arrive</TableCell><TableCell>Seats</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>{routes.map(r=>(<TableRow key={r._id}><TableCell>{r.routeId}</TableCell><TableCell>{r.busNumber}</TableCell><TableCell>{r.driverName}</TableCell><TableCell>{r.startPoint}</TableCell><TableCell>{r.endPoint}</TableCell><TableCell>{r.departureTime}</TableCell><TableCell>{r.arrivalTime}</TableCell><TableCell>{r.seatsAvailable}</TableCell><TableCell><Button size="small" onClick={()=>editRoute(r)}>Edit</Button><Button size="small" color="error" onClick={()=>deleteRoute(r._id)}>Delete</Button></TableCell></TableRow>))}</TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
