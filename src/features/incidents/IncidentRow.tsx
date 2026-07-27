import type { Incident } from '../../types/incident'
export function IncidentRow({ incident }: { incident: Incident }) {
  return (
    <tr>
      <td>{incident.title}</td>
      <td>{incident.severity}</td>
      <td>{incident.status}</td>
      <td>{new Date(incident.createdAt).toLocaleString()}</td>
    </tr>
  )
}
