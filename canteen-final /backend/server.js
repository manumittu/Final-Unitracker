const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/canteen', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log('MongoDB connected'))
  .catch(err=>console.log(err));

const menuSchema = new mongoose.Schema({ itemName:{type:String, required:true}, category:String, price:{type:Number, default:0}, availability:{type:Boolean, default:true}, prepTime:String, imageUrl:String });
const bookingSchema = new mongoose.Schema({ studentId:String, name:String, date:Date, timeSlot:String, foodItem:String, quantity:Number, paymentMode:String, specialInstructions:String, confirmed:Boolean });
const feedbackSchema = new mongoose.Schema({ studentId:String, rating:Number, comments:String, date:Date, staff:String });
const staffSchema = new mongoose.Schema({ staffId:String, name:String, shift:String, tasksCompleted:Number, issuesFaced:String, date:Date });

const Menu = mongoose.model('Menu', menuSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const StaffReport = mongoose.model('StaffReport', staffSchema);

// Menu routes
app.get('/menu', async (req,res)=> res.json(await Menu.find().sort({itemName:1})));
app.post('/menu', async (req,res)=>{ const m = new Menu(req.body); await m.save(); res.json(m); });
app.put('/menu/:id', async (req,res)=>{ const m = await Menu.findByIdAndUpdate(req.params.id, req.body, {new:true}); res.json(m); });
app.delete('/menu/:id', async (req,res)=>{ await Menu.findByIdAndDelete(req.params.id); res.json({deleted:true}); });

// Booking routes
app.get('/booking', async (req,res)=> res.json(await Booking.find().sort({date:-1})));
app.post('/booking', async (req,res)=>{ const b = new Booking(req.body); await b.save(); res.json(b); });
app.put('/booking/:id', async (req,res)=>{ const b = await Booking.findByIdAndUpdate(req.params.id, req.body, {new:true}); res.json(b); });
app.delete('/booking/:id', async (req,res)=>{ await Booking.findByIdAndDelete(req.params.id); res.json({deleted:true}); });

// Feedback routes
app.get('/feedback', async (req,res)=> res.json(await Feedback.find().sort({date:-1})));
app.post('/feedback', async (req,res)=>{ const f = new Feedback(req.body); await f.save(); res.json(f); });
app.delete('/feedback/:id', async (req,res)=>{ await Feedback.findByIdAndDelete(req.params.id); res.json({deleted:true}); });

// Staff report routes
app.get('/staffreport', async (req,res)=> res.json(await StaffReport.find().sort({date:-1})));
app.post('/staffreport', async (req,res)=>{ const s = new StaffReport(req.body); await s.save(); res.json(s); });
app.put('/staffreport/:id', async (req,res)=>{ const s = await StaffReport.findByIdAndUpdate(req.params.id, req.body, {new:true}); res.json(s); });
app.delete('/staffreport/:id', async (req,res)=>{ await StaffReport.findByIdAndDelete(req.params.id); res.json({deleted:true}); });

// Dashboard endpoints
app.get('/dashboard/top-items', async (req,res)=>{
  const agg = await Booking.aggregate([
    { $group: { _id: "$foodItem", total: { $sum: "$quantity" } } },
    { $sort: { total: -1 } },
    { $limit: 5 }
  ]);
  res.json(agg);
});

app.get('/dashboard/orders-per-day', async (req,res)=>{
  const agg = await Booking.aggregate([
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, total: { $sum: "$quantity" } } },
    { $sort: { _id: 1 } }
  ]);
  res.json(agg);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
