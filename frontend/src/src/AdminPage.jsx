import { useState, useEffect } from 'react'
import api from './api.js'

const urgColor = u => u >= 8 ? '#dc2626' : u >= 6 ? '#d97706' : u >= 4 ? '#ca8a04' : '#16a34a'
const urgBg    = u => u >= 8 ? '#fef2f2' : u >= 6 ? '#fffbeb' : u >= 4 ? '#fefce8' : '#f0fdf4'
const STATUS   = {
  open:        { bg: '#fef2f2', color: '#dc2626', label: '🔴 Open' },
  in_progress: { bg: '#fffbeb', color: '#d97706', label: '🟡 In Progress' },
  resolved:    { bg: '#f0fdf4', color: '#16a34a', label: '🟢 Resolved' },
}

export default function AdminPage({ onBack, onLogout, user }) {
  const [issues, setIssues]   = useState([])
  const [stats, setStats]     = useState(null)
  const [filter, setFilter]   = useState('all')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const [iRes, sRes] = await Promise.all([api.get('/api/admin/issues'), api.get('/api/stats')])
    setIssues(iRes.data); setStats(sRes.data); setLoading(false)
  }

  useEffect(() => { load() }, [])

  const changeStatus = async (id, status) => {
    await api.post(`/api/issues/${id}/status`, { status })
    setIssues(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  const filtered = filter === 'all' ? issues : issues.filter(i => i.status === filter)

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
          borderRadius: '8px', padding: '6px 14px', color: '#fff',
          fontSize: '13px', fontWeight: 600,
        }}>← Back to Map</button>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '20px', color: '#fff' }}>
          ⚙ Admin Dashboard
        </div>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Municipal Officer View</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
          {user && <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>👤 {user.name}</span>}
          <button onClick={onLogout} style={{
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px', padding: '5px 12px', color: '#fff', fontSize: '12px',
          }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Total Issues',  value: stats.total,    color: 'var(--accent)',   bg: 'var(--accent-light)', icon: '📊' },
              { label: 'Open',          value: stats.open,     color: '#dc2626',          bg: '#fef2f2',             icon: '🔴' },
              { label: 'In Progress',   value: stats.total - stats.open - stats.resolved, color: '#d97706', bg: '#fffbeb', icon: '🟡' },
              { label: 'Resolved',      value: stats.resolved, color: '#16a34a',          bg: '#f0fdf4',             icon: '🟢' },
              { label: 'Urgent (7+)',   value: stats.urgent,   color: '#dc2626',          bg: '#fef2f2',             icon: '🚨' },
            ].map(({ label, value, color, bg, icon }) => (
              <div key={label} style={{
                background: bg, border: `1.5px solid ${color}33`,
                borderRadius: 'var(--radius-lg)', padding: '16px',
                textAlign: 'center', boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{icon}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-head)', color }}>{value}</div>
                <div style={{ fontSize: '12px', color, opacity: 0.8, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Category breakdown */}
        {stats && Object.keys(stats.by_category).length > 0 && (
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)', marginBottom: '12px', fontFamily: 'var(--font-head)' }}>📊 Issues by category</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {Object.entries(stats.by_category).sort((a,b)=>b[1]-a[1]).map(([cat, count]) => (
                <div key={cat} style={{
                  background: 'var(--accent-light)', border: '1px solid var(--border)',
                  borderRadius: '20px', padding: '4px 14px', fontSize: '12px',
                  display: 'flex', gap: '6px', alignItems: 'center',
                }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{count}</span>
                  <span style={{ color: 'var(--muted)' }}>{cat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[['all','All Issues'],['open','Open'],['in_progress','In Progress'],['resolved','Resolved']].map(([f, label]) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 18px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
              background: filter === f ? 'var(--accent)' : '#fff',
              color: filter === f ? '#fff' : 'var(--muted)',
              border: `1.5px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
              boxShadow: filter === f ? '0 2px 6px rgba(26,107,60,0.2)' : 'none',
              transition: 'all 0.2s',
            }}>{label}</button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--muted)', alignSelf: 'center', fontWeight: 500 }}>
            {filtered.length} issues
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px', fontSize: '24px' }}>🌱</div>
        ) : (
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 90px 80px 160px',
              padding: '12px 20px', background: 'var(--bg2)',
              borderBottom: '1.5px solid var(--border)',
              fontSize: '11px', fontWeight: 700, color: 'var(--accent)',
              textTransform: 'uppercase', letterSpacing: '.06em',
            }}>
              <span>Issue</span><span>Category</span><span>Urgency</span><span>Upvotes</span><span>Change Status</span>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px' }}>No issues found.</div>
            ) : filtered.map((issue, idx) => {
              const ss = STATUS[issue.status] || STATUS.open
              return (
                <div key={issue.id} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 90px 80px 160px',
                  padding: '14px 20px', alignItems: 'center',
                  borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  background: issue.urgency >= 8 ? '#fff8f8' : '#fff',
                  transition: 'background 0.2s',
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '3px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {issue.urgency >= 8 && <span style={{ fontSize: '10px', background: '#fef2f2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>URGENT</span>}
                      {issue.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      📍 {issue.address || 'No address'} · {new Date(issue.created_at).toLocaleDateString('en-IN')}
                      {issue.reported_by ? ` · 👤 ${issue.reported_by.name}` : ''}
                    </div>
                    {issue.authority_name && (
                      <div style={{ fontSize: '11px', color: 'var(--accent)', marginTop: '2px', fontWeight: 500 }}>
                        🏛 {issue.authority_name} · 📞 {issue.authority_phone}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{issue.category}</div>
                  <div style={{
                    display: 'inline-flex', padding: '3px 10px', borderRadius: '20px',
                    background: urgBg(issue.urgency), color: urgColor(issue.urgency),
                    fontSize: '12px', fontWeight: 700, width: 'fit-content',
                  }}>{issue.urgency}/10</div>
                  <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>👍 {issue.upvotes}</div>
                  <select value={issue.status} onChange={e => changeStatus(issue.id, e.target.value)} style={{
                    padding: '6px 10px', borderRadius: '8px', fontSize: '12px',
                    background: ss.bg, color: ss.color,
                    border: `1.5px solid ${ss.color}55`, width: '150px', fontWeight: 600,
                  }}>
                    <option value="open">🔴 Open</option>
                    <option value="in_progress">🟡 In Progress</option>
                    <option value="resolved">🟢 Resolved</option>
                  </select>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
