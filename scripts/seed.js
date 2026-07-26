// Run: node scripts/seed.js > db.json
const services = ["checkout-api","auth-service","search-index","billing-worker","notifications","image-cdn","user-profile-api","recommendation-engine"]
const titles = ["Elevated error rate","Latency spike","Partial outage","Failed deploy rollback","Database connection pool exhausted","Memory leak detected","Queue backlog growing","Certificate expiring soon","Rate limit misconfiguration","Cache stampede"]
const statuses = ["open","investigating","identified","monitoring","resolved"]
const tagPool = ["api","5xx","db","infra","customer-facing","regression","on-call"]
const names = ["Amara Chen","Diego Ruiz","Priya Nair","Sam O'Connor","Lena Kowalski","Malik Johnson","Yuki Tanaka","Fatima Al-Sayed"]

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const pad = (n, len) => String(n).padStart(len, "0")

const assignees = names.map((name, i) => ({ id: `usr-${pad(i + 1, 2)}`, name, team: services[i % services.length] }))

const incidents = Array.from({ length: 200 }, (_, i) => {
  const createdAt = new Date(Date.now() - Math.random() * 90 * 86400000).toISOString()
  const status = pick(statuses)
  return {
    id: `inc-${pad(i + 1, 4)}`,
    title: `${pick(titles)} — ${pick(services)}`,
    service: pick(services),
    severity: 1 + Math.floor(Math.random() * 4), // 1 low .. 4 critical
    status,
    assigneeId: status === "open" ? null : pick(assignees).id,
    createdAt,
    updatedAt: createdAt,
    tags: Array.from({ length: Math.floor(Math.random() * 3) }, () => pick(tagPool)),
  }
})

console.log(JSON.stringify({ incidents, assignees }, null, 2))