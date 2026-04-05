import { fetchPokemonList } from '@api/pokemon'
import type { PokemonSummary } from '@models/pokemon'
import { useCallback, useEffect, useState } from 'react'

interface UsePokemonListResult {
  pokemon: PokemonSummary[]
  loading: boolean
  error: string | null
  retry: () => void
}

export const usePokemonList = (): UsePokemonListResult => {
  const [pokemon, setPokemon] = useState<PokemonSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setPokemon([])
    setLoading(true)
    setError(null)

    const load = async () => {
      try {
        const data = await fetchPokemonList()
        if (!cancelled) {
          setPokemon(data.pokemon)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch Pokemon list',
          )
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => {
    setAttempt((prev) => prev + 1)
  }, [])

  return { pokemon, loading, error, retry }
}
