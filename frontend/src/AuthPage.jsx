import { useState } from 'react'
import api from './api.js'

const CITIES = ['Patna','Delhi','Mumbai','Bangalore','Chennai','Kolkata','Hyderabad','Pune','Ahmedabad','Jaipur','Lucknow','Kanpur','Nagpur','Indore','Bhopal','Surat','Vadodara','Agra','Varanasi','Meerut','Other']

export default function AuthPage({ onLogin, onBack, adminMode }) {
  const [mode, setMode]     = useState('login')
  const [name, setName]     = useState('')
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [city, setCity]     = useState('')
  const [error, setError]   = useState('')
  const [busy, setBusy]     = useState(false)

  const submit = async () => {
    setError('')
    if (!email || !pass) { setError('Email and password are required'); return }
    if (mode === 'register' && !name) { setError('Name is required'); return }
    setBusy(true)
    try {
      const url  = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body = mode === 'login' ? { email, password: pass } : { name, email, password: pass, city }
      const res  = await api.post(url, body)
      localStorage.setItem('fmc_token', res.data.token)
      onLogin(res.data.user)
    } catch (e) {
      setError(e.response?.data?.error || 'Could not connect. Is the backend running?')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '36px', width: '100%', maxWidth: '420px' }}>

        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer', marginBottom: '20px', padding: 0 }}>← Back to home</button>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '14px', background: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '24px', color: '#fff', marginBottom: '12px' }}>F</div>
          {adminMode && <div style={{ fontSize: '11px', background: '#ff5c3a22', color: 'var(--accent)', padding: '3px 12px', borderRadius: '20px', display: 'inline-block', marginBottom: '8px', fontWeight: 600 }}>Municipal Officer Portal</div>}
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '22px' }}>Fix<span style={{ color: 'var(--accent)' }}>My</span>City</div>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>{mode === 'login' ? 'Sign in to your account' : 'Create a new account'}</div>
        </div>

        {!adminMode && (
          <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '3px', marginBottom: '20px' }}>
            {['login','register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }} style={{ flex: 1, padding: '8px', borderRadius: '7px', background: mode === m ? 'var(--bg2)' : 'transparent', border: mode === m ? '1px solid var(--border)' : '1px solid transparent', color: mode === m ? 'var(--text)' : 'var(--muted)', fontWeight: mode === m ? 500 : 400, textTransform: 'capitalize', fontSize: '13px' }}>{m}</button>
            ))}
          </div>
        )}

        {mode === 'register' && !adminMode && (
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>Full name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
          </div>
        )}

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>

        <div style={{ marginBottom: mode === 'register' && !adminMode ? '12px' : '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>Password</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>

        {mode === 'register' && !adminMode && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>Your city <span style={{ color: 'var(--muted)' }}>(for nearby issues)</span></label>
            <select value={city} onChange={e => setCity(e.target.value)}>
              <option value="">Select your city...</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        {error && <div style={{ background: '#ff4f4f18', border: '1px solid #ff4f4f40', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '13px', color: '#ff4f4f', marginBottom: '16px' }}>{error}</div>}

        <button onClick={submit} disabled={busy} style={{ width: '100%', padding: '12px', background: busy ? 'var(--bg3)' : 'var(--accent)', color: busy ? 'var(--muted)' : '#fff', borderRadius: 'var(--radius)', fontWeight: 700, fontFamily: 'var(--font-head)', fontSize: '15px', border: 'none' }}>
          {busy ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>

        {!adminMode && (
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--muted)' }}>
            Continue without account?{' '}
            <button onClick={() => onLogin(null)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}>Browse as guest</button>
          </div>
        )}
      </div>
    </div>
  )
}
