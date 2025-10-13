
import React, { useState, useEffect } from 'react';
const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function App(){
  const [token,setToken] = useState(localStorage.getItem('token')||'');
  const [view,setView] = useState('items');
  if(!token) return <Login onLogin={setToken}/>;
  return (
    <div style={{fontFamily:'ui-sans-serif,system-ui', padding:20}}>
      <h1>FreshOnCall Admin</h1>
      <nav style={{display:'flex', gap:8, marginBottom:12}}>
        <button onClick={()=>setView('items')}>Items</button>
        <button onClick={()=>setView('offers')}>Offers</button>
        <button onClick={()=>setView('orders')}>Orders</button>
        <button onClick={()=>{localStorage.removeItem('token'); location.reload();}}>Logout</button>
      </nav>
      {view==='items' && <Items token={token}/>}
      {view==='offers' && <Offers token={token}/>}
      {view==='orders' && <Orders token={token}/>}
    </div>
  );
}

function Login({onLogin}){
  const [email,setEmail]=useState('admin@freshoncall.local');
  const [password,setPassword]=useState('FreshOnCall2025');
  const submit=async(e)=>{
    e.preventDefault();
    const res = await fetch(`${API}/api/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password}) });
    const data = await res.json();
    if(data.token){ localStorage.setItem('token', data.token); onLogin(data.token); } else alert(data.error||'Login failed');
  };
  return (<form onSubmit={submit} style={{display:'grid', gap:8, width:280, margin:'60px auto'}}>
    <h2>Admin Login</h2>
    <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
    <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
    <button type="submit">Login</button>
  </form>);
}

function Items({token}){
  const [items,setItems]=useState([]);
  const [form,setForm]=useState({name:'',price:0,cat:'veg'});
  const load=async()=>{ const res=await fetch(`${API}/api/items`); setItems(await res.json()); };
  useEffect(()=>{ load(); },[]);
  const save=async()=>{
    const res=await fetch(`${API}/api/items`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(form)});
    if(res.ok){ setForm({name:'',price:0,cat:'veg'}); load(); } else alert('Save failed');
  };
  const remove=async(id)=>{
    if(!confirm('Delete item?')) return;
    const res=await fetch(`${API}/api/items/${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}});
    if(res.ok) load();
  };
  return (<div>
    <h3>Items</h3>
    <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
      <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:parseFloat(e.target.value)})}/>
      <select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})}>
        <option value="veg">veg</option><option value="fruit">fruit</option><option value="rice">rice</option><option value="spice">spice</option><option value="household">household</option>
      </select>
      <button onClick={save}>Add</button>
    </div>
    <ul>{items.map(i=> <li key={i._id}>{i.name} — £{i.price.toFixed(2)} — {i.cat} <button onClick={()=>remove(i._id)}>Delete</button></li>)}</ul>
  </div>);
}

function Offers({token}){
  const [offers,setOffers]=useState([]);
  const [form,setForm]=useState({title:'',description:'',discountPct:10,active:true});
  const load=async()=>{ const res=await fetch(`${API}/api/offers`); setOffers(await res.json()); };
  useEffect(()=>{ load(); },[]);
  const save=async()=>{
    const res=await fetch(`${API}/api/offers`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(form)});
    if(res.ok){ setForm({title:'',description:'',discountPct:10,active:true}); load(); } else alert('Save failed');
  };
  const remove=async(id)=>{
    if(!confirm('Delete offer?')) return;
    const res=await fetch(`${API}/api/offers/${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}});
    if(res.ok) load();
  };
  return (<div>
    <h3>Offers</h3>
    <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
      <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
      <input placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
      <input type="number" placeholder="% Off" value={form.discountPct} onChange={e=>setForm({...form,discountPct:parseFloat(e.target.value)})}/>
      <button onClick={save}>Add</button>
    </div>
    <ul>{offers.map(o=> <li key={o._id}><strong>{o.title}</strong> — {o.discountPct}% <button onClick={()=>remove(o._id)}>Delete</button></li>)}</ul>
  </div>);
}

function Orders({token}){
  const [orders,setOrders]=useState([]);
  const load=async()=>{ const res=await fetch(`${API}/api/orders`, { headers:{Authorization:`Bearer ${token}`}}); setOrders(await res.json()); };
  useEffect(()=>{ load(); },[]);
  return (<div>
    <h3>Orders</h3>
    <ul>{orders.map(o=> <li key={o._id}>£{o.total?.toFixed?.(2)} — {new Date(o.createdAt).toLocaleString()} — {o.paymentStatus}</li>)}</ul>
  </div>);
}
