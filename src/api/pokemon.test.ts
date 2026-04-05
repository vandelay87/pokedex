import type {
  PokemonDetail,
  PokemonListResponse,
} from '@models/pokemon'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchPokemonList, fetchPokemonDetail } from './pokemon'

const mockListResponse: PokemonListResponse = {
  pokemon: [
    { id: 1, name: 'Bulbasaur', types: ['Grass', 'Poison'], sprite: 'https://example.com/1.png' },
    { id: 4, name: 'Charmander', types: ['Fire'], sprite: 'https://example.com/4.png' },
  ],
  count: 2,
  nextToken: null,
}

const mockDetailResponse: PokemonDetail = {
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
      json: () => Promise.resolve(mockDetailResponse),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await fetchPokemonDetail(1)

    expect(mockFetch).toHaveBeenCalledWith(
      '/pokedex/pokemon/1',
    )
    expect(result).toEqual(mockDetailResponse)
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
