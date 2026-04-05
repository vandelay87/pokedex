import { PokemonDetail } from '@components/PokemonDetail'
import { PokemonList } from '@components/PokemonList'
import { SearchInput } from '@components/SearchInput'
import { usePokemonDetail, usePokemonList, useSearchFilter, useSelectedPokemon } from '@hooks'
import type { FC } from 'react'

export const Pokedex: FC = () => {
  const { pokemon, loading: listLoading, error: listError } = usePokemonList()
  const { query, setQuery, filtered } = useSearchFilter(pokemon)
  const { selectedId, setSelectedId } = useSelectedPokemon()
  const {
    detail,
    loading: detailLoading,
    error: detailError,
  } = usePokemonDetail(selectedId)

  if (listLoading) {
    return <p>Loading Pokemon...</p>
  }

  if (listError) {
    return <p>Error: {listError}</p>
  }

  return (
    <div>
      <div>
        <SearchInput value={query} onChange={setQuery} />
        <PokemonList
          pokemon={filtered}
          onSelect={setSelectedId}
          selectedId={selectedId}
        />
      </div>
      <PokemonDetail
        pokemon={detail}
        loading={detailLoading}
        error={detailError}
      />
    </div>
  )
}
