import { useEffect, useRef, useState } from 'react'
import { fetchPokemonDetail } from '../api/pokemon'
import type { PokemonDetail } from '../types/pokemon'

interface UsePokemonDetailResult {
  detail: PokemonDetail | null
  loading: boolean
  error: string | null
}

export const usePokemonDetail = (
  id: number | null,
): UsePokemonDetailResult => {
  const [detail, setDetail] = useState<PokemonDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cache = useRef<Record<number, PokemonDetail>>({})

  useEffect(() => {
    if (id === null) {
      setDetail(null)
      setLoading(false)
      setError(null)
      return
    }

    if (cache.current[id]) {
      setDetail(cache.current[id])
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    const load = async () => {
      try {
        const data = await fetchPokemonDetail(id)
        if (!cancelled) {
          cache.current[id] = data
          setDetail(data)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to fetch Pokemon detail',
          )
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [id])

  return { detail, loading, error }
}
