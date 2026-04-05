import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('renders an input with aria-label', () => {
    render(<SearchInput value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Search Pokemon')).toBeInTheDocument()
  })

  it('calls onChange when user types', async () => {
    const handleChange = vi.fn()
    render(<SearchInput value="" onChange={handleChange} />)

    await userEvent.type(screen.getByLabelText('Search Pokemon'), 'pika')
    expect(handleChange).toHaveBeenCalledTimes(4)
    expect(handleChange).toHaveBeenLastCalledWith('a')
  })

  it('does not show clear button when value is empty', () => {
    render(<SearchInput value="" onChange={() => {}} />)
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
  })

  it('shows clear button when value has text', () => {
    render(<SearchInput value="pikachu" onChange={() => {}} />)
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('calls onChange with empty string when clear button is clicked', async () => {
    const handleChange = vi.fn()
    render(<SearchInput value="pikachu" onChange={handleChange} />)

    await userEvent.click(screen.getByLabelText('Clear search'))
    expect(handleChange).toHaveBeenCalledWith('')
  })

  it('calls onChange with empty string when Escape is pressed', async () => {
    const handleChange = vi.fn()
    render(<SearchInput value="pikachu" onChange={handleChange} />)

    const input = screen.getByLabelText('Search Pokemon')
    await userEvent.type(input, '{Escape}')
    expect(handleChange).toHaveBeenCalledWith('')
  })
})
