import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function Auth({ mode, setUser }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const submit = async event => {
    event.preventDefault();
    try {
      const result = mode === 'login' ? await api.login({ email: form.email, password: form.password }) : await api.register(form);
      localStorage.setItem('threadforge-user', JSON.stringify(result.user));
      localStorage.setItem('threadforge-token', result.token);
      setUser(result.user); navigate('/');
    } catch (e) { setError(e.message); }
  };
  return <div className="auth-page"><div className="auth-card"><span className="eyebrow">Welcome to ThreadForge</span><h1>{mode === 'login' ? 'Log in' : 'Create an account'}</h1><form onSubmit={submit}>{mode === 'register' && <label>Full name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>}<label>Email address<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label><label>Password<input required type="password" minLength="8" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>{error && <p className="form-error">{error}</p>}<button className="button primary full">{mode === 'login' ? 'Log in' : 'Create account'}</button></form><p className="auth-switch">{mode === 'login' ? 'New to ThreadForge?' : 'Already have an account?'} <Link to={mode === 'login' ? '/register' : '/login'}>{mode === 'login' ? 'Create an account' : 'Log in'}</Link></p></div></div>;
}
