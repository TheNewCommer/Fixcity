import { useState, useEffect, useRef } from 'react'
import api from './api.js'
import LandingPage from './LandingPage.jsx'
import AuthPage from './AuthPage.jsx'
import AdminPage from './AdminPage.jsx'
import MapView from './MapView.jsx'
import IssueList from './IssueList.jsx'
import ReportForm from './ReportForm.jsx'
import StatsBar from './StatsBar.jsx'
import ProfilePage from './ProfilePage.jsx'

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

// Floating leaf animation component
function FloatingLeaves() {
  const leaves = ['🍃', '🌿', '🍀', '🌱']
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${10 + i * 15}%`,
          top: '-30px',
          fontSize: '18px',
          animation: `leafFall ${8 + i * 2}s linear ${i * 1.5}s infinite`,
          opacity: 0.15,
        }}>{leaves[i % leaves.length]}</div>
      ))}
    </div>
  )
}

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

  if (page === 'landing') return <LandingPage onCitizenLogin={() => setPage('auth')} onAdminLogin={() => setPage('admin_auth')} />
  if (page === 'auth')       return <AuthPage onLogin={handleLogin} onBack={() => setPage('landing')} adminMode={false} />
  if (page === 'admin_auth') return <AuthPage onLogin={handleLogin} onBack={() => setPage('landing')} adminMode={true} />
  if (page === 'admin')      return <AdminPage onBack={() => setPage('app')} onLogout={handleLogout} user={user} />
  if (page === 'profile')    return <ProfilePage user={user} onBack={() => setPage('app')} onUserUpdate={u => setUser(u)} />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg)', position: 'relative' }}>
      <FloatingLeaves />

      {/* Header */}
      <header style={{
        background: 'var(--bg)',
        borderBottom: '1.5px solid var(--border)',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        height: '60px',
        flexShrink: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
      }}>
        {/* Logo */}
        <div onClick={() => setPage('landing')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '18px', color: '#fff',
            boxShadow: '0 2px 8px rgba(26,107,60,0.3)',
          }}>F</div>
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '17px', lineHeight: 1, color: 'var(--accent)' }}>
              Fix<span style={{ color: 'var(--accent2)' }}>My</span>City
            </div>
            <div style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.08em', lineHeight: 1 }}>CIVIC ISSUE REPORTER</div>
          </div>
        </div>

        {/* Nav tabs */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg2)', borderRadius: '10px', padding: '3px' }}>
          {[
            { key: 'map',  label: '🗺 Map' },
            { key: 'list', label: '📋 Issues' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '6px 14px', borderRadius: '8px', fontWeight: 600, fontSize: '13px',
              background: tab === t.key ? 'var(--accent)' : 'transparent',
              color: tab === t.key ? '#fff' : 'var(--muted)',
              border: 'none', transition: 'all 0.2s',
              boxShadow: tab === t.key ? '0 2px 6px rgba(26,107,60,0.25)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '260px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', pointerEvents: 'none' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search issues, areas..."
            style={{ paddingLeft: '34px', fontSize: '13px', background: 'var(--bg2)' }} />
        </div>

        {/* Filters */}
        <select value={catFilter} onChange={e => setCat(e.target.value)}
          style={{ padding: '8px 10px', fontSize: '12px', width: 'auto', minWidth: '130px', background: 'var(--bg2)', fontWeight: 500 }}>
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
        </select>

        <select value={statusFilter} onChange={e => setStatus(e.target.value)}
          style={{ padding: '8px 10px', fontSize: '12px', width: 'auto', background: 'var(--bg2)', fontWeight: 500 }}>
          <option value="all">All statuses</option>
          <option value="open">🔴 Open</option>
          <option value="in_progress">🟡 In Progress</option>
          <option value="resolved">🟢 Resolved</option>
        </select>

        {/* Right side */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          {stats && (
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
              <span style={{ background: 'var(--bg2)', padding: '4px 10px', borderRadius: '20px', color: 'var(--muted)', fontWeight: 500 }}>
                <b style={{ color: 'var(--text)' }}>{stats.total}</b> total
              </span>
              <span style={{ background: '#fef2f2', padding: '4px 10px', borderRadius: '20px', color: 'var(--danger)', fontWeight: 500 }}>
                🚨 <b>{stats.urgent}</b> urgent
              </span>
              <span style={{ background: 'var(--success-bg)', padding: '4px 10px', borderRadius: '20px', color: 'var(--success)', fontWeight: 500 }}>
                ✅ <b>{stats.resolved}</b> resolved
              </span>
            </div>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button onClick={() => setPage('profile')} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--bg2)', border: '1.5px solid var(--border)',
                borderRadius: '24px', padding: '5px 12px 5px 5px',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, color: '#fff',
                }}>{user.name.charAt(0).toUpperCase()}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text)', fontWeight: 600, lineHeight: 1.2 }}>{user.name}</div>
                  {user.city && <div style={{ fontSize: '10px', color: 'var(--muted)' }}>📍 {user.city}</div>}
                </div>
              </button>

              {user.role === 'admin' && (
                <button onClick={() => setPage('admin')} style={{
                  background: 'var(--accent-light)', border: '1.5px solid var(--accent)',
                  borderRadius: '8px', padding: '6px 12px',
                  color: 'var(--accent)', fontSize: '12px', fontWeight: 700,
                }}>⚙ Admin</button>
              )}

              <button onClick={handleLogout} style={{
                background: 'none', border: '1.5px solid var(--border)',
                borderRadius: '8px', padding: '6px 10px',
                color: 'var(--muted)', fontSize: '12px',
              }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => setPage('auth')} style={{
              background: 'none', border: '1.5px solid var(--accent)',
              borderRadius: '10px', padding: '7px 16px',
              color: 'var(--accent)', fontSize: '13px', fontWeight: 600,
            }}>Login</button>
          )}

          {/* Report button */}
          <button onClick={() => setShowForm(true)} style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)',
            color: '#fff', padding: '8px 18px',
            borderRadius: '10px', fontWeight: 700,
            fontFamily: 'var(--font-head)', fontSize: '13px',
            boxShadow: '0 2px 8px rgba(26,107,60,0.35)',
            display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(26,107,60,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(26,107,60,0.35)' }}
          >
            <span style={{ fontSize: '16px' }}>+</span> Report Issue
          </button>
        </div>
      </header>

      {/* Stats bar */}
      {stats && <StatsBar stats={stats} />}

      {/* Filter indicator */}
      {(search || catFilter !== 'all' || statusFilter !== 'all') && (
        <div style={{
          background: 'var(--accent-light)', borderBottom: '1.5px solid var(--border)',
          padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
        }}>
          <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 500 }}>
            🔍 Showing <b>{filtered.length}</b> of {issues.length} issues
          </span>
          {search && <span style={{ fontSize: '11px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2px 10px', color: 'var(--muted)' }}>"{search}"</span>}
          {catFilter !== 'all' && <span style={{ fontSize: '11px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2px 10px', color: 'var(--muted)' }}>{catFilter}</span>}
          <button onClick={() => { setSearch(''); setCat('all'); setStatus('all') }}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12px', fontWeight: 600, marginLeft: '4px' }}>
            Clear ×
          </button>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
            <div style={{ fontSize: '40px', animation: 'float 2s ease-in-out infinite' }}>🌱</div>
            <div style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Loading issues...</div>
            <div style={{ width: 200, height: 3, background: 'var(--bg2)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--accent2))', borderRadius: '2px', animation: 'shimmer 1.5s ease-in-out infinite', backgroundSize: '200% 100%' }} />
            </div>
          </div>
        ) : tab === 'map' ? (
          <MapView issues={filtered} selectedIssue={selected} onSelect={setSelected} onUpvote={handleUpvote} categoryIcons={CATEGORY_ICONS} />
        ) : (
          <IssueList issues={filtered} onSelect={i => { setSelected(i); setTab('map') }} onUpvote={handleUpvote} categoryIcons={CATEGORY_ICONS} user={user} />
        )}
      </div>

      {/* Report modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(26,107,60,0.15)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="animate-scale">
            <ReportForm onSubmit={handleNewIssue} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
