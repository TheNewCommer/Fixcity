export default function LandingPage({ onCitizenLogin, onAdminLogin }) {
  const schemes = [
    { name: 'Swachh Bharat Mission', year: '2014–Present', color: '#16a34a', icon: '🇮🇳', article: `Launched by Prime Minister Narendra Modi on 2nd October 2014, Swachh Bharat Mission is India's largest ever cleanliness campaign. The mission aimed to make India Open Defecation Free (ODF) by constructing over 10 crore household toilets. As of 2023, over 4,500 cities have been declared ODF and more than 70,000 tonnes of solid waste is now being processed daily. The mission also introduced Swachhata rankings for cities, motivating local bodies to improve their cleanliness scores every year.` },
    { name: 'Smart Cities Mission', year: '2015–Present', color: '#0284c7', icon: '🏙', article: `Launched in June 2015 to develop 100 cities into smart, sustainable urban centres. Cities deploy IoT-enabled garbage bins that alert sanitation workers when full, GPS-tracked garbage collection vehicles, and sensor-based systems. Cities like Surat, Indore, and Bhopal have emerged as leaders — Indore won India's cleanest city award for 7 consecutive years due to its smart waste segregation and door-to-door collection system. Over ₹2 lakh crore has been invested in urban infrastructure.` },
    { name: 'AMRUT 2.0', year: '2021–Present', color: '#0891b2', icon: '💧', article: `Atal Mission for Rejuvenation and Urban Transformation 2.0 was launched with a budget of ₹2.77 lakh crore to make 500 Indian cities water-secure and clean. The mission focuses on 100% water supply coverage, sewerage management, and rejuvenation of water bodies. AMRUT 2.0 introduces a circular economy for used water — treated wastewater is reused for industrial purposes. The mission directly impacts urban cleanliness by ensuring proper drainage which prevents waterlogging and disease outbreaks.` },
    { name: 'National Clean Air Programme', year: '2019–Present', color: '#7c3aed', icon: '🌿', article: `Launched in January 2019 with an ambitious target to reduce Particulate Matter pollution by 40% by 2026 across 132 non-attainment cities. The programme funds city-level action plans including mechanised road sweeping, dust control on construction sites, and real-time air quality monitoring stations. Municipal corporations are required to deploy mechanised sweeping machines, sprinklers, and anti-smog guns in high-traffic areas as part of the programme.` },
    { name: 'Namami Gange', year: '2015–Present', color: '#0369a1', icon: '🌊', article: `A flagship programme approved by the Union Government with a budget of ₹20,000 crore to accomplish the twin objectives of effective abatement of pollution and conservation of the national river Ganga. The programme covers sewage treatment plants, river-front development, real-time water quality monitoring, and afforestation of river banks. Over 180 sewage treatment plants with a capacity of 5,000+ MLD have been sanctioned. The programme has significantly improved water quality at key monitoring stations.` },
    { name: 'PM SVANidhi', year: '2020–Present', color: '#b45309', icon: '🛒', article: `PM Street Vendor's AtmaNirbhar Nidhi was launched in June 2020 to provide affordable loans to street vendors and bring street vending into an organised, regulated framework — creating dedicated vending zones that are clean, hygienic, and well-maintained. Over 50 lakh street vendors have been issued certificates of vending. Organised vending zones reduce garbage accumulation in unplanned areas and contribute directly to urban cleanliness.` },
  ]

  const tips = [
    { icon: '♻️', text: 'Always segregate dry and wet waste before handing to collection vehicles.' },
    { icon: '🚰', text: 'Report water pipeline leaks immediately — a single leak wastes over 1000 litres daily.' },
    { icon: '💡', text: 'Report broken streetlights to keep roads safe at night for pedestrians.' },
    { icon: '🌳', text: 'Never dump garbage near trees, water bodies, or open drains.' },
    { icon: '📱', text: 'Use FixMyCity to report issues — your report directly reaches the responsible authority.' },
    { icon: '👥', text: 'Encourage neighbours to upvote issues — more upvotes means faster government response.' },
    { icon: '🏠', text: 'Participate in your ward\'s monthly cleanliness drives by the municipal corporation.' },
    { icon: '🚯', text: 'Never litter in public — ₹500 fine applicable under Solid Waste Management Rules 2016.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#fff', overflowY: 'auto' }}>

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1.5px solid var(--border)',
        padding: '0 40px', height: '60px',
        display: 'flex', alignItems: 'center', gap: '16px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, #1a6b3c 0%, #25a85a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '18px', color: '#fff',
            boxShadow: '0 2px 8px rgba(26,107,60,0.3)',
          }}>F</div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '18px', color: '#1a6b3c' }}>
            Fix<span style={{ color: '#25a85a' }}>My</span>City
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          <button onClick={onAdminLogin} style={{
            background: 'none', border: '1.5px solid var(--border)',
            borderRadius: '10px', padding: '7px 16px',
            color: '#5a7a66', fontSize: '13px', fontWeight: 600,
          }}>⚙ Officer Login</button>
          <button onClick={onCitizenLogin} style={{
            background: 'linear-gradient(135deg, #1a6b3c 0%, #25a85a 100%)',
            color: '#fff', padding: '8px 20px', borderRadius: '10px',
            fontWeight: 700, fontSize: '13px',
            boxShadow: '0 2px 8px rgba(26,107,60,0.3)',
          }}>Get Started →</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #f0faf4 0%, #e6f4ed 50%, #f8fff9 100%)',
        padding: '80px 40px 70px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(37,168,90,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(26,107,60,0.06)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#e8f5ee', border: '1px solid #b8d4c4',
            borderRadius: '20px', padding: '6px 16px', marginBottom: '24px',
            fontSize: '12px', color: '#1a6b3c', fontWeight: 600,
          }}>
            🌱 AI-Powered Civic Issue Reporter
          </div>

          <h1 style={{
            fontFamily: 'var(--font-head)', fontSize: '52px', fontWeight: 800,
            margin: '0 0 16px', lineHeight: 1.1, color: '#1a1a1a',
          }}>
            Fix Your City,<br />
            <span style={{ color: '#1a6b3c' }}>One Report</span> at a Time
          </h1>

          <p style={{ fontSize: '18px', color: '#5a7a66', maxWidth: '520px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Upload a photo of a civic problem. AI classifies it instantly and notifies the right authority. Together we build a cleaner, safer India.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
            <button onClick={onCitizenLogin} style={{
              background: 'linear-gradient(135deg, #1a6b3c 0%, #25a85a 100%)',
              color: '#fff', padding: '16px 40px', borderRadius: '14px',
              fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '17px',
              boxShadow: '0 4px 16px rgba(26,107,60,0.35)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,107,60,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,107,60,0.35)' }}
            >🏘 Citizen Login / Register</button>
            <button onClick={onAdminLogin} style={{
              background: '#fff', color: '#1a6b3c', padding: '16px 40px', borderRadius: '14px',
              fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '17px',
              border: '2px solid #1a6b3c',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f0faf4' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
            >⚙ Municipal Officer Login</button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['8+','Demo Issues'],['4','AI Models'],['100%','Free to Use'],['9','Issue Categories']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '28px', fontWeight: 800, color: '#1a6b3c' }}>{num}</div>
                <div style={{ fontSize: '12px', color: '#5a7a66', fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo video section */}
      <div style={{ padding: '64px 40px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '28px', textAlign: 'center', marginBottom: '8px', color: '#1a1a1a' }}>See it in action</h2>
        <p style={{ textAlign: 'center', color: '#5a7a66', fontSize: '14px', marginBottom: '28px' }}>Watch how FixMyCity works in under 60 seconds</p>
        <div style={{
          background: 'linear-gradient(135deg, #f0faf4 0%, #e6f4ed 100%)',
          border: '2px dashed #b8d4c4', borderRadius: '20px',
          padding: '60px 40px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '20px', color: '#1a6b3c', marginBottom: '8px', fontWeight: 700 }}>Demo Video Coming Soon</div>
          <div style={{ fontSize: '13px', color: '#5a7a66', marginBottom: '24px' }}>Record a short screen recording and place it here as demo.mp4</div>
          <div style={{ fontSize: '12px', color: '#b8d4c4', fontFamily: 'monospace', background: '#fff', padding: '8px 16px', borderRadius: '8px', display: 'inline-block' }}>
            Place your video at: frontend/public/demo.mp4
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: '#f0faf4', padding: '64px 40px', borderTop: '1.5px solid var(--border)', borderBottom: '1.5px solid var(--border)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>How FixMyCity Works</h2>
          <p style={{ textAlign: 'center', color: '#5a7a66', fontSize: '14px', marginBottom: '36px' }}>Simple, fast, and powered by AI</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { icon: '📸', step: '1', title: 'Take a photo', desc: 'Photograph the civic issue — pothole, garbage, broken light', color: '#16a34a' },
              { icon: '🤖', step: '2', title: 'AI classifies it', desc: 'AI identifies issue type and assigns urgency 1–10 automatically', color: '#0284c7' },
              { icon: '🗺', step: '3', title: 'Pinned on map', desc: 'Issue appears on the city map for all citizens to upvote', color: '#7c3aed' },
              { icon: '🏛', step: '4', title: 'Authority alerted', desc: 'Responsible department identified with contact details', color: '#d97706' },
            ].map(s => (
              <div key={s.step} style={{
                background: '#fff', border: '1.5px solid var(--border)',
                borderRadius: '16px', padding: '24px', textAlign: 'center',
                boxShadow: 'var(--shadow-sm)', transition: 'all 0.25s',
                borderTop: `3px solid ${s.color}`,
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
              >
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{s.icon}</div>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: s.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>{s.step}</div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '14px', marginBottom: '8px', color: s.color }}>{s.title}</div>
                <div style={{ fontSize: '12px', color: '#5a7a66', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI section */}
      <div style={{ padding: '64px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '28px', marginBottom: '8px', textAlign: 'center' }}>🤖 AI / ML in FixMyCity</h2>
          <p style={{ textAlign: 'center', color: '#5a7a66', fontSize: '14px', marginBottom: '32px' }}>No manual categorization — AI does it all automatically</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {[
              { title: 'Image Classification', model: 'Google ViT Vision Transformer', desc: 'When a photo is uploaded, the AI model analyses it and identifies the civic issue type — pothole, garbage, flooding — without any human review.', color: '#7c3aed' },
              { title: 'Urgency Scoring', model: 'Category-based ML scoring', desc: 'Based on the issue category and AI confidence, urgency level 1–10 is automatically assigned. Street light outages = 8, Flooding = 9.', color: '#dc2626' },
              { title: 'Auto Title Generation', model: 'NLP + template mapping', desc: 'The AI suggests a human-readable issue title automatically so citizens do not need to type anything when reporting an issue.', color: '#16a34a' },
              { title: 'Authority Matching', model: 'Rule-based classification', desc: 'Based on detected issue type, the system identifies which municipal department is responsible and shows their phone and email.', color: '#0284c7' },
            ].map(ai => (
              <div key={ai.title} style={{
                background: '#fff', borderLeft: `4px solid ${ai.color}`,
                border: `1.5px solid ${ai.color}33`, borderRadius: '14px',
                padding: '20px', boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
              >
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: '#1a1a1a' }}>{ai.title}</div>
                <div style={{ fontSize: '11px', color: ai.color, fontWeight: 700, marginBottom: '10px' }}>{ai.model}</div>
                <div style={{ fontSize: '12px', color: '#5a7a66', lineHeight: 1.7 }}>{ai.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Government schemes */}
      <div style={{ background: '#f0faf4', padding: '64px 40px', borderTop: '1.5px solid var(--border)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>🏛 Government Cleanliness Initiatives</h2>
          <p style={{ textAlign: 'center', color: '#5a7a66', fontSize: '14px', marginBottom: '32px' }}>Major government programmes working to make India cleaner</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {schemes.map(s => (
              <div key={s.name} style={{
                background: '#fff', border: '1.5px solid var(--border)',
                borderRadius: '16px', overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
              >
                <div style={{ borderLeft: `4px solid ${s.color}`, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{s.icon}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>{s.name}</div>
                      <span style={{ fontSize: '11px', background: s.color + '18', color: s.color, padding: '2px 10px', borderRadius: '20px', fontWeight: 700 }}>{s.year}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#5a7a66', lineHeight: 1.8 }}>{s.article}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div style={{ padding: '64px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>💡 Cleanliness Awareness Tips</h2>
          <p style={{ textAlign: 'center', color: '#5a7a66', fontSize: '14px', marginBottom: '32px' }}>Simple actions that make a big difference</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
            {tips.map((t, i) => (
              <div key={i} style={{
                background: '#fff', border: '1.5px solid var(--border)',
                borderRadius: '14px', padding: '16px',
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#25a85a'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
              >
                <span style={{ fontSize: '22px', flexShrink: 0 }}>{t.icon}</span>
                <span style={{ fontSize: '13px', color: '#5a7a66', lineHeight: 1.6 }}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #1a6b3c 0%, #25a85a 100%)',
        padding: '60px 40px', textAlign: 'center',
      }}>
        <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '28px', marginBottom: '12px', color: '#fff' }}>Ready to make your city better?</h3>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', marginBottom: '28px' }}>Join thousands of citizens already reporting issues</p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onCitizenLogin} style={{
            background: '#fff', color: '#1a6b3c', padding: '14px 32px',
            borderRadius: '12px', fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >Get Started — It's Free 🌿</button>
          <button onClick={onAdminLogin} style={{
            background: 'rgba(255,255,255,0.15)', color: '#fff',
            padding: '14px 32px', borderRadius: '12px',
            fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '16px',
            border: '2px solid rgba(255,255,255,0.4)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >Municipal Officer? Login here</button>
        </div>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '24px' }}>FixMyCity — BTech CSE Final Year Project · Built with React, Python Flask, and AI/ML</p>
      </div>
    </div>
  )
}
