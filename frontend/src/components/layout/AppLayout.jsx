import { Sidebar } from './Sidebar'

export function AppLayout({ children, allModelsHealthy }) {
  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <Sidebar allModelsHealthy={allModelsHealthy} />
    <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:ml-64 lg:p-10">{children}</main>
  </div>
}
