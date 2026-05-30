import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export async function signUp(username, displayName, password) {
  const email = `${username}@nasaanako.ph`

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error

  // Create profile
  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    username,
    display_name: displayName,
  })
  if (profileError) throw profileError

  return data
}

export async function signIn(username, password) {
  const email = `${username}@nasaanako.ph`
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

export async function saveGame(userId, gameData) {
  const { totalScore, roundScore, roundsPlayed, accuracy, avgDistanceKm, mode, isFinalRound } = gameData

  // Save game record
  await supabase.from('games').insert({
    user_id: userId,
    total_score: totalScore,
    rounds_played: roundsPlayed,
    accuracy,
    avg_distance_km: avgDistanceKm,
    mode,
  })

  // Update profile — only add the SINGLE round's score (roundScore) to avoid double-counting
  // Only increment games_played on the final round of a game
  const profile = await getProfile(userId)
  const newTotal = (profile.total_score || 0) + (roundScore || 0)
  const newBest  = Math.max(profile.best_score || 0, totalScore)
  const newGames = isFinalRound ? (profile.games_played || 0) + 1 : (profile.games_played || 0)

  await supabase.from('profiles').update({
    total_score:  newTotal,
    best_score:   newBest,
    games_played: newGames,
  }).eq('id', userId)

  // Recalculate ALL players' tiers by rank after every save
  const { data: ranked } = await supabase
    .from('profiles')
    .select('id, total_score')
    .order('total_score', { ascending: false })

  if (ranked) {
    await Promise.all(ranked.map((p, i) =>
      supabase.from('profiles').update({ tier: getTierByRank(i + 1) }).eq('id', p.id)
    ))
  }
}

export function getTierByRank(rank) {
  if (rank === 1)  return 'Pusang Gala'
  if (rank === 2)  return 'Lagalag'
  if (rank === 3)  return 'Chill Traveler'
  if (rank <= 10)  return 'Mausisa'
  return 'Baguhan'
}

// Keep for backwards compatibility
export function getTier(totalScore) {
  return 'Ligaw' // tiers are now rank-based, updated after each save
}

export async function getLeaderboard() {
  const { data } = await supabase
    .from('leaderboard')
    .select('*')
    .order('rank', { ascending: true })
    .limit(10)
  return data || []
}
