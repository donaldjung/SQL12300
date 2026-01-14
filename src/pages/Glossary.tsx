import { useState } from 'react'
import { Library, Search } from 'lucide-react'

const glossaryTerms = [
  // A
  { term: 'Aggregate Function', definition: 'A function that performs a calculation on a set of values and returns a single value. Examples: COUNT, SUM, AVG, MIN, MAX.', category: 'Functions' },
  { term: 'Alias', definition: 'A temporary name given to a table or column for the duration of a query using the AS keyword.', category: 'Syntax' },
  { term: 'ANSI SQL', definition: 'The standard SQL specification defined by the American National Standards Institute, ensuring compatibility across database systems.', category: 'Standards' },
  
  // B
  { term: 'Base Table', definition: 'A permanent table in the database that stores data, as opposed to a view or derived table.', category: 'Database Objects' },
  { term: 'BETWEEN', definition: 'An operator that tests if a value falls within a specified range (inclusive of boundaries).', category: 'Operators' },
  
  // C
  { term: 'Cardinality', definition: 'The number of rows in a table or the number of unique values in a column.', category: 'Database Concepts' },
  { term: 'Cartesian Product', definition: 'The result of a CROSS JOIN, combining every row from one table with every row from another.', category: 'Joins' },
  { term: 'Column', definition: 'A vertical entity in a table that contains all data associated with a specific field.', category: 'Database Objects' },
  { term: 'Constraint', definition: 'A rule enforced on data columns to ensure validity. Examples: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL.', category: 'Database Objects' },
  { term: 'Correlated Subquery', definition: 'A subquery that references columns from the outer query and executes once per outer row.', category: 'Queries' },
  { term: 'CTE (Common Table Expression)', definition: 'A named temporary result set defined with WITH clause, available for the duration of a query.', category: 'Queries' },
  { term: 'Cumulative Distribution', definition: 'The proportion of values that are less than or equal to a specific value, calculated with CUME_DIST().', category: 'Analytics' },
  
  // D
  { term: 'Data Type', definition: 'The attribute that specifies the type of data a column can hold (INTEGER, VARCHAR, DATE, etc.).', category: 'Database Concepts' },
  { term: 'DDL (Data Definition Language)', definition: 'SQL commands used to define database structure: CREATE, ALTER, DROP, TRUNCATE.', category: 'SQL Categories' },
  { term: 'Derived Table', definition: 'A subquery in the FROM clause that creates a temporary table for the duration of the query.', category: 'Queries' },
  { term: 'DISTINCT', definition: 'A keyword that removes duplicate rows from the result set.', category: 'Syntax' },
  { term: 'DML (Data Manipulation Language)', definition: 'SQL commands used to modify data: INSERT, UPDATE, DELETE, MERGE.', category: 'SQL Categories' },
  
  // E
  { term: 'Execution Plan', definition: 'The strategy the database engine uses to execute a query, showing operations like scans, joins, and sorts.', category: 'Performance' },
  { term: 'EXISTS', definition: 'A predicate that returns TRUE if a subquery returns at least one row.', category: 'Operators' },
  
  // F
  { term: 'Foreign Key', definition: 'A column or set of columns that establishes a link between data in two tables, referencing a primary key.', category: 'Database Objects' },
  { term: 'Frame Clause', definition: 'The part of a window function that defines which rows to include relative to the current row (ROWS/RANGE BETWEEN).', category: 'Window Functions' },
  { term: 'Full Table Scan', definition: 'A query operation that reads every row in a table, often indicating a need for indexing.', category: 'Performance' },
  
  // G
  { term: 'GROUP BY', definition: 'A clause that groups rows sharing common values into summary rows for aggregate function application.', category: 'Syntax' },
  { term: 'GROUPING SETS', definition: 'An extension of GROUP BY that allows multiple groupings in a single query.', category: 'Aggregation' },
  
  // H
  { term: 'HAVING', definition: 'A clause that filters grouped results based on aggregate function conditions, applied after GROUP BY.', category: 'Syntax' },
  
  // I
  { term: 'Index', definition: 'A database object that improves query performance by providing quick access to rows based on column values.', category: 'Performance' },
  { term: 'INNER JOIN', definition: 'A join that returns only rows with matching values in both tables.', category: 'Joins' },
  { term: 'INSERT', definition: 'A DML command that adds new rows to a table.', category: 'SQL Categories' },
  
  // J
  { term: 'JOIN', definition: 'An operation that combines rows from two or more tables based on a related column.', category: 'Joins' },
  
  // K
  { term: 'Key', definition: 'A column or combination of columns used to uniquely identify rows or establish relationships between tables.', category: 'Database Objects' },
  
  // L
  { term: 'LAG', definition: 'A window function that accesses data from a previous row in the result set.', category: 'Window Functions' },
  { term: 'LEAD', definition: 'A window function that accesses data from a subsequent row in the result set.', category: 'Window Functions' },
  { term: 'LEFT JOIN', definition: 'A join that returns all rows from the left table and matching rows from the right table.', category: 'Joins' },
  { term: 'LIKE', definition: 'An operator used for pattern matching with wildcards (% and _).', category: 'Operators' },
  { term: 'LIMIT', definition: 'A clause that restricts the number of rows returned by a query.', category: 'Syntax' },
  
  // N
  { term: 'Normalization', definition: 'The process of organizing data to reduce redundancy and improve data integrity.', category: 'Database Concepts' },
  { term: 'NULL', definition: 'A marker representing missing or unknown data, not equal to any value including itself.', category: 'Database Concepts' },
  { term: 'NTILE', definition: 'A window function that divides rows into a specified number of approximately equal groups.', category: 'Window Functions' },
  
  // O
  { term: 'OFFSET', definition: 'A clause used with LIMIT to skip a specified number of rows before returning results.', category: 'Syntax' },
  { term: 'ORDER BY', definition: 'A clause that sorts the result set by one or more columns in ascending or descending order.', category: 'Syntax' },
  { term: 'OUTER JOIN', definition: 'A join that returns matching rows plus unmatched rows from one or both tables (LEFT, RIGHT, or FULL).', category: 'Joins' },
  { term: 'OVER', definition: 'A clause that defines a window for a window function, specifying PARTITION BY and ORDER BY.', category: 'Window Functions' },
  
  // P
  { term: 'PARTITION BY', definition: 'A clause in window functions that divides the result set into partitions for separate calculations.', category: 'Window Functions' },
  { term: 'Percentile', definition: 'A value below which a given percentage of observations fall, calculated with PERCENT_RANK or PERCENTILE functions.', category: 'Analytics' },
  { term: 'Predicate', definition: 'An expression that evaluates to TRUE, FALSE, or UNKNOWN, used in WHERE and HAVING clauses.', category: 'Database Concepts' },
  { term: 'Primary Key', definition: 'A column or combination of columns that uniquely identifies each row in a table.', category: 'Database Objects' },
  
  // Q
  { term: 'Query', definition: 'A request for data from the database, typically written as a SELECT statement.', category: 'Database Concepts' },
  { term: 'Query Optimizer', definition: 'The database component that determines the most efficient way to execute a query.', category: 'Performance' },
  
  // R
  { term: 'RANK', definition: 'A window function that assigns rankings with gaps for ties (1, 2, 2, 4).', category: 'Window Functions' },
  { term: 'Relational Database', definition: 'A database that stores data in tables with relationships defined between them.', category: 'Database Concepts' },
  { term: 'Result Set', definition: 'The set of rows returned by a query.', category: 'Database Concepts' },
  { term: 'RIGHT JOIN', definition: 'A join that returns all rows from the right table and matching rows from the left table.', category: 'Joins' },
  { term: 'ROLLUP', definition: 'A GROUP BY extension that generates subtotals and grand totals in hierarchical order.', category: 'Aggregation' },
  { term: 'ROW_NUMBER', definition: 'A window function that assigns unique sequential numbers to rows within a partition.', category: 'Window Functions' },
  { term: 'Running Total', definition: 'A cumulative sum calculated as you move through rows, created with SUM() OVER (ORDER BY ...).', category: 'Analytics' },
  
  // S
  { term: 'Scalar Subquery', definition: 'A subquery that returns exactly one value (one row, one column).', category: 'Queries' },
  { term: 'Schema', definition: 'The structure of a database including tables, columns, relationships, and constraints.', category: 'Database Objects' },
  { term: 'SELECT', definition: 'The SQL command used to retrieve data from one or more tables.', category: 'SQL Categories' },
  { term: 'Self Join', definition: 'A join where a table is joined with itself, typically using different aliases.', category: 'Joins' },
  { term: 'Subquery', definition: 'A query nested inside another query, used in SELECT, FROM, or WHERE clauses.', category: 'Queries' },
  
  // T
  { term: 'Table', definition: 'A collection of related data organized in rows and columns within a database.', category: 'Database Objects' },
  { term: 'Transaction', definition: 'A sequence of database operations treated as a single logical unit of work.', category: 'Database Concepts' },
  { term: 'Truncate', definition: 'A DDL command that quickly removes all rows from a table without logging individual deletions.', category: 'SQL Categories' },
  
  // U
  { term: 'UNION', definition: 'An operator that combines result sets from multiple queries, removing duplicates.', category: 'Operators' },
  { term: 'UNION ALL', definition: 'An operator that combines result sets from multiple queries, keeping all rows including duplicates.', category: 'Operators' },
  { term: 'UPDATE', definition: 'A DML command that modifies existing rows in a table.', category: 'SQL Categories' },
  
  // V
  { term: 'View', definition: 'A virtual table based on a stored SELECT query that does not store data itself.', category: 'Database Objects' },
  
  // W
  { term: 'WHERE', definition: 'A clause that filters rows based on specified conditions before aggregation.', category: 'Syntax' },
  { term: 'Wildcard', definition: 'A character used in LIKE patterns: % (any characters) and _ (single character).', category: 'Operators' },
  { term: 'Window Function', definition: 'A function that performs calculations across a set of rows related to the current row without collapsing them.', category: 'Window Functions' },
  { term: 'WITH Clause', definition: 'The clause used to define Common Table Expressions (CTEs) at the beginning of a query.', category: 'Syntax' },
]

