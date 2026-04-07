import { useState, useEffect } from 'react'
import api from './api.js'
import LandingPage from './LandingPage.jsx'
import AuthPage from './AuthPage.jsx'
import AdminPage from './AdminPage.jsx'
import MapView from './MapView.jsx'
import IssueList from './IssueList.jsx'
import ReportForm from './ReportForm.jsx'
import StatsBar from './StatsBar.jsx'

const CATEGORY_ICONS = {
  'Pothole / Road Damage':     '🕳️',
  'Garbage / Waste':           '🗑️',
  'Street Light Outage':       '💡',
  'Flooding / Waterlogging':   '🌊',
  'Broken Infrastructure':     '🏚️',
  'Vandalism / Graffiti':      '🎨',
  'Fallen Tree / Obstruction': '🌳',
  'Damaged Public Property':   '🚧',
  'Other':                     '⚠️',
}
const CATEGORIES = Object.keys(CATEGORY_ICONS)

export default function App() {
  const [page, setPage]           = useState('landing')
  const [user, setUser]           = useState(null)
  const [issues, setIssues]       = useState([])
  const [stats, setStats]         = useState(null)
  const [loading, setLoading]     = useState(false)
  const [showForm, setShowForm]   = useState(false)
  const [selected, setSelected]   = useState(null)
  const [tab, setTab]             = useState('map')
  const [search, setSearch]       = useState('')
  const [catFilter, setCat]       = useState('all')
  const [statusFilter, setStatus] = useState('all')

  // Restore session on load
  useEffect(() => {
    const token = localStorage.getItem('fmc_token')
    if (!token) return
    api.get('/api/auth/me')
      .then(r => { setUser(r.data); setPage('app') })
      .catch(() => localStorage.removeItem('fmc_token'))
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [iRes, sRes] = await Promise.all([api.get('/api/issues'), api.get('/api/stats')])
      setIssues(iRes.data)
      setStats(sRes.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { if (page === 'app') fetchData() }, [page])

  const handleLogin = (u) => {
    setUser(u)
    if (u?.role === 'admin') setPage('admin')
    else setPage('app')
  }

  const handleLogout = async () => {
    await api.post('/api/auth/logout').catch(() => {})
    localStorage.removeItem('fmc_token')
    setUser(null)
    setPage('landing')
  }

  const handleNewIssue = (issue) => {
    setIssues(prev => [issue, ...prev])
    fetchData()
    setShowForm(false)
  }

  const handleUpvote = async (id) => {
    const res = await api.post(`/api/issues/${id}/upvote`)
    setIssues(prev => prev.map(i => i.id === id ? { ...i, upvotes: res.data.upvotes } : i))
  }

  const filtered = issues.filter(i => {
    const s = search.toLowerCase()
    const matchSearch = !search ||
      i.title.toLowerCase().includes(s) ||
      (i.address || '').toLowerCase().includes(s) ||
      i.category.toLowerCase().includes(s)
    const matchCat    = catFilter === 'all' || i.category === catFilter
    const matchStatus = statusFilter === 'all' || i.status === statusFilter
    return matchSearch && matchCat && matchStatus
  })

  // ── PAGES ─────────────────────────────────────────

  if (page === 'landing')
    return <LandingPage onCitizenLogin={() => setPage('auth')} onAdminLogin={() => setPage('admin_auth')} />

  if (page === 'auth')
    return <AuthPage onLogin={handleLogin} onBack={() => setPage('landing')} adminMode={false} />

  if (page === 'admin_auth')
    return <AuthPage onLogin={handleLogin} onBack={() => setPage('landing')} adminMode={true} />

  if (page === 'admin')
    return <AdminPage onBack={() => setPage('app')} onLogout={handleLogout} user={user} />

  // ── MAIN APP ──────────────────────────────────────

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* Header */}
      <header style={{
        background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        padding: '0 16px', display: 'flex', alignItems: 'center',
        gap: '12px', height: '56px', flexShrink: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div onClick={() => setPage('landing')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '16px', color: '#fff' }}>F</div>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '18px' }}>Fix<span style={{ color: 'var(--accent)' }}>My</span>City</span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '3px' }}>
          {['map', 'list'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '5px 12px', borderRadius: '7px', fontWeight: 500, cursor: 'pointer', background: tab === t ? 'var(--bg3)' : 'transparent', color: tab === t ? 'var(--text)' : 'var(--muted)', border: tab === t ? '1px solid var(--border)' : '1px solid transparent', fontSize: '13px' }}>
              {t === 'map' ? '🗺 Map' : '📋 Issues'}
            </button>
          ))}
        </div>

        {/* Search */}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search issues, areas..."
          style={{ flex: 1, maxWidth: '240px', padding: '6px 12px', fontSize: '13px' }} />

        {/* Category filter */}
        <select value={catFilter} onChange={e => setCat(e.target.value)} style={{ padding: '6px 8px', fontSize: '12px', width: 'auto', minWidth: '120px' }}>
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
        </select>

        {/* Status filter */}
        <select value={statusFilter} onChange={e => setStatus(e.target.value)} style={{ padding: '6px 8px', fontSize: '12px', width: 'auto' }}>
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        {/* Right side */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          {stats && (
            <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--muted)' }}>
              <span><b style={{ color: 'var(--text)' }}>{stats.total}</b> total</span>
              <span><b style={{ color: '#ff4f4f' }}>{stats.urgent}</b> urgent</span>
              <span><b style={{ color: '#2fd180' }}>{stats.resolved}</b> resolved</span>
            </div>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text)', fontWeight: 500 }}>{user.name}</div>
                {user.city && <div style={{ fontSize: '10px', color: 'var(--muted)' }}>📍 {user.city}</div>}
              </div>
              {user.role === 'admin' && (
                <button onClick={() => setPage('admin')} style={{ background: '#ff5c3a22', border: '1px solid #ff5c3a44', borderRadius: '6px', padding: '4px 10px', color: 'var(--accent)', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>⚙ Admin</button>
              )}
              <button onClick={handleLogout} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 8px', color: 'var(--muted)', fontSize: '11px', cursor: 'pointer' }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => setPage('auth')} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '5px 12px', color: 'var(--muted)', fontSize: '12px', cursor: 'pointer' }}>Login</button>
          )}

          <button onClick={() => setShowForm(true)} style={{ background: 'var(--accent)', color: '#fff', padding: '7px 16px', borderRadius: '8px', fontWeight: 600, fontFamily: 'var(--font-head)', fontSize: '13px', border: 'none', cursor: 'pointer' }}>
            + Report
          </button>
        </div>
      </header>

      {/* Stats bar */}
      {stats && <StatsBar stats={stats} />}

      {/* Active filter indicator */}
      {(search || catFilter !== 'all' || statusFilter !== 'all') && (
        <div style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)', padding: '5px 16px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
            Showing <b style={{ color: 'var(--text)' }}>{filtered.length}</b> of {issues.length} issues
          </span>
          <button onClick={() => { setSearch(''); setCat('all'); setStatus('all') }}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12px', cursor: 'pointer' }}>Clear filters</button>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)', gap: '12px' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
            Loading issues...
          </div>
        ) : tab === 'map' ? (
          <MapView issues={filtered} selectedIssue={selected} onSelect={setSelected} onUpvote={handleUpvote} categoryIcons={CATEGORY_ICONS} />
        ) : (
          <IssueList issues={filtered} onSelect={i => { setSelected(i); setTab('map') }} onUpvote={handleUpvote} categoryIcons={CATEGORY_ICONS} user={user} />
        )}
      </div>

      {/* Report form modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <ReportForm onSubmit={handleNewIssue} onClose={() => setShowForm(false)} />
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
