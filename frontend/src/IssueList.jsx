import { useState } from 'react'
import Comments from './Comments.jsx'
import ActivityLog from './ActivityLog.jsx'

const urgencyColor = u => u >= 8 ? '#ff4f4f' : u >= 6 ? '#ffa45c' : u >= 4 ? '#ffcf55' : '#2fd180'
const statusStyle  = { open: { bg: '#ff5c3a18', color: '#ff5c3a' }, in_progress: { bg: '#3a9cff18', color: '#3a9cff' }, resolved: { bg: '#2fd18018', color: '#2fd180' } }

const fmt = iso => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export default function IssueList({ issues, onSelect, onUpvote, categoryIcons, user }) {
  const [sort, setSort]         = useState('newest')
  const [expanded, setExpanded] = useState(null)

  const sorted = [...issues].sort((a, b) => {
    if (sort === 'urgency') return b.urgency - a.urgency
    if (sort === 'upvotes') return b.upvotes - a.upvotes
    return new Date(b.created_at) - new Date(a.created_at)
  })

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{issues.length} issues</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Sort:</span>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ width: 'auto', padding: '5px 8px', fontSize: '12px' }}>
            <option value="newest">Newest</option>
            <option value="urgency">Most Urgent</option>
            <option value="upvotes">Most Upvoted</option>
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '60px 0' }}>No issues found.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
          {sorted.map(issue => {
            const uc = urgencyColor(issue.urgency)
            const ss = statusStyle[issue.status] || statusStyle.open
            const isExp = expanded === issue.id
            return (
              <div key={issue.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'border-color 0.15s, transform 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
              >
                {/* Image */}
                {issue.image_path && (
                  <div style={{ height: '160px', overflow: 'hidden', background: 'var(--bg3)', cursor: 'pointer' }} onClick={() => onSelect(issue)}>
                    <img src={issue.image_path} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.parentElement.style.display = 'none'} />
                  </div>
                )}

                <div style={{ padding: '14px' }}>
                  {/* Category + status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{categoryIcons[issue.category] || '⚠️'} {issue.category}</span>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: ss.bg, color: ss.color, fontWeight: 500 }}>{issue.status.replace('_', ' ')}</span>
                  </div>

                  {/* Title */}
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px', fontFamily: 'var(--font-head)', cursor: 'pointer', lineHeight: 1.4 }} onClick={() => onSelect(issue)}>
                    {issue.title}
                  </div>

                  {/* Description */}
                  {issue.description && <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px', lineHeight: 1.5 }}>{issue.description.length > 90 ? issue.description.slice(0, 90) + '…' : issue.description}</div>}

                  {/* Address + date */}
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>📍 {issue.address || 'No address'} · {fmt(issue.created_at)}</div>

                  {/* Reporter */}
                  {issue.reported_by && <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>👤 Reported by <b style={{ color: 'var(--text)' }}>{issue.reported_by.name}</b></div>}

                  {/* Authority contact */}
                  {issue.authority_name && (
                    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '8px 10px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>🏛 Responsible Authority</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>{issue.authority_name}</div>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {issue.authority_phone && <a href={`tel:${issue.authority_phone}`} style={{ fontSize: '11px', color: 'var(--info)' }}>📞 {issue.authority_phone}</a>}
                        {issue.authority_email && <a href={`mailto:${issue.authority_email}`} style={{ fontSize: '11px', color: 'var(--info)' }}>✉️ {issue.authority_email}</a>}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: uc + '22', color: uc }}>Urgency {issue.urgency}/10</span>
                    <button onClick={e => { e.stopPropagation(); onUpvote(issue.id) }} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '4px 10px', color: 'var(--muted)', fontSize: '12px' }}>
                      👍 {issue.upvotes}
                    </button>
                  </div>

                  {/* Comments + activity */}
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                    <button onClick={() => setExpanded(isExp ? null : issue.id)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '12px', cursor: 'pointer', padding: 0 }}>
                      {isExp ? '▾ Hide details' : `▸ Comments (${issue.comment_count || 0}) & Activity`}
                    </button>
                    {isExp && (
                      <div style={{ marginTop: '10px' }}>
                        <Comments issueId={issue.id} user={user} />
                        <div style={{ marginTop: '8px' }}><ActivityLog issueId={issue.id} /></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
