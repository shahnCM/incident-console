export interface Incident {
  id: string
  title: string
  service: string
  severity: 1 | 2 | 3 | 4
  status: 'open' | 'identified' | 'investigating' | 'monitoring' | 'resolved'
  assigneeId: string
  createdAt: string
  updatedAt: string
  tags: string[]
}
