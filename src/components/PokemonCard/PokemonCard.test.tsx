import type { PokemonSummary } from '@models/pokemon'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PokemonCard } from './PokemonCard'

const bulbasaur: PokemonSummary = {
  id: 1,
  name: 'Bulbasaur',
  types: ['Grass', 'Poison'],
  sprite: 'https://example.com/bulbasaur.png',
}

const pikachu: PokemonSummary = {
  id: 25,
  name: 'Pikachu',
  types: ['Electric'],
  sprite: 'https://example.com/pikachu.png',
}

describe('PokemonCard', () => {
  it('renders pokemon name', () => {
    render(<PokemonCard pokemon={bulbasaur} onClick={() => {}} />)
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
  })

  it('renders formatted ID as #001', () => {
    render(<PokemonCard pokemon={bulbasaur} onClick={() => {}} />)
    expect(screen.getByText('#001')).toBeInTheDocument()
  })

  it('renders formatted ID as #025 for Pikachu', () => {
    render(<PokemonCard pokemon={pikachu} onClick={() => {}} />)
    expect(screen.getByText('#025')).toBeInTheDocument()
  })

  it('renders sprite with lazy loading', () => {
    render(<PokemonCard pokemon={bulbasaur} onClick={() => {}} />)
    const img = screen.getByRole('img', { name: 'Bulbasaur' })
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('src', 'https://example.com/bulbasaur.png')
  })

  it('renders types', () => {
    render(<PokemonCard pokemon={bulbasaur} onClick={() => {}} />)
    expect(screen.getByText('Grass')).toBeInTheDocument()
    expect(screen.getByText('Poison')).toBeInTheDocument()
  })

  it('is a button with correct aria-label for multi-type pokemon', () => {
    render(<PokemonCard pokemon={bulbasaur} onClick={() => {}} />)
    expect(
      screen.getByRole('button', { name: 'Bulbasaur, Grass and Poison type' }),
    ).toBeInTheDocument()
  })

  it('is a button with correct aria-label for single-type pokemon', () => {
    render(<PokemonCard pokemon={pikachu} onClick={() => {}} />)
    expect(
      screen.getByRole('button', { name: 'Pikachu, Electric type' }),
    ).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<PokemonCard pokemon={bulbasaur} onClick={handleClick} />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Bulbasaur, Grass and Poison type' }),
    )
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
