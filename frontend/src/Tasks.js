import React, { useState, useEffect } from 'react';
import API from '../services/api';

function authHeaders(token) {
  return { headers: { Authorization: 'Bearer ' + token } };
}

export default function Tasks({ token }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      const res = await API.get('/tasks', authHeaders(token));
      setTasks(res.data);
    } catch (e) {
      setErr('Failed to load tasks');
    }
  };

  useEffect(()=>{ load(); }, []);

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks', { title, description }, authHeaders(token));
      setTitle(''); setDescription('');
      load();
    } catch (e) { setErr('Create failed'); }
  };

  const startEdit = (t) => { setEditing(t); setTitle(t.title); setDescription(t.description || ''); };
  const cancelEdit = ()=> { setEditing(null); setTitle(''); setDescription(''); };

  const saveEdit = async () => {
    try {
      await API.put('/tasks/' + editing.id, { title, description, status: editing.status }, authHeaders(token));
      cancelEdit(); load();
    } catch (e) { setErr('Update failed'); }
  };

  const toggleStatus = async (t) => {
    try {
      const newStatus = t.status === 'pending' ? 'completed' : 'pending';
      await API.put('/tasks/' + t.id, { title: t.title, description: t.description, status: newStatus }, authHeaders(token));
      load();
    } catch (e) { setErr('Toggle failed'); }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete task?')) return;
    try {
      await API.delete('/tasks/' + id, authHeaders(token));
      load();
    } catch (e) { setErr('Delete failed'); }
  };

  return (
    <div>
      <h3>Your tasks</h3>
      {err && <div style={{color:'red'}}>{err}</div>}
      <form onSubmit={editing ? (e=>{e.preventDefault(); saveEdit();}) : createTask}>
        <div>
          <input placeholder='Title' value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>
        <div>
          <input placeholder='Description' value={description} onChange={e=>setDescription(e.target.value)} />
        </div>
        <div style={{marginTop:8}}>
          <button type='submit'>{editing ? 'Save' : 'Add Task'}</button>
          {editing && <button type='button' onClick={cancelEdit} style={{marginLeft:8}}>Cancel</button>}
        </div>
      </form>

      <ul style={{listStyle:'none', padding:0, marginTop:16}}>
        {tasks.map(t=>(
          <li key={t.id} style={{padding:8, border:'1px solid #ddd', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontWeight:600}}>{t.title} {t.status === 'completed' && <span style={{color:'green'}}>(completed)</span>}</div>
              <div style={{fontSize:13, color:'#555'}}>{t.description}</div>
            </div>
            <div>
              <button onClick={()=>toggleStatus(t)}>{t.status === 'pending' ? 'Mark completed' : 'Mark pending'}</button>
              <button onClick={()=>startEdit(t)} style={{marginLeft:8}}>Edit</button>
              <button onClick={()=>deleteTask(t.id)} style={{marginLeft:8}}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
