import { useState } from 'react'
import api from './api.js'

const CITIES = ['Patna','Delhi','Mumbai','Bangalore','Chennai','Kolkata','Hyderabad','Pune','Ahmedabad','Jaipur','Lucknow','Kanpur','Nagpur','Indore','Bhopal','Surat','Vadodara','Agra','Varanasi','Meerut','Other']

export default function AuthPage({ onLogin, onBack, adminMode }) {
  const [mode, setMode]   = useState('login')
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [city, setCity]   = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy]   = useState(false)

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
    } finally { setBusy(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0faf4 0%, #e6f4ed 50%, #f0faf4 100%)',
      padding: '20px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(37,168,90,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(26,107,60,0.06)', pointerEvents: 'none' }} />

      <div className="animate-scale" style={{
        background: '#fff', border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-xl)', padding: '40px',
        width: '100%', maxWidth: '420px',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
      }}>
        {/* Back button */}
        <button onClick={onBack} style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: '8px', padding: '6px 12px', color: 'var(--muted)',
          fontSize: '13px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '4px',
        }}>← Back to home</button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: 60, height: 60, borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '28px', color: '#fff',
            marginBottom: '14px', boxShadow: '0 4px 12px rgba(26,107,60,0.3)',
          }}>F</div>
          {adminMode && (
            <div style={{
              fontSize: '11px', background: 'var(--accent-light)',
              color: 'var(--accent)', padding: '4px 14px', borderRadius: '20px',
              display: 'inline-block', marginBottom: '8px', fontWeight: 700,
              border: '1px solid var(--border)',
            }}>⚙ Municipal Officer Portal</div>
          )}
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '24px', color: 'var(--accent)' }}>
            Fix<span style={{ color: 'var(--accent2)' }}>My</span>City
          </div>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
            {mode === 'login' ? 'Welcome back! Sign in to continue' : 'Join the civic community'}
          </div>
        </div>

        {/* Toggle */}
        {!adminMode && (
          <div style={{
            display: 'flex', background: 'var(--bg2)', borderRadius: '10px',
            padding: '3px', marginBottom: '24px', border: '1px solid var(--border)',
          }}>
            {['login','register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }} style={{
                flex: 1, padding: '8px', borderRadius: '8px',
                background: mode === m ? 'var(--accent)' : 'transparent',
                color: mode === m ? '#fff' : 'var(--muted)',
                fontWeight: mode === m ? 700 : 400,
                textTransform: 'capitalize', fontSize: '13px',
                boxShadow: mode === m ? '0 2px 6px rgba(26,107,60,0.25)' : 'none',
                transition: 'all 0.2s',
              }}>{m === 'login' ? '🔑 Login' : '✨ Register'}</button>
            ))}
          </div>
        )}

        {/* Fields */}
        {mode === 'register' && !adminMode && (
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 600 }}>Full name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
          </div>
        )}

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 600 }}>Email address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>

        <div style={{ marginBottom: mode === 'register' && !adminMode ? '14px' : '24px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 600 }}>Password</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>

        {mode === 'register' && !adminMode && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 600 }}>
              Your city <span style={{ color: 'var(--accent2)' }}>*</span>
              <span style={{ color: 'var(--muted)', fontWeight: 400 }}> — for nearby issues</span>
            </label>
            <select value={city} onChange={e => setCity(e.target.value)}>
              <option value="">Select your city...</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        {error && (
          <div style={{
            background: 'var(--danger-bg)', border: '1px solid #fecaca',
            borderRadius: 'var(--radius)', padding: '10px 14px',
            fontSize: '13px', color: 'var(--danger)', marginBottom: '16px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>⚠️ {error}</div>
        )}

        <button onClick={submit} disabled={busy} style={{
          width: '100%', padding: '13px',
          background: busy ? 'var(--bg3)' : 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)',
          color: busy ? 'var(--muted)' : '#fff',
          borderRadius: 'var(--radius)', fontWeight: 700,
          fontFamily: 'var(--font-head)', fontSize: '15px',
          boxShadow: busy ? 'none' : '0 3px 10px rgba(26,107,60,0.3)',
          transition: 'all 0.2s',
        }}>
          {busy ? '⏳ Please wait...' : mode === 'login' ? '🔑 Sign in' : '✨ Create account'}
        </button>

        {!adminMode && (
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--muted)' }}>
            Continue without account?{' '}
            <button onClick={() => onLogin(null)} style={{
              background: 'none', border: 'none', color: 'var(--accent)',
              cursor: 'pointer', fontSize: '12px', fontWeight: 600, textDecoration: 'underline',
            }}>Browse as guest</button>
          </div>
        )}
      </div>
    </div>
  )
}
