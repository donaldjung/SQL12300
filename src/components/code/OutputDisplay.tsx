import { Table, X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Column {
  name: string
  type?: string
}

interface OutputDisplayProps {
  columns: Column[]
  rows: (string | number | null)[][]
  title?: string
  className?: string
  onClose?: () => void
  rowCount?: number
}

export default function OutputDisplay({
  columns,
  rows,
  title = 'Query Results',
  className,
  onClose,
  rowCount,
}: OutputDisplayProps) {
  return (
    <div className={cn('terminal-window', className)}>
      {/* Header */}
      <div className="terminal-header">
        <Table size={16} className="text-sql-green" />
        <span className="ml-2 text-sm font-mono text-sql-green">
          {title}
        </span>
        {rowCount !== undefined && (
          <span className="ml-2 text-xs text-gray-500">
            ({rowCount} row{rowCount !== 1 ? 's' : ''})
          </span>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Results table */}
      <div className="p-4 overflow-x-auto">
        <table className="result-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>
                  {col.name}
                  {col.type && (
                    <span className="ml-1 text-gray-500 font-normal text-[10px]">
                      ({col.type})
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>
                    {cell === null ? (
                      <span className="text-gray-500 italic">NULL</span>
                    ) : (
                      String(cell)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
