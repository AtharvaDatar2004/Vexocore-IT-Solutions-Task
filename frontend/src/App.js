import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Tasks from './components/Tasks';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState('login'); // login | signup | tasks

  useEffect(() => {
    if (token) setView('tasks');
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setView('login');
  };

  return (
    <div style={{ maxWidth: 720, margin: '30px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{textAlign:'center'}}>Task Manager</h2>
      {!token && view === 'login' && <Login onLogin={(t)=>{setToken(t); localStorage.setItem('token', t);}} onSwitch={()=>setView('signup')} />}
      {!token && view === 'signup' && <Signup onSignup={(t)=>{setToken(t); localStorage.setItem('token', t);}} onSwitch={()=>setView('login')} />}
      {token && <div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>Logged in</div>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <Tasks token={token} />
      </div>}
    </div>
  );
}
