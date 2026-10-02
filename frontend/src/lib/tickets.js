export const formatLabel = (value = '') => value.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())

export const formatMoney = (value) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value)

export const needsRescue = (ticket) => !ticket.first_response_at && ticket.age_days > 7

export const ticketRank = (ticket) => ({ urgent: 4, high: 3, medium: 2, low: 1 }[ticket.priority] * 1000 + ticket.age_days)

export const investigationPrompt = (ticket, sandboxTime) =>
  `Investigate Suki Mart ticket ${ticket.ticket_number} (ID ${ticket.id}) at ${ticket.branch_code}. Use the suki MCP server and sandbox time ${sandboxTime}. Check its order and delivery context, explain the priority, and recommend the next customer-care action. If the necessary tools are unavailable, tell me which tools need to be added.`

export function getSavedAssignments() {
  try {
    return JSON.parse(localStorage.getItem('suki-assignments') || '{}')
  } catch {
    return {}
  }
}
