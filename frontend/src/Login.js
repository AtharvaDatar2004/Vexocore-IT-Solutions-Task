import React, { useState } from 'react';
import API from '../services/api';

export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      onLogin(res.data.token);
    } catch (e) {
      setErr(e.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={submit}>
        <div>
          <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <input placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        {err && <div style={{color:'red'}}>{err}</div>}
        <div style={{marginTop:8}}>
          <button type='submit'>Login</button>
          <button type='button' onClick={onSwitch} style={{marginLeft:8}}>Create account</button>
        </div>
      </form>
    </div>
  );
}
