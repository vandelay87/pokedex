export interface PokemonSummary {
  id: number
  name: string
  types: string[]
  sprite: string
}

export interface PokemonDetail extends PokemonSummary {
  height: number
  weight: number
  category: string
  description: string
  genderRate: number
  stats: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
}

export interface PokemonListResponse {
  pokemon: PokemonSummary[]
  count: number
  nextToken: string | null
}
