import { StatBar } from '@components/StatBar'
import type { PokemonDetail as PokemonDetailType } from '@models/pokemon'
import type { FC } from 'react'

interface PokemonDetailProps {
  pokemon: PokemonDetailType | null
  loading: boolean
  error: string | null
}

const formatId = (id: number): string => `#${String(id).padStart(3, '0')}`

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  specialAttack: 'Sp. Atk',
  specialDefense: 'Sp. Def',
  speed: 'Speed',
}

export const PokemonDetail: FC<PokemonDetailProps> = ({
  pokemon,
  loading,
  error,
}) => {
  const renderContent = () => {
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>
    if (!pokemon) return <p>Select a Pokemon to view details</p>

    return (
      <>
        <h2>
          {pokemon.name} {formatId(pokemon.id)}
        </h2>
        <img src={pokemon.sprite} alt={pokemon.name} />
        <div>
          {pokemon.types.map((type) => (
            <span key={type}>{type}</span>
          ))}
        </div>
        <dl>
          <dt>Height</dt>
          <dd>{pokemon.height}</dd>
          <dt>Weight</dt>
          <dd>{pokemon.weight}</dd>
          <dt>Category</dt>
          <dd>{pokemon.category}</dd>
          <dt>Gender Rate</dt>
          <dd>{pokemon.genderRate}</dd>
        </dl>
        <p>{pokemon.description}</p>
        <div>
          {Object.entries(pokemon.stats).map(([key, value]) => (
            <StatBar key={key} label={STAT_LABELS[key] ?? key} value={value} />
          ))}
        </div>
      </>
    )
  }

  return (
    <div role="region" aria-label="Pokemon details">
      {renderContent()}
    </div>
  )
}
