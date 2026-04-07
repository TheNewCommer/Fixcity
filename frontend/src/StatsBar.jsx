export default function StatsBar({ stats }) {
  const cats = Object.entries(stats.by_category || {}).sort((a,b)=>b[1]-a[1]).slice(0,4)
  return (
    <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '6px 24px', display: 'flex', gap: '20px', alignItems: 'center', overflowX: 'auto', flexShrink: 0 }}>
      {[
        { label: 'Open',      value: stats.open,     color: '#ff5c3a' },
        { label: 'In Progress', value: stats.total - stats.open - stats.resolved, color: '#3a9cff' },
        { label: 'Resolved',  value: stats.resolved, color: '#2fd180' },
        { label: 'Critical',  value: stats.urgent,   color: '#ff4f4f' },
      ].map(({ label, value, color }) => (
        <div key={label} style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-head)', color }}>{value}</div>
          <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</div>
        </div>
      ))}
      {cats.length > 0 && <>
        <div style={{ width: '1px', height: '32px', background: 'var(--border)', flexShrink: 0 }} />
        {cats.map(([cat, count]) => (
          <div key={cat} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: 'var(--muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{count}</span> {cat}
          </div>
        ))}
      </>}
    </div>
  )
}
