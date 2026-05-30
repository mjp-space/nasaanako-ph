'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getLeaderboard } from '../lib/supabase'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [playerCount, setPlayerCount] = useState<number | null>(null)
  const [visitorCount, setVisitorCount] = useState<number | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({ data }) => setProfile(data))
      }
    })
    getLeaderboard().then(data => setLeaderboard(data.filter((p: any) => (p.total_score || 0) > 0)))
    supabase.from('profiles').select('*', { count: 'exact', head: true }).then(({ count }) => setPlayerCount(count))

    // Track unique visitor via localStorage fingerprint
    let vid = localStorage.getItem('nasaanako_vid')
    if (!vid) {
      vid = Math.random().toString(36).slice(2) + Date.now().toString(36)
      localStorage.setItem('nasaanako_vid', vid)
    }
    supabase.from('visitors').upsert({ id: vid, last_seen: new Date().toISOString() }, { onConflict: 'id' }).then(() => {
      supabase.from('visitors').select('*', { count: 'exact', head: true }).then(({ count }) => setVisitorCount(count))
    })
  }, [])

  const MOCK_LB = [
    { rank: 1, display_name: 'Juan dela Cruz', username: 'juandelaCruz', tier: 'Pusang Gala',    total_score: 24850, games_played: 12 },
    { rank: 2, display_name: 'Maria Santiago',  username: 'mariasantiago', tier: 'Lagalag',        total_score: 23100, games_played: 9  },
    { rank: 3, display_name: 'Pepe Reyes',      username: 'pepereyes',     tier: 'Chill Traveler', total_score: 21400, games_played: 7  },
  ]

  const displayLB = leaderboard.length > 0 ? leaderboard : MOCK_LB

  const medals = ['🥇', '🥈', '🥉', '4', '5', '6', '7', '8', '9', '10']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'Segoe UI, system-ui, sans-serif' }}>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 56, background: 'rgba(15,17,23,0.95)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(10px)', zIndex: 200 }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.5px', flexShrink: 0 }}>
          Nasaan<span style={{ color: 'var(--accent)' }}>Ako</span>.ph
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          {user ? (
            <>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'none' } as any} className="hide-mobile">
                Hi, <strong style={{ color: 'var(--accent)' }}>{profile?.display_name || 'Player'}</strong>
              </span>
              <button onClick={() => router.push('/modes')} style={{ background: 'var(--accent)', color: '#0f1117', border: 'none', padding: '8px 16px', borderRadius: 24, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                ▶ Play
              </button>
              <button onClick={async () => { await supabase.auth.signOut(); setUser(null); setProfile(null) }} style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: 24, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => router.push('/auth')} style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', padding: '8px 14px', borderRadius: 24, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                Log In
              </button>
              <button onClick={() => router.push('/auth?tab=signup')} style={{ background: 'var(--accent)', color: '#0f1117', border: 'none', padding: '8px 14px', borderRadius: 24, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <div style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(245,197,66,0.07), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,197,66,0.1)', border: '1px solid rgba(245,197,66,0.25)', borderRadius: 24, padding: '6px 18px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 24 }}>
          🇵🇭 Philippines Only · Free to Play
        </div>

        <h1 style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(3.5rem, 10vw, 7rem)', fontWeight: 900, letterSpacing: '-3px', lineHeight: 1, marginBottom: 16 }}>
          Nasaan<span style={{ color: 'var(--accent)' }}>Ako</span>.ph
        </h1>

        <p style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'var(--muted)', marginBottom: 48, maxWidth: 500, lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text)' }}>Drop anywhere in the Philippines.</strong><br />
          Guess where you are. Compete with the nation.
        </p>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }}>
          <button onClick={() => router.push('/modes')} style={{ background: 'var(--accent)', color: '#0f1117', border: 'none', padding: '18px 56px', borderRadius: 36, fontWeight: 900, fontSize: '1.3rem', cursor: 'pointer', boxShadow: '0 8px 32px rgba(245,197,66,0.35)' }}>
            ▶ Play Now — It's Free
          </button>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 48, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['500+', 'PH Locations'], ['81', 'Provinces'], ['Free', 'Always'], [playerCount !== null ? playerCount.toLocaleString() : '—', 'Players']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent)' }}>{val}</div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1, color: 'var(--muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW TO PLAY */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 3, color: 'var(--accent)', marginBottom: 12 }}>🇵🇭 Panuto / How It Works</div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, marginBottom: 8, letterSpacing: '-0.5px' }}>Tatlong hakbang lang.</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 40 }}>Hindi kailangan ng experience. Instinct mo na bahala.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {[
            { icon: '🎬', title: 'Drop',    desc: 'You will be dropped randomly anywhere in the Philippines.' },
            { icon: '🗺️', title: 'Observe', desc: 'Gamitin ang Street View, basahin ang mga signs, at i-pin ang hula mong lokasyon sa mapa.' },
            { icon: '🏆', title: 'Compete', desc: 'Earn points based on how close your guess is. Climb the leaderboards and enjoy!' },
          ].map((step, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'rgba(245,197,66,0.08)', position: 'absolute', top: 10, right: 14, lineHeight: 1 }}>{i + 1}</div>
              <div style={{ fontSize: '2rem', marginBottom: 14 }}>{step.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{step.title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LEADERBOARD */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 3, color: 'var(--accent)', marginBottom: 12 }}>The Wanderer Tier List</div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, marginBottom: 8, letterSpacing: '-0.5px' }}>Top Players</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 40 }}>Sino ang pinaka-maalam sa Pilipinas?</p>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 800 }}>🏆 All-Time Top 10</div>
            {leaderboard.length === 0 && <div style={{ fontSize: '0.7rem', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: 'var(--accent2)', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>Sample Data</div>}
          </div>
          {displayLB.map((p: any, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ width: 28, textAlign: 'center', fontWeight: 800, fontSize: '1rem' }}>{medals[i]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{p.display_name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{p.tier}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, color: 'var(--accent2)' }}>{p.total_score?.toLocaleString()}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>{p.games_played || 0} rounds</div>
              </div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div style={{ textAlign: 'center', padding: 14, fontSize: '0.75rem', color: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
              Sample data · Play and sign in to appear on the real leaderboard
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: 32, textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: 8 }}>
          Nasaan<span style={{ color: 'var(--accent)' }}>Ako</span>.ph
        </div>
        <p>A love letter to the Philippines 🇵🇭</p>
        <p style={{ marginTop: 6, opacity: 0.5 }}>© 2026 NasaanAko.ph · Built with love in PH</p>
      </footer>
    </div>
  )
}
