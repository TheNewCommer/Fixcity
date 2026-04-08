import { useState } from 'react'
import Comments from './Comments.jsx'
import ActivityLog from './ActivityLog.jsx'

const urgencyColor = u => u >= 8 ? '#dc2626' : u >= 6 ? '#d97706' : u >= 4 ? '#ca8a04' : '#16a34a'
const urgencyBg    = u => u >= 8 ? '#fef2f2' : u >= 6 ? '#fffbeb' : u >= 4 ? '#fefce8' : '#f0fdf4'
const urgencyLabel = u => u >= 8 ? 'Critical' : u >= 6 ? 'High' : u >= 4 ? 'Medium' : 'Low'

const STATUS = {
  open:        { bg: '#fef2f2', color: '#dc2626', label: '🔴 Open' },
  in_progress: { bg: '#fffbeb', color: '#d97706', label: '🟡 In Progress' },
  resolved:    { bg: '#f0fdf4', color: '#16a34a', label: '🟢 Resolved' },
}

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
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px 24px', background: 'var(--bg2)' }}>
      {/* Sort bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 500 }}>
          🌿 <b style={{ color: 'var(--accent)' }}>{issues.length}</b> issues found
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Sort by:</span>
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '2px' }}>
            {[['newest','🕐 Newest'],['urgency','🚨 Urgency'],['upvotes','👍 Popular']].map(([key, label]) => (
              <button key={key} onClick={() => setSort(key)} style={{
                padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                background: sort === key ? 'var(--accent)' : 'transparent',
                color: sort === key ? '#fff' : 'var(--muted)', border: 'none',
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌱</div>
          <div style={{ color: 'var(--muted)', fontSize: '15px', fontWeight: 500 }}>No issues found</div>
          <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '4px' }}>Try adjusting your filters</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {sorted.map(issue => {
            const uc  = urgencyColor(issue.urgency)
            const ubg = urgencyBg(issue.urgency)
            const ss  = STATUS[issue.status] || STATUS.open
            const isExp = expanded === issue.id

            return (
              <div key={issue.id} className="animate-fade" style={{
                background: '#fff',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                transition: 'all 0.25s ease',
                boxShadow: 'var(--shadow-sm)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent2)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none' }}
              >
                {/* Image */}
                {issue.image_path && (
                  <div style={{ height: '170px', overflow: 'hidden', cursor: 'pointer', background: 'var(--bg2)', position: 'relative' }}
                    onClick={() => onSelect(issue)}>
                    <img src={issue.image_path} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      onError={e => e.target.parentElement.style.display = 'none'} />
                    {/* Urgency badge on image */}
                    <div style={{
                      position: 'absolute', top: '10px', right: '10px',
                      background: ubg, color: uc, border: `1px solid ${uc}44`,
                      borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700,
                    }}>{urgencyLabel(issue.urgency)} — {issue.urgency}/10</div>
                  </div>
                )}

                <div style={{ padding: '16px' }}>
                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>
                      {categoryIcons[issue.category] || '⚠️'} {issue.category}
                    </span>
                    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: ss.bg, color: ss.color, fontWeight: 600 }}>
                      {ss.label}
                    </span>
                  </div>

                  {/* Title */}
                  <div style={{
                    fontWeight: 700, fontSize: '15px', marginBottom: '6px',
                    fontFamily: 'var(--font-head)', cursor: 'pointer', lineHeight: 1.3,
                    color: 'var(--text)',
                  }} onClick={() => onSelect(issue)}>
                    {issue.title}
                  </div>

                  {/* Description */}
                  {issue.description && (
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px', lineHeight: 1.6 }}>
                      {issue.description.length > 90 ? issue.description.slice(0, 90) + '…' : issue.description}
                    </div>
                  )}

                  {/* Location + date */}
                  <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--muted)', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <span>📍 {issue.address || 'No address'}</span>
                    <span>📅 {fmt(issue.created_at)}</span>
                    {issue.reported_by && <span>👤 {issue.reported_by.name}</span>}
                  </div>

                  {/* Authority box */}
                  {issue.authority_name && (
                    <div style={{
                      background: 'var(--accent-light)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)', padding: '8px 12px', marginBottom: '12px',
                      borderLeft: '3px solid var(--accent)',
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>🏛 Responsible Authority</div>
                      <div style={{ fontSize: '11px', color: 'var(--text)', marginBottom: '4px', fontWeight: 500 }}>{issue.authority_name}</div>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {issue.authority_phone && <a href={`tel:${issue.authority_phone}`} style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>📞 {issue.authority_phone}</a>}
                        {issue.authority_email && <a href={`mailto:${issue.authority_email}`} style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>✉️ {issue.authority_email}</a>}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                    {!issue.image_path && (
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: ubg, color: uc }}>
                        {urgencyLabel(issue.urgency)} — {issue.urgency}/10
                      </span>
                    )}
                    {issue.image_path && <div />}
                    <button onClick={e => { e.stopPropagation(); onUpvote(issue.id) }} style={{
                      background: 'var(--bg2)', border: '1.5px solid var(--border)',
                      borderRadius: '8px', padding: '5px 12px',
                      color: 'var(--accent)', fontSize: '12px', fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: '4px',
                      transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                    >👍 {issue.upvotes}</button>
                  </div>

                  {/* Comments toggle */}
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                    <button onClick={() => setExpanded(isExp ? null : issue.id)} style={{
                      background: 'none', border: 'none', color: 'var(--accent)',
                      fontSize: '12px', fontWeight: 600, padding: 0, display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      {isExp ? '▾ Hide details' : `💬 Comments (${issue.comment_count || 0}) & Activity ▸`}
                    </button>
                    {isExp && (
                      <div className="animate-fade" style={{ marginTop: '10px' }}>
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
