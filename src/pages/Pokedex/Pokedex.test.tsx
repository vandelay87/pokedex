import type { PokemonDetail, PokemonListResponse } from '@models/pokemon'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createElement, type FC, type PropsWithChildren } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Pokedex } from './Pokedex'

const mockListResponse: PokemonListResponse = {
  pokemon: [
    { id: 1, name: 'Bulbasaur', types: ['Grass', 'Poison'], sprite: 'https://example.com/1.png' },
    { id: 4, name: 'Charmander', types: ['Fire'], sprite: 'https://example.com/4.png' },
    { id: 25, name: 'Pikachu', types: ['Electric'], sprite: 'https://example.com/25.png' },
  ],
  count: 3,
  nextToken: null,
}

const mockDetail: PokemonDetail = {
  id: 25,
  name: 'Pikachu',
  types: ['Electric'],
  sprite: 'https://example.com/25.png',
  height: 4,
  weight: 60,
  category: 'Mouse Pokemon',
  description: 'When several of these Pokemon gather, their electricity can build and cause lightning storms.',
  genderRate: 4,
  stats: {
    hp: 35,
    attack: 55,
    defense: 40,
    specialAttack: 50,
    specialDefense: 50,
    speed: 90,
  },
}

const createWrapper = (initialEntries: string[] = ['/']): FC<PropsWithChildren> => {
  const Wrapper: FC<PropsWithChildren> = ({ children }) =>
    createElement(MemoryRouter, { initialEntries }, children)
  return Wrapper
}

const mockFetch = (url: string) => {
  if (url.endsWith('/pokemon') || url.endsWith('/pokemon/')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockListResponse),
    })
  }
  if (url.endsWith('/pokemon/25')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockDetail),
    })
  }
  return Promise.resolve({ ok: false, status: 404 })
}

let mockIsDesktop = true

vi.mock('@hooks', async () => {
  const actual = await vi.importActual<typeof import('@hooks')>('@hooks')
  return {
    ...actual,
    useMediaQuery: () => mockIsDesktop,
  }
})

describe('Pokedex page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.stubGlobal('fetch', vi.fn(mockFetch))
    mockIsDesktop = true
  })

  it('shows loading state while fetching pokemon list', () => {
    render(<Pokedex />, { wrapper: createWrapper() })
    expect(screen.getByText('Loading Pokemon...')).toBeInTheDocument()
  })

  it('renders pokemon list after fetch', async () => {
    render(<Pokedex />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })

    expect(screen.getByText('Charmander')).toBeInTheDocument()
    expect(screen.getByText('Pikachu')).toBeInTheDocument()
  })

  it('shows empty detail panel prompt when no pokemon is selected', async () => {
    render(<Pokedex />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })

    expect(
      screen.getByText('Select a Pokemon to view details'),
    ).toBeInTheDocument()
  })

  it('filters list when typing in search', async () => {
    const user = userEvent.setup()
    render(<Pokedex />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })

    const searchInput = screen.getByRole('textbox', { name: 'Search Pokemon' })
    await user.type(searchInput, 'pika')

    expect(screen.getByText('Pikachu')).toBeInTheDocument()
    expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument()
    expect(screen.queryByText('Charmander')).not.toBeInTheDocument()
  })

  it('clicking a pokemon shows its details', async () => {
    const user = userEvent.setup()
    render(<Pokedex />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument()
    })

    const pikachuButton = screen.getByRole('button', {
      name: 'Pikachu, Electric type',
    })
    await user.click(pikachuButton)

    await waitFor(() => {
      expect(screen.getByLabelText('HP: 35 out of 255')).toBeInTheDocument()
    })

    expect(screen.getByText('Mouse Pokemon')).toBeInTheDocument()
    expect(screen.getByText(/When several of these Pokemon gather/)).toBeInTheDocument()
  })

  it('opens detail panel when URL has ?id= param', async () => {
    render(<Pokedex />, { wrapper: createWrapper(['/?id=25']) })

    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByLabelText('HP: 35 out of 255')).toBeInTheDocument()
    })

    expect(screen.getByText('Mouse Pokemon')).toBeInTheDocument()
  })

  it('shows error with retry button when list fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    )

    render(<Pokedex />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
  })

  it('retries fetching when retry button is clicked', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockImplementation(mockFetch)

    vi.stubGlobal('fetch', fetchMock)

    render(<Pokedex />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
  })

  describe('desktop layout', () => {
    beforeEach(() => {
      mockIsDesktop = true
    })

    it('shows both list and detail panel side by side', async () => {
      render(<Pokedex />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
      })

      expect(
        screen.getByText('Select a Pokemon to view details'),
      ).toBeInTheDocument()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.queryByText('Back')).not.toBeInTheDocument()
    })
  })

  describe('mobile layout', () => {
    beforeEach(() => {
      mockIsDesktop = false
    })

    it('does not show detail panel when no pokemon is selected', async () => {
      render(<Pokedex />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
      })

      expect(
        screen.queryByText('Select a Pokemon to view details'),
      ).not.toBeInTheDocument()
    })

    it('shows overlay with back button when pokemon is selected', async () => {
      const user = userEvent.setup()
      render(<Pokedex />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('Pikachu')).toBeInTheDocument()
      })

      const pikachuButton = screen.getByRole('button', {
        name: 'Pikachu, Electric type',
      })
      await user.click(pikachuButton)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      expect(screen.getByText('Back')).toBeInTheDocument()
    })

    it('closes overlay and returns focus when back button is clicked', async () => {
      const user = userEvent.setup()
      render(<Pokedex />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('Pikachu')).toBeInTheDocument()
      })

      const pikachuButton = screen.getByRole('button', {
        name: 'Pikachu, Electric type',
      })
      await user.click(pikachuButton)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      const backButton = screen.getByText('Back')
      await user.click(backButton)

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      // Focus should return to the triggering card
      await waitFor(() => {
        expect(document.activeElement).toBe(pikachuButton)
      })
    })

    it('overlay has aria-modal attribute', async () => {
      const user = userEvent.setup()
      render(<Pokedex />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('Pikachu')).toBeInTheDocument()
      })

      await user.click(
        screen.getByRole('button', { name: 'Pikachu, Electric type' }),
      )

      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toHaveAttribute('aria-modal', 'true')
        expect(dialog).toHaveAttribute('aria-label', 'Pokemon details')
      })
    })

    it('closes overlay when Escape is pressed', async () => {
      const user = userEvent.setup()
      render(<Pokedex />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('Pikachu')).toBeInTheDocument()
      })

      const pikachuButton = screen.getByRole('button', {
        name: 'Pikachu, Electric type',
      })
      await user.click(pikachuButton)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      await waitFor(() => {
        expect(document.activeElement).toBe(pikachuButton)
      })
    })
  })
})
