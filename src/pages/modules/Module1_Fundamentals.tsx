import { Link } from 'react-router-dom'
import { Database, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import CodeBlock from '../../components/code/CodeBlock'
import OutputDisplay from '../../components/code/OutputDisplay'
import FlowDiagram from '../../components/visualizations/FlowDiagram'

export default function Module1_Fundamentals() {
  const basicSelect = `-- Basic SELECT statement
SELECT first_name, last_name, email
FROM customers;`

  const selectAll = `-- Select all columns using asterisk
SELECT *
FROM products;`

  const selectDistinct = `-- Remove duplicate values
SELECT DISTINCT category
FROM products;

-- DISTINCT across multiple columns
SELECT DISTINCT city, state
FROM customers;`

  const columnAliases = `-- Column aliases for clarity
SELECT 
    first_name AS "First Name",
    last_name AS "Last Name",
    email AS "Email Address",
    order_count AS total_orders
FROM customers;`

  const expressions = `-- Calculated columns / expressions
SELECT 
    product_name,
    unit_price,
    quantity_in_stock,
    unit_price * quantity_in_stock AS inventory_value
FROM products;

-- String concatenation
SELECT 
    first_name || ' ' || last_name AS full_name,
    email
FROM customers;`

  const literals = `-- Using literal values and constants
SELECT 
    product_name,
    unit_price,
    'USD' AS currency,
    1.08 AS tax_rate,
    unit_price * 1.08 AS price_with_tax
FROM products;`

  const queryFlow = `flowchart TD
    A[SELECT clause] --> B["Choose columns<br/>or expressions"]
    B --> C[FROM clause]
    C --> D["Specify source<br/>table(s)"]
    D --> E[Query Execution]
    E --> F[Result Set]
    
    style A fill:#1a1a2e,stroke:#3b82f6,color:#3b82f6
    style B fill:#16213e,stroke:#00d4ff,color:#00d4ff
    style C fill:#1a1a2e,stroke:#3b82f6,color:#3b82f6
    style D fill:#16213e,stroke:#00d4ff,color:#00d4ff
    style E fill:#1a1a2e,stroke:#10b981,color:#10b981
    style F fill:#16213e,stroke:#10b981,color:#10b981`

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-sql-blue transition-colors">Home</Link>
          <span>/</span>
          <span className="text-sql-blue">Module 1</span>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-sql-blue/20 rounded-xl border border-sql-blue/30">
            <Database className="text-sql-blue" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              SQL Fundamentals
            </h1>
            <p className="text-gray-400">Module 1 of 7</p>
          </div>
        </div>

        <p className="text-gray-300 text-lg">
          Learn the foundation of SQL: retrieving data with SELECT statements, choosing columns,
          removing duplicates, and working with expressions.
        </p>
      </div>

      {/* Learning Objectives */}
      <section className="card-highlight mb-8">
        <h2 className="section-title">Learning Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Write basic SELECT statements',
            'Select specific columns vs all columns',
            'Use DISTINCT to remove duplicates',
            'Create column aliases for readability',
            'Build expressions and calculated columns',
            'Understand SQL data types'
          ].map((objective, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="text-sql-green flex-shrink-0" size={18} />
              <span className="text-gray-300">{objective}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Query Flow Diagram */}
      <section className="mb-8">
        <FlowDiagram 
          chart={queryFlow} 
          title="Basic Query Structure"
        />
      </section>

      {/* SELECT Statement */}
      <section className="mb-8">
        <h2 className="section-title">The SELECT Statement</h2>
        <p className="text-gray-300 mb-4">
          The <code className="code-inline">SELECT</code> statement is the foundation of data retrieval in SQL.
          It specifies which columns you want to retrieve from your data.
        </p>
        
        <CodeBlock 
          code={basicSelect} 
          title="basic_select.sql"
          highlightLines={[2]}
        />

        <div className="mt-4">
          <OutputDisplay
            title="Query Result"
            columns={[
              { name: 'first_name', type: 'VARCHAR' },
              { name: 'last_name', type: 'VARCHAR' },
              { name: 'email', type: 'VARCHAR' }
            ]}
            rows={[
              ['John', 'Smith', 'john.smith@email.com'],
              ['Jane', 'Doe', 'jane.doe@email.com'],
              ['Bob', 'Johnson', 'bob.j@email.com'],
            ]}
            rowCount={3}
          />
        </div>

        <div className="card-dark mt-6">
          <h3 className="text-sql-green font-semibold mb-3">Key Points</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">•</span>
              <span><code className="code-inline">SELECT</code> specifies which columns to retrieve</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">•</span>
              <span><code className="code-inline">FROM</code> specifies the table to query</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">•</span>
              <span>SQL keywords are case-insensitive, but UPPERCASE is conventional</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">•</span>
              <span>Statements end with a semicolon <code className="code-inline">;</code></span>
            </li>
          </ul>
        </div>
      </section>

      {/* SELECT * */}
      <section className="mb-8">
        <h2 className="section-title">Selecting All Columns</h2>
        <p className="text-gray-300 mb-4">
          Use the asterisk <code className="code-inline">*</code> to select all columns from a table.
          While convenient for exploration, it's generally better to specify columns explicitly in production queries.
        </p>
        
        <CodeBlock code={selectAll} title="select_all.sql" />

        <div className="card-dark mt-4 border-accent-orange/30">
          <h3 className="text-accent-orange font-semibold mb-2">⚠️ Best Practice Warning</h3>
          <p className="text-gray-300">
            Avoid <code className="code-inline">SELECT *</code> in production code:
          </p>
          <ul className="mt-2 space-y-1 text-gray-400 text-sm">
            <li>• Returns more data than needed, impacting performance</li>
            <li>• Makes code fragile if table schema changes</li>
            <li>• Reduces query readability</li>
          </ul>
        </div>
      </section>

      {/* DISTINCT */}
      <section className="mb-8">
        <h2 className="section-title">Removing Duplicates with DISTINCT</h2>
        <p className="text-gray-300 mb-4">
          The <code className="code-inline">DISTINCT</code> keyword removes duplicate rows from your result set.
        </p>
        
        <CodeBlock code={selectDistinct} title="select_distinct.sql" />

        <div className="mt-4">
          <OutputDisplay
            title="Distinct Categories"
            columns={[{ name: 'category', type: 'VARCHAR' }]}
            rows={[
              ['Electronics'],
              ['Clothing'],
              ['Home & Garden'],
              ['Books'],
            ]}
            rowCount={4}
          />
        </div>
      </section>

      {/* Column Aliases */}
      <section className="mb-8">
        <h2 className="section-title">Column Aliases</h2>
        <p className="text-gray-300 mb-4">
          Aliases rename columns in the output using the <code className="code-inline">AS</code> keyword.
          Use quotes for aliases with spaces or special characters.
        </p>
        
        <CodeBlock 
          code={columnAliases} 
          title="column_aliases.sql"
          highlightLines={[3, 4, 5, 6]}
        />

        <div className="card-dark mt-4">
          <h3 className="text-sql-green font-semibold mb-2">Alias Rules</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• <code className="code-inline">AS</code> keyword is optional but recommended for clarity</li>
            <li>• Use double quotes <code className="code-inline">"Like This"</code> for aliases with spaces</li>
            <li>• Aliases without quotes cannot contain spaces</li>
            <li>• Aliases are applied after query execution (can't use in WHERE of same query)</li>
          </ul>
        </div>
      </section>

      {/* Expressions */}
      <section className="mb-8">
        <h2 className="section-title">Expressions and Calculated Columns</h2>
        <p className="text-gray-300 mb-4">
          SQL can perform calculations and transformations directly in the SELECT clause.
        </p>
        
        <CodeBlock code={expressions} title="expressions.sql" />

        <div className="mt-4">
          <OutputDisplay
            title="Inventory Values"
            columns={[
              { name: 'product_name', type: 'VARCHAR' },
              { name: 'unit_price', type: 'DECIMAL' },
              { name: 'quantity_in_stock', type: 'INT' },
              { name: 'inventory_value', type: 'DECIMAL' }
            ]}
            rows={[
              ['Laptop', '999.99', '50', '49999.50'],
              ['Mouse', '29.99', '200', '5998.00'],
              ['Keyboard', '79.99', '150', '11998.50'],
            ]}
            rowCount={3}
          />
        </div>

        <div className="card-dark mt-4">
          <h3 className="text-sql-green font-semibold mb-2">Common Operators</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-accent-cyan text-sm font-mono mb-2">Arithmetic</h4>
              <ul className="space-y-1 text-gray-300 text-sm font-mono">
                <li>+ Addition</li>
                <li>- Subtraction</li>
                <li>* Multiplication</li>
                <li>/ Division</li>
                <li>% Modulo</li>
              </ul>
            </div>
            <div>
              <h4 className="text-accent-cyan text-sm font-mono mb-2">String</h4>
              <ul className="space-y-1 text-gray-300 text-sm font-mono">
                <li>|| Concatenation</li>
                <li>CONCAT() Function</li>
                <li>UPPER() / LOWER()</li>
                <li>TRIM() / LENGTH()</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Literal Values */}
      <section className="mb-8">
        <h2 className="section-title">Literal Values and Constants</h2>
        <p className="text-gray-300 mb-4">
          Include constant values in your SELECT to add static information to results.
        </p>
        
        <CodeBlock code={literals} title="literals.sql" />
      </section>

      {/* Data Types */}
      <section className="mb-8">
        <h2 className="section-title">Common SQL Data Types</h2>
        <p className="text-gray-300 mb-4">
          Understanding data types is essential for writing correct queries and ensuring data integrity.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-dark">
            <h3 className="text-sql-blue font-semibold mb-3">Numeric Types</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between text-gray-300">
                <code className="code-inline">INTEGER/INT</code>
                <span className="text-gray-500">Whole numbers</span>
              </li>
              <li className="flex justify-between text-gray-300">
                <code className="code-inline">BIGINT</code>
                <span className="text-gray-500">Large integers</span>
              </li>
              <li className="flex justify-between text-gray-300">
                <code className="code-inline">DECIMAL(p,s)</code>
                <span className="text-gray-500">Exact decimals</span>
              </li>
              <li className="flex justify-between text-gray-300">
                <code className="code-inline">FLOAT/REAL</code>
                <span className="text-gray-500">Approximate decimals</span>
              </li>
            </ul>
          </div>

          <div className="card-dark">
            <h3 className="text-sql-green font-semibold mb-3">Text Types</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between text-gray-300">
                <code className="code-inline">CHAR(n)</code>
                <span className="text-gray-500">Fixed length</span>
              </li>
              <li className="flex justify-between text-gray-300">
                <code className="code-inline">VARCHAR(n)</code>
                <span className="text-gray-500">Variable length</span>
              </li>
              <li className="flex justify-between text-gray-300">
                <code className="code-inline">TEXT</code>
                <span className="text-gray-500">Unlimited text</span>
              </li>
            </ul>
          </div>

          <div className="card-dark">
            <h3 className="text-accent-cyan font-semibold mb-3">Date/Time Types</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between text-gray-300">
                <code className="code-inline">DATE</code>
                <span className="text-gray-500">Date only</span>
              </li>
              <li className="flex justify-between text-gray-300">
                <code className="code-inline">TIME</code>
                <span className="text-gray-500">Time only</span>
              </li>
              <li className="flex justify-between text-gray-300">
                <code className="code-inline">TIMESTAMP</code>
                <span className="text-gray-500">Date + Time</span>
              </li>
              <li className="flex justify-between text-gray-300">
                <code className="code-inline">INTERVAL</code>
                <span className="text-gray-500">Time duration</span>
              </li>
            </ul>
          </div>

          <div className="card-dark">
            <h3 className="text-accent-purple font-semibold mb-3">Other Types</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between text-gray-300">
                <code className="code-inline">BOOLEAN</code>
                <span className="text-gray-500">TRUE/FALSE</span>
              </li>
              <li className="flex justify-between text-gray-300">
                <code className="code-inline">JSON/JSONB</code>
                <span className="text-gray-500">JSON data</span>
              </li>
              <li className="flex justify-between text-gray-300">
                <code className="code-inline">UUID</code>
                <span className="text-gray-500">Unique identifier</span>
              </li>
              <li className="flex justify-between text-gray-300">
                <code className="code-inline">ARRAY</code>
                <span className="text-gray-500">Array of values</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="card-highlight mb-8">
        <h2 className="section-title">Module Summary</h2>
        <div className="space-y-4 text-gray-300">
          <p>
            In this module, you learned the foundational elements of SQL queries:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>The <code className="code-inline">SELECT ... FROM</code> structure is the basis of all queries</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Choose specific columns for better performance and clarity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span><code className="code-inline">DISTINCT</code> removes duplicate rows from results</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Aliases improve readability with the <code className="code-inline">AS</code> keyword</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Expressions allow calculations directly in queries</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t border-sql-blue/20">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-400 hover:text-sql-blue transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>
        <Link
          to="/module/2"
          className="btn-primary flex items-center gap-2"
        >
          <span>Module 2: Filtering & Sorting</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  )
}
