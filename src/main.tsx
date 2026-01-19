import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BoardProvider } from './context/BoardContext'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BoardProvider>
      <App />
    </BoardProvider>
  </StrictMode>,
)
