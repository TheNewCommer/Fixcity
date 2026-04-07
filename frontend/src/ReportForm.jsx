import { useState, useRef } from 'react'

export default function ReportForm({ onSubmit, onClose }) {
  const [title, setTitle]     = useState('')
  const [desc, setDesc]       = useState('')
  const [address, setAddress] = useState('')
  const [lat, setLat]         = useState('')
  const [lng, setLng]         = useState('')
  const [busy, setBusy]       = useState(false)
  const [error, setError]     = useState('')
  const [result, setResult]   = useState(null)

  const gps = () => {
    navigator.geolocation.getCurrentPosition(
      p => { setLat(p.coords.latitude.toFixed(6)); setLng(p.coords.longitude.toFixed(6)) },
      () => setError('Could not get location.')
    )
  }

  const submit = async () => {
    if (!lat || !lng) { setError('Location is required. Click 📍'); return }
    if (!title) { setError('Please add a title.'); return }
    setBusy(true); setError('')
    try {
      const res = await fetch('https://fixcity-f08t.onrender.com/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('fmc_token') || ''}`
        },
        body: JSON.stringify({
          title, description: desc, address,
          lat: parseFloat(lat), lng: parseFloat(lng),
          category: 'Other', urgency: 5
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setResult(data)
      setTimeout(() => onSubmit(data), 1500)
    } catch (e) {
      setError('Failed: ' + e.message)
    } finally { setBusy(false) }
  }

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '20px' }}>Report a Civic Issue</h2>
        <button onClick={onClose} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', width: 32, height: 32, color: 'var(--muted)', fontSize: '18px' }}>×</button>
      </div>

      {result && <div style={{ background: '#2fd18018', border: '1px solid #2fd18040', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: '16px', fontSize: '13px' }}>
        <div style={{ color: '#2fd180', fontWeight: 600 }}>✓ Submitted successfully!</div>
      </div>}

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>Title *</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Pothole on MG Road" />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>Description</label>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the issue..." rows={3} />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>Location</label>
        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address / landmark" style={{ marginBottom: '8px' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input value={lat} onChange={e => setLat(e.target.value)} placeholder="Latitude" style={{ flex: 1 }} />
          <input value={lng} onChange={e => setLng(e.target.value)} placeholder="Longitude" style={{ flex: 1 }} />
          <button onClick={gps} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0 12px', color: 'var(--info)', fontSize: '18px', flexShrink: 0 }}>📍</button>
        </div>
      </div>

      {error && <div style={{ background: '#ff4f4f18', border: '1px solid #ff4f4f40', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '13px', color: '#ff4f4f', marginBottom: '12px' }}>{error}</div>}

      <button onClick={submit} disabled={busy} style={{ width: '100%', padding: '12px', background: busy ? 'var(--bg3)' : 'var(--accent)', color: busy ? 'var(--muted)' : '#fff', borderRadius: 'var(--radius)', fontWeight: 700, fontFamily: 'var(--font-head)', fontSize: '15px', border: 'none' }}>
        {busy ? 'Submitting...' : 'Submit Issue'}
      </button>
    </div>
  )
}
