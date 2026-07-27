// App.tsx
import './App.css'
import type { Incident } from './types/incident'
import { IncidentList } from './features/incidents/IncidentList'

interface AppProps {
  incidents: Incident[]
}

export default function App({ incidents }: AppProps) {
  return (
    <main>
      <h1>Incident Console</h1>
      <IncidentList incidents={incidents} />
    </main>
  )
}
