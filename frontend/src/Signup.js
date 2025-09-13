import React, { useState } from 'react';
import API from '../services/api';

export default function Signup({ onSignup, onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', { name, email, password });
      onSignup(res.data.token);
    } catch (e) {
      setErr(e.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <div>
      <h3>Sign up</h3>
      <form onSubmit={submit}>
        <div>
          <input placeholder='Full name' value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div>
          <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <input placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        {err && <div style={{color:'red'}}>{err}</div>}
        <div style={{marginTop:8}}>
          <button type='submit'>Create account</button>
          <button type='button' onClick={onSwitch} style={{marginLeft:8}}>Back to login</button>
        </div>
      </form>
    </div>
  );
}
