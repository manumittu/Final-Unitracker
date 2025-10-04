import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, TextField, Grid, Button, Switch, FormControlLabel, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

export default function MenuManagement(){
  const [menu,setMenu]=useState([]);
  const [form,setForm]=useState({itemName:'',category:'',price:0,availability:true,prepTime:'',imageUrl:''});
  const [editId,setEditId]=useState(null);

  useEffect(()=>{ fetchMenu(); },[]);
  const fetchMenu=()=>axios.get('http://localhost:5000/menu').then(r=>setMenu(r.data));

  const handleChange=(e)=>setForm({...form,[e.target.name]: e.target.type==='number'? Number(e.target.value) : e.target.value});
  const handleSubmit=async(e)=>{ e.preventDefault(); if(editId) await axios.put(`http://localhost:5000/menu/${editId}`,form); else await axios.post('http://localhost:5000/menu',form); setForm({itemName:'',category:'',price:0,availability:true,prepTime:'',imageUrl:''}); setEditId(null); fetchMenu(); }

  const startEdit=(m)=>{ setForm(m); setEditId(m._id); window.scrollTo({top:0,behavior:'smooth'}); }
  const removeItem=async(id)=>{ if(window.confirm('Delete this item?')){ await axios.delete(`http://localhost:5000/menu/${id}`); fetchMenu(); } }

  return (
    <div>
      <Card sx={{mb:3}}><CardContent>
        <Typography variant="h6" gutterBottom>Menu Management</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Item Name" name="itemName" value={form.itemName} onChange={handleChange} required/></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Category" name="category" value={form.category} onChange={handleChange}/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Price" type="number" name="price" value={form.price} onChange={handleChange}/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Prep Time" name="prepTime" value={form.prepTime} onChange={handleChange}/></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange}/></Grid>
            <Grid item xs={12}><FormControlLabel control={<Switch checked={form.availability} onChange={e=>setForm({...form,availability:e.target.checked})}/>} label="Available"/></Grid>
            <Grid item xs={12}><Button variant="contained" type="submit">{editId? 'Update' : 'Add Item'}</Button></Grid>
          </Grid>
        </form>
      </CardContent></Card>

      <Card><CardContent>
        <Typography variant="h6" gutterBottom>Menu List</Typography>
        <Table>
          <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Category</TableCell><TableCell>Price</TableCell><TableCell>Avail</TableCell><TableCell>Prep</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>{menu.map(m=>(<TableRow key={m._id}><TableCell>{m.itemName}</TableCell><TableCell>{m.category}</TableCell><TableCell>{m.price}</TableCell><TableCell>{m.availability? 'Yes':'No'}</TableCell><TableCell>{m.prepTime}</TableCell><TableCell><Button size="small" onClick={()=>startEdit(m)}>Edit</Button><Button size="small" color="error" onClick={()=>removeItem(m._id)}>Delete</Button></TableCell></TableRow>))}</TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
