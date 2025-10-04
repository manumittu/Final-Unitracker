import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function Dashboard(){
  const [topItems, setTopItems] = useState([]);
  const [ordersPerDay, setOrdersPerDay] = useState([]);

  useEffect(()=>{
    axios.get('http://localhost:5000/dashboard/top-items').then(r=>setTopItems(r.data.map(x=>({name:x._id, value:x.total}))));
    axios.get('http://localhost:5000/dashboard/orders-per-day').then(r=>setOrdersPerDay(r.data.map(x=>({day:x._id, value:x.total}))));
  },[]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card><CardContent>
          <Typography variant="h6" gutterBottom>Top 5 Ordered Items</Typography>
          <ResponsiveContainer width="100%" height={300}><BarChart data={topItems}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="value" fill="#1976d2"/></BarChart></ResponsiveContainer>
        </CardContent></Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card><CardContent>
          <Typography variant="h6" gutterBottom>Orders per Day</Typography>
          <ResponsiveContainer width="100%" height={300}><LineChart data={ordersPerDay}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="day"/><YAxis/><Tooltip/><Line type="monotone" dataKey="value" stroke="#82ca9d" /></LineChart></ResponsiveContainer>
        </CardContent></Card>
      </Grid>
    </Grid>
  );
}
