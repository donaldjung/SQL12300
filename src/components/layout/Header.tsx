import { Search, Database, Bell } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="sticky top-0 z-40 h-16 bg-sql-darker/80 backdrop-blur-md border-b border-sql-blue/20 px-8 flex items-center justify-between">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search SQL documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-sql-terminal border border-sql-blue/20 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-sql-blue/50 focus:ring-1 focus:ring-sql-blue/30 transition-all font-mono text-sm"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-sql-dark rounded text-xs text-gray-500 border border-gray-700">
          ⌘K
        </kbd>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-sql-blue/10 rounded-full border border-sql-blue/30">
          <div className="w-2 h-2 rounded-full bg-sql-green animate-pulse" />
          <span className="text-sql-blue text-xs font-mono">ANSI SQL</span>
        </div>

        {/* Database icon */}
        <button className="p-2 text-gray-400 hover:text-sql-blue hover:bg-sql-blue/10 rounded-lg transition-all">
          <Database size={20} />
        </button>

        {/* Notifications */}
        <button className="p-2 text-gray-400 hover:text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-all relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-cyan rounded-full" />
        </button>

        {/* Version badge */}
        <div className="px-3 py-1 bg-sql-terminal rounded-md border border-sql-blue/20">
          <span className="text-xs font-mono text-sql-blue">SQL:2023</span>
        </div>
      </div>
    </header>
  )
}
