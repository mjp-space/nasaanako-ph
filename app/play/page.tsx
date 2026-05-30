'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, saveGame, getProfile, signUp, signIn } from '../../lib/supabase'
import { LOCATIONS, getDailyLocations } from '../../lib/locations'

const PH_ANIMALS = ['Tamaraw', 'Tarsier', 'Bayawak', 'Kalapati', 'Pawikan', 'Agila', 'Kalabaw', 'Baboy', 'Itik', 'Maya', 'Butiki', 'Pugita', 'Bangus', 'Tilapia', 'Dalag', 'Uwak', 'Lawin', 'Kabayo', 'Buwaya', 'Kambing']

function randomGuestName() {
  const animal = PH_ANIMALS[Math.floor(Math.random() * PH_ANIMALS.length)]
  const num = Math.floor(1000 + Math.random() * 9000)
  return `${animal}#${num}`
}

declare global {
  interface Window { google: any; initMap: () => void }
}

const TOTAL_ROUNDS = 5
const ROUND_TIME   = 60
const PH_BOUNDS    = { minLat: 4.5, maxLat: 21.5, minLng: 116.0, maxLng: 127.5 }

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function calcScore(distKm: number) {
  return Math.round(Math.min(5000, Math.max(0, 5000 * Math.pow(Math.max(0, 1 - distKm/400), 2))))
}

function scoreLabel(pts: number) {
  if (pts === 5000) return { icon: '🎯', label: 'Bullseye!',  color: '#4ade80' }
  if (pts >= 4000)  return { icon: '🔥', label: 'So Close!',  color: '#4ade80' }
  if (pts >= 3000)  return { icon: '✅', label: 'Nice Shot!', color: '#a3e635' }
  if (pts >= 2000)  return { icon: '👍', label: 'Not Bad',    color: '#facc15' }
  if (pts >= 1000)  return { icon: '😐', label: 'Far Off',    color: '#fb923c' }
  if (pts > 0)      return { icon: '😬', label: 'Way Off',    color: '#f87171' }
  return               { icon: '🚫', label: 'Outside PH!', color: '#f87171' }
}

