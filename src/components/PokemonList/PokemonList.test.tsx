import type { PokemonSummary } from '@models/pokemon'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PokemonList } from './PokemonList'

const mockPokemon: PokemonSummary[] = [
  { id: 1, name: 'Bulbasaur', types: ['Grass', 'Poison'], sprite: '/bulbasaur.png' },
  { id: 4, name: 'Charmander', types: ['Fire'], sprite: '/charmander.png' },
  { id: 7, name: 'Squirtle', types: ['Water'], sprite: '/squirtle.png' },
]

describe('PokemonList', () => {
  it('renders a list of pokemon cards', () => {
    render(<PokemonList pokemon={mockPokemon} onSelect={() => {}} />)

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('renders each pokemon name', () => {
    render(<PokemonList pokemon={mockPokemon} onSelect={() => {}} />)

    expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    expect(screen.getByText('Charmander')).toBeInTheDocument()
    expect(screen.getByText('Squirtle')).toBeInTheDocument()
  })

  it('calls onSelect with the pokemon id when a card is clicked', async () => {
    const handleSelect = vi.fn()
    render(<PokemonList pokemon={mockPokemon} onSelect={handleSelect} />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Charmander, Fire type' }),
    )
    expect(handleSelect).toHaveBeenCalledWith(4)
  })

  it('shows empty state when pokemon list is empty', () => {
    render(<PokemonList pokemon={[]} onSelect={() => {}} />)

    expect(screen.getByText('No Pokemon found.')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('passes selectedId to cards', () => {
    render(
      <PokemonList pokemon={mockPokemon} onSelect={() => {}} selectedId={4} />,
    )

    const charmander = screen.getByRole('button', { name: 'Charmander, Fire type' })
    expect(charmander).toHaveAttribute('aria-pressed', 'true')

    const bulbasaur = screen.getByRole('button', {
      name: 'Bulbasaur, Grass and Poison type',
    })
    expect(bulbasaur).toHaveAttribute('aria-pressed', 'false')
  })
})
