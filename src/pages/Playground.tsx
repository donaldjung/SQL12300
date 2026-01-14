import { useState } from 'react'
import { Play, RotateCcw, Database, Table, Info } from 'lucide-react'
import OutputDisplay from '../components/code/OutputDisplay'

// Sample database schema and data
const sampleData = {
  customers: {
    columns: [
      { name: 'customer_id', type: 'INT' },
      { name: 'customer_name', type: 'VARCHAR' },
      { name: 'email', type: 'VARCHAR' },
      { name: 'city', type: 'VARCHAR' },
      { name: 'signup_date', type: 'DATE' }
    ],
    rows: [
      [1, 'John Smith', 'john@email.com', 'New York', '2023-01-15'],
      [2, 'Jane Doe', 'jane@email.com', 'Los Angeles', '2023-02-20'],
      [3, 'Bob Wilson', 'bob@email.com', 'Chicago', '2023-03-10'],
      [4, 'Alice Brown', 'alice@email.com', 'Houston', '2023-04-05'],
      [5, 'Charlie Davis', 'charlie@email.com', 'Phoenix', '2023-05-12'],
    ]
  },
  orders: {
    columns: [
      { name: 'order_id', type: 'INT' },
      { name: 'customer_id', type: 'INT' },
      { name: 'order_date', type: 'DATE' },
      { name: 'amount', type: 'DECIMAL' },
      { name: 'status', type: 'VARCHAR' }
    ],
    rows: [
      [101, 1, '2024-01-10', 150.00, 'completed'],
      [102, 2, '2024-01-12', 275.50, 'completed'],
      [103, 1, '2024-01-15', 89.99, 'completed'],
      [104, 3, '2024-01-18', 425.00, 'pending'],
      [105, 2, '2024-01-20', 199.99, 'completed'],
      [106, 4, '2024-01-22', 350.00, 'cancelled'],
      [107, 5, '2024-01-25', 125.00, 'completed'],
      [108, 1, '2024-02-01', 299.99, 'pending'],
    ]
  },
  products: {
    columns: [
      { name: 'product_id', type: 'INT' },
      { name: 'product_name', type: 'VARCHAR' },
      { name: 'category', type: 'VARCHAR' },
      { name: 'unit_price', type: 'DECIMAL' },
      { name: 'stock', type: 'INT' }
    ],
    rows: [
      [1, 'Laptop Pro', 'Electronics', 1299.99, 50],
      [2, 'Wireless Mouse', 'Electronics', 49.99, 200],
      [3, 'USB-C Hub', 'Electronics', 79.99, 150],
      [4, 'Notebook Set', 'Office', 24.99, 500],
      [5, 'Desk Lamp', 'Home', 59.99, 100],
      [6, 'Coffee Mug', 'Home', 14.99, 300],
    ]
  }
}

const templates = [
  {
    name: 'Basic SELECT',
    query: `SELECT customer_name, email, city
FROM customers;`
  },
  {
    name: 'WHERE + ORDER BY',
    query: `SELECT order_id, amount, status
FROM orders
WHERE amount > 100
ORDER BY amount DESC;`
  },
  {
    name: 'JOIN Tables',
    query: `SELECT 
    c.customer_name,
    o.order_id,
    o.amount
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
ORDER BY o.amount DESC;`
  },
  {
    name: 'Aggregation',
    query: `SELECT 
    c.customer_name,
    COUNT(o.order_id) AS order_count,
    SUM(o.amount) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name
ORDER BY total_spent DESC;`
  },
  {
    name: 'Window Function',
    query: `SELECT 
    customer_id,
    order_date,
    amount,
    SUM(amount) OVER (
        PARTITION BY customer_id 
        ORDER BY order_date
    ) AS running_total
FROM orders
ORDER BY customer_id, order_date;`
  }
]

