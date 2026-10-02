import { ArrowUpRight, Check, RefreshCw, Search, X } from 'lucide-react'
import { formatLabel, needsRescue } from '../lib/tickets.js'

export default function Queue({ tickets, view, branches, csrs, assignments, search, setSearch, branch, setBranch, onOpen }) {
  const visible = tickets.filter((ticket) =>
    (view === 'all' || needsRescue(ticket)) &&
    (branch === 'all' || ticket.branch_code === branch) &&
    `${ticket.ticket_number} ${ticket.subject} ${ticket.branch_name} ${ticket.category}`.toLowerCase().includes(search.toLowerCase()),
  )

  return <section className="overflow-hidden rounded-xl border border-forest-100 bg-white">
    <div className="flex items-start justify-between gap-4 px-4 py-5 md:px-6">
      <div><h2 className="font-display text-base font-bold text-forest-900">{view === 'rescue' ? 'The rescue queue' : 'Unresolved tickets'} <span className="ml-1 rounded bg-forest-50 px-2 py-1 font-sans text-[10px] text-forest-500">{visible.length}</span></h2>
        <p className="mt-1.5 text-[10px] text-slate-400">Ordered by priority, then longest wait. Select a ticket to investigate.</p></div>
      <button className="flex shrink-0 items-center gap-1.5 text-[10px] text-slate-500 hover:text-forest-800" onClick={() => { setSearch(''); setBranch('all') }}><RefreshCw size={14} /><span className="hidden sm:inline">Reset filters</span></button>
    </div>
    <div className="flex flex-wrap gap-3 px-4 pb-4 md:px-6">
      <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-forest-100 px-3 py-2.5 text-slate-400 focus-within:border-forest-500">
        <Search size={16} /><input aria-label="Search tickets" className="w-full bg-transparent text-[11px] text-forest-900 outline-none placeholder:text-slate-400" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search ticket, issue, or branch…" />
        {search && <button aria-label="Clear search" onClick={() => setSearch('')}><X size={15} /></button>}
      </div>
      <select aria-label="Filter branch" className="w-full rounded-lg border border-forest-100 bg-white px-3 py-2.5 text-[11px] text-slate-600 sm:w-auto" value={branch} onChange={(event) => setBranch(event.target.value)}>
        <option value="all">All branches</option>{branches.map((item) => <option key={item.id} value={item.code}>{item.code} · {item.name}</option>)}
      </select>
    </div>
    <div className="max-h-[570px] overflow-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-forest-50 text-[8px] font-semibold tracking-widest text-slate-500"><tr>{['CONVERSATION', 'BRANCH', 'PRIORITY', 'WAITING', 'OWNER', ''].map((heading) => <th className="border-y border-forest-100 px-4 py-3 md:px-6" key={heading}>{heading}</th>)}</tr></thead>
        <tbody>{visible.map((ticket) => {
          const isRescue = needsRescue(ticket)
          const assigned = assignments[ticket.id]
          const owner = assigned ? csrs.find((csr) => csr.id === assigned)?.name : csrs.find((csr) => csr.id === ticket.assigned_staff_id)?.name
          return <tr key={ticket.id} onClick={() => onOpen(ticket)} className="cursor-pointer border-b border-forest-50 hover:bg-forest-50/70">
            <td className="px-4 py-4 md:px-6"><button className="text-left text-[11px] font-semibold text-forest-900 hover:text-forest-700" onClick={(event) => { event.stopPropagation(); onOpen(ticket) }}>{ticket.subject}</button><div className="mt-1.5 flex gap-2 text-[9px] text-slate-400">{ticket.ticket_number}<span>·</span>{formatLabel(ticket.category)}</div></td>
            <td className="px-4 py-4 md:px-6"><span className="rounded border border-forest-100 bg-forest-50 px-2 py-1 text-[9px] font-semibold text-forest-500">{ticket.branch_code || '—'}</span></td>
            <td className="px-4 py-4 md:px-6"><Priority priority={ticket.priority} /></td>
            <td className="px-4 py-4 text-[11px] md:px-6"><span className={isRescue ? 'font-medium text-amber-700' : ''}>{Math.floor(ticket.age_days)} days</span><div className="mt-1.5 text-[9px] text-slate-400">{ticket.first_response_at ? 'Response recorded' : 'No first response'}</div></td>
            <td className="px-4 py-4 md:px-6">{owner ? <span className="inline-flex items-center gap-1 text-[10px] text-forest-500"><Check size={13} />{owner}</span> : <span className="text-[10px] text-slate-400">Unassigned</span>}</td>
            <td className="px-4 py-4 text-slate-400"><ArrowUpRight size={17} /></td>
          </tr>
        })}</tbody>
      </table>
      {visible.length === 0 && <div className="px-6 py-12 text-center text-slate-500"><Search className="mx-auto" size={28} /><h3 className="mt-3 text-sm font-semibold">No matching tickets</h3><p className="mt-1 text-xs">Try a different search or branch.</p><button className="mt-3 text-xs text-forest-700 underline" onClick={() => { setSearch(''); setBranch('all') }}>Clear filters</button></div>}
    </div>
    <div className="flex justify-between bg-forest-50/40 px-4 py-3 text-[9px] text-slate-400 md:px-6"><span>{visible.length} conversations · {view === 'rescue' ? 'First response overdue' : 'Open & pending'}</span><span className="hidden sm:block">Source: Suki Mart sandbox</span></div>
  </section>
}

export function Priority({ priority }) {
  const colors = { urgent: 'bg-red-50 text-red-700', high: 'bg-amber-50 text-amber-700', medium: 'bg-forest-50 text-forest-500', low: 'bg-slate-100 text-slate-500' }
  return <span className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[9px] ${colors[priority] || colors.low}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{formatLabel(priority)}</span>
}
