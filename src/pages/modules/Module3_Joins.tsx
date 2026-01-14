import { Link } from 'react-router-dom'
import { GitMerge, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import CodeBlock from '../../components/code/CodeBlock'
import OutputDisplay from '../../components/code/OutputDisplay'
import FlowDiagram from '../../components/visualizations/FlowDiagram'

export default function Module3_Joins() {
  const innerJoin = `-- INNER JOIN: Returns matching rows from both tables
SELECT 
    o.order_id,
    o.order_date,
    c.customer_name,
    c.email
FROM orders o
    INNER JOIN customers c ON o.customer_id = c.customer_id;

-- Equivalent shorter syntax
SELECT o.order_id, o.order_date, c.customer_name
FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id;`

  const leftJoin = `-- LEFT JOIN: All rows from left table, matching from right
SELECT 
    c.customer_name,
    c.email,
    o.order_id,
    o.amount
FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id;

-- Find customers with NO orders
SELECT c.customer_name, c.email
FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;`

  const rightJoin = `-- RIGHT JOIN: All rows from right table, matching from left
SELECT 
    o.order_id,
    o.amount,
    c.customer_name
FROM customers c
    RIGHT JOIN orders o ON c.customer_id = o.customer_id;

-- Note: RIGHT JOIN is less common; usually rewrite as LEFT JOIN
-- The above is equivalent to:
SELECT o.order_id, o.amount, c.customer_name
FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.customer_id;`

  const fullJoin = `-- FULL OUTER JOIN: All rows from both tables
SELECT 
    c.customer_name,
    o.order_id,
    o.amount
FROM customers c
    FULL OUTER JOIN orders o ON c.customer_id = o.customer_id;

-- Find unmatched from either side
SELECT c.customer_name, o.order_id
FROM customers c
    FULL OUTER JOIN orders o ON c.customer_id = o.customer_id
WHERE c.customer_id IS NULL 
   OR o.customer_id IS NULL;`

  const crossJoin = `-- CROSS JOIN: Cartesian product (all combinations)
SELECT 
    p.product_name,
    c.color_name
FROM products p
    CROSS JOIN colors c;

-- Practical use: Generate all date/product combinations
SELECT 
    d.date,
    p.product_id
FROM calendar_dates d
    CROSS JOIN products p
WHERE d.date BETWEEN '2024-01-01' AND '2024-12-31';`

  const selfJoin = `-- Self Join: Join table to itself
-- Find employees and their managers
SELECT 
    e.employee_name AS employee,
    m.employee_name AS manager
FROM employees e
    LEFT JOIN employees m ON e.manager_id = m.employee_id;

-- Find products in same category
SELECT 
    p1.product_name,
    p2.product_name AS related_product
FROM products p1
    JOIN products p2 ON p1.category_id = p2.category_id
                    AND p1.product_id < p2.product_id;`

  const multipleJoins = `-- Joining multiple tables
SELECT 
    o.order_id,
    o.order_date,
    c.customer_name,
    p.product_name,
    oi.quantity,
    oi.unit_price,
    oi.quantity * oi.unit_price AS line_total
FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
WHERE o.order_date >= '2024-01-01'
ORDER BY o.order_date DESC;`

  const joinConditions = `-- Multiple join conditions
SELECT *
FROM table_a a
    JOIN table_b b ON a.id = b.a_id
                  AND a.type = b.type;

-- Using WHERE vs ON for filtering
-- ON filters before join (affects outer joins)
SELECT c.customer_name, o.order_id
FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
                      AND o.status = 'completed';

-- WHERE filters after join
SELECT c.customer_name, o.order_id
FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'completed';  -- Turns LEFT into INNER join effectively`

  const usingNatural = `-- USING clause (when column names match)
SELECT o.order_id, c.customer_name
FROM orders o
    JOIN customers c USING (customer_id);

-- Equivalent to:
-- JOIN customers c ON o.customer_id = c.customer_id

-- NATURAL JOIN (joins on all matching column names)
SELECT *
FROM orders
    NATURAL JOIN customers;

-- Warning: NATURAL JOIN can be unpredictable if schema changes`

  const joinDiagram = `flowchart LR
    subgraph INNER["INNER JOIN"]
        I1[A] --- IM((Matching))
        IM --- I2[B]
    end
    
    subgraph LEFT["LEFT JOIN"]
        L1[A - All] --- LM((Matching))
        LM -.- L2["B - if exists"]
    end
    
    subgraph RIGHT["RIGHT JOIN"]
        R1["A - if exists"] -.- RM((Matching))
        RM --- R2[B - All]
    end
    
    subgraph FULL["FULL OUTER"]
        F1[A - All] -.- FM((Matching))
        FM -.- F2[B - All]
    end
    
    style IM fill:#10b981,stroke:#10b981,color:#fff
    style LM fill:#3b82f6,stroke:#3b82f6,color:#fff
    style RM fill:#f97316,stroke:#f97316,color:#fff
    style FM fill:#a855f7,stroke:#a855f7,color:#fff`

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-sql-blue transition-colors">Home</Link>
          <span>/</span>
          <span className="text-sql-blue">Module 3</span>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-accent-cyan/20 rounded-xl border border-accent-cyan/30">
            <GitMerge className="text-accent-cyan" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              Joins & Relationships
            </h1>
            <p className="text-gray-400">Module 3 of 7</p>
          </div>
        </div>

        <p className="text-gray-300 text-lg">
          Master combining data from multiple tables using different types of joins.
          Learn when to use each join type for optimal data retrieval.
        </p>
      </div>

      {/* Learning Objectives */}
      <section className="card-highlight mb-8">
        <h2 className="section-title">Learning Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Understand relational data concepts',
            'Use INNER JOIN for matching rows',
            'Use LEFT/RIGHT JOIN for all rows from one table',
            'Use FULL OUTER JOIN for complete data',
            'Create CROSS JOINs and Self Joins',
            'Join multiple tables efficiently',
            'Distinguish ON vs WHERE filtering'
          ].map((objective, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="text-sql-green flex-shrink-0" size={18} />
              <span className="text-gray-300">{objective}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Join Types Diagram */}
      <section className="mb-8">
        <FlowDiagram 
          chart={joinDiagram} 
          title="Types of SQL Joins"
        />
      </section>

      {/* INNER JOIN */}
      <section className="mb-8">
        <h2 className="section-title">INNER JOIN</h2>
        <p className="text-gray-300 mb-4">
          Returns only rows where there is a match in <strong>both</strong> tables.
          This is the most common join type.
        </p>
        
        <CodeBlock 
          code={innerJoin} 
          title="inner_join.sql"
          highlightLines={[6, 7]}
        />

        <div className="mt-4">
          <OutputDisplay
            title="INNER JOIN Result"
            columns={[
              { name: 'order_id', type: 'INT' },
              { name: 'order_date', type: 'DATE' },
              { name: 'customer_name', type: 'VARCHAR' },
              { name: 'email', type: 'VARCHAR' }
            ]}
            rows={[
              ['1001', '2024-01-15', 'John Smith', 'john@email.com'],
              ['1002', '2024-01-16', 'Jane Doe', 'jane@email.com'],
              ['1003', '2024-01-17', 'John Smith', 'john@email.com'],
            ]}
            rowCount={3}
          />
        </div>

        <div className="card-dark mt-4">
          <h3 className="text-sql-green font-semibold mb-2">When to Use INNER JOIN</h3>
          <ul className="space-y-1 text-gray-300 text-sm">
            <li>• You only want rows that have related data in both tables</li>
            <li>• You need to filter out unmatched records</li>
            <li>• The relationship is required (not optional)</li>
          </ul>
        </div>
      </section>

      {/* LEFT JOIN */}
      <section className="mb-8">
        <h2 className="section-title">LEFT JOIN (LEFT OUTER JOIN)</h2>
        <p className="text-gray-300 mb-4">
          Returns <strong>all rows from the left table</strong>, and matching rows from the right table.
          Non-matching rows from the right table will have NULL values.
        </p>
        
        <CodeBlock 
          code={leftJoin} 
          title="left_join.sql"
          highlightLines={[7]}
        />

        <div className="mt-4">
          <OutputDisplay
            title="LEFT JOIN Result - Customers with Orders"
            columns={[
              { name: 'customer_name', type: 'VARCHAR' },
              { name: 'email', type: 'VARCHAR' },
              { name: 'order_id', type: 'INT' },
              { name: 'amount', type: 'DECIMAL' }
            ]}
            rows={[
              ['John Smith', 'john@email.com', '1001', '150.00'],
              ['John Smith', 'john@email.com', '1003', '275.00'],
              ['Jane Doe', 'jane@email.com', '1002', '89.99'],
              ['Bob Wilson', 'bob@email.com', null, null],
            ]}
            rowCount={4}
          />
        </div>

        <div className="card-dark mt-4 border-accent-cyan/30">
          <h3 className="text-accent-cyan font-semibold mb-2">Finding Missing Data</h3>
          <p className="text-gray-300 text-sm">
            LEFT JOIN + WHERE IS NULL is a powerful pattern for finding records 
            without matching data (e.g., customers without orders).
          </p>
        </div>
      </section>

      {/* RIGHT JOIN */}
      <section className="mb-8">
        <h2 className="section-title">RIGHT JOIN (RIGHT OUTER JOIN)</h2>
        <p className="text-gray-300 mb-4">
          Returns <strong>all rows from the right table</strong>, with matching rows from the left.
          Less commonly used since it can always be rewritten as LEFT JOIN.
        </p>
        
        <CodeBlock code={rightJoin} title="right_join.sql" />

        <div className="card-dark mt-4 border-accent-orange/30">
          <h3 className="text-accent-orange font-semibold mb-2">💡 Pro Tip</h3>
          <p className="text-gray-300 text-sm">
            Most developers prefer LEFT JOIN for consistency. Simply swap the table order
            to convert RIGHT JOIN to LEFT JOIN.
          </p>
        </div>
      </section>

      {/* FULL OUTER JOIN */}
      <section className="mb-8">
        <h2 className="section-title">FULL OUTER JOIN</h2>
        <p className="text-gray-300 mb-4">
          Returns <strong>all rows from both tables</strong>, matching where possible.
          Useful for finding mismatches or creating complete datasets.
        </p>
        
        <CodeBlock code={fullJoin} title="full_outer_join.sql" />

        <div className="mt-4">
          <OutputDisplay
            title="FULL OUTER JOIN Result"
            columns={[
              { name: 'customer_name', type: 'VARCHAR' },
              { name: 'order_id', type: 'INT' },
              { name: 'amount', type: 'DECIMAL' }
            ]}
            rows={[
              ['John Smith', '1001', '150.00'],
              ['Jane Doe', '1002', '89.99'],
              ['Bob Wilson', null, null],
              [null, '1004', '299.99'],
            ]}
            rowCount={4}
          />
        </div>
      </section>

      {/* CROSS JOIN */}
      <section className="mb-8">
        <h2 className="section-title">CROSS JOIN</h2>
        <p className="text-gray-300 mb-4">
          Creates a Cartesian product: every row from the first table combined with every row from the second.
          Use with caution – can produce very large result sets!
        </p>
        
        <CodeBlock code={crossJoin} title="cross_join.sql" />

        <div className="card-dark mt-4 border-accent-purple/30">
          <h3 className="text-accent-purple font-semibold mb-2">Practical Uses</h3>
          <ul className="space-y-1 text-gray-300 text-sm">
            <li>• Generating all combinations (products × colors)</li>
            <li>• Creating calendar/time series scaffolds</li>
            <li>• Matrix-style reports</li>
          </ul>
        </div>
      </section>

      {/* Self Join */}
      <section className="mb-8">
        <h2 className="section-title">Self Join</h2>
        <p className="text-gray-300 mb-4">
          Join a table to itself using different aliases. Useful for hierarchical data
          or comparing rows within the same table.
        </p>
        
        <CodeBlock code={selfJoin} title="self_join.sql" />

        <div className="mt-4">
          <OutputDisplay
            title="Employee Hierarchy"
            columns={[
              { name: 'employee', type: 'VARCHAR' },
              { name: 'manager', type: 'VARCHAR' }
            ]}
            rows={[
              ['Alice Johnson', 'CEO'],
              ['Bob Smith', 'Alice Johnson'],
              ['Carol Williams', 'Alice Johnson'],
              ['David Brown', 'Bob Smith'],
            ]}
            rowCount={4}
          />
        </div>
      </section>

      {/* Multiple Joins */}
      <section className="mb-8">
        <h2 className="section-title">Joining Multiple Tables</h2>
        <p className="text-gray-300 mb-4">
          Chain multiple joins to combine data from many related tables.
          This is common in normalized databases.
        </p>
        
        <CodeBlock 
          code={multipleJoins} 
          title="multiple_joins.sql"
          highlightLines={[9, 10, 11, 12]}
        />
      </section>

      {/* ON vs WHERE */}
      <section className="mb-8">
        <h2 className="section-title">ON vs WHERE Filtering</h2>
        <p className="text-gray-300 mb-4">
          Understanding when to filter in ON vs WHERE is crucial for outer joins.
        </p>
        
        <CodeBlock code={joinConditions} title="on_vs_where.sql" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="card-dark border-sql-blue/30">
            <h3 className="text-sql-blue font-semibold mb-2">ON Clause</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Filters <strong>during</strong> the join</li>
              <li>• Preserves all rows from outer table</li>
              <li>• Use for conditions related to the join relationship</li>
            </ul>
          </div>
          <div className="card-dark border-sql-green/30">
            <h3 className="text-sql-green font-semibold mb-2">WHERE Clause</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Filters <strong>after</strong> the join</li>
              <li>• Can eliminate outer-joined rows</li>
              <li>• Use for final result filtering</li>
            </ul>
          </div>
        </div>
      </section>

      {/* USING and NATURAL */}
      <section className="mb-8">
        <h2 className="section-title">USING and NATURAL JOIN</h2>
        <p className="text-gray-300 mb-4">
          Shortcuts for joining on columns with the same name.
        </p>
        
        <CodeBlock code={usingNatural} title="using_natural.sql" />

        <div className="card-dark mt-4 border-red-500/30">
          <h3 className="text-red-400 font-semibold mb-2">⚠️ Warning: NATURAL JOIN</h3>
          <p className="text-gray-300 text-sm">
            NATURAL JOIN joins on ALL columns with matching names. This can lead to 
            unexpected results if tables have coincidentally matching column names.
            Prefer explicit join conditions for clarity.
          </p>
        </div>
      </section>

      {/* Summary */}
      <section className="card-highlight mb-8">
        <h2 className="section-title">Module Summary</h2>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Join Type</th>
                  <th>Returns</th>
                  <th>Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code className="text-sql-blue">INNER JOIN</code></td>
                  <td>Only matching rows</td>
                  <td>Required relationships</td>
                </tr>
                <tr>
                  <td><code className="text-sql-blue">LEFT JOIN</code></td>
                  <td>All left + matching right</td>
                  <td>Optional relationships, find missing</td>
                </tr>
                <tr>
                  <td><code className="text-sql-blue">RIGHT JOIN</code></td>
                  <td>All right + matching left</td>
                  <td>Rarely used; use LEFT instead</td>
                </tr>
                <tr>
                  <td><code className="text-sql-blue">FULL OUTER</code></td>
                  <td>All from both tables</td>
                  <td>Data reconciliation</td>
                </tr>
                <tr>
                  <td><code className="text-sql-blue">CROSS JOIN</code></td>
                  <td>Cartesian product</td>
                  <td>All combinations</td>
                </tr>
                <tr>
                  <td><code className="text-sql-blue">Self Join</code></td>
                  <td>Table with itself</td>
                  <td>Hierarchies, comparisons</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t border-sql-blue/20">
        <Link
          to="/module/2"
          className="flex items-center gap-2 text-gray-400 hover:text-sql-blue transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Module 2: Filtering</span>
        </Link>
        <Link
          to="/module/4"
          className="btn-primary flex items-center gap-2"
        >
          <span>Module 4: Aggregation</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  )
}