// Simple query parser/executor simulation
function executeQuery(query: string): { columns: { name: string; type?: string }[]; rows: (string | number | null)[][]; error?: string } {
  const normalizedQuery = query.toLowerCase().trim()
  
  // Check for simple patterns
  if (!normalizedQuery.startsWith('select')) {
    return { columns: [], rows: [], error: 'Only SELECT queries are supported in this playground.' }
  }

  // Parse FROM clause to identify table
  const fromMatch = normalizedQuery.match(/from\s+(\w+)/)
  if (!fromMatch) {
    return { columns: [], rows: [], error: 'Could not parse FROM clause.' }
  }

  const tableName = fromMatch[1].replace(/\s+as\s+\w+/, '').trim()
  const tableData = sampleData[tableName as keyof typeof sampleData]
  
  if (!tableData) {
    return { columns: [], rows: [], error: `Table "${tableName}" not found. Available: customers, orders, products` }
  }

  // For simple queries, return simulated results
  // This is a simplified simulation - real execution would need full SQL parser
  
  // Check for JOIN
  const hasJoin = normalizedQuery.includes('join')
  
  if (hasJoin) {
    // Simulate a join result
    const joinMatch = normalizedQuery.match(/join\s+(\w+)/)
    const joinTable = joinMatch ? joinMatch[1] : null
    
    if (joinTable === 'orders' || tableName === 'orders') {
      // Customer-Order join simulation
      return {
        columns: [
          { name: 'customer_name', type: 'VARCHAR' },
          { name: 'order_id', type: 'INT' },
          { name: 'amount', type: 'DECIMAL' },
        ],
        rows: [
          ['John Smith', 101, 150.00],
          ['John Smith', 103, 89.99],
          ['John Smith', 108, 299.99],
          ['Jane Doe', 102, 275.50],
          ['Jane Doe', 105, 199.99],
          ['Bob Wilson', 104, 425.00],
          ['Alice Brown', 106, 350.00],
          ['Charlie Davis', 107, 125.00],
        ]
      }
    }
  }

  // Check for aggregation
  const hasAggregate = /\b(count|sum|avg|min|max)\s*\(/i.test(query)
  const hasGroupBy = normalizedQuery.includes('group by')

  if (hasAggregate && hasGroupBy) {
    // Simulate aggregation result
    return {
      columns: [
        { name: 'customer_name', type: 'VARCHAR' },
        { name: 'order_count', type: 'INT' },
        { name: 'total_spent', type: 'DECIMAL' },
      ],
      rows: [
        ['John Smith', 3, 539.98],
        ['Jane Doe', 2, 475.49],
        ['Bob Wilson', 1, 425.00],
        ['Alice Brown', 1, 350.00],
        ['Charlie Davis', 1, 125.00],
      ]
    }
  }

  // Check for window function
  const hasWindow = normalizedQuery.includes('over')
  if (hasWindow) {
    return {
      columns: [
        { name: 'customer_id', type: 'INT' },
        { name: 'order_date', type: 'DATE' },
        { name: 'amount', type: 'DECIMAL' },
        { name: 'running_total', type: 'DECIMAL' },
      ],
      rows: [
        [1, '2024-01-10', 150.00, 150.00],
        [1, '2024-01-15', 89.99, 239.99],
        [1, '2024-02-01', 299.99, 539.98],
        [2, '2024-01-12', 275.50, 275.50],
        [2, '2024-01-20', 199.99, 475.49],
        [3, '2024-01-18', 425.00, 425.00],
        [4, '2024-01-22', 350.00, 350.00],
        [5, '2024-01-25', 125.00, 125.00],
      ]
    }
  }

  // Check for WHERE clause
  const hasWhere = normalizedQuery.includes('where')
  if (hasWhere && tableName === 'orders') {
    // Filter orders simulation
    const amountMatch = normalizedQuery.match(/amount\s*>\s*(\d+)/)
    const threshold = amountMatch ? parseFloat(amountMatch[1]) : 0
    
    const filteredRows = tableData.rows
      .filter(row => (row[3] as number) > threshold)
      .map(row => [row[0], row[3], row[4]])
    
    return {
      columns: [
        { name: 'order_id', type: 'INT' },
        { name: 'amount', type: 'DECIMAL' },
        { name: 'status', type: 'VARCHAR' },
      ],
      rows: filteredRows
    }
  }

  // Default: return columns based on SELECT
  // Parse selected columns
  const selectMatch = query.match(/select\s+([\s\S]+?)\s+from/i)
  if (selectMatch) {
    const selectClause = selectMatch[1].trim()
    
    if (selectClause === '*') {
      return {
        columns: tableData.columns,
        rows: tableData.rows
      }
    }
    
    // Parse column list
    const requestedColumns = selectClause.split(',').map(c => {
      const col = c.trim().toLowerCase()
      // Handle aliases
      const aliasMatch = col.match(/(\w+)\s+as\s+["']?(\w+)["']?/)
      return aliasMatch ? aliasMatch[1] : col.split('.').pop() || col
    })

    const columnIndices = requestedColumns.map(col => 
      tableData.columns.findIndex(c => c.name.toLowerCase() === col)
    ).filter(i => i !== -1)

    const filteredColumns = columnIndices.map(i => tableData.columns[i])
    const filteredRows = tableData.rows.map(row => 
      columnIndices.map(i => row[i])
    )

    return {
      columns: filteredColumns.length > 0 ? filteredColumns : tableData.columns.slice(0, 3),
      rows: filteredRows.length > 0 && filteredRows[0].length > 0 ? filteredRows : tableData.rows.map(r => r.slice(0, 3))
    }
  }

  return {
    columns: tableData.columns,
    rows: tableData.rows
  }
}

export default function Playground() {
  const [query, setQuery] = useState(templates[0].query)
  const [result, setResult] = useState<{ columns: { name: string; type?: string }[]; rows: (string | number | null)[][]; error?: string } | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  const handleExecute = () => {
    setIsExecuting(true)
    // Simulate execution delay
    setTimeout(() => {
      const queryResult = executeQuery(query)
      setResult(queryResult)
      setIsExecuting(false)
    }, 300)
  }

  const handleReset = () => {
    setQuery(templates[0].query)
    setResult(null)
  }

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setQuery(template.query)
    setResult(null)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          SQL <span className="text-sql-blue">Playground</span>
        </h1>
        <p className="text-gray-400">
          Write and execute SQL queries against sample data. Experiment with different queries to practice your skills.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Schema Browser */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card-dark">
            <h3 className="text-sql-blue font-semibold mb-3 flex items-center gap-2">
              <Database size={16} />
              Schema Browser
            </h3>
            <div className="space-y-2">
              {Object.entries(sampleData).map(([tableName, data]) => (
                <div key={tableName}>
                  <button
                    onClick={() => setSelectedTable(selectedTable === tableName ? null : tableName)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-sql-blue/10 rounded transition-colors"
                  >
                    <Table size={14} className="text-sql-green" />
                    <span className="font-mono text-sm">{tableName}</span>
                    <span className="text-gray-500 text-xs ml-auto">
                      {data.rows.length} rows
                    </span>
                  </button>
                  {selectedTable === tableName && (
                    <div className="ml-6 mt-1 space-y-1">
                      {data.columns.map(col => (
                        <div key={col.name} className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                          <span className="text-accent-cyan">{col.name}</span>
                          <span className="text-gray-600">{col.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Query Templates */}
          <div className="card-dark">
            <h3 className="text-accent-cyan font-semibold mb-3">Quick Templates</h3>
            <div className="space-y-2">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateSelect(template)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-sql-blue/10 hover:text-sql-blue rounded transition-colors"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Query Editor */}
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500" />
              <div className="terminal-dot bg-yellow-500" />
              <div className="terminal-dot bg-green-500" />
              <span className="ml-3 text-gray-400 text-sm font-mono">query_editor.sql</span>
            </div>
            <div className="p-4">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-48 bg-transparent text-gray-200 font-mono text-sm resize-none focus:outline-none"
                placeholder="Enter your SQL query here..."
                spellCheck={false}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="btn-primary flex items-center gap-2"
            >
              <Play size={16} />
              {isExecuting ? 'Executing...' : 'Run Query'}
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          {/* Results */}
          {result && (
            <div>
              {result.error ? (
                <div className="card-dark border-red-500/30">
                  <div className="flex items-start gap-3">
                    <Info className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="text-red-400 font-semibold mb-1">Error</h4>
                      <p className="text-gray-300 text-sm">{result.error}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <OutputDisplay
                  title="Query Results"
                  columns={result.columns}
                  rows={result.rows}
                  rowCount={result.rows.length}
                />
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="card-dark border-sql-blue/20">
            <div className="flex items-start gap-3">
              <Info className="text-sql-blue flex-shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-sql-blue font-semibold mb-1">About This Playground</h4>
                <p className="text-gray-400 text-sm">
                  This is a simulated SQL environment with sample data. The query execution 
                  is simplified for demonstration purposes. For full SQL practice, use a 
                  local database like PostgreSQL or SQLite.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
