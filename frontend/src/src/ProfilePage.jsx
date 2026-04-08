import { useState, useEffect } from 'react'
import api from './api.js'

const CITIES = ['Patna','Delhi','Mumbai','Bangalore','Chennai','Kolkata','Hyderabad','Pune','Ahmedabad','Jaipur','Lucknow','Kanpur','Nagpur','Indore','Bhopal','Surat','Vadodara','Agra','Varanasi','Meerut','Other']
const urgColor = u => u >= 8 ? '#dc2626' : u >= 6 ? '#d97706' : u >= 4 ? '#ca8a04' : '#16a34a'
const urgBg    = u => u >= 8 ? '#fef2f2' : u >= 6 ? '#fffbeb' : u >= 4 ? '#fefce8' : '#f0fdf4'
const fmt = iso => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export default function ProfilePage({ user, onBack, onUserUpdate }) {
  const [name, setName]         = useState(user?.name || '')
  const [city, setCity]         = useState(user?.city || '')
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [myIssues, setMyIssues] = useState([])
  const [allIssues, setAll]     = useState([])
  const [tab, setTab]           = useState('nearby')

  useEffect(() => {
    api.get('/api/issues').then(res => {
      setAll(res.data)
      if (user) setMyIssues(res.data.filter(i => i.reported_by?.id === user.id))
    })
  }, [user])

  const nearby = city
    ? allIssues.filter(i => (i.address || '').toLowerCase().includes(city.toLowerCase())).slice(0, 8)
    : allIssues.slice(0, 8)

  const save = async () => {
    setSaving(true)
    try {
      const res = await api.post('/api/auth/profile', { name, city })
      onUserUpdate(res.data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch { alert('Failed to save') }
    finally { setSaving(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg2)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)',
        padding: '0 24px', display: 'flex', alignItems: 'center',
        gap: '16px', height: '60px', boxShadow: 'var(--shadow-md)',
      }}>
        <button onClick={onBack} style={{
          background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '8px', padding: '6px 14px', color: '#fff', fontSize: '13px', fontWeight: 600,
        }}>← Back</button>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '20px', color: '#fff' }}>My Profile</div>
      </div>

      <div style={{ padding: '24px', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>

          {/* Left — profile card */}
          <div>
            <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px', boxShadow: 'var(--shadow-sm)' }}>
              {/* Avatar */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '32px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-head)',
                  boxShadow: '0 4px 12px rgba(26,107,60,0.3)',
                }}>{(user?.name || 'U').charAt(0).toUpperCase()}</div>
                <div style={{ marginTop: '12px', fontFamily: 'var(--font-head)', fontSize: '18px', fontWeight: 700, color: 'var(--accent)' }}>{user?.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{user?.email}</div>
                <div style={{ marginTop: '8px' }}>
                  <span style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, border: '1px solid var(--border)' }}>
                    {user?.role === 'admin' ? '⚙ Admin' : '🏘 Citizen'}
                  </span>
                </div>
              </div>

              {/* Edit form */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 600 }}>Full name</label>
                <input value={name} onChange={e => setName(e.target.value)} />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 600 }}>Email</label>
                <input value={user?.email || ''} disabled style={{ opacity: 0.6, background: 'var(--bg2)' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 600 }}>
                  📍 Your city
                  <span style={{ color: 'var(--muted)', fontWeight: 400 }}> — for nearby issues</span>
                </label>
                <select value={city} onChange={e => setCity(e.target.value)}>
                  <option value="">Select city...</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {city && (
                <div style={{ background: 'var(--accent-light)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '12px', color: 'var(--accent)', marginBottom: '16px', fontWeight: 500 }}>
                  🌿 Showing issues near <b>{city}</b>
                </div>
              )}

              <button onClick={save} disabled={saving} style={{
                width: '100%', padding: '11px',
                background: saved ? '#16a34a' : 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)',
                color: '#fff', borderRadius: 'var(--radius)',
                fontWeight: 700, fontFamily: 'var(--font-head)', fontSize: '14px',
                boxShadow: '0 3px 8px rgba(26,107,60,0.25)',
                transition: 'all 0.3s',
              }}>
                {saving ? '⏳ Saving...' : saved ? '✅ Saved!' : '💾 Save Profile'}
              </button>
            </div>

            {/* Stats */}
            <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)', marginBottom: '12px', fontFamily: 'var(--font-head)' }}>📊 Your activity</div>
              {[
                { label: 'Issues reported', value: myIssues.length, color: 'var(--accent)' },
                { label: 'City', value: city || 'Not set', color: 'var(--info)' },
                { label: 'Role', value: user?.role || 'citizen', color: 'var(--success)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
                  <span style={{ color: 'var(--muted)' }}>{label}</span>
                  <span style={{ color, fontWeight: 700, textTransform: 'capitalize' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {[
                { key: 'nearby', label: `🏙 Nearby Issues (${nearby.length})` },
                { key: 'mine',   label: `📋 My Reports (${myIssues.length})` },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} style={{
                  padding: '9px 18px', borderRadius: '10px',
                  background: tab === t.key ? 'var(--accent)' : '#fff',
                  color: tab === t.key ? '#fff' : 'var(--muted)',
                  border: `1.5px solid ${tab === t.key ? 'var(--accent)' : 'var(--border)'}`,
                  fontSize: '13px', fontWeight: 600,
                  boxShadow: tab === t.key ? '0 2px 8px rgba(26,107,60,0.25)' : 'none',
                  transition: 'all 0.2s',
                }}>{t.label}</button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(tab === 'nearby' ? nearby : myIssues).length === 0 ? (
                <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌱</div>
                  <div style={{ color: 'var(--muted)', fontSize: '14px' }}>
                    {tab === 'nearby' ? 'No nearby issues found.' : "You haven't reported any issues yet."}
                  </div>
                </div>
              ) : (tab === 'nearby' ? nearby : myIssues).map(issue => (
                <div key={issue.id} style={{
                  background: '#fff', border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: '14px',
                  display: 'flex', gap: '14px', alignItems: 'flex-start',
                  boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s',
                }}>
                  {issue.image_path && (
                    <img src={issue.image_path} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 'var(--radius)', flexShrink: 0 }}
                      onError={e => e.target.style.display = 'none'} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)', marginBottom: '4px', fontFamily: 'var(--font-head)' }}>{issue.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>📍 {issue.address} · {fmt(issue.created_at)}</div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: urgBg(issue.urgency), color: urgColor(issue.urgency), fontWeight: 700 }}>
                        Urgency {issue.urgency}/10
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>👍 {issue.upvotes}</span>
                    </div>
                    {issue.authority_name && (
                      <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--accent)', fontWeight: 500 }}>
                        🏛 {issue.authority_name}
                        {issue.authority_phone && <span style={{ marginLeft: '8px' }}>📞 {issue.authority_phone}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
