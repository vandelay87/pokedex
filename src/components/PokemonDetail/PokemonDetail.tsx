import { StatBar } from '@components/StatBar'
import type { PokemonDetail as PokemonDetailType } from '@models/pokemon'
import { formatId } from '@utils/formatId'
import type { FC } from 'react'
import styles from './PokemonDetail.module.css'

interface PokemonDetailProps {
  pokemon: PokemonDetailType | null
  loading: boolean
  error: string | null
}

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
    if (loading) return <p className={styles.loadingText}>Loading...</p>
    if (error) return <p className={styles.errorText}>Error: {error}</p>
    if (!pokemon)
      return (
        <p className={styles.noSelection}>Select a Pokemon to view details</p>
      )

    return (
      <>
        <div className={styles.header}>
          <h2 className={styles.name}>
            {pokemon.name} <span className={styles.id}>{formatId(pokemon.id)}</span>
          </h2>
        </div>
        <img
          className={styles.sprite}
          src={pokemon.sprite}
          alt={pokemon.name}
        />
        <div className={styles.types}>
          {pokemon.types.map((type) => (
            <span
              key={type}
              className={styles.typeBadge}
              style={{
                backgroundColor: `var(--type-${type.toLowerCase()})`,
                color: `var(--type-${type.toLowerCase()}-text)`,
              }}
            >
              {type}
            </span>
          ))}
        </div>
        <p className={styles.description}>{pokemon.description}</p>
        <dl className={styles.infoGrid}>
          <div>
            <dt className={styles.infoLabel}>Height</dt>
            <dd className={styles.infoValue}>
              {(pokemon.height / 10).toFixed(1)} m
            </dd>
          </div>
          <div>
            <dt className={styles.infoLabel}>Weight</dt>
            <dd className={styles.infoValue}>
              {(pokemon.weight / 10).toFixed(1)} kg
            </dd>
          </div>
          <div>
            <dt className={styles.infoLabel}>Category</dt>
            <dd className={styles.infoValue}>{pokemon.category}</dd>
          </div>
          <div>
            <dt className={styles.infoLabel}>Gender Rate</dt>
            <dd className={styles.infoValue}>{pokemon.genderRate}</dd>
          </div>
        </dl>
        <div className={styles.stats}>
          {Object.entries(pokemon.stats).map(([key, value], index) => (
            <StatBar
              key={key}
              label={STAT_LABELS[key] ?? key}
              value={value}
              index={index}
            />
          ))}
        </div>
      </>
    )
  }

  return (
    <div className={styles.panel} role="region" aria-label="Pokemon details">
      {renderContent()}
    </div>
  )
}
