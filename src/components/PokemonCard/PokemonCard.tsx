import type { PokemonSummary } from '@models/pokemon'
import type { FC } from 'react'

interface PokemonCardProps {
  pokemon: PokemonSummary
  onClick: () => void
  selected?: boolean
}

const formatId = (id: number): string => `#${String(id).padStart(3, '0')}`

const formatAriaLabel = (pokemon: PokemonSummary): string => {
  const types = pokemon.types
  const typeLabel =
    types.length <= 1
      ? types[0] ?? ''
      : `${types.slice(0, -1).join(', ')} and ${types[types.length - 1]}`
  return `${pokemon.name}, ${typeLabel} type`
}

export const PokemonCard: FC<PokemonCardProps> = ({
  pokemon,
  onClick,
  selected = false,
}) => {
  return (
    <button
      type="button"
      aria-label={formatAriaLabel(pokemon)}
      aria-pressed={selected}
      onClick={onClick}
    >
      <img
        src={pokemon.sprite}
        alt={pokemon.name}
        loading="lazy"
      />
      <span>{formatId(pokemon.id)}</span>
      <span>{pokemon.name}</span>
      <span>
        {pokemon.types.map((type) => (
          <span key={type}>{type}</span>
        ))}
      </span>
    </button>
  )
}
