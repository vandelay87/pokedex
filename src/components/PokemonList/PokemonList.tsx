import { PokemonCard } from '@components/PokemonCard'
import type { PokemonSummary } from '@models/pokemon'
import { useEffect, useRef, type FC } from 'react'
import styles from './PokemonList.module.css'

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
  const selectedRef = useRef<HTMLLIElement | null>(null)

  useEffect(() => {
    if (selectedId !== null && selectedRef.current) {
      selectedRef.current.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedId])

  if (pokemon.length === 0) {
    return <p className={styles.emptyState}>No Pokemon found.</p>
  }

  return (
    <ul className={styles.list}>
      {pokemon.map((p) => (
        <li key={p.id} ref={p.id === selectedId ? selectedRef : undefined}>
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
