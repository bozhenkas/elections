import { useState, useEffect, useCallback } from 'react'

// ─── Simple hash-based router ────────────────────────────────────────────────
// Routes:
//   #/                              → home
//   #/elections/:id                  → election detail
//   #/elections/:id/candidates/:cid  → candidate detail

export interface Route {
  page: 'home' | 'election' | 'candidate'
  electionId?: string
  candidateId?: string
}

function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '')
  if (!path) return { page: 'home' }

  // /elections/:id/candidates/:cid
  const candidateMatch = path.match(/^elections\/([^/]+)\/candidates\/([^/]+)/)
  if (candidateMatch) {
    return { page: 'candidate', electionId: candidateMatch[1], candidateId: candidateMatch[2] }
  }

  // /elections/:id
  const electionMatch = path.match(/^elections\/([^/]+)/)
  if (electionMatch) {
    return { page: 'election', electionId: electionMatch[1] }
  }

  return { page: 'home' }
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))

  useEffect(() => {
    const handler = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  const navigate = useCallback((path: string) => {
    window.location.hash = path
  }, [])

  const goHome = useCallback(() => navigate('/'), [navigate])
  const goElection = useCallback((id: string) => navigate(`/elections/${id}`), [navigate])
  const goCandidate = useCallback((electionId: string, candidateId: string) => {
    navigate(`/elections/${electionId}/candidates/${candidateId}`)
  }, [navigate])
  const goBack = useCallback(() => window.history.back(), [])

  return { route, navigate, goHome, goElection, goCandidate, goBack }
}
