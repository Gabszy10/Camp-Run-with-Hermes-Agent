import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Clock3, Sparkles, Ticket, Users } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import MetricCard from './components/MetricCard.jsx'
import Queue from './components/Queue.jsx'
import TicketDrawer from './components/TicketDrawer.jsx'
import { getSavedAssignments, needsRescue, ticketRank } from './lib/tickets.js'

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [branch, setBranch] = useState('all')
  const [view, setView] = useState('rescue')
  const [selected, setSelected] = useState(null)
  const [assignee, setAssignee] = useState('')
  const [toast, setToast] = useState('')
  const [copied, setCopied] = useState(false)
  const [assignments, setAssignments] = useState(getSavedAssignments)

  useEffect(() => {
    fetch('/sandbox.json')
      .then((response) => { if (!response.ok) throw new Error('Could not load sandbox data'); return response.json() })
      .then(setData)
      .catch((cause) => setError(cause.message))
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = setTimeout(() => setToast(''), 4000)
    return () => clearTimeout(timeout)
  }, [toast])

  const tickets = useMemo(() => data ? [...data.tickets].sort((a, b) => ticketRank(b) - ticketRank(a)) : [], [data])
  const rescue = useMemo(() => tickets.filter(needsRescue), [tickets])
  const assignedCount = rescue.filter((ticket) => assignments[ticket.id]).length
  const csrs = useMemo(() => data?.csrs.map((csr) => {
    const adjustment = Object.entries(assignments).reduce((count, [id, staffId]) => {
      const ticket = tickets.find((item) => item.id === Number(id))
      if (!ticket) return count
      if (staffId === csr.id && ticket.assigned_staff_id !== csr.id) return count + 1
      if (staffId !== csr.id && ticket.assigned_staff_id === csr.id) return count - 1
      return count
    }, 0)
    return { ...csr, workload: csr.workload + adjustment }
  }).sort((a, b) => a.workload - b.workload) || [], [data, assignments, tickets])

  function openTicket(ticket) {
    setSelected(ticket)
    setAssignee(String(assignments[ticket.id] || ticket.assigned_staff_id || ''))
    setCopied(false)
  }

  function assignTicket() {
    if (!assignee || !selected) return
    const next = { ...assignments, [selected.id]: Number(assignee) }
    try {
      localStorage.setItem('suki-assignments', JSON.stringify(next))
      setAssignments(next)
      setToast(`${selected.ticket_number} assigned in this browser`)
    } catch {
      setToast('Could not save. Browser storage is unavailable.')
    }
  }

  async function copyPrompt(prompt) {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
    } catch {
      setToast('Clipboard unavailable. Select and copy the prompt below.')
    }
  }

  if (error) return <StateScreen icon={AlertCircle} title="Unable to open the dashboard" message={error} action={<button className="mt-3 rounded-lg bg-forest-800 px-4 py-2 text-sm text-white" onClick={() => location.reload()}>Try again</button>} />
  if (!data) return <StateScreen icon={Ticket} title="Opening Suki Mart…" message="Getting your customer-care queue ready." />

  return <div className="min-h-screen bg-[#f7f9f7] text-slate-800">
    <Sidebar view={view} setView={setView} rescueCount={rescue.length} ticketCount={tickets.length} />
    <main className="pt-[104px] md:ml-60 md:pt-0">
      <header className="flex h-14 items-center justify-between border-b border-forest-100 bg-white px-5 md:h-[76px] md:px-10">
        <div className="flex items-center gap-2 text-[11px] text-slate-500">Workspace <span className="text-slate-300">›</span> Customer experience</div>
        <div className="flex items-center gap-4 text-[10px] text-slate-500"><span className="hidden items-center gap-2 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-lime-300" />Data snapshot</span><span className="grid h-8 w-8 place-items-center rounded-full bg-amber-50 font-semibold text-amber-800">OP</span></div>
      </header>
      <div className="mx-auto max-w-[1500px] px-4 py-7 md:px-10 md:py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div><div className="text-[8px] font-bold tracking-[.18em] text-forest-500 md:text-[9px]">CUSTOMER CARE, WITH A LITTLE MORE CARE</div><h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-forest-900 md:text-[33px]">{view === 'rescue' ? 'No complaint left behind.' : 'Your customer-care inbox.'}</h1><p className="mt-2 text-[11px] text-slate-500 md:text-xs">{view === 'rescue' ? 'Find forgotten conversations. Give every customer a next step.' : 'A single view of open and pending tickets across your branches.'}</p></div>
          <div className="hidden max-w-48 flex-wrap items-center gap-2 text-[11px] text-slate-500 sm:flex"><Clock3 size={15} />{new Date(data.sandbox_now.replace(' ', 'T')).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}<small className="w-full text-right text-[10px] text-slate-400">Sandbox time · Manila</small></div>
        </div>
        <section className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4 md:gap-4">
          <MetricCard icon={Ticket} title="Unresolved tickets" value={tickets.length} note="Across all 12 branches" />
          <MetricCard icon={Clock3} title="Needs a first response" value={rescue.length} note="Unanswered for more than 7 days" warning />
          <MetricCard icon={AlertCircle} title="High-priority rescues" value={rescue.filter((ticket) => ['urgent', 'high'].includes(ticket.priority)).length} note="High or urgent priority" />
          <MetricCard icon={Users} title="Assigned in this demo" value={assignedCount} note="Saved on this browser" />
        </section>
        <section className="mb-7 flex items-start gap-3 rounded-xl border border-lime-300/50 bg-lime-100 px-4 py-4 md:items-center md:gap-4 md:px-6">
          <span className="rounded-lg bg-lime-300/40 p-2.5 text-forest-700"><Sparkles size={21} /></span><div><div className="text-[13px] font-bold text-forest-800">A smaller queue. A bigger impact.</div><p className="mt-1 text-[10px] leading-5 text-forest-700/80 md:text-[11px]">{rescue.length} customers have waited over a week without a first response. Start with urgent cases, review the facts, then give each ticket an owner.</p></div><span className="ml-auto hidden shrink-0 rounded bg-lime-300/40 px-2 py-1.5 text-[8px] tracking-widest text-forest-700 lg:block">RESCUE BRIEF</span>
        </section>
        <Queue tickets={tickets} view={view} branches={data.branches} csrs={csrs} assignments={assignments} search={search} setSearch={setSearch} branch={branch} setBranch={setBranch} onOpen={openTicket} />
        <footer className="flex justify-between gap-3 py-6 text-[9px] text-slate-400"><span>Made for the moments that matter.</span><span>Suki Mart · CAMP / RUN 2026</span></footer>
      </div>
    </main>
    {selected && <TicketDrawer ticket={selected} sandboxTime={data.sandbox_now} csrs={csrs} assignee={assignee} setAssignee={setAssignee} onAssign={assignTicket} onClose={() => setSelected(null)} onCopy={copyPrompt} copied={copied} />}
    {toast && <div role="status" className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-forest-900 px-5 py-3 text-xs text-white shadow-lg"><span className="text-lime-300">✓</span>{toast}</div>}
  </div>
}

function StateScreen({ icon: Icon, title, message, action }) {
  return <main className="flex min-h-screen flex-col items-center justify-center bg-forest-50 px-6 text-center text-forest-700"><Icon size={34} /><h1 className="mt-4 font-display text-xl font-bold">{title}</h1><p className="mt-2 text-sm text-slate-500">{message}</p>{action}</main>
}
