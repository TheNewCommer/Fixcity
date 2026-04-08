import { useState, useRef } from 'react'
import api from './api.js'

const CATEGORIES = [
  'Pothole / Road Damage', 'Garbage / Waste', 'Street Light Outage',
  'Flooding / Waterlogging', 'Broken Infrastructure', 'Vandalism / Graffiti',
  'Fallen Tree / Obstruction', 'Damaged Public Property', 'Other'
]

export default function ReportForm({ onSubmit, onClose }) {
  const [title, setTitle]       = useState('')
  const [desc, setDesc]         = useState('')
  const [address, setAddress]   = useState('')
  const [lat, setLat]           = useState('')
  const [lng, setLng]           = useState('')
  const [category, setCategory] = useState('')
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState(null)
  const [busy, setBusy]         = useState(false)
  const [geobusy, setGeobusy]   = useState(false)
  const [result, setResult]     = useState(null)
  const [error, setError]       = useState('')
  const [step, setStep]         = useState(1)
  const fileRef = useRef(null)

  const onFile = e => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(null)
  }

  const gps = () => {
    setGeobusy(true)
    navigator.geolocation.getCurrentPosition(
      p => { setLat(p.coords.latitude.toFixed(6)); setLng(p.coords.longitude.toFixed(6)); setGeobusy(false) },
      () => { setError('Could not get location.'); setGeobusy(false) }
    )
  }

  const submit = async () => {
    if (!lat || !lng) { setError('Location is required. Click 📍'); return }
    if (!file && !title) { setError('Please add a photo or a title.'); return }
    setBusy(true); setError('')
    const form = new FormData()
    if (file)     form.append('image', file)
    if (title)    form.append('title', title)
    if (desc)     form.append('description', desc)
    if (address)  form.append('address', address)
    if (category) form.append('category', category)
    form.append('lat', lat)
    form.append('lng', lng)
    try {
      const res = await api.post('/api/issues', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setResult(res.data)
      setTimeout(() => onSubmit(res.data), 1800)
    } catch (e) {
      setError('Failed to submit. Make sure the backend is running.')
    } finally { setBusy(false) }
  }

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)',
      borderRadius: 'var(--radius-xl)', padding: '28px',
      width: '100%', maxWidth: '540px',
      maxHeight: '90vh', overflowY: 'auto',
      boxShadow: 'var(--shadow-lg)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '20px', color: 'var(--accent)' }}>🌿 Report a Civic Issue</h2>
          <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>Help make your city better</p>
        </div>
        <button onClick={onClose} style={{
          background: 'var(--bg2)', border: '1.5px solid var(--border)',
          borderRadius: '10px', width: 34, height: 34,
          color: 'var(--muted)', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>×</button>
      </div>

      {/* Success */}
      {result && (
        <div style={{
          background: 'var(--success-bg)', border: '1.5px solid #bbf7d0',
          borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: '16px',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>✅ Submitted successfully!</div>
          <div style={{ color: 'var(--muted)', fontSize: '12px' }}>
            AI classified as <b style={{ color: 'var(--text)' }}>{result.category}</b> · Urgency <b style={{ color: urgBadgeColor(result.urgency) }}>{result.urgency}/10</b>
          </div>
        </div>
      )}

      {/* Image drop zone */}
      <div
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)) } }}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current.click()}
        style={{
          border: `2px dashed ${preview ? 'var(--accent2)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)',
          minHeight: preview ? 'auto' : '140px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', marginBottom: '16px',
          overflow: 'hidden',
          background: preview ? 'transparent' : 'var(--bg2)',
          transition: 'all 0.2s',
        }}
      >
        {preview ? (
          <div style={{ position: 'relative', width: '100%' }}>
            <img src={preview} alt="preview" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', top: '8px', right: '8px',
              background: 'rgba(0,0,0,0.5)', color: '#fff',
              borderRadius: '6px', padding: '2px 8px', fontSize: '11px',
            }}>Click to change</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '36px', marginBottom: '10px', animation: 'float 3s ease-in-out infinite' }}>📸</div>
            <div style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: 600 }}>Drop a photo or click to browse</div>
            <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '4px' }}>🤖 AI will auto-classify the issue type</div>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFile} />

      {/* Form fields */}
      <div style={{ display: 'grid', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 600 }}>
            Title <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(AI will suggest from photo)</span>
          </label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Pothole on MG Road" />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 600 }}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">AI will detect automatically...</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 600 }}>Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the issue briefly..." rows={3} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 600 }}>📍 Location</label>
          <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address / landmark" style={{ marginBottom: '8px' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <input value={lat} onChange={e => setLat(e.target.value)} placeholder="Latitude" style={{ flex: 1 }} />
            <input value={lng} onChange={e => setLng(e.target.value)} placeholder="Longitude" style={{ flex: 1 }} />
            <button onClick={gps} disabled={geobusy} title="Use my location" style={{
              background: geobusy ? 'var(--bg2)' : 'var(--accent-light)',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '0 14px',
              color: 'var(--accent)', fontSize: '18px', flexShrink: 0,
              transition: 'all 0.2s',
            }}>{geobusy ? '⏳' : '📍'}</button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'var(--danger-bg)', border: '1px solid #fecaca',
          borderRadius: 'var(--radius)', padding: '10px 14px',
          fontSize: '13px', color: 'var(--danger)', marginTop: '14px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>⚠️ {error}</div>
      )}

      <button onClick={submit} disabled={busy} style={{
        width: '100%', padding: '13px', marginTop: '20px',
        background: busy ? 'var(--bg3)' : 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)',
        color: busy ? 'var(--muted)' : '#fff',
        borderRadius: 'var(--radius)', fontWeight: 700,
        fontFamily: 'var(--font-head)', fontSize: '15px',
        boxShadow: busy ? 'none' : '0 3px 10px rgba(26,107,60,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      }}>
        {busy ? '🤖 Analysing with AI...' : '🌿 Submit Issue'}
      </button>
    </div>
  )
}

function urgBadgeColor(u) {
  if (u >= 8) return '#dc2626'
  if (u >= 6) return '#d97706'
  if (u >= 4) return '#ca8a04'
  return '#16a34a'
}
