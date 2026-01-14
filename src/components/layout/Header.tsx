import { Search, Terminal, Bell, X, FileText, Code, BookOpen, ArrowRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// Search data for SQL modules and tools
const searchData = [
  { 
    title: 'SQL Fundamentals', 
    path: '/module/1', 
    type: 'module',
    keywords: ['basics', 'introduction', 'select', 'from', 'columns', 'tables', 'data types', 'alias'],
    description: 'SELECT, FROM, column aliases, DISTINCT, data types'
  },
  { 
    title: 'Filtering & Sorting', 
    path: '/module/2', 
    type: 'module',
    keywords: ['where', 'filter', 'order by', 'sort', 'limit', 'offset', 'between', 'like', 'in', 'null'],
    description: 'WHERE clauses, comparison operators, ORDER BY, LIMIT'
  },
  { 
    title: 'Joins & Relations', 
    path: '/module/3', 
    type: 'module',
    keywords: ['join', 'inner', 'left', 'right', 'full', 'cross', 'self', 'on', 'foreign key', 'relationship'],
    description: 'INNER, LEFT, RIGHT, FULL, CROSS JOINs and self-joins'
  },
  { 
    title: 'Aggregation', 
    path: '/module/4', 
    type: 'module',
    keywords: ['count', 'sum', 'avg', 'min', 'max', 'group by', 'having', 'aggregate', 'grouping'],
    description: 'COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING'
  },
  { 
    title: 'Subqueries & CTEs', 
    path: '/module/5', 
    type: 'module',
    keywords: ['subquery', 'cte', 'with', 'common table expression', 'nested', 'correlated', 'exists', 'scalar'],
    description: 'Scalar subqueries, correlated subqueries, WITH clause'
  },
  { 
    title: 'Window Functions', 
    path: '/module/6', 
    type: 'module',
    keywords: ['window', 'over', 'partition by', 'row_number', 'rank', 'dense_rank', 'lag', 'lead', 'ntile'],
    description: 'OVER, PARTITION BY, ROW_NUMBER, RANK, LAG, LEAD'
  },
  { 
    title: 'Advanced Analytics', 
    path: '/module/7', 
    type: 'module',
    keywords: ['case', 'pivot', 'unpivot', 'cohort', 'analysis', 'performance', 'optimization', 'index'],
    description: 'CASE expressions, pivoting, cohort analysis, performance'
  },
  { 
    title: 'Playground', 
    path: '/playground', 
    type: 'tool',
    keywords: ['editor', 'code', 'run', 'execute', 'query', 'test', 'try', 'practice'],
    description: 'Interactive SQL query editor'
  },
  { 
    title: 'Cheat Sheet', 
    path: '/cheatsheet', 
    type: 'tool',
    keywords: ['reference', 'quick', 'syntax', 'commands', 'statements', 'guide', 'functions'],
    description: 'Quick reference for SQL syntax'
  },
  { 
    title: 'Glossary', 
    path: '/glossary', 
    type: 'tool',
    keywords: ['terms', 'definitions', 'database', 'vocabulary', 'meaning', 'concepts'],
    description: 'SQL and database terminology'
  },
]

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Filter results based on search query
  const searchResults = searchQuery.trim() === '' 
    ? searchData 
    : searchData.filter(item => {
        const query = searchQuery.toLowerCase()
        return (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.keywords.some(keyword => keyword.toLowerCase().includes(query))
        )
      })

  // Keyboard shortcut to open search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  // Handle keyboard navigation in results
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
      e.preventDefault()
      navigateToResult(searchResults[selectedIndex].path)
    }
  }

  const navigateToResult = (path: string) => {
    navigate(path)
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'module': return <FileText size={16} className="text-sql-blue" />
      case 'tool': return <Code size={16} className="text-accent-cyan" />
      default: return <BookOpen size={16} className="text-gray-400" />
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-gray-900/80 backdrop-blur-md border-b border-sql-blue/20 px-8 flex items-center justify-between">
        {/* Search trigger */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="relative w-96 flex items-center"
        >
          <Search className="absolute left-3 text-gray-500" size={18} />
          <div className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-sql-blue/20 rounded-lg text-gray-500 text-left font-mono text-sm cursor-pointer hover:border-sql-blue/40 transition-all">
            Search SQL documentation...
          </div>
          <kbd className="absolute right-3 px-2 py-0.5 bg-gray-900 rounded text-xs text-gray-500 border border-gray-700">
            ⌘K
          </kbd>
        </button>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-sql-blue/10 rounded-full border border-sql-blue/30">
            <div className="w-2 h-2 rounded-full bg-sql-blue animate-pulse" />
            <span className="text-sql-blue text-xs font-mono">ANSI SQL</span>
          </div>

          {/* Terminal toggle */}
          <button className="p-2 text-gray-400 hover:text-sql-blue hover:bg-sql-blue/10 rounded-lg transition-all">
            <Terminal size={20} />
          </button>

          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-all relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-cyan rounded-full" />
          </button>

          {/* Version badge */}
          <div className="px-3 py-1 bg-gray-800 rounded-md border border-sql-blue/20">
            <span className="text-xs font-mono text-sql-blue">SQL:2023</span>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setIsSearchOpen(false)
              setSearchQuery('')
            }}
          />
          
          {/* Modal */}
          <div className="relative w-full max-w-2xl bg-gray-900 border border-sql-blue/30 rounded-xl shadow-2xl shadow-sql-blue/10 overflow-hidden">
            {/* Search input */}
            <div className="flex items-center px-4 border-b border-sql-blue/20">
              <Search className="text-sql-blue" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search modules, tools, and documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 px-4 py-4 bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none font-mono"
              />
              <button 
                onClick={() => {
                  setIsSearchOpen(false)
                  setSearchQuery('')
                }}
                className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-sql-blue/10 rounded transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Search size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No results found for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="py-2">
                  {searchResults.map((result, index) => (
                    <button
                      key={result.path}
                      onClick={() => navigateToResult(result.path)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-all ${
                        index === selectedIndex 
                          ? 'bg-sql-blue/10 border-l-2 border-sql-blue' 
                          : 'hover:bg-sql-blue/5 border-l-2 border-transparent'
                      }`}
                    >
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-800 rounded-lg">
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-200 font-medium truncate">{result.title}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            result.type === 'module' 
                              ? 'bg-sql-blue/20 text-sql-blue' 
                              : 'bg-accent-cyan/20 text-accent-cyan'
                          }`}>
                            {result.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{result.description}</p>
                      </div>
                      <ArrowRight size={16} className={`flex-shrink-0 transition-opacity ${
                        index === selectedIndex ? 'text-sql-blue opacity-100' : 'opacity-0'
                      }`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-sql-blue/20 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">↵</kbd>
                to select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">esc</kbd>
                to close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
