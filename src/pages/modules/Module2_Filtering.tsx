import { Link } from 'react-router-dom'
import { Filter, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import CodeBlock from '../../components/code/CodeBlock'
import OutputDisplay from '../../components/code/OutputDisplay'
import FlowDiagram from '../../components/visualizations/FlowDiagram'

export default function Module2_Filtering() {
  const basicWhere = `-- Filter rows with WHERE clause
SELECT product_name, unit_price, category
FROM products
WHERE category = 'Electronics';`

  const comparisonOps = `-- Comparison operators
SELECT order_id, customer_id, amount
FROM orders
WHERE amount > 100;          -- Greater than

SELECT * FROM products
WHERE unit_price <= 50;      -- Less than or equal

SELECT * FROM customers
WHERE country <> 'USA';      -- Not equal (also !=)`

  const logicalOps = `-- Combining conditions with AND, OR, NOT
SELECT product_name, unit_price, quantity_in_stock
FROM products
WHERE unit_price > 50 
  AND quantity_in_stock > 0;

-- OR for alternative conditions
SELECT * FROM customers
WHERE country = 'USA' OR country = 'Canada';

-- NOT to negate
SELECT * FROM orders
WHERE NOT status = 'cancelled';`

  const betweenIn = `-- BETWEEN for ranges (inclusive)
SELECT order_id, order_date, amount
FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31';

-- IN for multiple values
SELECT product_name, category
FROM products
WHERE category IN ('Electronics', 'Computers', 'Phones');

-- NOT IN to exclude
SELECT * FROM customers
WHERE country NOT IN ('USA', 'Canada', 'Mexico');`

  const likePattern = `-- LIKE for pattern matching
SELECT first_name, last_name, email
FROM customers
WHERE email LIKE '%@gmail.com';     -- Ends with @gmail.com

-- Wildcard patterns
WHERE first_name LIKE 'J%';         -- Starts with J
WHERE last_name LIKE '%son';        -- Ends with son
WHERE email LIKE '%@%.com';         -- Contains @ and ends with .com
WHERE product_code LIKE 'A_B_';     -- _ matches single character

-- Case-insensitive (PostgreSQL)
WHERE email ILIKE '%@GMAIL.COM';`

  const nullHandling = `-- Handling NULL values
SELECT customer_name, phone, email
FROM customers
WHERE phone IS NULL;                 -- Find missing values

SELECT * FROM orders
WHERE shipped_date IS NOT NULL;      -- Find completed orders

-- COALESCE to provide defaults
SELECT 
    customer_name,
    COALESCE(phone, 'No phone') AS phone_display,
    COALESCE(email, phone, 'No contact') AS primary_contact
FROM customers;`

  const orderBy = `-- Sorting with ORDER BY
SELECT product_name, unit_price
FROM products
ORDER BY unit_price;                 -- Ascending (default)

SELECT product_name, unit_price
FROM products
ORDER BY unit_price DESC;            -- Descending

-- Multiple columns
SELECT last_name, first_name, hire_date
FROM employees
ORDER BY last_name ASC, first_name ASC;

-- Order by column position (not recommended)
SELECT product_name, category, unit_price
FROM products
ORDER BY 3 DESC;                     -- 3 = unit_price`

  const limitOffset = `-- Limiting results
SELECT product_name, unit_price
FROM products
ORDER BY unit_price DESC
LIMIT 10;                            -- Top 10 most expensive

-- Pagination with OFFSET
SELECT product_name, unit_price
FROM products
ORDER BY product_name
LIMIT 20 OFFSET 40;                  -- Page 3 (21-40 skipped)

-- PostgreSQL: FETCH syntax
SELECT * FROM products
ORDER BY unit_price DESC
FETCH FIRST 5 ROWS ONLY;`

  const combinedExample = `-- Complete filtering example
SELECT 
    o.order_id,
    c.customer_name,
    o.order_date,
    o.amount,
    o.status
FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
WHERE o.amount >= 100
    AND o.status IN ('pending', 'processing')
    AND o.order_date BETWEEN '2024-01-01' AND '2024-06-30'
    AND c.country = 'USA'
ORDER BY o.amount DESC, o.order_date
LIMIT 50;`

  const executionOrder = `flowchart TD
    A["FROM / JOINs"] --> B[WHERE]
    B --> C["GROUP BY"]
    C --> D["HAVING"]
    D --> E["SELECT"]
    E --> F["DISTINCT"]
    F --> G["ORDER BY"]
    G --> H["LIMIT / OFFSET"]
    
    style A fill:#1a1a2e,stroke:#3b82f6,color:#3b82f6
    style B fill:#1a1a2e,stroke:#10b981,color:#10b981
    style C fill:#16213e,stroke:#00d4ff,color:#00d4ff
    style D fill:#16213e,stroke:#00d4ff,color:#00d4ff
    style E fill:#1a1a2e,stroke:#3b82f6,color:#3b82f6
    style F fill:#16213e,stroke:#a855f7,color:#a855f7
    style G fill:#1a1a2e,stroke:#f97316,color:#f97316
    style H fill:#1a1a2e,stroke:#f97316,color:#f97316`

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-sql-blue transition-colors">Home</Link>
          <span>/</span>
          <span className="text-sql-blue">Module 2</span>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-sql-green/20 rounded-xl border border-sql-green/30">
            <Filter className="text-sql-green" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              Filtering & Sorting
            </h1>
            <p className="text-gray-400">Module 2 of 7</p>
          </div>
        </div>

        <p className="text-gray-300 text-lg">
          Learn to filter data with WHERE clauses, use comparison and logical operators,
          sort results with ORDER BY, and implement pagination.
        </p>
      </div>

      {/* Learning Objectives */}
      <section className="card-highlight mb-8">
        <h2 className="section-title">Learning Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Filter data with WHERE clauses',
            'Use comparison operators (=, <>, >, <, etc.)',
            'Combine conditions with AND, OR, NOT',
            'Work with BETWEEN, IN, and LIKE',
            'Handle NULL values properly',
            'Sort results with ORDER BY',
            'Implement pagination with LIMIT/OFFSET'
          ].map((objective, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="text-sql-green flex-shrink-0" size={18} />
              <span className="text-gray-300">{objective}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Query Execution Order */}
      <section className="mb-8">
        <FlowDiagram 
          chart={executionOrder} 
          title="SQL Query Execution Order"
        />
        <p className="text-gray-400 text-sm mt-2">
          Understanding execution order helps you write efficient queries. WHERE filters before SELECT.
        </p>
      </section>

      {/* WHERE Clause */}
      <section className="mb-8">
        <h2 className="section-title">The WHERE Clause</h2>
        <p className="text-gray-300 mb-4">
          The <code className="code-inline">WHERE</code> clause filters rows based on specified conditions.
          Only rows that evaluate to TRUE are included in the result.
        </p>
        
        <CodeBlock 
          code={basicWhere} 
          title="where_basic.sql"
          highlightLines={[4]}
        />

        <div className="mt-4">
          <OutputDisplay
            title="Filtered Results"
            columns={[
              { name: 'product_name', type: 'VARCHAR' },
              { name: 'unit_price', type: 'DECIMAL' },
              { name: 'category', type: 'VARCHAR' }
            ]}
            rows={[
              ['Laptop Pro', '1299.99', 'Electronics'],
              ['Wireless Mouse', '49.99', 'Electronics'],
              ['USB-C Hub', '79.99', 'Electronics'],
            ]}
            rowCount={3}
          />
        </div>
      </section>

      {/* Comparison Operators */}
      <section className="mb-8">
        <h2 className="section-title">Comparison Operators</h2>
        
        <div className="card-dark mb-4">
          <table className="data-table">
            <thead>
              <tr>
                <th>Operator</th>
                <th>Description</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="text-sql-blue">=</code></td>
                <td>Equal to</td>
                <td><code>status = 'active'</code></td>
              </tr>
              <tr>
                <td><code className="text-sql-blue">&lt;&gt;</code> or <code className="text-sql-blue">!=</code></td>
                <td>Not equal to</td>
                <td><code>status &lt;&gt; 'deleted'</code></td>
              </tr>
              <tr>
                <td><code className="text-sql-blue">&gt;</code></td>
                <td>Greater than</td>
                <td><code>price &gt; 100</code></td>
              </tr>
              <tr>
                <td><code className="text-sql-blue">&lt;</code></td>
                <td>Less than</td>
                <td><code>quantity &lt; 10</code></td>
              </tr>
              <tr>
                <td><code className="text-sql-blue">&gt;=</code></td>
                <td>Greater than or equal</td>
                <td><code>rating &gt;= 4.0</code></td>
              </tr>
              <tr>
                <td><code className="text-sql-blue">&lt;=</code></td>
                <td>Less than or equal</td>
                <td><code>age &lt;= 65</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock code={comparisonOps} title="comparison_operators.sql" />
      </section>

      {/* Logical Operators */}
      <section className="mb-8">
        <h2 className="section-title">Logical Operators: AND, OR, NOT</h2>
        <p className="text-gray-300 mb-4">
          Combine multiple conditions using logical operators. Use parentheses for complex expressions.
        </p>
        
        <CodeBlock code={logicalOps} title="logical_operators.sql" />

        <div className="card-dark mt-4 border-accent-cyan/30">
          <h3 className="text-accent-cyan font-semibold mb-2">Operator Precedence</h3>
          <p className="text-gray-300 text-sm mb-2">
            <code className="code-inline">NOT</code> is evaluated first, then 
            <code className="code-inline">AND</code>, then 
            <code className="code-inline">OR</code>. Use parentheses to be explicit:
          </p>
          <code className="text-gray-400 text-sm block font-mono">
            WHERE (status = 'active' OR status = 'pending') AND amount &gt; 100
          </code>
        </div>
      </section>

      {/* BETWEEN and IN */}
      <section className="mb-8">
        <h2 className="section-title">BETWEEN and IN</h2>
        <p className="text-gray-300 mb-4">
          Simplify range and list comparisons with these powerful operators.
        </p>
        
        <CodeBlock code={betweenIn} title="between_in.sql" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="card-dark">
            <h3 className="text-sql-blue font-semibold mb-2">BETWEEN</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Inclusive on both ends</li>
              <li>• Works with numbers, dates, strings</li>
              <li>• Equivalent to: <code className="text-gray-400">x &gt;= a AND x &lt;= b</code></li>
            </ul>
          </div>
          <div className="card-dark">
            <h3 className="text-sql-green font-semibold mb-2">IN</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Matches any value in the list</li>
              <li>• Cleaner than multiple OR conditions</li>
              <li>• Can use subqueries inside IN</li>
            </ul>
          </div>
        </div>
      </section>

      {/* LIKE Pattern Matching */}
      <section className="mb-8">
        <h2 className="section-title">Pattern Matching with LIKE</h2>
        <p className="text-gray-300 mb-4">
          The <code className="code-inline">LIKE</code> operator enables pattern matching with wildcards.
        </p>
        
        <CodeBlock code={likePattern} title="like_patterns.sql" />

        <div className="card-dark mt-4">
          <h3 className="text-sql-green font-semibold mb-3">Wildcard Characters</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <code className="text-sql-blue text-lg">%</code>
              <p className="text-gray-400 text-sm mt-1">
                Matches zero or more characters
              </p>
              <p className="text-gray-500 text-xs mt-1 font-mono">
                'A%' → Apple, Ant, A
              </p>
            </div>
            <div>
              <code className="text-sql-blue text-lg">_</code>
              <p className="text-gray-400 text-sm mt-1">
                Matches exactly one character
              </p>
              <p className="text-gray-500 text-xs mt-1 font-mono">
                'A_' → At, As, An
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NULL Handling */}
      <section className="mb-8">
        <h2 className="section-title">Handling NULL Values</h2>
        <p className="text-gray-300 mb-4">
          NULL represents missing or unknown data. It requires special handling because 
          NULL is not equal to anything, including itself.
        </p>
        
        <CodeBlock code={nullHandling} title="null_handling.sql" />

        <div className="card-dark mt-4 border-accent-orange/30">
          <h3 className="text-accent-orange font-semibold mb-2">⚠️ NULL Gotchas</h3>
          <ul className="space-y-1 text-gray-300 text-sm">
            <li>• <code className="text-red-400">column = NULL</code> never matches (use IS NULL)</li>
            <li>• <code className="text-red-400">column &lt;&gt; NULL</code> never matches (use IS NOT NULL)</li>
            <li>• NULL in calculations makes the result NULL</li>
            <li>• Use COALESCE() or NULLIF() for NULL handling</li>
          </ul>
        </div>
      </section>

      {/* ORDER BY */}
      <section className="mb-8">
        <h2 className="section-title">Sorting with ORDER BY</h2>
        <p className="text-gray-300 mb-4">
          The <code className="code-inline">ORDER BY</code> clause sorts results by one or more columns.
        </p>
        
        <CodeBlock code={orderBy} title="order_by.sql" />

        <div className="mt-4">
          <OutputDisplay
            title="Sorted Products"
            columns={[
              { name: 'product_name', type: 'VARCHAR' },
              { name: 'unit_price', type: 'DECIMAL' }
            ]}
            rows={[
              ['MacBook Pro', '2499.99'],
              ['iPhone 15 Pro', '1199.99'],
              ['iPad Pro', '999.99'],
              ['AirPods Pro', '249.99'],
              ['Apple Watch', '399.99'],
            ]}
            rowCount={5}
          />
        </div>
      </section>

      {/* LIMIT and OFFSET */}
      <section className="mb-8">
        <h2 className="section-title">Pagination with LIMIT and OFFSET</h2>
        <p className="text-gray-300 mb-4">
          Control result set size and implement pagination for large datasets.
        </p>
        
        <CodeBlock code={limitOffset} title="limit_offset.sql" />

        <div className="card-dark mt-4">
          <h3 className="text-accent-cyan font-semibold mb-2">Pagination Formula</h3>
          <p className="text-gray-300 text-sm mb-2">For page N with P items per page:</p>
          <code className="text-gray-400 text-sm block font-mono bg-sql-darker p-3 rounded">
            LIMIT P OFFSET (N - 1) * P
          </code>
          <p className="text-gray-500 text-xs mt-2">
            Page 3 with 20 items: LIMIT 20 OFFSET 40
          </p>
        </div>
      </section>

      {/* Combined Example */}
      <section className="mb-8">
        <h2 className="section-title">Complete Example</h2>
        <p className="text-gray-300 mb-4">
          Combining all filtering and sorting concepts in a real-world query:
        </p>
        
        <CodeBlock 
          code={combinedExample} 
          title="complete_filtering.sql"
          highlightLines={[8, 9, 10, 11, 12, 13]}
        />
      </section>

      {/* Summary */}
      <section className="card-highlight mb-8">
        <h2 className="section-title">Module Summary</h2>
        <div className="space-y-4 text-gray-300">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span><code className="code-inline">WHERE</code> filters rows before they reach SELECT</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Combine conditions with <code className="code-inline">AND</code>, <code className="code-inline">OR</code>, <code className="code-inline">NOT</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span><code className="code-inline">BETWEEN</code> and <code className="code-inline">IN</code> simplify range and list checks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span><code className="code-inline">LIKE</code> with wildcards (<code className="code-inline">%</code>, <code className="code-inline">_</code>) for pattern matching</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Use <code className="code-inline">IS NULL</code> / <code className="code-inline">IS NOT NULL</code> for NULL checks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span><code className="code-inline">ORDER BY</code> sorts with ASC/DESC options</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span><code className="code-inline">LIMIT</code> and <code className="code-inline">OFFSET</code> enable pagination</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t border-sql-blue/20">
        <Link
          to="/module/1"
          className="flex items-center gap-2 text-gray-400 hover:text-sql-blue transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Module 1: Fundamentals</span>
        </Link>
        <Link
          to="/module/3"
          className="btn-primary flex items-center gap-2"
        >
          <span>Module 3: Joins</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  )
}
