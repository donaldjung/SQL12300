import { FileCode } from 'lucide-react'
import CodeBlock from '../components/code/CodeBlock'

const sections = [
  {
    title: 'Basic Queries',
    color: 'text-sql-blue',
    items: [
      {
        name: 'SELECT',
        syntax: 'SELECT column1, column2 FROM table;',
        description: 'Retrieve specific columns'
      },
      {
        name: 'SELECT ALL',
        syntax: 'SELECT * FROM table;',
        description: 'Retrieve all columns'
      },
      {
        name: 'DISTINCT',
        syntax: 'SELECT DISTINCT column FROM table;',
        description: 'Remove duplicate values'
      },
      {
        name: 'ALIAS',
        syntax: 'SELECT column AS alias FROM table;',
        description: 'Rename column in output'
      },
    ]
  },
  {
    title: 'Filtering',
    color: 'text-sql-green',
    items: [
      {
        name: 'WHERE',
        syntax: 'WHERE column = value',
        description: 'Filter rows by condition'
      },
      {
        name: 'AND / OR',
        syntax: 'WHERE cond1 AND cond2',
        description: 'Combine conditions'
      },
      {
        name: 'BETWEEN',
        syntax: 'WHERE column BETWEEN a AND b',
        description: 'Range check (inclusive)'
      },
      {
        name: 'IN',
        syntax: "WHERE column IN (val1, val2)",
        description: 'Match any in list'
      },
      {
        name: 'LIKE',
        syntax: "WHERE column LIKE 'pattern%'",
        description: 'Pattern matching'
      },
      {
        name: 'IS NULL',
        syntax: 'WHERE column IS NULL',
        description: 'Check for NULL values'
      },
    ]
  },
  {
    title: 'Sorting & Limiting',
    color: 'text-accent-cyan',
    items: [
      {
        name: 'ORDER BY',
        syntax: 'ORDER BY column ASC|DESC',
        description: 'Sort results'
      },
      {
        name: 'LIMIT',
        syntax: 'LIMIT n',
        description: 'Limit result count'
      },
      {
        name: 'OFFSET',
        syntax: 'LIMIT n OFFSET m',
        description: 'Skip rows (pagination)'
      },
    ]
  },
  {
    title: 'Joins',
    color: 'text-accent-purple',
    items: [
      {
        name: 'INNER JOIN',
        syntax: 'FROM a JOIN b ON a.id = b.a_id',
        description: 'Matching rows only'
      },
      {
        name: 'LEFT JOIN',
        syntax: 'FROM a LEFT JOIN b ON a.id = b.a_id',
        description: 'All from left + matching'
      },
      {
        name: 'RIGHT JOIN',
        syntax: 'FROM a RIGHT JOIN b ON a.id = b.a_id',
        description: 'All from right + matching'
      },
      {
        name: 'FULL OUTER',
        syntax: 'FROM a FULL OUTER JOIN b ON ...',
        description: 'All rows from both'
      },
      {
        name: 'CROSS JOIN',
        syntax: 'FROM a CROSS JOIN b',
        description: 'Cartesian product'
      },
    ]
  },
  {
    title: 'Aggregation',
    color: 'text-accent-orange',
    items: [
      {
        name: 'COUNT',
        syntax: 'COUNT(*) / COUNT(column)',
        description: 'Count rows'
      },
      {
        name: 'SUM',
        syntax: 'SUM(column)',
        description: 'Sum of values'
      },
      {
        name: 'AVG',
        syntax: 'AVG(column)',
        description: 'Average value'
      },
      {
        name: 'MIN / MAX',
        syntax: 'MIN(column) / MAX(column)',
        description: 'Minimum / Maximum'
      },
      {
        name: 'GROUP BY',
        syntax: 'GROUP BY column',
        description: 'Group rows for aggregation'
      },
      {
        name: 'HAVING',
        syntax: 'HAVING COUNT(*) > 5',
        description: 'Filter grouped results'
      },
    ]
  },
  {
    title: 'Subqueries & CTEs',
    color: 'text-pink-400',
    items: [
      {
        name: 'Scalar Subquery',
        syntax: 'WHERE col = (SELECT ...)',
        description: 'Returns single value'
      },
      {
        name: 'IN Subquery',
        syntax: 'WHERE col IN (SELECT ...)',
        description: 'Match list from subquery'
      },
      {
        name: 'EXISTS',
        syntax: 'WHERE EXISTS (SELECT ...)',
        description: 'Check if rows exist'
      },
      {
        name: 'CTE',
        syntax: 'WITH name AS (SELECT ...) SELECT ...',
        description: 'Named temporary result set'
      },
      {
        name: 'Recursive CTE',
        syntax: 'WITH RECURSIVE name AS (...)',
        description: 'Self-referencing CTE'
      },
    ]
  },
  {
    title: 'Window Functions',
    color: 'text-yellow-400',
    items: [
      {
        name: 'OVER()',
        syntax: 'SUM(col) OVER ()',
        description: 'Window over all rows'
      },
      {
        name: 'PARTITION BY',
        syntax: 'OVER (PARTITION BY col)',
        description: 'Window per group'
      },
      {
        name: 'ORDER BY',
        syntax: 'OVER (ORDER BY col)',
        description: 'Running calculations'
      },
      {
        name: 'ROW_NUMBER',
        syntax: 'ROW_NUMBER() OVER (...)',
        description: 'Unique row numbers'
      },
      {
        name: 'RANK / DENSE_RANK',
        syntax: 'RANK() OVER (ORDER BY ...)',
        description: 'Ranking with/without gaps'
      },
      {
        name: 'LAG / LEAD',
        syntax: 'LAG(col, 1) OVER (...)',
        description: 'Access prev/next row'
      },
      {
        name: 'Frame Clause',
        syntax: 'ROWS BETWEEN n PRECEDING AND CURRENT ROW',
        description: 'Define window bounds'
      },
    ]
  },
]

