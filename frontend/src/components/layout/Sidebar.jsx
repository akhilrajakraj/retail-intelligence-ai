import { Activity, BrainCircuit, TrendingUp, Users } from 'lucide-react'

const navigation = [
  { label: 'Overview', href: '#top', icon: Activity },
  { label: 'Customer segments', href: '#segments', icon: Users },
  { label: 'Inactivity model', href: '#inactivity', icon: TrendingUp },
]

export function Sidebar({ allModelsHealthy }) {
  return <>
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-6 lg:block">
      <Brand />
      <nav aria-label="Main navigation" className="mt-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
        {navigation.map(({ label, href, icon: Icon }, index) => <a key={href} href={href}
          className={'mt-2 flex items-center gap-3 rounded-xl px-4 py-3 font-medium ' +
            (index === 0 ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800')}>
          <Icon size={18} aria-hidden="true" />{label}
        </a>)}
      </nav>
      <ModelStatus allModelsHealthy={allModelsHealthy} />
    </aside>
    <div className="border-b border-slate-200 bg-white px-5 py-3 lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <Brand />
        <span className="flex items-center gap-2 text-xs text-slate-500">
          <span className={'h-2 w-2 rounded-full ' + (allModelsHealthy ? 'bg-emerald-500' : 'bg-amber-500')} />
          {allModelsHealthy ? 'Models ready' : 'Checking models'}
        </span>
      </div>
      <nav aria-label="Main navigation" className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {navigation.map(({ label, href }) => <a key={href} href={href} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">{label}</a>)}
      </nav>
    </div>
  </>
}

function Brand() {
  return <div className="flex items-center gap-3">
    <div className="rounded-xl bg-indigo-600 p-2 text-white"><BrainCircuit size={24} aria-hidden="true" /></div>
    <div><p className="font-bold">Retail Intelligence</p><p className="text-xs text-slate-500">AI Analytics Platform</p></div>
  </div>
}

function ModelStatus({ allModelsHealthy }) {
  return <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-slate-50 p-4">
    <div className="flex items-center gap-2 text-sm font-medium">
      <span className={'h-2 w-2 rounded-full ' + (allModelsHealthy ? 'bg-emerald-500' : 'bg-amber-500')} />
      {allModelsHealthy ? 'Models operational' : 'Checking models'}
    </div>
    <p className="mt-1 text-xs text-slate-500">Local development environment</p>
  </div>
}
