import { useState, useEffect } from 'react'
import api from './api.js'

export default function Comments({ issueId, user }) {
  const [comments, setComments] = useState([])
  const [text, setText]         = useState('')
  const [open, setOpen]         = useState(false)
  const [busy, setBusy]         = useState(false)

  const load = () => api.get(`/api/issues/${issueId}/comments`).then(r => setComments(r.data))

  useEffect(() => { if (open) load() }, [open, issueId])

  const post = async () => {
    if (!text.trim()) return
    setBusy(true)
    try {
      await api.post(`/api/issues/${issueId}/comments`, { text })
      setText('')
      load()
    } catch (e) { alert('Failed to post comment') }
    finally { setBusy(false) }
  }

  const fmt = iso => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ marginTop: '10px' }}>
      <button onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', color: 'var(--info)', fontSize: '12px', cursor: 'pointer', padding: 0 }}>
        {open ? '▾ Hide comments' : `▸ Comments (${comments.length || ''})`}
      </button>
      {open && (
        <div style={{ marginTop: '10px' }}>
          {comments.length === 0
            ? <div style={{ fontSize: '12px', color: 'var(--muted)', padding: '4px 0' }}>No comments yet.</div>
            : comments.map(c => (
              <div key={c.id} style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '8px 12px', marginBottom: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <b style={{ color: 'var(--text)' }}>{c.user.name}</b>
                  <span style={{ color: 'var(--muted)', fontSize: '11px' }}>{fmt(c.created_at)}</span>
                </div>
                <div style={{ color: 'var(--muted)' }}>{c.text}</div>
              </div>
            ))
          }
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && post()} placeholder={user ? 'Add a comment...' : 'Login to comment'} disabled={!user} style={{ flex: 1, fontSize: '12px', padding: '7px 10px' }} />
            <button onClick={post} disabled={busy || !user || !text.trim()} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '7px 14px', fontSize: '12px', fontWeight: 600, opacity: (!user || !text.trim()) ? 0.4 : 1 }}>
              {busy ? '...' : 'Post'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
