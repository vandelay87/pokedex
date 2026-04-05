import { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

interface UseSelectedPokemonResult {
  selectedId: number | null
  setSelectedId: (id: number | null) => void
}

export const useSelectedPokemon = (): UseSelectedPokemonResult => {
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedId = useMemo(() => {
    const raw = searchParams.get('id')
    if (raw === null || raw === '') return null
    const parsed = Number(raw)
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 151) return null
    return parsed
  }, [searchParams])

  // Remove invalid params from URL
  useEffect(() => {
    const rawId = searchParams.get('id')
    if (rawId !== null && selectedId === null) {
      const next = new URLSearchParams(searchParams)
      next.delete('id')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, selectedId, setSearchParams])

  const setSelectedId = useCallback(
    (id: number | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (id === null) {
          next.delete('id')
        } else {
          next.set('id', String(id))
        }
        return next
      })
    },
    [setSearchParams],
  )

  return { selectedId, setSelectedId }
}
