export default function MetricCard({ icon: Icon, title, value, note, warning = false }) {
  return <article className={`rounded-xl border p-4 md:p-5 ${warning ? 'border-amber-200 bg-amber-50/50' : 'border-forest-100 bg-white'}`}>
    <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500 md:text-[11px]">{title}<Icon className={warning ? 'text-amber-600' : 'text-slate-400'} size={17} /></div>
    <div className="mt-2 font-display text-3xl font-bold tracking-tight text-forest-900 md:mt-3 md:text-4xl">{value}{warning && <span className="ml-2 font-sans text-[9px] font-medium tracking-normal text-amber-700">need attention</span>}</div>
    <p className="mt-1.5 text-[9px] text-slate-400">{note}</p>
  </article>
}
