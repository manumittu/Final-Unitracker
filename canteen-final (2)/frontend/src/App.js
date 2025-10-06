import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import MenuManagement from './components/MenuManagement';
import FoodBooking from './components/FoodBooking';
import FeedbackForm from './components/FeedbackForm';
import StaffReportForm from './components/StaffReportForm';
import Dashboard from './components/Dashboard';

function App(){
  return (
    <Router>
      <AppBar position="static" color="primary" sx={{mb:3}}>
        <Toolbar>
          <Typography variant="h6" sx={{flexGrow:1}}>Canteen Pre-Booking</Typography>
          <Button color="inherit" href="/">Dashboard</Button>
          <Button color="inherit" href="/menu">Menu</Button>
          <Button color="inherit" href="/booking">Booking</Button>
          <Button color="inherit" href="/feedback">Feedback</Button>
          <Button color="inherit" href="/staff">Staff</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/menu" element={<MenuManagement />} />
          <Route path="/booking" element={<FoodBooking />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/staff" element={<StaffReportForm />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
