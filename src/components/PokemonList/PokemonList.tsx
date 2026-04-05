import { PokemonCard } from '@components/PokemonCard'
import type { PokemonSummary } from '@models/pokemon'
import type { FC } from 'react'

interface PokemonListProps {
  pokemon: PokemonSummary[]
  onSelect: (id: number) => void
  selectedId?: number | null
}

export const PokemonList: FC<PokemonListProps> = ({
  pokemon,
  onSelect,
  selectedId = null,
}) => {
  if (pokemon.length === 0) {
    return <p>No Pokemon found.</p>
  }

  return (
    <ul>
      {pokemon.map((p) => (
        <li key={p.id}>
          <PokemonCard
            pokemon={p}
            onClick={() => onSelect(p.id)}
            selected={p.id === selectedId}
          />
        </li>
      ))}
    </ul>
  )
}
