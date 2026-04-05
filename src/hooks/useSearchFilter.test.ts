import type { PokemonSummary } from '@models/pokemon'
import { act, renderHook } from '@testing-library/react'
import { useSearchFilter } from './useSearchFilter'

const mockPokemon: PokemonSummary[] = [
  { id: 1, name: 'Bulbasaur', types: ['Grass', 'Poison'], sprite: '/bulbasaur.png' },
  { id: 4, name: 'Charmander', types: ['Fire'], sprite: '/charmander.png' },
  { id: 7, name: 'Squirtle', types: ['Water'], sprite: '/squirtle.png' },
  { id: 25, name: 'Pikachu', types: ['Electric'], sprite: '/pikachu.png' },
]

describe('useSearchFilter', () => {
  it('returns all pokemon when query is empty', () => {
    const { result } = renderHook(() => useSearchFilter(mockPokemon))
    expect(result.current.filtered).toEqual(mockPokemon)
    expect(result.current.query).toBe('')
  })

  it('filters pokemon by name case-insensitively', () => {
    const { result } = renderHook(() => useSearchFilter(mockPokemon))

    act(() => {
      result.current.setQuery('char')
    })

    expect(result.current.filtered).toEqual([mockPokemon[1]])
  })

  it('filters with uppercase query', () => {
    const { result } = renderHook(() => useSearchFilter(mockPokemon))

    act(() => {
      result.current.setQuery('SQUIR')
    })

    expect(result.current.filtered).toEqual([mockPokemon[2]])
  })

  it('returns empty array when no pokemon match', () => {
    const { result } = renderHook(() => useSearchFilter(mockPokemon))

    act(() => {
      result.current.setQuery('Mewtwo')
    })

    expect(result.current.filtered).toEqual([])
  })

  it('matches partial names', () => {
    const { result } = renderHook(() => useSearchFilter(mockPokemon))

    act(() => {
      result.current.setQuery('aur')
    })

    expect(result.current.filtered).toEqual([mockPokemon[0]])
  })
})
