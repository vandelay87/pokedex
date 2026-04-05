import { render, screen } from '@testing-library/react'
import { StatBar } from './StatBar'

describe('StatBar', () => {
  it('renders label and value', () => {
    render(<StatBar label="HP" value={45} />)
    expect(screen.getByText('HP')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
  })

  it('has aria-label with value out of default max', () => {
    render(<StatBar label="HP" value={45} />)
    expect(screen.getByLabelText('HP: 45 out of 255')).toBeInTheDocument()
  })

  it('has aria-label with value out of custom max', () => {
    render(<StatBar label="Attack" value={100} maxValue={200} />)
    expect(
      screen.getByLabelText('Attack: 100 out of 200'),
    ).toBeInTheDocument()
  })

  it('renders bar fill with correct width via CSS custom property', () => {
    const { container } = render(<StatBar label="HP" value={127} maxValue={255} />)
    const fill = container.querySelector('[class*="fill"]')
    expect(fill).toHaveStyle({ '--stat-width': `${(127 / 255) * 100}%` })
  })

  it('caps bar width at 100% when value exceeds maxValue', () => {
    const { container } = render(<StatBar label="HP" value={300} maxValue={255} />)
    const fill = container.querySelector('[class*="fill"]')
    expect(fill).toHaveStyle({ '--stat-width': '100%' })
  })

  it('has role="progressbar" with correct aria value attributes', () => {
    render(<StatBar label="Attack" value={49} maxValue={255} />)
    const progressbar = screen.getByRole('progressbar', { name: 'Attack: 49 out of 255' })
    expect(progressbar).toHaveAttribute('aria-valuenow', '49')
    expect(progressbar).toHaveAttribute('aria-valuemin', '0')
    expect(progressbar).toHaveAttribute('aria-valuemax', '255')
  })

  it('applies stagger index as CSS custom property', () => {
    const { container } = render(<StatBar label="Speed" value={45} index={3} />)
    const fill = container.querySelector('[class*="fill"]')
    expect(fill).toHaveStyle({ '--stat-index': '3' })
  })

  it('applies red colour for low stat values', () => {
    const { container } = render(<StatBar label="HP" value={30} maxValue={255} />)
    const fill = container.querySelector('[class*="fill"]')
    expect(fill).toHaveStyle({ backgroundColor: '#C03028' })
  })

  it('applies yellow colour for medium stat values', () => {
    const { container } = render(<StatBar label="HP" value={100} maxValue={255} />)
    const fill = container.querySelector('[class*="fill"]')
    expect(fill).toHaveStyle({ backgroundColor: '#F8D030' })
  })

  it('applies green colour for high stat values', () => {
    const { container } = render(<StatBar label="HP" value={200} maxValue={255} />)
    const fill = container.querySelector('[class*="fill"]')
    expect(fill).toHaveStyle({ backgroundColor: '#78C850' })
  })
})