export default function PlayPage() {
  const router = useRouter()
  const streetViewRef  = useRef<HTMLDivElement>(null)
  const guessMapRef    = useRef<HTMLDivElement>(null)
  const resultMapRef   = useRef<HTMLDivElement>(null)
  const svPanoRef      = useRef<any>(null)
  const guessMapObjRef = useRef<any>(null)
  const guessMarkerRef = useRef<any>(null)
  const timerRef       = useRef<NodeJS.Timeout | null>(null)
  const bgMusicRef     = useRef<HTMLAudioElement | null>(null)
  const nextLocRef     = useRef<any>(null)

  const [mapsLoaded, setMapsLoaded]     = useState(false)
  const [svLoading, setSvLoading]       = useState(true)
  const [round, setRound]               = useState(0)
  const [totalScore, setTotalScore]     = useState(0)
  const [isFreePlay, setIsFreePlay]     = useState(false)
  const [roundLocations, setRoundLocations] = useState<any[]>([])
  const [currentLoc, setCurrentLoc]     = useState<any>(null)
  const [lbVisible, setLbVisible]       = useState(false)
  const [lbData, setLbData]             = useState<any[]>([])
  const [isDaily, setIsDaily]           = useState(true)
  const dailyLocs                       = useRef<any[]>(getDailyLocations(5))
  const [guessPlaced, setGuessPlaced]   = useState(false)
  const [timeLeft, setTimeLeft]         = useState(ROUND_TIME)
  const [timeLocked, setTimeLocked]     = useState(false)
  const [muted, setMuted]               = useState(false)
  const [phase, setPhase]               = useState<'playing' | 'result' | 'final'>('playing')
  const [roundResult, setRoundResult]   = useState<any>(null)
  const [roundDistances, setRoundDistances] = useState<number[]>([])
  const [user, setUser]                 = useState<any>(null)
  const [profile, setProfile]           = useState<any>(null)
  const [guestName]                     = useState(() => randomGuestName())
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authTab, setAuthTab]           = useState<'login'|'signup'>('signup')
  const [authLoading, setAuthLoading]   = useState(false)
  const [authError, setAuthError]       = useState('')
  const [authDisplay, setAuthDisplay]   = useState('')
  const [authUsername, setAuthUsername] = useState('')
  const [authPassword, setAuthPassword] = useState('')

  // Audio
  const sfx = useRef<Record<string, HTMLAudioElement>>({})

  useEffect(() => {
    const files = { pin: 'map pin effect', good: 'good score effect', bad: 'bad score effect', perfect: 'perfect 5000 score', start: 'round start effect' }
    Object.entries(files).forEach(([k, v]) => {
      sfx.current[k] = new Audio(`/audio/${v}.mp3`)
      sfx.current[k].volume = 0.7
    })
    bgMusicRef.current = new Audio('/audio/background music.mp3')
    bgMusicRef.current.loop = true
    bgMusicRef.current.volume = 0.5

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        const { data } = await supabase.from('profiles').select('*').eq('id', u.id).single()
        setProfile(data)
      }
    })

    // Load top 3 for in-game leaderboard widget (only players with a real score)
    supabase.from('leaderboard').select('*').order('rank', { ascending: true }).gt('total_score', 0).limit(3)
      .then(({ data }) => { if (data && data.length > 0) setLbData(data) })


    return () => {
      bgMusicRef.current?.pause()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  function playFX(name: string) {
    try { sfx.current[name].currentTime = 0; sfx.current[name].play().catch(() => {}) } catch {}
  }

  function startMusic() {
    bgMusicRef.current?.play().catch(() => {})
  }

  // Load Google Maps
  useEffect(() => {
    if (window.google?.maps) { setMapsLoaded(true); return }
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Script already in DOM (e.g. navigated back) — wait for it
      const poll = setInterval(() => {
        if (window.google?.maps) { setMapsLoaded(true); clearInterval(poll) }
      }, 100)
      return () => clearInterval(poll)
    }
    window.initMap = () => setMapsLoaded(true)
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&callback=initMap`
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [])

  // Init guess map when Maps loaded
  useEffect(() => {
    if (!mapsLoaded || !guessMapRef.current || guessMapObjRef.current) return
    // Small delay so the flex container has painted and has real dimensions
    const t = setTimeout(() => {

      if (!guessMapRef.current || guessMapObjRef.current) return
      const phBounds = new window.google.maps.LatLngBounds(
        { lat: 4.5, lng: 116.0 },  // SW corner
        { lat: 21.5, lng: 127.5 }  // NE corner
      )
      const map = new window.google.maps.Map(guessMapRef.current, {
        center: { lat: 12.5, lng: 122.5 },
        zoom: 5,
        minZoom: 5,
        mapTypeId: 'roadmap',
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy',
        restriction: {
          latLngBounds: phBounds,
          strictBounds: false,
        },
        styles: [{ elementType: 'geometry', stylers: [{ color: '#1a1d27' }] }, { elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] }, { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f1117' }] }],
      })
      // Fit the whole Philippines on load
      map.fitBounds(phBounds)
      guessMapObjRef.current = map
      // Force resize in case container dimensions settled after init
      window.google.maps.event.trigger(map, 'resize')
      map.addListener('click', (e: any) => {
      const latlng = e.latLng
      if (guessMarkerRef.current) guessMarkerRef.current.setMap(null)
      guessMarkerRef.current = new window.google.maps.Marker({
        position: latlng,
        map,
        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: '#f5c542', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 }
      })
      setGuessPlaced(true)
      playFX('pin')
    })
    }, 300)
    return () => clearTimeout(t)
  }, [mapsLoaded])

  function refreshLb() {
    supabase.from('leaderboard').select('*').order('rank', { ascending: true }).gt('total_score', 0).limit(3)
      .then(({ data }) => { if (data && data.length > 0) setLbData(data) })
  }

  // Preload first location as soon as Maps API is ready
  useEffect(() => {
    if (mapsLoaded) preloadNextLocation([])
  }, [mapsLoaded])

  // Resize guess map when ticker appears/disappears
  useEffect(() => {
    if (guessMapObjRef.current && window.google?.maps) {
      setTimeout(() => window.google.maps.event.trigger(guessMapObjRef.current, 'resize'), 50)
    }
  }, [lbData])

  // Start first round
  useEffect(() => {
    if (mapsLoaded) startRound(0, [])
  }, [mapsLoaded])

  function startRound(currentRound: number, usedLocs: any[]) {
    setPhase('playing')
    setGuessPlaced(false)
    setTimeLocked(false)
    if (guessMarkerRef.current) { guessMarkerRef.current.setMap(null); guessMarkerRef.current = null }

    // Use preloaded location if available, otherwise pick random
    const available = LOCATIONS.filter(l => !usedLocs.includes(l))
    const loc = (nextLocRef.current && !usedLocs.includes(nextLocRef.current))
      ? nextLocRef.current
      : available[Math.floor(Math.random() * available.length)]
    nextLocRef.current = null
    setCurrentLoc(loc)
    setRoundLocations(prev => [...prev, loc])

    // Load Street View — with fallback if no imagery exists
    if (streetViewRef.current && window.google?.maps) {
      const sv = new window.google.maps.StreetViewService()
      sv.getPanorama({ location: { lat: loc.lat, lng: loc.lng }, radius: 1000 }, (data: any, status: any) => {
        if (status === 'OK') {
          setSvLoading(true)
          svPanoRef.current = new window.google.maps.StreetViewPanorama(streetViewRef.current!, {
            position: { lat: loc.lat, lng: loc.lng },
            pov: { heading: Math.random() * 360, pitch: 0 },
            zoom: 1,
            addressControl: false,
            showRoadLabels: false,
            fullscreenControl: false,
            motionTracking: false,
            motionTrackingControl: false,
          })
          svPanoRef.current.addListener('status_changed', () => {
            if (svPanoRef.current?.getStatus() === 'OK') setSvLoading(false)
          })
          // Fallback: if Street View doesn't load in 8s, skip to next location
          const svTimeout = setTimeout(() => {
            if (svPanoRef.current?.getStatus() !== 'OK') {
              const next = LOCATIONS.filter(l => ![...usedLocs, loc].includes(l))[
                Math.floor(Math.random() * LOCATIONS.filter(l => ![...usedLocs, loc].includes(l)).length)
              ]
              if (next) startRound(currentRound, [...usedLocs, loc])
            }
          }, 8000)
        } else {
          // No Street View coverage — silently skip to a new location
          const nextLoc = LOCATIONS.filter(l => ![...usedLocs, loc].includes(l))[
            Math.floor(Math.random() * LOCATIONS.filter(l => ![...usedLocs, loc].includes(l)).length)
          ]
          if (nextLoc) {
            setCurrentLoc(nextLoc)
            setRoundLocations(prev => [...prev.slice(0, -1), nextLoc])
            sv.getPanorama({ location: { lat: nextLoc.lat, lng: nextLoc.lng }, radius: 1000 }, (d2: any, s2: any) => {
              if (s2 === 'OK') {
                svPanoRef.current = new window.google.maps.StreetViewPanorama(streetViewRef.current!, {
                  position: { lat: nextLoc.lat, lng: nextLoc.lng },
                  pov: { heading: Math.random() * 360, pitch: 0 },
                  zoom: 1,
                  addressControl: false,
                  showRoadLabels: false,
                  fullscreenControl: false,
                  motionTracking: false,
                  motionTrackingControl: false,
                })
              }
            })
          }
        }
      })
    }

    // Start timer
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeLeft(ROUND_TIME)
    let t = ROUND_TIME
    timerRef.current = setInterval(() => {
      t--
      setTimeLeft(t)
      if (t <= 0) {
        if (timerRef.current) clearInterval(timerRef.current)
        // If Street View still hasn't loaded, auto-refresh to a new location
        if (svPanoRef.current?.getStatus() !== 'OK') {
          refreshLocation(currentRound, usedLocs)
          return
        }
        setTimeLocked(true)
        if (svPanoRef.current) svPanoRef.current.setOptions({ linksControl: false, panControl: false, zoomControl: false })
      }
    }, 1000)

    playFX('start')
    startMusic()
    setRound(currentRound)
  }

  function refreshLocation(currentRound: number, usedLocs: any[]) {
    // Pick a new random location and restart the same round
    nextLocRef.current = null
    const available = LOCATIONS.filter(l => !usedLocs.includes(l))
    const newLoc = available[Math.floor(Math.random() * available.length)]
    setCurrentLoc(newLoc)
    setSvLoading(true)
    setGuessPlaced(false)
    setTimeLocked(false)
    if (guessMarkerRef.current) { guessMarkerRef.current.setMap(null); guessMarkerRef.current = null }
    if (streetViewRef.current && window.google?.maps) {
      const sv = new window.google.maps.StreetViewService()
      sv.getPanorama({ location: { lat: newLoc.lat, lng: newLoc.lng }, radius: 1000 }, (data: any, status: any) => {
        if (status === 'OK') {
          svPanoRef.current = new window.google.maps.StreetViewPanorama(streetViewRef.current!, {
            position: { lat: newLoc.lat, lng: newLoc.lng },
            pov: { heading: Math.random() * 360, pitch: 0 },
            zoom: 1,
            addressControl: false,
            showRoadLabels: false,
            fullscreenControl: false,
            motionTracking: false,
            motionTrackingControl: false,
          })
          svPanoRef.current.addListener('status_changed', () => {
            if (svPanoRef.current?.getStatus() === 'OK') setSvLoading(false)
          })
        } else {
          // Try again with another location
          refreshLocation(currentRound, [...usedLocs, newLoc])
        }
      })
    }
    // Restart timer
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeLeft(ROUND_TIME)
    let t = ROUND_TIME
    timerRef.current = setInterval(() => {
      t--
      setTimeLeft(t)
      if (t <= 0) {
        if (timerRef.current) clearInterval(timerRef.current)
        if (svPanoRef.current?.getStatus() !== 'OK') {
          refreshLocation(currentRound, [...usedLocs, newLoc])
          return
        }
        setTimeLocked(true)
        if (svPanoRef.current) svPanoRef.current.setOptions({ linksControl: false, panControl: false, zoomControl: false })
      }
    }, 1000)
  }

  function submitGuess() {
    if (!guessMarkerRef.current || !currentLoc) return
    if (timerRef.current) clearInterval(timerRef.current)

    const pos = guessMarkerRef.current.getPosition()
    const lat  = pos.lat()
    const lng  = pos.lng()
    const outside = lat < PH_BOUNDS.minLat || lat > PH_BOUNDS.maxLat || lng < PH_BOUNDS.minLng || lng > PH_BOUNDS.maxLng
    const dist  = haversineKm(lat, lng, currentLoc.lat, currentLoc.lng)
    const pts   = outside ? 0 : calcScore(dist)
    const label = scoreLabel(pts)

    if (pts === 5000)      playFX('perfect')
    else if (pts >= 2000)  playFX('good')
    else                   playFX('bad')

    const newTotal = totalScore + pts
    const newDistances = [...roundDistances, dist]
    setTotalScore(newTotal)
    setRoundDistances(newDistances)
    setRoundResult({ pts, dist, outside, label, guessLat: lat, guessLng: lng, actualLat: currentLoc.lat, actualLng: currentLoc.lng, name: currentLoc.name, hint: currentLoc.hint })
    setPhase('result')
    setTimeLeft(0)

    // Preload next location while player reads their result
    preloadNextLocation([...roundLocations, currentLoc])

    // Save progress after every round so partial games are recorded
    if (user) {
      const avgDist = newDistances.reduce((a, b) => a + b, 0) / newDistances.length
      const accuracy = Math.round(Math.max(0, (1 - avgDist / 400)) * 100)
      saveGame(user.id, { totalScore: newTotal, roundScore: pts, roundsPlayed: round + 1, accuracy, avgDistanceKm: avgDist, mode: isFreePlay ? 'freeplay' : 'daily', isFinalRound: !isFreePlay && round + 1 >= TOTAL_ROUNDS })
        .then(async () => {
          const { data: updated } = await supabase.from('profiles').select('*').eq('id', user.id).single()
          setProfile(updated)
          refreshLb()
        }).catch(() => {})
    }

    // Geocode actual location
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${currentLoc.lat}&lon=${currentLoc.lng}&format=json&addressdetails=1`, { headers: { 'User-Agent': 'NasaanAkoPH/1.0', 'Accept-Language': 'en' } })
      .then(r => r.json())
      .then(data => {
        const a = data.address || {}
        const parts = [a.road || a.pedestrian, a.suburb || a.city_district, a.city || a.municipality, a.province || a.state].filter(Boolean)
        setRoundResult((prev: any) => ({ ...prev, fullAddress: parts.join(', ') || data.display_name?.split(',').slice(0,3).join(',') }))
      }).catch(() => {})

    // Draw result map
    setTimeout(() => {
      if (!resultMapRef.current || !window.google?.maps) return
      const map = new window.google.maps.Map(resultMapRef.current, {
        mapTypeId: 'roadmap', disableDefaultUI: true,
        styles: [{ elementType: 'geometry', stylers: [{ color: '#1a1d27' }] }, { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f1117' }] }],
      })
      const actual = new window.google.maps.LatLng(currentLoc.lat, currentLoc.lng)
      const guess  = new window.google.maps.LatLng(lat, lng)
      new window.google.maps.Marker({ position: actual, map, icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 9, fillColor: '#4ade80', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 }, title: 'Actual' })
      new window.google.maps.Marker({ position: guess,  map, icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 9, fillColor: '#f5c542', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 }, title: 'Your guess' })
      new window.google.maps.Polyline({ path: [actual, guess], geodesic: true, strokeColor: '#f5c542', strokeOpacity: 0.7, strokeWeight: 2, map })
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend(actual); bounds.extend(guess)
      map.fitBounds(bounds, 40)
    }, 100)
  }

  function preloadNextLocation(usedLocs: any[]) {
    if (!window.google?.maps) return
    const available = LOCATIONS.filter(l => !usedLocs.includes(l))
    const candidates = [...available].sort(() => Math.random() - 0.5).slice(0, 2)
    const sv = new window.google.maps.StreetViewService()
    const tryNext = (i: number) => {
      if (i >= candidates.length) return
      sv.getPanorama({ location: { lat: candidates[i].lat, lng: candidates[i].lng }, radius: 1000 }, (data: any, status: any) => {
        if (status === 'OK') nextLocRef.current = candidates[i]
        else tryNext(i + 1)
      })
    }
    tryNext(0)
  }

  function nextRound() {
    const nextRoundNum = round + 1
    if (!isFreePlay && nextRoundNum >= TOTAL_ROUNDS) {
      showFinal()
      return
    }
    startRound(nextRoundNum, roundLocations)
  }

  async function showFinal() {
    setPhase('final')
    // Score already saved per round — just refresh profile for display
    if (user) {
      try {
        const { data: updated } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(updated)
      } catch {}
    }
  }

  async function handleInlineAuth() {
    setAuthError('')
    setAuthLoading(true)
    try {
      if (authTab === 'signup') {
        if (!authDisplay.trim()) { setAuthError('Enter your display name.'); setAuthLoading(false); return }
        if (authUsername.length < 3) { setAuthError('Username must be at least 3 characters.'); setAuthLoading(false); return }
        if (authPassword.length < 6) { setAuthError('Password must be at least 6 characters.'); setAuthLoading(false); return }
        await signUp(authUsername.trim(), authDisplay.trim(), authPassword)
      } else {
        await signIn(authUsername.trim(), authPassword)
      }
      const { data: { session } } = await supabase.auth.getSession()
      const newUser = session?.user ?? null
      setUser(newUser)
      setShowAuthModal(false)
      // Save the score now that we have a user
      if (newUser) {
        const avgDist = roundDistances.reduce((a, b) => a + b, 0) / Math.max(roundDistances.length, 1)
        const accuracy = Math.round(Math.max(0, (1 - avgDist / 400)) * 100)
        try {
          await saveGame(newUser.id, { totalScore, roundScore: totalScore, roundsPlayed: round + 1, accuracy, avgDistanceKm: avgDist, mode: isFreePlay ? 'freeplay' : 'daily', isFinalRound: true })
          const { data: updated } = await supabase.from('profiles').select('*').eq('id', newUser.id).single()
          setProfile(updated)
        } catch {}
      }
    } catch (e: any) {
      setAuthError(authTab === 'signup' ? (e.message || 'Something went wrong.') : 'Wrong username or password.')
    } finally {
      setAuthLoading(false)
    }
  }

  function keepPlaying() {
    setIsFreePlay(true)
    startRound(round + 1, roundLocations)
  }

  function restartGame() {
    setTotalScore(0)
    setRound(0)
    setRoundLocations([])
    setRoundDistances([])
    setIsFreePlay(false)
    startRound(0, [])
  }

  const timeColor = timeLeft <= 10 ? '#f87171' : timeLeft <= 20 ? '#fb923c' : 'var(--accent)'
  const accuracy  = roundDistances.length ? Math.round(Math.max(0, (1 - roundDistances.reduce((a,b)=>a+b,0)/roundDistances.length/400))*100) : 0
  const avgDist   = roundDistances.length ? roundDistances.reduce((a,b)=>a+b,0)/roundDistances.length : 0
  const maxScore  = (isFreePlay ? round + 1 : TOTAL_ROUNDS) * 5000
  const tierName  = profile?.tier || 'Baguhan'

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }} onClick={() => bgMusicRef.current?.paused && bgMusicRef.current?.play().catch(()=>{})}>

      <style>{`
        .game-header { display: flex; align-items: center; justify-content: space-between; padding: 0 12px; height: 48px; background: var(--surface); border-bottom: 1px solid var(--border); flex-shrink: 0; z-index: 100; }
        .header-logo { font-size: 1rem; font-weight: 900; }
        .header-controls { display: flex; gap: 10px; align-items: center; }
        .header-stat { text-align: center; }
        .header-stat-label { font-size: 0.5rem; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); }
        .header-stat-value { font-size: 0.95rem; font-weight: 700; color: var(--accent); }
        .header-dots { display: flex; gap: 4px; align-items: center; }
        .header-btn { background: transparent; border: 1px solid var(--border); border-radius: 8px; padding: 4px 8px; color: var(--text); cursor: pointer; font-size: 1rem; line-height: 1; }
        .minimap-h { height: 240px; }
        .guess-btn-bottom { bottom: 248px; }
        .timesup-bottom { bottom: 318px; }
        .lb-widget { position:absolute; top:12px; right:12px; z-index:60; background:rgba(15,17,23,0.92); border:1px solid var(--border); border-radius:14px; padding:10px 14px; min-width:190px; backdrop-filter:blur(10px); }
        .lb-widget-row { display:flex; align-items:center; gap:8px; padding:5px 0; border-bottom:1px solid var(--border); }
        .lb-widget-row:last-child { border-bottom:none; }
        .lb-widget-name { font-size:0.78rem; font-weight:700; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:90px; }
        .lb-widget-tier { font-size:0.58rem; color:var(--muted); }
        .lb-widget-pts  { font-size:0.78rem; font-weight:800; color:var(--accent); margin-left:auto; white-space:nowrap; }
        .ticker-wrap { width:100%; height:28px; background:rgba(15,17,23,0.95); border-bottom:1px solid var(--border); overflow:hidden; display:flex; align-items:center; }
        .ticker-track { display:flex; gap:0; animation:ticker 30s linear infinite; white-space:nowrap; }
        .ticker-track:hover { animation-play-state:paused; }
        .ticker-item { display:inline-flex; align-items:center; gap:8px; padding:0 24px; border-right:1px solid var(--border); font-size:0.65rem; }
        .ticker-rank { font-weight:800; }
        .ticker-rank.gold { color:#f5c542; } .ticker-rank.silver { color:#94a3b8; } .ticker-rank.bronze { color:#cd7c3a; }
        .ticker-score { color:var(--accent); font-weight:700; }
        .ticker-title { color:var(--muted); }
        @keyframes ticker { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @media (max-width:430px) { .lb-widget { min-width:160px; } .lb-widget-name { max-width:70px; } }
        @media (max-width: 430px) {
          .game-header { height: 44px; padding: 0 8px; }
          .header-logo { font-size: 0.85rem; }
          .header-controls { gap: 6px; }
          .header-stat-value { font-size: 0.85rem; }
          .minimap-h { height: 200px; }
          .guess-btn-bottom { bottom: 208px; }
          .timesup-bottom { bottom: 278px; }
        }
        @media (min-width: 768px) {
          .minimap-h { height: 260px; }
          .guess-btn-bottom { bottom: 268px; }
          .timesup-bottom { bottom: 338px; }
        }
      `}</style>

      {/* HEADER */}
      <header className="game-header">
        <div className="header-logo">Nasaan<span style={{ color: 'var(--accent)' }}>Ako</span>.ph</div>
        <div className="header-controls">
          <div className="header-stat">
            <div className="header-stat-label">Round</div>
            <div className="header-stat-value">{round + 1}</div>
          </div>
          <div className="header-dots">
            {Array.from({ length: Math.min(TOTAL_ROUNDS, round + 1) }).map((_, i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i < round ? 'var(--accent2)' : 'var(--accent)' }} />
            ))}
            {Array.from({ length: Math.max(0, TOTAL_ROUNDS - round - 1) }).map((_, i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--border)' }} />
            ))}
          </div>
          <div className="header-stat">
            <div className="header-stat-label">{profile ? profile.display_name : guestName}</div>
            <div className="header-stat-value">{profile ? (profile.total_score || 0).toLocaleString() : '—'}</div>
          </div>
          <button className="header-btn" onClick={() => router.push('/modes')} title="Back">🏠</button>
          <button className="header-btn" onClick={() => { setMuted(!muted); if (bgMusicRef.current) bgMusicRef.current.muted = !muted }}>
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      </header>

      {/* GAME AREA */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* Street View */}
        <div ref={streetViewRef} style={{ width: '100%', height: '100%', pointerEvents: timeLocked ? 'none' : 'auto' }} />

        {/* Loading overlay */}
        {svLoading && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 49, background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 32px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', animation: 'spin 1.2s linear infinite' }}>🌏</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)' }}>Finding your drop location…</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 280 }}>
              Please wait while we load a Street View location somewhere in the Philippines.
              <br />If it takes too long, tap Refresh to try a different spot.
            </div>
            <button
              onClick={() => refreshLocation(round, roundLocations)}
              style={{ marginTop: 8, padding: '10px 28px', background: 'var(--accent)', border: 'none', borderRadius: 10, color: '#0f1117', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              🔄 Refresh Location
            </button>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Timer */}
        {!svLoading && <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 50, background: 'rgba(15,17,23,0.88)', border: `1px solid ${timeColor}`, borderRadius: 12, padding: '8px 14px', minWidth: 68, textAlign: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: 2, color: 'var(--muted)', marginBottom: 2 }}>Time</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: timeColor, lineHeight: 1 }}>{timeLeft}</div>
          <div style={{ marginTop: 5, height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(timeLeft / ROUND_TIME) * 100}%`, background: timeColor, borderRadius: 2, transition: 'width 1s linear' }} />
          </div>
        </div>}

        {/* Leaderboard widget */}
        {!svLoading && lbVisible && lbData.length > 0 && phase === 'playing' && (
          <div className="lb-widget">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:2, color:'var(--muted)', fontWeight:700 }}>🏆 Top 1–3</span>
              <span onClick={() => setLbVisible(false)} style={{ fontSize:'0.8rem', color:'var(--muted)', cursor:'pointer', padding:'0 2px' }}>✕</span>
            </div>
            {lbData.map((p, i) => (
              <div key={i} className="lb-widget-row">
                <span style={{ fontSize:'0.9rem' }}>{['🥇','🥈','🥉'][i]}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="lb-widget-name">{p.display_name}</div>
                  <div className="lb-widget-tier">{p.tier}</div>
                </div>
                <div className="lb-widget-pts">{(p.total_score||0).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}

        {/* Leaderboard toggle when dismissed */}
        {!lbVisible && phase === 'playing' && (
          <button onClick={() => setLbVisible(true)} style={{ position:'absolute', top:12, right:12, zIndex:60, background:'rgba(15,17,23,0.88)', border:'1px solid var(--border)', borderRadius:10, padding:'5px 10px', fontSize:'0.72rem', color:'var(--text)', cursor:'pointer', backdropFilter:'blur(8px)' }}>
            🏆 Top 1–3
          </button>
        )}

        {/* Time up hint */}
        {timeLocked && !guessPlaced && (
          <div className="timesup-bottom" style={{ position: 'absolute', left: 12, right: 12, zIndex: 55, background: 'rgba(15,17,23,0.92)', border: '1px solid rgba(245,197,66,0.4)', borderRadius: 12, padding: '10px 16px', textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 700 }}>⏱ Time's up!</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>Tap the map to drop your pin, then submit.</div>
          </div>
        )}

        {/* Map label */}
        {!svLoading && (
        <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: 'var(--text)', fontSize: '0.65rem', padding: '3px 10px', borderRadius: 20, pointerEvents: 'none', zIndex: 51, whiteSpace: 'nowrap' }}>
          {guessPlaced ? '✅ Pin placed — tap submit!' : '👆 Tap the map to drop your pin'}
        </div>
        )}

        {/* Minimap + optional ticker strip */}
        <div className="minimap-h" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderTop: '2px solid var(--border)', zIndex: 50, display:'flex', flexDirection:'column' }}>
          {lbData.length > 0 && phase === 'playing' && (
            <div className="ticker-wrap" style={{ position:'relative', height:28, flexShrink:0 }}>
              <div className="ticker-track">
                {[...lbData, ...lbData].map((p, i) => (
                  <div key={i} className="ticker-item">
                    <span className={`ticker-rank ${i%lbData.length===0?'gold':i%lbData.length===1?'silver':'bronze'}`}>#{(i%lbData.length)+1}</span>
                    <span style={{ color:'var(--text)', fontWeight:600 }}>{p.display_name}</span>
                    <span className="ticker-title">· {p.tier} ·</span>
                    <span className="ticker-score">{(p.total_score||0).toLocaleString()} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div ref={guessMapRef} style={{ flex:1 }} />
        </div>

        {/* Guess button */}
        {!svLoading && <button
          className="guess-btn-bottom"
          onClick={guessPlaced ? submitGuess : undefined}
          disabled={!guessPlaced}
          style={{ position: 'absolute', left: 12, right: 12, padding: '13px 20px', background: 'var(--accent)', color: '#0f1117', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '1rem', cursor: guessPlaced ? 'pointer' : 'not-allowed', opacity: guessPlaced ? 1 : 0.45, zIndex: 60, boxShadow: '0 4px 20px rgba(245,197,66,0.4)', fontFamily: 'inherit' }}
        >
          📍 Drop Pin & Guess
        </button>}

        {/* RESULT OVERLAY */}
        {phase === 'result' && roundResult && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 24px', maxWidth: 420, width: '100%', textAlign: 'center', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: roundResult.label.color, lineHeight: 1 }}>{roundResult.pts.toLocaleString()}</div>
              <div style={{ fontSize: '0.9rem', color: roundResult.label.color, fontWeight: 700, marginTop: 4 }}>{roundResult.label.icon} {roundResult.label.label}</div>
              <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, margin: '12px 0', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(roundResult.pts / 5000) * 100}%`, background: roundResult.label.color, borderRadius: 3, transition: 'width 1s ease' }} />
              </div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text)', marginBottom: 4 }}>
                {roundResult.outside ? '🚫 Your pin was outside the Philippines — 0 pts' : `You were ${roundResult.dist < 1 ? `${Math.round(roundResult.dist * 1000)} m` : `${roundResult.dist.toFixed(1)} km`} away`}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 12 }}>📍 {roundResult.name} — {roundResult.hint}</div>
              {roundResult.fullAddress && (
                <div style={{ fontSize: '0.78rem', color: 'var(--accent)', background: 'rgba(245,197,66,0.07)', border: '1px solid rgba(245,197,66,0.15)', borderRadius: 8, padding: '8px 12px', marginBottom: 14, textAlign: 'left' }}>
                  📌 Exact: {roundResult.fullAddress}
                </div>
              )}
              <div ref={resultMapRef} style={{ width: '100%', height: 160, borderRadius: 10, overflow: 'hidden', marginBottom: 16 }} />

              {/* Early sign-up nudge for guests — show after round 1 */}
              {!user && round >= 1 && (
                <div style={{ background: 'rgba(245,197,66,0.08)', border: '1px solid rgba(245,197,66,0.25)', borderRadius: 12, padding: '10px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text)', lineHeight: 1.4 }}>
                    🏆 <strong>Sign up</strong> to save your score to the leaderboard!
                  </div>
                  <button onClick={() => router.push('/auth?tab=signup')} style={{ flexShrink: 0, padding: '6px 14px', background: 'var(--accent)', color: '#0f1117', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                    Sign Up →
                  </button>
                </div>
              )}

              <button onClick={!isFreePlay && round + 1 >= TOTAL_ROUNDS ? showFinal : nextRound} style={{ width: '100%', padding: '12px', background: 'var(--accent)', color: '#0f1117', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                {!isFreePlay && round + 1 >= TOTAL_ROUNDS ? 'See Final Score →' : isFreePlay ? 'Next Bonus Round →' : 'Next Round →'}
              </button>
            </div>
          </div>
        )}

        {/* FINAL OVERLAY */}
        {phase === 'final' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px 24px', maxWidth: 440, width: '100%', textAlign: 'center', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>{isFreePlay ? 'Free Play' : 'Lakbay'} Complete</div>
              <div style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>{totalScore.toLocaleString()}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 20 }}>out of {maxScore.toLocaleString()} pts</div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
                {[['Accuracy', `${accuracy}%`, 'var(--accent2)'], ['Avg Distance', avgDist < 1 ? `${Math.round(avgDist*1000)}m` : `${avgDist.toFixed(1)}km`, 'var(--accent)'], ['Tier', tierName, '#a78bfa']].map(([label, val, color]) => (
                  <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color }}>{val}</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
                  </div>
                ))}
              </div>

              {user ? (
                <div style={{ fontSize: '0.82rem', color: 'var(--accent2)', marginBottom: 16 }}>✅ Score saved to leaderboard!</div>
              ) : (
                <div style={{ marginBottom: 16 }}>
                  {!showAuthModal ? (
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={() => { setAuthTab('signup'); setShowAuthModal(true) }} style={{ flex:1, padding:'10px', background:'var(--accent)', color:'#0f1117', border:'none', borderRadius:10, fontWeight:800, fontSize:'0.85rem', cursor:'pointer', fontFamily:'inherit' }}>Sign Up &amp; Save Score</button>
                      <button onClick={() => { setAuthTab('login'); setShowAuthModal(true) }} style={{ flex:1, padding:'10px', background:'transparent', color:'var(--text)', border:'1px solid var(--border)', borderRadius:10, fontWeight:700, fontSize:'0.85rem', cursor:'pointer', fontFamily:'inherit' }}>Log In</button>
                    </div>
                  ) : (
                    <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:12, padding:16 }}>
                      <div style={{ display:'flex', gap:6, marginBottom:12 }}>
                        {(['signup','login'] as const).map(t => (
                          <button key={t} onClick={() => { setAuthTab(t); setAuthError('') }} style={{ flex:1, padding:'6px', borderRadius:8, border:'none', background: authTab===t ? 'var(--accent)' : 'transparent', color: authTab===t ? '#0f1117' : 'var(--muted)', fontWeight:700, fontSize:'0.78rem', cursor:'pointer', fontFamily:'inherit' }}>
                            {t === 'signup' ? 'Sign Up' : 'Log In'}
                          </button>
                        ))}
                      </div>
                      {authError && <div style={{ fontSize:'0.75rem', color:'#f87171', marginBottom:8, background:'rgba(248,113,113,0.1)', padding:'6px 10px', borderRadius:6 }}>{authError}</div>}
                      {authTab === 'signup' && (
                        <input placeholder="Display Name" value={authDisplay} onChange={e => setAuthDisplay(e.target.value)} style={{ width:'100%', marginBottom:8, padding:'8px 10px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text)', fontSize:'0.85rem', fontFamily:'inherit', boxSizing:'border-box' }} />
                      )}
                      <input placeholder="Username" value={authUsername} onChange={e => setAuthUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g,''))} style={{ width:'100%', marginBottom:8, padding:'8px 10px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text)', fontSize:'0.85rem', fontFamily:'inherit', boxSizing:'border-box' }} />
                      <input type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} onKeyDown={e => e.key==='Enter' && handleInlineAuth()} style={{ width:'100%', marginBottom:10, padding:'8px 10px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text)', fontSize:'0.85rem', fontFamily:'inherit', boxSizing:'border-box' }} />
                      <div style={{ display:'flex', gap:8 }}>
                        <button onClick={handleInlineAuth} disabled={authLoading} style={{ flex:1, padding:'9px', background:'var(--accent)', color:'#0f1117', border:'none', borderRadius:8, fontWeight:800, fontSize:'0.85rem', cursor:'pointer', fontFamily:'inherit', opacity: authLoading ? 0.7 : 1 }}>
                          {authLoading ? '...' : authTab === 'signup' ? 'Create & Save' : 'Log In & Save'}
                        </button>
                        <button onClick={() => { setShowAuthModal(false); setAuthError('') }} style={{ padding:'9px 12px', background:'transparent', color:'var(--muted)', border:'1px solid var(--border)', borderRadius:8, cursor:'pointer', fontFamily:'inherit' }}>✕</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={keepPlaying} style={{ padding: '12px', background: 'var(--accent2)', color: '#0f1117', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit' }}>▶ Keep Playing — Free Play</button>
                <button onClick={restartGame} style={{ padding: '12px', background: 'var(--accent)', color: '#0f1117', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit' }}>↺ New Game</button>
                <button onClick={() => router.push('/')} style={{ padding: '12px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 12, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit' }}>← Back to Home</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
