import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { PokemonListResponse } from '../types/pokemon'
import { usePokemonList } from './usePokemonList'

const mockListResponse: PokemonListResponse = {
  pokemon: [
    { id: 1, name: 'Bulbasaur', types: ['Grass', 'Poison'], sprite: 'https://example.com/1.png' },
  ],
  count: 1,
  nextToken: null,
}

describe('usePokemonList', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches the Pokemon list on mount and returns it', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockListResponse),
      }),
    )

    const { result } = renderHook(() => usePokemonList())

    expect(result.current.loading).toBe(true)
    expect(result.current.pokemon).toEqual([])

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.pokemon).toEqual(mockListResponse.pokemon)
    expect(result.current.error).toBeNull()
  })

  it('sets error state when fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    )

    const { result } = renderHook(() => usePokemonList())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to fetch Pokemon list: 500')
    expect(result.current.pokemon).toEqual([])
  })
})
