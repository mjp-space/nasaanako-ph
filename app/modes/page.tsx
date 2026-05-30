'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

const MODES = [
  { id: 'lakbay',    icon: '🗺️', name: 'Lakbay',    desc: 'Drop anywhere in the Philippines. Classic mode — no hints, pure instinct.', active: true },
  { id: 'pamana',    icon: '🏛️', name: 'Pamana',    desc: 'Historical landmarks, heritage sites, and cultural treasures across the archipelago.', active: false },
  { id: 'kalikasan', icon: '🌊', name: 'Kalikasan', desc: 'Rivers, mountains, flood control projects, and natural wonders of the Philippines.', active: false },
  { id: 'sikat',     icon: '⭐', name: 'Sikat',     desc: 'Birthplaces of celebrities, presidents, and national heroes.', active: false },
]

export default function ModesPage() {
  const router = useRouter()
  const [wiggle, setWiggle] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const pinRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    pinRef.current = new Audio('/audio/map pin effect.mp3')
    pinRef.current.volume = 0.7
  }, [])

  function playPin() {
    try { if (pinRef.current) { pinRef.current.currentTime = 0; pinRef.current.play().catch(() => {}) } } catch {}
  }

  function showToast(msg: string) {
    setToast(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }

  function selectMode(mode: typeof MODES[0]) {
    playPin()
    if (mode.active) {
      setTimeout(() => router.push('/play'), 180)
      return
    }
    setWiggle(mode.id)
    setTimeout(() => setWiggle(null), 500)
    showToast(`${mode.icon} ${mode.name} mode is coming soon!`)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'Segoe UI, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 52, background: 'rgba(15,17,23,0.95)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(10px)' }}>
        <div onClick={() => router.push('/')} style={{ fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer' }}>
          Nasaan<span style={{ color: 'var(--accent)' }}>Ako</span>.ph
        </div>
        <button onClick={() => router.push('/')} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', color: 'var(--muted)', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}>
          ← Home
        </button>
      </nav>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(245,197,66,0.06), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 3, color: 'var(--muted)', marginBottom: 10 }}>Choose Your Adventure</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', fontWeight: 900, letterSpacing: '-1px' }}>
            Anong <span style={{ color: 'var(--accent)' }}>mode</span>?
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: 8 }}>Pick a challenge and test your knowledge of the Philippines.</p>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 480 }}>
          {MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => selectMode(mode)}
              style={{
                display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px',
                background: mode.active ? 'rgba(245,197,66,0.06)' : 'var(--surface)',
                border: `1.5px solid ${mode.active ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 18, cursor: mode.active ? 'pointer' : 'not-allowed',
                opacity: mode.active ? 1 : 0.45, filter: mode.active ? 'none' : 'grayscale(0.3)',
                textAlign: 'left', width: '100%', fontFamily: 'inherit', color: 'var(--text)',
                animation: wiggle === mode.id ? 'wiggle 0.5s ease' : 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <div style={{ fontSize: '2.2rem', flexShrink: 0 }}>{mode.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: mode.active ? 'var(--accent)' : 'var(--text)', marginBottom: 3 }}>{mode.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.4 }}>{mode.desc}</div>
              </div>
              <span style={{ flexShrink: 0, fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, padding: '4px 10px', borderRadius: 20, background: mode.active ? 'rgba(74,222,128,0.12)' : 'rgba(107,114,128,0.15)', border: `1px solid ${mode.active ? 'rgba(74,222,128,0.3)' : 'rgba(107,114,128,0.2)'}`, color: mode.active ? 'var(--accent2)' : 'var(--muted)' }}>
                {mode.active ? 'Live' : 'Soon'}
              </span>
            </button>
          ))}
        </div>
      </main>

      {/* Toast */}
      <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: `translateX(-50%) translateY(${toastVisible ? 0 : 80}px)`, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 24px', fontSize: '0.88rem', fontWeight: 600, zIndex: 999, transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)', opacity: toastVisible ? 1 : 0, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
        {toast}
      </div>

      <style>{`
        @keyframes wiggle {
          0%,100% { transform: translateX(0); }
          15% { transform: translateX(-6px); }
          30% { transform: translateX(6px); }
          45% { transform: translateX(-4px); }
          60% { transform: translateX(4px); }
          75% { transform: translateX(-2px); }
          90% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  )
}
