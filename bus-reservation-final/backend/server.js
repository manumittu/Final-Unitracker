const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/bus_reservation', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log('MongoDB connected')).catch(err=>console.log(err));
const routeSchema = new mongoose.Schema({ routeId:{type:String, required:true}, busNumber:String, driverName:String, startPoint:String, endPoint:String, departureTime:String, arrivalTime:String, seatsAvailable:Number });
const reservationSchema = new mongoose.Schema({ reservationId:String, studentId:String, name:String, routeId:String, seatNumber:Number, date:Date, paymentMode:String, confirmed:Boolean });
const cancellationSchema = new mongoose.Schema({ cancellationId:String, reservationId:String, studentId:String, name:String, date:Date, reason:String });
const Route = mongoose.model('Route', routeSchema);
const Reservation = mongoose.model('Reservation', reservationSchema);
const Cancellation = mongoose.model('Cancellation', cancellationSchema);
// Routes CRUD
app.get('/routes', async (req,res)=> res.json(await Route.find().sort({routeId:1})));
app.post('/routes', async (req,res)=>{ const r = new Route(req.body); await r.save(); res.json(r); });
app.put('/routes/:id', async (req,res)=>{ const r = await Route.findByIdAndUpdate(req.params.id, req.body, {new:true}); res.json(r); });
app.delete('/routes/:id', async (req,res)=>{ await Route.findByIdAndDelete(req.params.id); res.json({deleted:true}); });
// Reservations CRUD
app.get('/reservations', async (req,res)=> res.json(await Reservation.find().sort({date:-1})));
app.post('/reservations', async (req,res)=>{ const b = new Reservation(req.body); await b.save(); res.json(b); });
app.put('/reservations/:id', async (req,res)=>{ const b = await Reservation.findByIdAndUpdate(req.params.id, req.body, {new:true}); res.json(b); });
app.delete('/reservations/:id', async (req,res)=>{ await Reservation.findByIdAndDelete(req.params.id); res.json({deleted:true}); });
// Cancellations CRUD
app.get('/cancellations', async (req,res)=> res.json(await Cancellation.find().sort({date:-1})));
app.post('/cancellations', async (req,res)=>{ const c = new Cancellation(req.body); await c.save(); res.json(c); });
app.delete('/cancellations/:id', async (req,res)=>{ await Cancellation.findByIdAndDelete(req.params.id); res.json({deleted:true}); });
// Dashboard endpoints
app.get('/dashboard/popular-routes', async (req,res)=>{
  const agg = await Reservation.aggregate([ { $group: { _id: "$routeId", total: { $sum: 1 } } }, { $sort: { total: -1 } }, { $limit: 5 } ]);
  res.json(agg);
});
app.get('/dashboard/reservations-per-day', async (req,res)=>{
  const agg = await Reservation.aggregate([ { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, total: { $sum: 1 } } }, { $sort: { _id: 1 } } ]);
  res.json(agg);
});
// Export reservations CSV
app.get('/export/reservations', async (req,res)=>{
  const reservations = await Reservation.find();
  const csvWriter = createCsvWriter({ path: 'reservations.csv', header: [
    {id:'reservationId', title:'Reservation ID'},{id:'studentId', title:'Student ID'},{id:'name', title:'Name'},{id:'routeId', title:'Route ID'},{id:'seatNumber', title:'Seat Number'},{id:'date', title:'Date'},{id:'paymentMode', title:'Payment Mode'},{id:'confirmed', title:'Confirmed'}
  ]});
  const records = reservations.map(r=>({reservationId:r.reservationId, studentId:r.studentId, name:r.name, routeId:r.routeId, seatNumber:r.seatNumber, date: r.date ? r.date.toISOString() : '', paymentMode:r.paymentMode, confirmed:r.confirmed}));
  await csvWriter.writeRecords(records);
  res.download('reservations.csv');
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, ()=>console.log(`Bus backend running on port ${PORT}`));
