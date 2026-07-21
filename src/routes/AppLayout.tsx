import { Outlet } from 'react-router-dom'
import { BottomNav } from '../components/ui/BottomNav'
import { Sidebar } from '../components/ui/Sidebar'

export function AppLayout() {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-2xl">
            <Outlet />
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
