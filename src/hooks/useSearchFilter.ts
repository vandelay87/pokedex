import type { PokemonSummary } from '@models/pokemon'
import { useMemo, useState } from 'react'

interface UseSearchFilterResult {
  query: string
  setQuery: (query: string) => void
  filtered: PokemonSummary[]
}

export const useSearchFilter = (
  pokemon: PokemonSummary[],
): UseSearchFilterResult => {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query) return pokemon
    const lowerQuery = query.toLowerCase()
    return pokemon.filter((p) => p.name.toLowerCase().includes(lowerQuery))
  }, [pokemon, query])

  return { query, setQuery, filtered }
}
