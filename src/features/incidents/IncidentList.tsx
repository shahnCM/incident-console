import type { Incident } from '../../types/incident'
import { IncidentRow } from './IncidentRow'

export function IncidentList({ incidents }: { incidents: Incident[] }) {
  return (
    <table className="incident-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Severity</th>
          <th>Status</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {incidents.map((incident) => (
          <IncidentRow key={incident.id} incident={incident} />
        ))}
      </tbody>
    </table>
  )
}
