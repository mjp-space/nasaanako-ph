'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signUp, signIn } from '../../lib/supabase'

function AuthContent() {
  const router = useRouter()
  const params = useSearchParams()
  const [tab, setTab] = useState<'login' | 'signup'>(params.get('tab') === 'signup' ? 'signup' : 'login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Sign up state
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Login state
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  async function handleSignup() {
    setError('')
    if (!displayName.trim()) return setError('Enter your display name.')
    if (!username.trim() || username.length < 3) return setError('Username must be at least 3 characters.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')

    setLoading(true)
    try {
      await signUp(username.trim(), displayName.trim(), password)
      router.push('/modes')
    } catch (e: any) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin() {
    setError('')
    if (!loginUsername.trim()) return setError('Enter your username.')
    if (!loginPassword) return setError('Enter your password.')

    setLoading(true)
    try {
      await signIn(loginUsername.trim(), loginPassword)
      router.push('/modes')
    } catch (e: any) {
      setError('Wrong username or password.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '11px 14px',
    color: 'var(--text)',
    fontSize: '0.92rem',
    outline: 'none',
    fontFamily: 'inherit',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.72rem',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    color: 'var(--muted)',
    marginBottom: 6,
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg)' }}>

      {/* Logo */}
      <div onClick={() => router.push('/')} style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 32, cursor: 'pointer' }}>
        Nasaan<span style={{ color: 'var(--accent)' }}>Ako</span>.ph
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 400 }}>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {(['signup', 'login'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setError('') }} style={{ flex: 1, padding: '8px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', border: 'none', background: tab === t ? 'var(--accent)' : 'transparent', color: tab === t ? '#0f1117' : 'var(--muted)', fontFamily: 'inherit' }}>
              {t === 'signup' ? 'Sign Up' : 'Log In'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: '0.82rem', color: '#f87171', marginBottom: 14 }}>
            {error}
          </div>
        )}

        {tab === 'signup' ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Display Name</label>
                <input style={inputStyle} placeholder="Juan Dela Cruz" value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={32} autoComplete="off" />
              </div>
              <div>
                <label style={labelStyle}>Username</label>
                <input style={inputStyle} placeholder="juandelacruz123" value={username} onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} maxLength={20} autoComplete="off" />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Password</label>
              <input style={inputStyle} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSignup()} autoComplete="new-password" />
            </div>
            <button onClick={handleSignup} disabled={loading} style={{ width: '100%', padding: 13, borderRadius: 12, border: 'none', background: 'var(--accent)', color: '#0f1117', fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Username</label>
              <input style={inputStyle} placeholder="markjude" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Password</label>
              <input style={inputStyle} type="password" placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: 13, borderRadius: 12, border: 'none', background: 'var(--accent)', color: '#0f1117', fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}>
              {loading ? 'Logging in...' : 'Log In →'}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0', color: 'var(--muted)', fontSize: '0.75rem' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          or
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <button onClick={() => router.push('/modes')} style={{ width: '100%', padding: 11, borderRadius: 12, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          👤 Continue as Guest
        </button>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  )
}
