import { fetchPokemonList } from '@api/pokemon'
import type { PokemonSummary } from '@types/pokemon'
import { useEffect, useState } from 'react'

interface UsePokemonListResult {
  pokemon: PokemonSummary[]
  loading: boolean
  error: string | null
}

export const usePokemonList = (): UsePokemonListResult => {
  const [pokemon, setPokemon] = useState<PokemonSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

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
  }, [])

  return { pokemon, loading, error }
}
