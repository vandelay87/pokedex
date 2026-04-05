import { renderHook, act } from '@testing-library/react'
import type { FC, PropsWithChildren } from 'react'
import { createElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { useSelectedPokemon } from './useSelectedPokemon'

const createWrapper = (initialEntries: string[] = ['/']): FC<PropsWithChildren> => {
  const Wrapper: FC<PropsWithChildren> = ({ children }) =>
    createElement(MemoryRouter, { initialEntries }, children)
  return Wrapper
}

describe('useSelectedPokemon', () => {
  it('returns null selectedId when no ?id= param is present', () => {
    const { result } = renderHook(() => useSelectedPokemon(), {
      wrapper: createWrapper(['/'])
    })
    expect(result.current.selectedId).toBeNull()
  })

  it('parses valid ?id= param', () => {
    const { result } = renderHook(() => useSelectedPokemon(), {
      wrapper: createWrapper(['/?id=25']),
    })
    expect(result.current.selectedId).toBe(25)
  })

  it('returns null for non-numeric ?id= value', () => {
    const { result } = renderHook(() => useSelectedPokemon(), {
      wrapper: createWrapper(['/?id=abc']),
    })
    expect(result.current.selectedId).toBeNull()
  })

  it('returns null for empty ?id= value', () => {
    const { result } = renderHook(() => useSelectedPokemon(), {
      wrapper: createWrapper(['/?id=']),
    })
    expect(result.current.selectedId).toBeNull()
  })

  it('returns null for out-of-range ?id= value (0)', () => {
    const { result } = renderHook(() => useSelectedPokemon(), {
      wrapper: createWrapper(['/?id=0']),
    })
    expect(result.current.selectedId).toBeNull()
  })

  it('returns null for out-of-range ?id= value (152)', () => {
    const { result } = renderHook(() => useSelectedPokemon(), {
      wrapper: createWrapper(['/?id=152']),
    })
    expect(result.current.selectedId).toBeNull()
  })

  it('returns null for floating point ?id= value', () => {
    const { result } = renderHook(() => useSelectedPokemon(), {
      wrapper: createWrapper(['/?id=1.5']),
    })
    expect(result.current.selectedId).toBeNull()
  })

  it('setSelectedId updates the selected id', () => {
    const { result } = renderHook(() => useSelectedPokemon(), {
      wrapper: createWrapper(['/'])
    })

    act(() => {
      result.current.setSelectedId(25)
    })

    expect(result.current.selectedId).toBe(25)
  })

  it('setSelectedId(null) clears the selected id', () => {
    const { result } = renderHook(() => useSelectedPokemon(), {
      wrapper: createWrapper(['/?id=25']),
    })

    expect(result.current.selectedId).toBe(25)

    act(() => {
      result.current.setSelectedId(null)
    })

    expect(result.current.selectedId).toBeNull()
  })
})
