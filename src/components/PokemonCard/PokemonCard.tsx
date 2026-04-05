import type { PokemonSummary } from '@models/pokemon'
import { formatId } from '@utils/formatId'
import type { FC } from 'react'
import styles from './PokemonCard.module.css'

interface PokemonCardProps {
  pokemon: PokemonSummary
  onClick: () => void
  selected?: boolean
}

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
      className={`${styles.card}${selected ? ` ${styles.selected}` : ''}`}
      aria-label={formatAriaLabel(pokemon)}
      aria-pressed={selected}
      onClick={onClick}
    >
      <img
        className={styles.sprite}
        src={pokemon.sprite}
        alt={pokemon.name}
        loading="lazy"
      />
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.id}>{formatId(pokemon.id)}</span>
          <span className={styles.name}>{pokemon.name}</span>
        </div>
        <span className={styles.types}>
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
        </span>
      </div>
    </button>
  )
}
