import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function Dashboard(){
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [reservationsPerDay, setReservationsPerDay] = useState([]);

  useEffect(()=>{
    axios.get('http://localhost:5001/dashboard/popular-routes').then(r=>setPopularRoutes(r.data.map(x=>({name:x._id, value:x.total}))));
    axios.get('http://localhost:5001/dashboard/reservations-per-day').then(r=>setReservationsPerDay(r.data.map(x=>({day:x._id, value:x.total}))));
  },[]);

  const exportCSV = ()=>{ window.open('http://localhost:5001/export/reservations'); }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Most Popular Routes</Typography>
            <ResponsiveContainer width="100%" height={300}><BarChart data={popularRoutes}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="value" fill="#1976d2"/></BarChart></ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Reservations per Day</Typography>
            <ResponsiveContainer width="100%" height={300}><LineChart data={reservationsPerDay}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="day"/><YAxis/><Tooltip/><Line type="monotone" dataKey="value" stroke="#82ca9d" /></LineChart></ResponsiveContainer>
            <Button variant="contained" sx={{mt:2}} onClick={exportCSV}>Export Reservations CSV</Button>
          </CardContent></Card>
        </Grid>
      </Grid>
    </div>
  );
}