const operators = [
  { op: '=', desc: 'Equal' },
  { op: '<> / !=', desc: 'Not equal' },
  { op: '>', desc: 'Greater than' },
  { op: '<', desc: 'Less than' },
  { op: '>=', desc: 'Greater or equal' },
  { op: '<=', desc: 'Less or equal' },
  { op: 'AND', desc: 'Both true' },
  { op: 'OR', desc: 'Either true' },
  { op: 'NOT', desc: 'Negate condition' },
  { op: '||', desc: 'String concat' },
  { op: '%', desc: 'Modulo' },
]

const wildcards = [
  { pattern: '%', desc: 'Any sequence of characters' },
  { pattern: '_', desc: 'Single character' },
  { pattern: "'A%'", desc: 'Starts with A' },
  { pattern: "'%A'", desc: 'Ends with A' },
  { pattern: "'%A%'", desc: 'Contains A' },
  { pattern: "'A_B'", desc: 'A, any char, B' },
]

export default function CheatSheet() {
  const quickReference = `-- Query structure order
SELECT columns
FROM table
JOIN other_table ON condition
WHERE filter_condition
GROUP BY grouping_columns
HAVING aggregate_condition
ORDER BY sort_columns
LIMIT n OFFSET m;`

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-sql-blue/20 rounded-xl border border-sql-blue/30">
            <FileCode className="text-sql-blue" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              SQL <span className="text-sql-blue">Cheat Sheet</span>
            </h1>
            <p className="text-gray-400">Quick reference for SQL syntax</p>
          </div>
        </div>
      </div>

      {/* Query Structure */}
      <section className="mb-8">
        <h2 className="section-title">Query Structure</h2>
        <CodeBlock code={quickReference} title="query_structure.sql" />
      </section>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {sections.map((section) => (
          <div key={section.title} className="card-dark">
            <h3 className={`${section.color} font-display font-semibold text-lg mb-4`}>
              {section.title}
            </h3>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.name} className="border-l-2 border-sql-blue/30 pl-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold text-sm">{item.name}</span>
                  </div>
                  <code className="text-accent-cyan text-xs font-mono block mb-1">
                    {item.syntax}
                  </code>
                  <span className="text-gray-500 text-xs">{item.description}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Operators and Wildcards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Operators */}
        <div className="card-dark">
          <h3 className="text-sql-blue font-display font-semibold text-lg mb-4">
            Operators
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {operators.map((op) => (
              <div key={op.op} className="flex items-center gap-2">
                <code className="text-accent-cyan font-mono text-sm w-16">{op.op}</code>
                <span className="text-gray-400 text-sm">{op.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wildcards */}
        <div className="card-dark">
          <h3 className="text-sql-green font-display font-semibold text-lg mb-4">
            LIKE Wildcards
          </h3>
          <div className="space-y-2">
            {wildcards.map((w) => (
              <div key={w.pattern} className="flex items-center gap-3">
                <code className="text-accent-cyan font-mono text-sm w-20">{w.pattern}</code>
                <span className="text-gray-400 text-sm">{w.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Types */}
      <section className="mt-8">
        <h2 className="section-title">Common Data Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card-dark">
            <h4 className="text-sql-blue font-semibold mb-2">Numeric</h4>
            <ul className="space-y-1 text-sm text-gray-400 font-mono">
              <li>INT / INTEGER</li>
              <li>BIGINT</li>
              <li>DECIMAL(p,s)</li>
              <li>FLOAT / REAL</li>
            </ul>
          </div>
          <div className="card-dark">
            <h4 className="text-sql-green font-semibold mb-2">Text</h4>
            <ul className="space-y-1 text-sm text-gray-400 font-mono">
              <li>CHAR(n)</li>
              <li>VARCHAR(n)</li>
              <li>TEXT</li>
            </ul>
          </div>
          <div className="card-dark">
            <h4 className="text-accent-cyan font-semibold mb-2">Date/Time</h4>
            <ul className="space-y-1 text-sm text-gray-400 font-mono">
              <li>DATE</li>
              <li>TIME</li>
              <li>TIMESTAMP</li>
              <li>INTERVAL</li>
            </ul>
          </div>
          <div className="card-dark">
            <h4 className="text-accent-purple font-semibold mb-2">Other</h4>
            <ul className="space-y-1 text-sm text-gray-400 font-mono">
              <li>BOOLEAN</li>
              <li>JSON / JSONB</li>
              <li>UUID</li>
              <li>ARRAY</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Common Functions */}
      <section className="mt-8">
        <h2 className="section-title">Common Functions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-dark">
            <h4 className="text-sql-blue font-semibold mb-3">String Functions</h4>
            <div className="space-y-2 text-sm">
              <div><code className="text-accent-cyan">UPPER(str)</code> <span className="text-gray-500">- Uppercase</span></div>
              <div><code className="text-accent-cyan">LOWER(str)</code> <span className="text-gray-500">- Lowercase</span></div>
              <div><code className="text-accent-cyan">TRIM(str)</code> <span className="text-gray-500">- Remove spaces</span></div>
              <div><code className="text-accent-cyan">LENGTH(str)</code> <span className="text-gray-500">- String length</span></div>
              <div><code className="text-accent-cyan">SUBSTRING(str, start, len)</code></div>
              <div><code className="text-accent-cyan">CONCAT(a, b)</code> <span className="text-gray-500">- Join strings</span></div>
              <div><code className="text-accent-cyan">REPLACE(str, old, new)</code></div>
            </div>
          </div>
          <div className="card-dark">
            <h4 className="text-sql-green font-semibold mb-3">Date Functions</h4>
            <div className="space-y-2 text-sm">
              <div><code className="text-accent-cyan">CURRENT_DATE</code> <span className="text-gray-500">- Today</span></div>
              <div><code className="text-accent-cyan">CURRENT_TIMESTAMP</code> <span className="text-gray-500">- Now</span></div>
              <div><code className="text-accent-cyan">DATE_TRUNC('month', date)</code></div>
              <div><code className="text-accent-cyan">EXTRACT(YEAR FROM date)</code></div>
              <div><code className="text-accent-cyan">AGE(date1, date2)</code></div>
              <div><code className="text-accent-cyan">date + INTERVAL '1 day'</code></div>
            </div>
          </div>
          <div className="card-dark">
            <h4 className="text-accent-purple font-semibold mb-3">Utility Functions</h4>
            <div className="space-y-2 text-sm">
              <div><code className="text-accent-cyan">COALESCE(a, b, c)</code> <span className="text-gray-500">- First non-NULL</span></div>
              <div><code className="text-accent-cyan">NULLIF(a, b)</code> <span className="text-gray-500">- NULL if equal</span></div>
              <div><code className="text-accent-cyan">CAST(x AS type)</code> <span className="text-gray-500">- Type conversion</span></div>
              <div><code className="text-accent-cyan">CASE WHEN ... THEN ... END</code></div>
              <div><code className="text-accent-cyan">GREATEST(a, b, c)</code></div>
              <div><code className="text-accent-cyan">LEAST(a, b, c)</code></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
