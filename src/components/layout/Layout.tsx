import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const mainRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0)
    }
  }, [pathname])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main ref={mainRef} className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
      {/* CRT Effect Overlay */}
      <div className="crt-overlay" />
    </div>
  )
}
