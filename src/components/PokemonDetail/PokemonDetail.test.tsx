import { render, screen } from '@testing-library/react'
import { mockBulbasaurDetail } from '../../test/fixtures/pokemon'
import { PokemonDetail } from './PokemonDetail'

const mockPokemon = mockBulbasaurDetail

describe('PokemonDetail', () => {
  it('has role="region" with aria-label', () => {
    render(<PokemonDetail pokemon={null} loading={false} error={null} />)
    expect(
      screen.getByRole('region', { name: 'Pokemon details' }),
    ).toBeInTheDocument()
  })

  it('shows prompt when no pokemon is selected and not loading', () => {
    render(<PokemonDetail pokemon={null} loading={false} error={null} />)
    expect(
      screen.getByText('Select a Pokemon to view details'),
    ).toBeInTheDocument()
  })

  it('shows loading indicator when loading', () => {
    render(<PokemonDetail pokemon={null} loading={true} error={null} />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows error message when error is set', () => {
    render(
      <PokemonDetail pokemon={null} loading={false} error="Network error" />,
    )
    expect(screen.getByText('Error: Network error')).toBeInTheDocument()
  })

  it('displays pokemon name and formatted ID', () => {
    render(
      <PokemonDetail pokemon={mockPokemon} loading={false} error={null} />,
    )
    expect(screen.getByText(/Bulbasaur/)).toBeInTheDocument()
    expect(screen.getByText(/#001/)).toBeInTheDocument()
  })

  it('displays sprite image', () => {
    render(
      <PokemonDetail pokemon={mockPokemon} loading={false} error={null} />,
    )
    const img = screen.getByRole('img', { name: 'Bulbasaur' })
    expect(img).toHaveAttribute('src', 'https://example.com/1.png')
  })

  it('displays types', () => {
    render(
      <PokemonDetail pokemon={mockPokemon} loading={false} error={null} />,
    )
    expect(screen.getByText('Grass')).toBeInTheDocument()
    expect(screen.getByText('Poison')).toBeInTheDocument()
  })

  it('displays height and weight with converted units', () => {
    render(
      <PokemonDetail pokemon={mockPokemon} loading={false} error={null} />,
    )
    expect(screen.getByText('Height')).toBeInTheDocument()
    expect(screen.getByText('0.7 m')).toBeInTheDocument()
    expect(screen.getByText('Weight')).toBeInTheDocument()
    expect(screen.getByText('6.9 kg')).toBeInTheDocument()
  })

  it('displays category and gender rate', () => {
    render(
      <PokemonDetail pokemon={mockPokemon} loading={false} error={null} />,
    )
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Seed Pokemon')).toBeInTheDocument()
    expect(screen.getByText('Gender Rate')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('displays description', () => {
    render(
      <PokemonDetail pokemon={mockPokemon} loading={false} error={null} />,
    )
    expect(
      screen.getByText('A strange seed was planted on its back at birth.'),
    ).toBeInTheDocument()
  })

  it('displays all 6 stat bars', () => {
    render(
      <PokemonDetail pokemon={mockPokemon} loading={false} error={null} />,
    )
    expect(screen.getByLabelText('HP: 45 out of 255')).toBeInTheDocument()
    expect(screen.getByLabelText('Attack: 49 out of 255')).toBeInTheDocument()
    expect(screen.getByLabelText('Defense: 49 out of 255')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Sp. Atk: 65 out of 255'),
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText('Sp. Def: 65 out of 255'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Speed: 45 out of 255')).toBeInTheDocument()
  })
})
