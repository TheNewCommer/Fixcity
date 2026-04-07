import { useState, useEffect } from 'react'
import api from './api.js'

export default function ActivityLog({ issueId }) {
  const [acts, setActs] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => { if (open) api.get(`/api/issues/${issueId}/activity`).then(r => setActs(r.data)) }, [open, issueId])

  const fmt = iso => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  const icon = a => {
    if (a.includes('Reported') || a.includes('reported')) return '📍'
    if (a.includes('urgent') || a.includes('Flagged'))    return '🚨'
    if (a.includes('Upvoted') || a.includes('upvoted'))   return '👍'
    if (a.includes('Status') || a.includes('status'))     return '🔄'
    if (a.includes('Comment') || a.includes('comment'))   return '💬'
    return '•'
  }

  return (
    <div style={{ marginTop: '8px' }}>
      <button onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '12px', cursor: 'pointer', padding: 0 }}>
        {open ? '▾ Hide activity' : '▸ Activity log'}
      </button>
      {open && (
        <div style={{ marginTop: '10px', paddingLeft: '8px', borderLeft: '2px solid var(--border)' }}>
          {acts.length === 0
            ? <div style={{ fontSize: '12px', color: 'var(--muted)' }}>No activity yet.</div>
            : acts.map((a, i) => (
              <div key={a.id} style={{ display: 'flex', gap: '8px', marginBottom: i < acts.length - 1 ? '8px' : 0 }}>
                <span style={{ fontSize: '13px' }}>{icon(a.action)}</span>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text)' }}>{a.action}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{fmt(a.created_at)}</div>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  )
}
