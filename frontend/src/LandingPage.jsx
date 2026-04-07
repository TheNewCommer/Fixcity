export default function LandingPage({ onCitizenLogin, onAdminLogin }) {
  const schemes = [
    {
      name: 'Swachh Bharat Mission',
      year: '2014 – Present',
      color: '#ff5c3a',
      article: `Launched by Prime Minister Narendra Modi on 2nd October 2014, Swachh Bharat Mission is India's largest ever cleanliness campaign. The mission aimed to make India Open Defecation Free (ODF) by constructing over 10 crore household toilets across rural and urban areas. As of 2023, over 4,500 cities have been declared ODF and more than 70,000 tonnes of solid waste is now being processed daily. The urban component — Swachh Bharat Mission (Urban) — focuses on eliminating open defecation, eradicating manual scavenging, and scientific municipal solid waste management. The mission also introduced Swachhata rankings for cities, motivating local bodies to improve their cleanliness scores every year.`,
    },
    {
      name: 'Smart Cities Mission',
      year: '2015 – Present',
      color: '#3a9cff',
      article: `The Smart Cities Mission was launched in June 2015 with the goal of developing 100 cities into smart, sustainable urban centres. Under this mission, cities deploy technology-driven solutions for waste management including IoT-enabled garbage bins that alert sanitation workers when full, GPS-tracked garbage collection vehicles, and sensor-based water leak detection systems. The mission has invested over ₹2 lakh crore in urban infrastructure. Cities like Surat, Indore, Pune, and Bhopal have emerged as leaders, with Indore winning India's cleanest city award for 7 consecutive years due to its smart waste segregation and door-to-door collection system.`,
    },
    {
      name: 'AMRUT 2.0',
      year: '2021 – Present',
      color: '#2fd180',
      article: `Atal Mission for Rejuvenation and Urban Transformation (AMRUT) 2.0 was launched with a budget of ₹2.77 lakh crore to make 500 Indian cities water-secure and clean. The mission focuses on providing 100% coverage of water supply to all households, sewerage and septage management, rejuvenation of water bodies, and creating green spaces and parks. AMRUT 2.0 introduces a circular economy for used water — treated wastewater is reused for industrial purposes and agriculture. The mission directly impacts urban cleanliness by ensuring proper drainage which prevents waterlogging and disease outbreaks in cities.`,
    },
    {
      name: 'National Clean Air Programme',
      year: '2019 – Present',
      color: '#ffa45c',
      article: `The National Clean Air Programme (NCAP) was launched in January 2019 with an ambitious target to reduce Particulate Matter (PM2.5 and PM10) pollution by 40% by 2026 across 132 non-attainment cities. The programme funds city-level action plans including mechanised road sweeping, dust control on construction sites, real-time air quality monitoring stations, and crackdown on waste burning. Cities receive funds based on their performance in reducing pollution levels. Municipal corporations are required to deploy mechanised sweeping machines, sprinklers, and anti-smog guns in high-traffic areas as part of the programme.`,
    },
    {
      name: 'Namami Gange',
      year: '2015 – Present',
      color: '#a78bfa',
      article: `Namami Gange is an integrated conservation mission approved by the Union Government with a budget of ₹20,000 crore to accomplish the twin objectives of effective abatement of pollution and conservation of the national river Ganga. The programme covers sewage treatment plants construction, river-front development, real-time water quality monitoring, afforestation of the river banks, and elimination of industrial effluent discharge. Over 180 sewage treatment plants with a capacity of 5,000+ MLD have been sanctioned. The programme has significantly improved the Biological Oxygen Demand (BOD) levels at key monitoring stations along the Ganga.`,
    },
    {
      name: 'PM SVANidhi',
      year: '2020 – Present',
      color: '#34d399',
      article: `PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi) was launched in June 2020 to provide affordable loans to street vendors whose livelihoods were adversely affected due to COVID-19. The scheme also aims to bring street vending into an organised, regulated framework — creating dedicated vending zones that are clean, hygienic, and well-maintained. Over 50 lakh street vendors have been issued certificates of vending under the scheme. Organised vending zones reduce garbage accumulation in unplanned areas and contribute directly to urban cleanliness. Vendors who maintain clean zones receive recognition and priority for loan enhancement.`,
    },
  ]

  const tips = [
    { icon: '♻️', text: 'Always segregate dry and wet waste before handing to collection vehicles.' },
    { icon: '🚰', text: 'Report water pipeline leaks immediately — a single leak wastes over 1000 litres daily.' },
    { icon: '💡', text: 'Report broken streetlights to keep roads safe at night for pedestrians and vehicles.' },
    { icon: '🌳', text: 'Never dump garbage near trees, water bodies, or open drains.' },
    { icon: '📱', text: 'Use FixMyCity to report issues — your report directly reaches the responsible authority.' },
    { icon: '👥', text: 'Encourage your neighbours to upvote issues — more upvotes means faster government response.' },
    { icon: '🏠', text: 'Participate in your ward\'s monthly cleanliness drives organised by the municipal corporation.' },
    { icon: '🚯', text: 'Never litter in public — ₹500 fine is applicable under Solid Waste Management Rules 2016.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowY: 'auto' }}>

      {/* Hero */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '60px 24px 50px', textAlign: 'center' }}>
        <div style={{
          width: 68, height: 68, borderRadius: '18px', background: 'var(--accent)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '32px', color: '#fff', marginBottom: '20px',
        }}>F</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '40px', fontWeight: 800, margin: '0 0 12px' }}>
          Fix<span style={{ color: 'var(--accent)' }}>My</span>City
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--muted)', maxWidth: '500px', margin: '0 auto 36px', lineHeight: 1.7 }}>
          Report civic issues in your city. AI automatically classifies your photo and identifies the responsible authority. Together we build a cleaner, safer India.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onCitizenLogin} style={{
            background: 'var(--accent)', color: '#fff', padding: '14px 36px',
            borderRadius: '12px', fontFamily: 'var(--font-head)', fontWeight: 700,
            fontSize: '16px', border: 'none',
          }}>🏘 Citizen — Login / Register</button>
          <button onClick={onAdminLogin} style={{
            background: 'var(--bg3)', color: 'var(--text)', padding: '14px 36px',
            borderRadius: '12px', fontFamily: 'var(--font-head)', fontWeight: 700,
            fontSize: '16px', border: '1px solid var(--border)',
          }}>⚙ Municipal Officer Login</button>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: '48px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '24px', textAlign: 'center', marginBottom: '28px' }}>How FixMyCity Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          {[
            { icon: '📸', step: '1', title: 'Take a photo', desc: 'Photograph the civic issue — pothole, garbage, broken light' },
            { icon: '🤖', step: '2', title: 'AI classifies it', desc: 'AI model identifies issue type and assigns urgency 1–10 automatically' },
            { icon: '🗺', step: '3', title: 'Pinned on map', desc: 'Issue appears on the city map for all citizens to see and upvote' },
            { icon: '🏛', step: '4', title: 'Authority alerted', desc: 'Responsible municipal department is identified with contact info' },
          ].map(s => (
            <div key={s.step} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>{s.icon}</div>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{s.step}</div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>{s.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI section */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '24px', marginBottom: '8px', textAlign: 'center' }}>🤖 AI / ML Used in This Project</h2>
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px', marginBottom: '28px' }}>No manual categorization — AI does it automatically</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {[
              { title: 'Image Classification', model: 'Google ViT (Vision Transformer)', desc: 'When a photo is uploaded, the AI model analyses it and identifies the civic issue type — pothole, garbage, flooding — without any human review.', color: '#a78bfa' },
              { title: 'Urgency Scoring', model: 'Category-based ML scoring', desc: 'Based on the issue category and AI confidence score, an urgency level from 1–10 is automatically assigned. Street light outages = 8, Flooding = 9.', color: '#ff5c3a' },
              { title: 'Auto Title Generation', model: 'NLP + template mapping', desc: 'The AI suggests a human-readable issue title automatically so citizens do not need to type anything when reporting.', color: '#2fd180' },
              { title: 'Authority Matching', model: 'Rule-based classification', desc: 'Based on the detected issue type, the system identifies which municipal department is responsible and shows their phone and email.', color: '#3a9cff' },
            ].map(ai => (
              <div key={ai.title} style={{ background: 'var(--bg3)', borderLeft: `3px solid ${ai.color}`, borderRadius: 'var(--radius-lg)', padding: '16px' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{ai.title}</div>
                <div style={{ fontSize: '11px', color: ai.color, fontWeight: 600, marginBottom: '8px' }}>{ai.model}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>{ai.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Government schemes */}
      <div style={{ padding: '48px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '24px', textAlign: 'center', marginBottom: '8px' }}>🏛 Government Cleanliness Initiatives</h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px', marginBottom: '28px' }}>Major government programmes working to make India cleaner</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {schemes.map(s => (
            <div key={s.name} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ borderLeft: `4px solid ${s.color}`, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px' }}>{s.name}</div>
                  <span style={{ fontSize: '11px', background: s.color + '22', color: s.color, padding: '2px 10px', borderRadius: '20px', fontWeight: 600 }}>{s.year}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.8 }}>{s.article}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Awareness tips */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '24px', textAlign: 'center', marginBottom: '28px' }}>💡 Cleanliness Awareness Tips</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {tips.map((t, i) => (
              <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{t.icon}</span>
                <span style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '36px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          <button onClick={onCitizenLogin} style={{ background: 'var(--accent)', color: '#fff', padding: '12px 28px', borderRadius: '10px', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', border: 'none' }}>Get Started — It's Free</button>
          <button onClick={onAdminLogin} style={{ background: 'transparent', color: 'var(--muted)', padding: '12px 28px', borderRadius: '10px', fontSize: '14px', border: '1px solid var(--border)' }}>Municipal Officer? Login here</button>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--muted)' }}>FixMyCity — BTech CSE Final Year Project · Built with React, Python Flask, and AI/ML</p>
      </div>
    </div>
  )
}
