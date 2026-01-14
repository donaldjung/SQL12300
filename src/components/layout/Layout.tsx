import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
      {/* CRT Effect Overlay */}
      <div className="crt-overlay" />
    </div>
  )
}
