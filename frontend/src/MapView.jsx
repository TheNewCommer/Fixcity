import { useEffect, useRef } from 'react'
import L from 'leaflet'

const urgColor = u => u >= 8 ? '#ff4f4f' : u >= 6 ? '#ffa45c' : u >= 4 ? '#ffcf55' : '#2fd180'

const makeIcon = issue => {
  const c = urgColor(issue.urgency)
  const svg = `<svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg"><path d="M16 0C7.16 0 0 7.16 0 16C0 27 16 40 16 40C16 40 32 27 32 16C32 7.16 24.84 0 16 0Z" fill="${c}" opacity="0.9"/><circle cx="16" cy="16" r="7" fill="white" opacity="0.2"/><text x="16" y="21" text-anchor="middle" font-size="11" fill="white" font-weight="700" font-family="sans-serif">${issue.urgency}</text></svg>`
  return L.divIcon({ html: svg, className: '', iconSize: [32, 40], iconAnchor: [16, 40], popupAnchor: [0, -42] })
}

export default function MapView({ issues, selectedIssue, onSelect, onUpvote, categoryIcons }) {
  const mapRef     = useRef(null)
  const mapInst    = useRef(null)
  const markersRef = useRef({})

  useEffect(() => {
    if (mapInst.current) return
    mapInst.current = L.map(mapRef.current, { center: [25.5941, 85.1376], zoom: 12 })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19 }).addTo(mapInst.current)
  }, [])

  useEffect(() => {
    const map = mapInst.current
    if (!map) return
    Object.values(markersRef.current).forEach(m => m.remove())
    markersRef.current = {}
    issues.forEach(issue => {
      if (!issue.lat || !issue.lng) return
      const marker = L.marker([issue.lat, issue.lng], { icon: makeIcon(issue) })
      const ic = categoryIcons[issue.category] || '⚠️'
      const uc = urgColor(issue.urgency)
      const ss = issue.status === 'resolved' ? '#2fd180' : issue.status === 'in_progress' ? '#3a9cff' : '#ff5c3a'
      marker.bindPopup(`
        <div style="min-width:220px;font-family:'DM Sans',sans-serif">
          <div style="font-weight:600;font-size:13px;color:#e8e9eb;margin-bottom:6px">${ic} ${issue.title}</div>
          <div style="display:flex;gap:6px;margin-bottom:6px;flex-wrap:wrap">
            <span style="background:#2a2d35;color:#7a7f8e;padding:2px 8px;border-radius:6px;font-size:11px">${issue.category}</span>
            <span style="background:${uc}22;color:${uc};padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700">Urgency ${issue.urgency}/10</span>
          </div>
          ${issue.address ? `<div style="font-size:11px;color:#7a7f8e;margin-bottom:4px">📍 ${issue.address}</div>` : ''}
          ${issue.authority_name ? `<div style="font-size:11px;color:#7a7f8e;margin-bottom:2px">🏛 ${issue.authority_name}</div>` : ''}
          ${issue.authority_phone ? `<div style="font-size:11px;color:#3a9cff;margin-bottom:4px">📞 ${issue.authority_phone}</div>` : ''}
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;padding-top:6px;border-top:1px solid #2a2d35">
            <span style="font-size:11px;color:#7a7f8e">👍 ${issue.upvotes}</span>
            <span style="font-size:11px;padding:2px 8px;border-radius:12px;background:${ss}22;color:${ss}">${issue.status.replace('_',' ')}</span>
          </div>
        </div>
      `)
      marker.addTo(map)
      markersRef.current[issue.id] = marker
    })
    if (issues.length > 0) {
      const valid = issues.filter(i => i.lat && i.lng)
      if (valid.length > 0) map.fitBounds(L.latLngBounds(valid.map(i => [i.lat, i.lng])), { padding: [40, 40], maxZoom: 14 })
    }
  }, [issues])

  useEffect(() => {
    if (selectedIssue && markersRef.current[selectedIssue.id] && mapInst.current) {
      mapInst.current.setView([selectedIssue.lat, selectedIssue.lng], 15)
      markersRef.current[selectedIssue.id].openPopup()
    }
  }, [selectedIssue])

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', bottom: 24, left: 16, zIndex: 999, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '12px', color: 'var(--muted)' }}>
        <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>Urgency</div>
        {[['#ff4f4f','8–10 Critical'],['#ffa45c','6–7 High'],['#ffcf55','4–5 Medium'],['#2fd180','1–3 Low']].map(([c,l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            <span>{l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
