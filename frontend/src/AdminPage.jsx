import { useState, useEffect } from 'react'
import api from './api.js'

const uc = u => u >= 8 ? '#ff4f4f' : u >= 6 ? '#ffa45c' : u >= 4 ? '#ffcf55' : '#2fd180'
const ss = { open: { bg: '#ff5c3a18', color: '#ff5c3a' }, in_progress: { bg: '#3a9cff18', color: '#3a9cff' }, resolved: { bg: '#2fd18018', color: '#2fd180' } }

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
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '12px', height: '56px' }}>
        <button onClick={onBack} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '5px 12px', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer' }}>← Back to Map</button>
        <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '18px' }}>Admin <span style={{ color: 'var(--accent)' }}>Dashboard</span></span>
        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Municipal Officer View</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
          {user && <span style={{ fontSize: '13px', color: 'var(--muted)' }}>👤 {user.name}</span>}
          <button onClick={onLogout} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 10px', color: 'var(--muted)', fontSize: '12px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Total', value: stats.total, color: 'var(--text)' },
              { label: 'Open', value: stats.open, color: '#ff5c3a' },
              { label: 'In Progress', value: stats.total - stats.open - stats.resolved, color: '#3a9cff' },
              { label: 'Resolved', value: stats.resolved, color: '#2fd180' },
              { label: 'Critical', value: stats.urgent, color: '#ff4f4f' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '26px', fontWeight: 700, fontFamily: 'var(--font-head)', color }}>{value}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {['all','open','in_progress','resolved'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: filter === f ? 'var(--accent)' : 'var(--bg3)', color: filter === f ? '#fff' : 'var(--muted)', border: '1px solid ' + (filter === f ? 'transparent' : 'var(--border)'), cursor: 'pointer' }}>
              {f.replace('_', ' ')}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--muted)', alignSelf: 'center' }}>{filtered.length} issues</span>
        </div>

        {loading ? <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px' }}>Loading...</div> : (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 80px 140px', padding: '10px 16px', borderBottom: '1px solid var(--border)', fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
              <span>Issue</span><span>Category</span><span>Urgency</span><span>Upvotes</span><span>Status</span>
            </div>
            {filtered.length === 0
              ? <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px' }}>No issues.</div>
              : filtered.map((issue, idx) => {
                const s = ss[issue.status] || ss.open
                return (
                  <div key={issue.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 80px 140px', padding: '12px 16px', alignItems: 'center', borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none', background: issue.urgency >= 8 ? '#ff4f4f06' : 'transparent' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {issue.urgency >= 8 && <span style={{ fontSize: '10px', background: '#ff4f4f22', color: '#ff4f4f', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>URGENT</span>}
                        {issue.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                        {issue.address || 'No address'} · {new Date(issue.created_at).toLocaleDateString('en-IN')}
                        {issue.reported_by ? ` · ${issue.reported_by.name}` : ''}
                      </div>
                      {issue.authority_name && <div style={{ fontSize: '11px', color: 'var(--info)', marginTop: '2px' }}>🏛 {issue.authority_name} · {issue.authority_phone}</div>}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{issue.category}</div>
                    <div style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: '6px', background: uc(issue.urgency) + '22', color: uc(issue.urgency), fontSize: '12px', fontWeight: 700, width: 'fit-content' }}>{issue.urgency}/10</div>
                    <div style={{ fontSize: '13px', color: 'var(--muted)' }}>👍 {issue.upvotes}</div>
                    <select value={issue.status} onChange={e => changeStatus(issue.id, e.target.value)} style={{ padding: '5px 8px', borderRadius: '8px', fontSize: '12px', background: s.bg, color: s.color, border: `1px solid ${s.color}44`, width: '130px' }}>
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                )
              })
            }
          </div>
        )}
      </div>
    </div>
  )
}
