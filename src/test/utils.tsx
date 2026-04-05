import { createElement, type FC, type PropsWithChildren } from 'react'
import { MemoryRouter } from 'react-router-dom'

export const createWrapper = (initialEntries: string[] = ['/']): FC<PropsWithChildren> => {
  const Wrapper: FC<PropsWithChildren> = ({ children }) =>
    createElement(MemoryRouter, { initialEntries }, children)
  return Wrapper
}
