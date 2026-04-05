import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockBulbasaurDetail, mockListResponse } from '../test/fixtures/pokemon'
import { fetchPokemonList, fetchPokemonDetail } from './pokemon'

describe('fetchPokemonList', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('calls the correct URL and returns the response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockListResponse),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await fetchPokemonList()

    expect(mockFetch).toHaveBeenCalledWith(
      '/pokedex/pokemon',
    )
    expect(result).toEqual(mockListResponse)
  })

  it('throws an error when the response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    )

    await expect(fetchPokemonList()).rejects.toThrow(
      'Failed to fetch Pokemon list: 500',
    )
  })
})

describe('fetchPokemonDetail', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('calls the correct URL with the Pokemon ID', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockBulbasaurDetail),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await fetchPokemonDetail(1)

    expect(mockFetch).toHaveBeenCalledWith(
      '/pokedex/pokemon/1',
    )
    expect(result).toEqual(mockBulbasaurDetail)
  })

  it('throws an error when the response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    )

    await expect(fetchPokemonDetail(999)).rejects.toThrow(
      'Failed to fetch Pokemon detail: 404',
    )
  })
})
