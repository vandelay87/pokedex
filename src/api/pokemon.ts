import type { PokemonDetail, PokemonListResponse } from '@models/pokemon'

const API_BASE = import.meta.env.PROD
  ? 'https://api.akli.dev/pokedex'
  : '/pokedex'

export const fetchPokemonList = async (): Promise<PokemonListResponse> => {
  const response = await fetch(`${API_BASE}/pokemon`)

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.status}`)
  }

  return response.json()
}

export const fetchPokemonDetail = async (
  id: number,
): Promise<PokemonDetail> => {
  const response = await fetch(`${API_BASE}/pokemon/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon detail: ${response.status}`)
  }

  return response.json()
}
