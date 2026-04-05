import { renderHook, waitFor } from '@testing-library/react'
import type { PokemonDetail } from '@types/pokemon'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePokemonDetail } from './usePokemonDetail'

const mockDetail: PokemonDetail = {
  id: 1,
  name: 'Bulbasaur',
  types: ['Grass', 'Poison'],
  sprite: 'https://example.com/1.png',
  height: 7,
  weight: 69,
  category: 'Seed Pokemon',
  description: 'A strange seed was planted on its back at birth.',
  genderRate: 1,
  stats: {
    hp: 45,
    attack: 49,
    defense: 49,
    specialAttack: 65,
    specialDefense: 65,
    speed: 45,
  },
}

describe('usePokemonDetail', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns null detail when id is null', () => {
    const { result } = renderHook(() => usePokemonDetail(null))

    expect(result.current.detail).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('fetches Pokemon detail for a given id', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDetail),
      }),
    )

    const { result } = renderHook(() => usePokemonDetail(1))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.detail).toEqual(mockDetail)
    expect(result.current.error).toBeNull()
  })

  it('caches fetched details — second call with same id does not re-fetch', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockDetail),
    })
    vi.stubGlobal('fetch', mockFetch)

    const { result, rerender } = renderHook(
      ({ id }) => usePokemonDetail(id),
      { initialProps: { id: 1 as number | null } },
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(result.current.detail).toEqual(mockDetail)

    // Switch to null then back to same id
    rerender({ id: null })
    rerender({ id: 1 })

    // Should use cached value — no additional fetch
    expect(result.current.detail).toEqual(mockDetail)
    expect(result.current.loading).toBe(false)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('sets error state when fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    )

    const { result } = renderHook(() => usePokemonDetail(999))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to fetch Pokemon detail: 404')
    expect(result.current.detail).toBeNull()
  })
})
