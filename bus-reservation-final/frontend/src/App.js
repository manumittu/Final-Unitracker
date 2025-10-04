import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import RouteManagement from './components/RouteManagement';
import ReservationForm from './components/ReservationForm';
import CancellationForm from './components/CancellationForm';
import Dashboard from './components/Dashboard';
function App(){ return (<Router><AppBar position="static" color="primary" sx={{mb:3}}><Toolbar><Typography variant="h6" sx={{flexGrow:1}}>Bus Reservation</Typography><Button color="inherit" href="/">Dashboard</Button><Button color="inherit" href="/routes">Routes</Button><Button color="inherit" href="/reserve">Reserve</Button><Button color="inherit" href="/cancel">Cancel</Button></Toolbar></AppBar><Container maxWidth="lg"><Routes><Route path="/" element={<Dashboard />} /><Route path="/routes" element={<RouteManagement />} /><Route path="/reserve" element={<ReservationForm />} /><Route path="/cancel" element={<CancellationForm />} /></Routes></Container></Router>); } export default App;