const categories = [...new Set(glossaryTerms.map(t => t.category))].sort()

export default function Glossary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredTerms = glossaryTerms.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === null || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Group by first letter
  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const letter = term.term[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(term)
    return acc
  }, {} as Record<string, typeof glossaryTerms>)

  const sortedLetters = Object.keys(groupedTerms).sort()

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-sql-blue/20 rounded-xl border border-sql-blue/30">
            <Library className="text-sql-blue" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              SQL <span className="text-sql-blue">Glossary</span>
            </h1>
            <p className="text-gray-400">{glossaryTerms.length} terms and definitions</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-sql-terminal border border-sql-blue/20 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-sql-blue/50 transition-all font-mono"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === null
                ? 'bg-sql-blue text-white'
                : 'bg-sql-terminal text-gray-400 hover:text-sql-blue border border-sql-blue/20'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-sql-blue text-white'
                  : 'bg-sql-terminal text-gray-400 hover:text-sql-blue border border-sql-blue/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-gray-500 text-sm mb-4">
        Showing {filteredTerms.length} of {glossaryTerms.length} terms
      </p>

      {/* Glossary Content */}
      <div className="space-y-8">
        {sortedLetters.map(letter => (
          <div key={letter}>
            {/* Letter Header */}
            <div className="sticky top-0 z-10 bg-sql-dark/95 backdrop-blur py-2 mb-4">
              <span className="text-4xl font-display font-bold text-sql-blue">
                {letter}
              </span>
            </div>

            {/* Terms */}
            <div className="space-y-4">
              {groupedTerms[letter].map(item => (
                <div 
                  key={item.term}
                  className="card-dark hover:border-sql-blue/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">
                        {item.term}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {item.definition}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-sql-terminal text-xs text-sql-blue rounded border border-sql-blue/20 whitespace-nowrap">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* No results */}
      {filteredTerms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No terms found matching your search.</p>
        </div>
      )}
    </div>
  )
}
