import type {
  PokemonDetail,
  PokemonListResponse,
  PokemonSummary,
} from '@models/pokemon'

export const mockBulbasaurSummary: PokemonSummary = {
  id: 1,
  name: 'Bulbasaur',
  types: ['Grass', 'Poison'],
  sprite: 'https://example.com/1.png',
}

export const mockCharmanderSummary: PokemonSummary = {
  id: 4,
  name: 'Charmander',
  types: ['Fire'],
  sprite: 'https://example.com/4.png',
}

export const mockPokemonList: PokemonSummary[] = [
  mockBulbasaurSummary,
  mockCharmanderSummary,
]

export const mockListResponse: PokemonListResponse = {
  pokemon: mockPokemonList,
  count: 2,
  nextToken: null,
}

export const mockBulbasaurDetail: PokemonDetail = {
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
