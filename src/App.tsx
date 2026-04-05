import { Pokedex } from '@pages/Pokedex'
import type { FC } from 'react'
import { BrowserRouter } from 'react-router-dom'

const App: FC = () => {
  return (
    <BrowserRouter>
      <Pokedex />
    </BrowserRouter>
  )
}

export default App
