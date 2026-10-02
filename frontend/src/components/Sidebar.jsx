import { ChevronRight, ShieldCheck, Sparkles, Store, Ticket } from 'lucide-react'

export default function Sidebar({ view, setView, rescueCount, ticketCount }) {
  return (
    <aside className="fixed inset-x-0 top-0 z-20 bg-forest-900 px-4 py-3 text-forest-50 md:inset-y-0 md:right-auto md:w-60 md:px-5 md:py-9">
      <a className="mb-4 flex items-center gap-3 font-display text-2xl font-extrabold tracking-tight md:mb-10 md:text-4xl" href="/">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime-300 text-forest-900 md:h-11 md:w-11"><Store size={22} /></span>
        <span>suki<span className="text-lime-300">.</span><small className="mt-1 block font-sans text-[8px] font-medium tracking-[.2em]">MART OPERATIONS</small></span>
      </a>
      <div className="mb-6 hidden items-center gap-2.5 rounded-lg border border-white/10 p-3 text-xs md:flex">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-forest-100 text-forest-700">SM</span>
        <div className="font-semibold">Suki Mart<small className="mt-1 block font-normal text-forest-200">Metro Manila · 12 branches</small></div><ChevronRight className="ml-auto text-forest-200" size={15} />
      </div>
      <div className="mb-3 hidden px-3 text-[9px] tracking-[.18em] text-forest-200 md:block">WORKSPACE</div>
      <nav className="flex gap-2 md:block" aria-label="Workspace">
        <NavButton active={view === 'rescue'} onClick={() => setView('rescue')} icon={ShieldCheck} count={rescueCount}>Complaint rescue</NavButton>
        <NavButton active={view === 'all'} onClick={() => setView('all')} icon={Ticket} count={ticketCount}>All unresolved</NavButton>
      </nav>
      <div className="absolute bottom-9 left-8 hidden text-xs md:block">
        <div className="flex items-center gap-2 text-lime-100"><Sparkles size={18} /> Built for Hermes</div>
        <p className="mt-3 leading-6 text-forest-200">From overlooked complaint<br />to a clear next step.</p>
        <div className="mt-7 flex items-center gap-2 border-t border-white/10 pt-5 text-[10px] text-forest-200"><span className="h-1.5 w-1.5 rounded-full bg-lime-300" /> Sandbox workspace</div>
      </div>
    </aside>
  )
}

function NavButton({ active, onClick, icon: Icon, count, children }) {
  return <button onClick={onClick} className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-[11px] md:mb-2 md:w-full md:gap-3 md:px-3 md:py-3 ${active ? 'bg-white/10 text-lime-100' : 'text-forest-200 hover:bg-white/5'}`}>
    <Icon size={18} />{children}<span className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px] md:ml-auto">{count}</span>
  </button>
}
