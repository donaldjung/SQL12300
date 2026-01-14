import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Database, 
  Filter, 
  GitMerge, 
  BarChart3, 
  Layers, 
  TrendingUp, 
  LineChart,
  Code2,
  FileCode,
  Library
} from 'lucide-react'
import { cn } from '../../lib/utils'

const modules = [
  { id: 1, title: 'SQL Fundamentals', icon: Database, path: '/module/1' },
  { id: 2, title: 'Filtering & Sorting', icon: Filter, path: '/module/2' },
  { id: 3, title: 'Joins & Relations', icon: GitMerge, path: '/module/3' },
  { id: 4, title: 'Aggregation', icon: BarChart3, path: '/module/4' },
  { id: 5, title: 'Subqueries & CTEs', icon: Layers, path: '/module/5' },
  { id: 6, title: 'Window Functions', icon: TrendingUp, path: '/module/6' },
  { id: 7, title: 'Advanced Analytics', icon: LineChart, path: '/module/7' },
]

const tools = [
  { title: 'Playground', icon: Code2, path: '/playground' },
  { title: 'Cheat Sheet', icon: FileCode, path: '/cheatsheet' },
  { title: 'Glossary', icon: Library, path: '/glossary' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sql-darker border-r border-sql-blue/20 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-sql-blue/20">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-sql-blue/20 flex items-center justify-center border border-sql-blue/40 group-hover:bg-sql-blue/30 transition-all">
            <Database className="text-sql-blue" size={20} />
          </div>
          <div>
            <h1 className="text-sql-blue font-display font-bold text-lg leading-tight">
              SQL
            </h1>
            <span className="text-gray-500 text-xs font-mono">Data Analytics</span>
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Home */}
        <div className="px-3 mb-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn('flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
                isActive
                  ? 'bg-sql-blue/10 text-sql-blue border-l-2 border-sql-blue'
                  : 'text-gray-400 hover:text-sql-blue hover:bg-sql-blue/5'
              )
            }
          >
            <Home size={18} />
            <span className="font-medium">Home</span>
          </NavLink>
        </div>

        {/* Modules Section */}
        <div className="px-3 mb-2">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Modules
          </h3>
          <div className="space-y-1">
            {modules.map((module) => (
              <NavLink
                key={module.id}
                to={module.path}
                className={({ isActive }) =>
                  cn('flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300',
                    isActive
                      ? 'bg-sql-blue/10 text-sql-blue border-l-2 border-sql-blue'
                      : 'text-gray-400 hover:text-sql-blue hover:bg-sql-blue/5'
                  )
                }
              >
                <module.icon size={16} />
                <span className="text-sm">
                  <span className="font-mono text-xs mr-1 opacity-60">{module.id}.</span>
                  {module.title}
                </span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Tools Section */}
        <div className="px-3 mt-6">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Tools
          </h3>
          <div className="space-y-1">
            {tools.map((tool) => (
              <NavLink
                key={tool.title}
                to={tool.path}
                className={({ isActive }) =>
                  cn('flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300',
                    isActive
                      ? 'bg-accent-cyan/10 text-accent-cyan border-l-2 border-accent-cyan'
                      : 'text-gray-400 hover:text-accent-cyan hover:bg-accent-cyan/5'
                  )
                }
              >
                <tool.icon size={16} />
                <span className="text-sm">{tool.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sql-blue/20">
        <div className="text-center">
          <p className="text-xs text-gray-500 font-mono">
            Standard SQL (ANSI)
          </p>
          <p className="text-xs text-gray-600 font-mono mt-1">
            Analytics Platform v1.0
          </p>
        </div>
      </div>
    </aside>
  )
}
