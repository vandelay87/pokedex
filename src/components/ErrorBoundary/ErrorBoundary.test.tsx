import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { FC } from 'react'

import { ErrorBoundary } from './ErrorBoundary'

const ThrowingChild: FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <p>Child content</p>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <p>Hello</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('shows fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/Something went wrong: Test error/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  it('resets error state when "Try again" is clicked', async () => {
    const user = userEvent.setup()

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()

    // Re-render with non-throwing child before clicking retry
    rerender(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={false} />
      </ErrorBoundary>,
    )

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('resets when resetKey changes', () => {
    const { rerender } = render(
      <ErrorBoundary resetKey={1}>
        <ThrowingChild shouldThrow />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()

    rerender(
      <ErrorBoundary resetKey={2}>
        <ThrowingChild shouldThrow={false} />
      </ErrorBoundary>,
    )

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })
})
