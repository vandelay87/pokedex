import { useCallback, useEffect, useState } from 'react'

export const useMediaQuery = (query: string): boolean => {
  const getMatch = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  )

  const [matches, setMatches] = useState(getMatch)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    setMatches(mql.matches)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}
