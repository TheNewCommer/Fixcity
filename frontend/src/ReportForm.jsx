import { useState, useRef } from 'react'
import api from './api.js'

export default function ReportForm({ onSubmit, onClose }) {
  const [title, setTitle]         = useState('')
  const [desc, setDesc]           = useState('')
  const [address, setAddress]     = useState('')
  const [lat, setLat]             = useState('')
  const [lng, setLng]             = useState('')
  const [file, setFile]           = useState(null)
  const [preview, setPreview]     = useState(null)
  const [busy, setBusy]           = useState(false)
  const [geobusy, setGeobusy]     = useState(false)
  const [result, setResult]       = useState(null)
  const [error, setError]         = useState('')
  const fileRef = useRef(null)

  const onFile = e => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
  }

  const gps = () => {
    setGeobusy(true)
    navigator.geolocation.getCurrentPosition(
      p => { setLat(p.coords.latitude.toFixed(6)); setLng(p.coords.longitude.toFixed(6)); setGeobusy(false) },
      () => { setError('Could not get location. Enter coordinates manually.'); setGeobusy(false) }
    )
  }

  const submit = async () => {
    if (!lat || !lng) { setError('Location is required. Click 📍 or type coordinates.'); return }
    if (!file && !title) { setError('Please add a photo or at least a title.'); return }
    setBusy(true); setError('')
    const form = new FormData()
    if (file)    form.append('image', file)
    if (title)   form.append('title', title)
    if (desc)    form.append('description', desc)
    if (address) form.append('address', address)
    form.append('lat', lat)
    form.append('lng', lng)
    try {
      const res = await api.post('/api/issues', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setResult(res.data)
      setTimeout(() => onSubmit(res.data), 1600)
    } catch (e) {
      setError('Failed to submit. Make sure the backend is running.')
    } finally { setBusy(false) }
  }

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '20px' }}>Report a Civic Issue</h2>
        <button onClick={onClose} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', width: 32, height: 32, color: 'var(--muted)', fontSize: '18px' }}>×</button>
      </div>

      <div onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)) } }} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current.click()} style={{ border: `2px dashed ${preview ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', minHeight: preview ? 'auto' : '130px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '16px', overflow: 'hidden', background: 'var(--bg3)' }}>
        {preview ? <img src={preview} alt="preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} /> : <>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>📷</div>
          <div style={{ color: 'var(--muted)', fontSize: '13px' }}>Drop a photo or click to browse</div>
          <div style={{ color: 'var(--muted)', fontSize: '11px', marginTop: '4px' }}>AI will auto-classify the issue</div>
        </>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFile} />

      {result && <div style={{ background: '#2fd18018', border: '1px solid #2fd18040', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: '16px', fontSize: '13px' }}>
        <div style={{ color: '#2fd180', fontWeight: 600, marginBottom: 3 }}>✓ Submitted!</div>
        <div style={{ color: 'var(--muted)' }}>AI classified as <b style={{ color: 'var(--text)' }}>{result.category}</b> · Urgency <b style={{ color: '#ffa45c' }}>{result.urgency}/10</b></div>
      </div>}

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>Title (optional — AI will suggest from photo)</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Pothole on MG Road" />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>Description</label>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the issue briefly..." rows={3} />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>Location</label>
        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address / landmark" style={{ marginBottom: '8px' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input value={lat} onChange={e => setLat(e.target.value)} placeholder="Latitude" style={{ flex: 1 }} />
          <input value={lng} onChange={e => setLng(e.target.value)} placeholder="Longitude" style={{ flex: 1 }} />
          <button onClick={gps} disabled={geobusy} title="Use my location" style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0 12px', color: geobusy ? 'var(--muted)' : 'var(--info)', fontSize: '18px', flexShrink: 0 }}>{geobusy ? '⏳' : '📍'}</button>
        </div>
      </div>

      {error && <div style={{ background: '#ff4f4f18', border: '1px solid #ff4f4f40', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '13px', color: '#ff4f4f', marginBottom: '12px' }}>{error}</div>}

      <button onClick={submit} disabled={busy} style={{ width: '100%', padding: '12px', background: busy ? 'var(--bg3)' : 'var(--accent)', color: busy ? 'var(--muted)' : '#fff', borderRadius: 'var(--radius)', fontWeight: 700, fontFamily: 'var(--font-head)', fontSize: '15px', border: 'none' }}>
        {busy ? 'Submitting & analysing with AI...' : 'Submit Issue'}
      </button>
    </div>
  )
}
