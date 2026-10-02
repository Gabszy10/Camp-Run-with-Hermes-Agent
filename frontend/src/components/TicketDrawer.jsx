import { Check, Copy, MessageSquare, Sparkles, Users, X } from 'lucide-react'
import { formatLabel, formatMoney, investigationPrompt } from '../lib/tickets.js'
import { Priority } from './Queue.jsx'

export default function TicketDrawer({ ticket, sandboxTime, csrs, assignee, setAssignee, onAssign, onClose, onCopy, copied }) {
  const prompt = investigationPrompt(ticket, sandboxTime)
  return <div className="fixed inset-0 z-40 flex justify-end bg-forest-900/40 backdrop-blur-sm" onClick={onClose}>
    <section className="h-full w-full max-w-[480px] overflow-y-auto bg-white p-6 shadow-drawer md:p-8" role="dialog" aria-modal="true" aria-labelledby="ticket-title" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => { if (event.key === 'Escape') onClose() }}>
      <div className="mb-7 flex items-center justify-between text-[11px] text-slate-500"><span>{ticket.ticket_number} · {ticket.branch_code}</span><button autoFocus aria-label="Close ticket details" className="rounded p-1 hover:bg-forest-50" onClick={onClose}><X size={21} /></button></div>
      <Priority priority={ticket.priority} />
      <h2 id="ticket-title" className="mt-3 font-display text-2xl font-bold leading-tight text-forest-900">{ticket.subject}</h2>
      <div className="mt-2 text-[11px] text-slate-400">{formatLabel(ticket.category)} · {formatLabel(ticket.status)} · {Math.floor(ticket.age_days)} days waiting</div>

      <DetailBlock title={<><MessageSquare size={16} /> Customer’s message</>}>
        <p className="text-[13px] leading-7 text-slate-600">{ticket.description}</p><small className="mt-2 block text-[10px] text-slate-400">Opened {ticket.created_at} · Manila</small>
      </DetailBlock>
      <DetailBlock title="Order & delivery context">
        {ticket.order_created_at > ticket.created_at && <p className="mb-3 rounded bg-amber-50 p-3 text-xs leading-5 text-amber-800">The linked order is dated after this ticket. Verify this relationship before acting.</p>}
        {ticket.order_number ? <>
          <Fact label="Order" value={ticket.order_number} /><Fact label="Total" value={formatMoney(ticket.order_total)} /><Fact label="Status" value={formatLabel(ticket.order_status)} /><Fact label="Delivery" value={formatLabel(ticket.delivery_status) || 'Not linked'} />
          {ticket.promised_by && <Fact label="Promised by" value={ticket.promised_by} />}{ticket.failure_reason && <p className="mt-3 text-xs leading-6 text-slate-600">{ticket.failure_reason}</p>}
        </> : <p className="text-xs leading-6 text-slate-500">No order is linked to this ticket. Verify the details with the customer before recommending a remedy.</p>}
      </DetailBlock>
      <DetailBlock title={<><Users size={16} /> Give this ticket an owner</>}>
        <label className="mb-2 block text-[10px] text-slate-500" htmlFor="csr">Customer service representative</label>
        <select id="csr" className="w-full rounded-lg border border-forest-100 bg-white p-3 text-[11px] text-slate-600" value={assignee} onChange={(event) => setAssignee(event.target.value)}>
          <option value="">Choose a CSR</option>{csrs.map((csr) => <option key={csr.id} value={csr.id}>{csr.name} · {csr.workload} active tickets</option>)}
        </select>
        <button disabled={!assignee} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-forest-800 px-3 py-3 text-[11px] text-white hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-50" onClick={onAssign}><Check size={16} /> Save demo assignment</button>
        <p className="mt-2 text-[10px] leading-5 text-slate-400">Demo assignments stay in this browser. They do not update the sandbox database.</p>
      </DetailBlock>
      <div className="mt-6 rounded-xl bg-lime-100 p-5">
        <h3 className="flex items-center gap-2 text-[13px] font-semibold text-forest-900"><Sparkles size={17} /> Investigate with Hermes</h3>
        <p className="mt-2 text-[11px] leading-5 text-slate-500">Copy this ticket’s context into Hermes to start an investigation.</p>
        <textarea readOnly aria-label="Hermes investigation prompt" className="mt-3 h-28 w-full resize-y rounded-lg border border-forest-100 bg-white/70 p-3 text-[10px] leading-5 text-slate-600" value={prompt} />
        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-forest-200 bg-white/70 px-3 py-3 text-[11px] text-forest-700 hover:bg-white" onClick={() => onCopy(prompt)}><Copy size={15} />{copied ? 'Copied to clipboard' : 'Copy Hermes prompt'}</button>
      </div>
    </section>
  </div>
}

function DetailBlock({ title, children }) {
  return <div className="border-b border-forest-100 py-5"><h3 className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-forest-900">{title}</h3>{children}</div>
}

function Fact({ label, value }) {
  return <div className="my-3 flex justify-between gap-4 text-[11px] text-slate-500"><span>{label}</span><strong className="font-medium text-forest-700">{value}</strong></div>
}
