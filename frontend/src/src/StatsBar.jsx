export default function StatsBar({ stats }) {
  const cats = Object.entries(stats.by_category || {}).sort((a,b)=>b[1]-a[1]).slice(0,4)

  const items = [
    { label: 'Open',        value: stats.open,                                    bg: '#fef2f2', color: '#dc2626', icon: '🔴' },
    { label: 'In Progress', value: stats.total - stats.open - stats.resolved,     bg: '#fffbeb', color: '#d97706', icon: '🟡' },
    { label: 'Resolved',    value: stats.resolved,                                bg: '#f0fdf4', color: '#16a34a', icon: '🟢' },
    { label: 'Urgent',      value: stats.urgent,                                  bg: '#fff1f2', color: '#e11d48', icon: '🚨' },
  ]

  return (
    <div style={{
      background: 'var(--bg2)',
      borderBottom: '1.5px solid var(--border)',
      padding: '8px 20px',
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      overflowX: 'auto',
      flexShrink: 0,
    }}>
      {items.map(({ label, value, bg, color, icon }) => (
        <div key={label} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: bg, borderRadius: '20px',
          padding: '4px 12px', flexShrink: 0,
        }}>
          <span style={{ fontSize: '12px' }}>{icon}</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color }}>{value}</span>
          <span style={{ fontSize: '11px', color, opacity: 0.8 }}>{label}</span>
        </div>
      ))}

      {cats.length > 0 && (
        <>
          <div style={{ width: '1px', height: '24px', background: 'var(--border)', flexShrink: 0, margin: '0 4px' }} />
          {cats.map(([cat, count]) => (
            <div key={cat} style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: '20px', padding: '4px 12px',
              fontSize: '11px', color: 'var(--muted)', whiteSpace: 'nowrap', flexShrink: 0,
              display: 'flex', gap: '4px', alignItems: 'center',
            }}>
              <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{count}</span>
              <span>{cat}</span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
