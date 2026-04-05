import { PokemonDetail } from '@components/PokemonDetail'
import { PokemonList } from '@components/PokemonList'
import { SearchInput } from '@components/SearchInput'
import { useMediaQuery, usePokemonDetail, usePokemonList, useSearchFilter, useSelectedPokemon } from '@hooks'
import { useCallback, useEffect, useRef, type FC, type KeyboardEvent } from 'react'

import styles from './Pokedex.module.css'

const DESKTOP_QUERY = '(min-width: 768px)'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export const Pokedex: FC = () => {
  const { pokemon, loading: listLoading, error: listError } = usePokemonList()
  const { query, setQuery, filtered } = useSearchFilter(pokemon)
  const { selectedId, setSelectedId } = useSelectedPokemon()
  const {
    detail,
    loading: detailLoading,
    error: detailError,
  } = usePokemonDetail(selectedId)

  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const isMobile = !isDesktop
  const triggerRef = useRef<HTMLElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)

  const showOverlay = isMobile && selectedId !== null

  const handleSelect = useCallback(
    (id: number) => {
      const activeEl = document.activeElement
      if (activeEl instanceof HTMLElement) {
        triggerRef.current = activeEl
      }
      setSelectedId(id)
    },
    [setSelectedId],
  )

  const closeOverlay = useCallback(() => {
    setSelectedId(null)
    const trigger = triggerRef.current
    if (trigger) {
      requestAnimationFrame(() => trigger.focus())
      triggerRef.current = null
    }
  }, [setSelectedId])

  const handleOverlayKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeOverlay()
        return
      }

      if (e.key !== 'Tab') return

      const overlay = overlayRef.current
      if (!overlay) return

      const focusable = Array.from(
        overlay.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [closeOverlay],
  )

  // Focus the overlay when it opens
  useEffect(() => {
    if (showOverlay && overlayRef.current) {
      const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
        FOCUSABLE_SELECTOR,
      )
      if (focusable.length > 0) {
        focusable[0].focus()
      }
    }
  }, [showOverlay])

  if (listLoading) {
    return <p>Loading Pokemon...</p>
  }

  if (listError) {
    return <p>Error: {listError}</p>
  }

  return (
    <div className={styles.layout}>
      <div className={styles.listPanel}>
        <SearchInput value={query} onChange={setQuery} />
        <PokemonList
          pokemon={filtered}
          onSelect={handleSelect}
          selectedId={selectedId}
        />
      </div>
      {(isDesktop || showOverlay) && (
        <div
          ref={overlayRef}
          className={styles.detailPanel}
          role={isMobile ? 'dialog' : undefined}
          aria-modal={isMobile ? true : undefined}
          aria-label={isMobile ? 'Pokemon details' : undefined}
          onKeyDown={isMobile ? handleOverlayKeyDown : undefined}
        >
          {isMobile && (
            <button
              type="button"
              className={styles.backButton}
              onClick={closeOverlay}
            >
              Back
            </button>
          )}
          <PokemonDetail
            pokemon={detail}
            loading={detailLoading}
            error={detailError}
          />
        </div>
      )}
    </div>
  )
}
