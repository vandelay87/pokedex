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

  it('renders bar with correct width percentage', () => {
    const { container } = render(<StatBar label="HP" value={127} maxValue={255} />)
    const bar = container.querySelector('[style]')
    expect(bar).toHaveStyle({ width: `${(127 / 255) * 100}%` })
  })

  it('caps bar width at 100% when value exceeds maxValue', () => {
    const { container } = render(<StatBar label="HP" value={300} maxValue={255} />)
    const bar = container.querySelector('[style]')
    expect(bar).toHaveStyle({ width: '100%' })
  })
})
