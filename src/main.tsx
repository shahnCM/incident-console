import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import type { Incident } from './types/incident.ts'

const res = await fetch('http://localhost:3001/incidents')
const incidents: Incident[] = (await res.json()) as Incident[]

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element #root not found — check index.html')
}

createRoot(root).render(
  <StrictMode>
    <App incidents={incidents} />
  </StrictMode>,
)
