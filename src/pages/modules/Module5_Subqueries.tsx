import { Link } from 'react-router-dom'
import { Layers, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import CodeBlock from '../../components/code/CodeBlock'
import OutputDisplay from '../../components/code/OutputDisplay'
import FlowDiagram from '../../components/visualizations/FlowDiagram'

export default function Module5_Subqueries() {
  const scalarSubquery = `-- Scalar subquery: Returns single value
SELECT 
    product_name,
    unit_price,
    (SELECT AVG(unit_price) FROM products) AS avg_price,
    unit_price - (SELECT AVG(unit_price) FROM products) AS diff_from_avg
FROM products
WHERE unit_price > (SELECT AVG(unit_price) FROM products);

-- In SELECT clause
SELECT 
    customer_name,
    (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.customer_id) AS order_count
FROM customers c;`

  const subqueryWhere = `-- Subquery in WHERE clause
-- Find customers who have placed orders
SELECT customer_name, email
FROM customers
WHERE customer_id IN (
    SELECT DISTINCT customer_id 
    FROM orders
);

-- Find products never ordered
SELECT product_name
FROM products
WHERE product_id NOT IN (
    SELECT product_id 
    FROM order_items
    WHERE product_id IS NOT NULL
);`

  const existsSubquery = `-- EXISTS: Check if subquery returns any rows
SELECT customer_name, email
FROM customers c
WHERE EXISTS (
    SELECT 1 
    FROM orders o 
    WHERE o.customer_id = c.customer_id
      AND o.amount > 500
);

-- NOT EXISTS: Find customers without recent orders
SELECT customer_name
FROM customers c
WHERE NOT EXISTS (
    SELECT 1 
    FROM orders o 
    WHERE o.customer_id = c.customer_id
      AND o.order_date >= '2024-01-01'
);`

  const correlatedSubquery = `-- Correlated subquery: References outer query
-- Find orders above customer's average
SELECT 
    o.order_id,
    o.customer_id,
    o.amount,
    (SELECT AVG(o2.amount) 
     FROM orders o2 
     WHERE o2.customer_id = o.customer_id) AS customer_avg
FROM orders o
WHERE o.amount > (
    SELECT AVG(o2.amount) 
    FROM orders o2 
    WHERE o2.customer_id = o.customer_id
);

-- Latest order per customer
SELECT *
FROM orders o1
WHERE o1.order_date = (
    SELECT MAX(o2.order_date)
    FROM orders o2
    WHERE o2.customer_id = o1.customer_id
);`

  const derivedTable = `-- Derived table (subquery in FROM clause)
SELECT 
    category,
    avg_price,
    product_count
FROM (
    SELECT 
        category,
        AVG(unit_price) AS avg_price,
        COUNT(*) AS product_count
    FROM products
    GROUP BY category
) AS category_stats
WHERE avg_price > 100;

-- Join with derived table
SELECT 
    c.customer_name,
    cs.total_orders,
    cs.total_spent
FROM customers c
JOIN (
    SELECT 
        customer_id,
        COUNT(*) AS total_orders,
        SUM(amount) AS total_spent
    FROM orders
    GROUP BY customer_id
) AS cs ON c.customer_id = cs.customer_id
WHERE cs.total_spent > 1000;`

  const basicCTE = `-- Common Table Expression (CTE)
WITH high_value_customers AS (
    SELECT 
        customer_id,
        SUM(amount) AS total_spent
    FROM orders
    GROUP BY customer_id
    HAVING SUM(amount) > 5000
)
SELECT 
    c.customer_name,
    c.email,
    hvc.total_spent
FROM customers c
JOIN high_value_customers hvc ON c.customer_id = hvc.customer_id
ORDER BY hvc.total_spent DESC;`

  const multipleCTEs = `-- Multiple CTEs
WITH 
monthly_sales AS (
    SELECT 
        DATE_TRUNC('month', order_date) AS month,
        SUM(amount) AS revenue
    FROM orders
    GROUP BY DATE_TRUNC('month', order_date)
),
sales_growth AS (
    SELECT 
        month,
        revenue,
        LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
        revenue - LAG(revenue) OVER (ORDER BY month) AS growth
    FROM monthly_sales
)
SELECT 
    month,
    revenue,
    prev_revenue,
    growth,
    ROUND(100.0 * growth / NULLIF(prev_revenue, 0), 2) AS growth_pct
FROM sales_growth
WHERE prev_revenue IS NOT NULL
ORDER BY month;`

  const recursiveCTE = `-- Recursive CTE: Hierarchical data
WITH RECURSIVE org_hierarchy AS (
    -- Base case: top-level employees (no manager)
    SELECT 
        employee_id,
        employee_name,
        manager_id,
        1 AS level,
        employee_name AS path
    FROM employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive case: employees with managers
    SELECT 
        e.employee_id,
        e.employee_name,
        e.manager_id,
        oh.level + 1,
        oh.path || ' > ' || e.employee_name
    FROM employees e
    JOIN org_hierarchy oh ON e.manager_id = oh.employee_id
)
SELECT * FROM org_hierarchy
ORDER BY path;`

  const recursiveSequence = `-- Generate date series with recursive CTE
WITH RECURSIVE date_series AS (
    SELECT DATE '2024-01-01' AS date
    UNION ALL
    SELECT date + INTERVAL '1 day'
    FROM date_series
    WHERE date < DATE '2024-12-31'
)
SELECT 
    ds.date,
    COALESCE(COUNT(o.order_id), 0) AS orders
FROM date_series ds
LEFT JOIN orders o ON DATE(o.order_date) = ds.date
GROUP BY ds.date
ORDER BY ds.date;`

  const cteVsSubquery = `-- CTE version (more readable)
WITH category_totals AS (
    SELECT category, SUM(unit_price * quantity) AS total
    FROM products
    GROUP BY category
)
SELECT category, total,
       total / SUM(total) OVER () * 100 AS percentage
FROM category_totals;

-- Equivalent subquery version (less readable)
SELECT category, total,
       total / SUM(total) OVER () * 100 AS percentage
FROM (
    SELECT category, SUM(unit_price * quantity) AS total
    FROM products
    GROUP BY category
) AS category_totals;`

  const subqueryTypes = `flowchart TD
    A[Subquery Types] --> B[Scalar]
    A --> C[Row]
    A --> D[Table]
    A --> E[Correlated]
    
    B --> B1["Returns single value"]
    C --> C1["Returns single row"]
    D --> D1["Returns multiple rows/cols"]
    E --> E1["References outer query"]
    
    style A fill:#1a1a2e,stroke:#3b82f6,color:#3b82f6
    style B fill:#16213e,stroke:#10b981,color:#10b981
    style C fill:#16213e,stroke:#00d4ff,color:#00d4ff
    style D fill:#16213e,stroke:#a855f7,color:#a855f7
    style E fill:#16213e,stroke:#f97316,color:#f97316`

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-sql-blue transition-colors">Home</Link>
          <span>/</span>
          <span className="text-sql-blue">Module 5</span>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-accent-orange/20 rounded-xl border border-accent-orange/30">
            <Layers className="text-accent-orange" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              Subqueries & CTEs
            </h1>
            <p className="text-gray-400">Module 5 of 7</p>
          </div>
        </div>

        <p className="text-gray-300 text-lg">
          Master nested queries and Common Table Expressions for complex data retrieval
          and hierarchical data processing.
        </p>
      </div>

      {/* Learning Objectives */}
      <section className="card-highlight mb-8">
        <h2 className="section-title">Learning Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Write scalar, row, and table subqueries',
            'Use subqueries in SELECT, FROM, WHERE',
            'Understand correlated subqueries',
            'Apply EXISTS and NOT EXISTS',
            'Create and chain CTEs',
            'Build recursive CTEs for hierarchies',
            'Choose between CTEs and subqueries'
          ].map((objective, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="text-sql-green flex-shrink-0" size={18} />
              <span className="text-gray-300">{objective}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Subquery Types */}
      <section className="mb-8">
        <FlowDiagram 
          chart={subqueryTypes} 
          title="Types of Subqueries"
        />
      </section>

      {/* Scalar Subqueries */}
      <section className="mb-8">
        <h2 className="section-title">Scalar Subqueries</h2>
        <p className="text-gray-300 mb-4">
          A scalar subquery returns exactly one value (one row, one column). 
          It can be used anywhere a single value is expected.
        </p>
        
        <CodeBlock 
          code={scalarSubquery} 
          title="scalar_subquery.sql"
          highlightLines={[5, 6]}
        />

        <div className="mt-4">
          <OutputDisplay
            title="Products Above Average Price"
            columns={[
              { name: 'product_name', type: 'VARCHAR' },
              { name: 'unit_price', type: 'DECIMAL' },
              { name: 'avg_price', type: 'DECIMAL' },
              { name: 'diff_from_avg', type: 'DECIMAL' }
            ]}
            rows={[
              ['MacBook Pro', '2499.99', '185.50', '2314.49'],
              ['iPhone 15 Pro', '1199.99', '185.50', '1014.49'],
              ['iPad Pro', '999.99', '185.50', '814.49'],
            ]}
            rowCount={3}
          />
        </div>
      </section>

      {/* Subqueries in WHERE */}
      <section className="mb-8">
        <h2 className="section-title">Subqueries in WHERE Clause</h2>
        <p className="text-gray-300 mb-4">
          Use subqueries with IN, NOT IN, comparison operators, or EXISTS to filter data.
        </p>
        
        <CodeBlock code={subqueryWhere} title="subquery_where.sql" />

        <div className="card-dark mt-4 border-accent-orange/30">
          <h3 className="text-accent-orange font-semibold mb-2">⚠️ NULL Handling with IN/NOT IN</h3>
          <p className="text-gray-300 text-sm">
            If the subquery returns NULL values, NOT IN may return unexpected results.
            Always filter out NULLs: <code className="code-inline">WHERE column IS NOT NULL</code>
          </p>
        </div>
      </section>

      {/* EXISTS */}
      <section className="mb-8">
        <h2 className="section-title">EXISTS and NOT EXISTS</h2>
        <p className="text-gray-300 mb-4">
          EXISTS returns TRUE if the subquery returns at least one row. 
          It's often more efficient than IN for large datasets.
        </p>
        
        <CodeBlock 
          code={existsSubquery} 
          title="exists_subquery.sql"
          highlightLines={[4, 5, 6, 7, 8]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="card-dark border-sql-blue/30">
            <h3 className="text-sql-blue font-semibold mb-2">EXISTS</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Returns TRUE if any rows match</li>
              <li>• Stops at first match (efficient)</li>
              <li>• SELECT 1 is convention (value ignored)</li>
            </ul>
          </div>
          <div className="card-dark border-sql-green/30">
            <h3 className="text-sql-green font-semibold mb-2">NOT EXISTS</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Returns TRUE if no rows match</li>
              <li>• Good for "find missing" queries</li>
              <li>• Handles NULLs correctly</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Correlated Subqueries */}
      <section className="mb-8">
        <h2 className="section-title">Correlated Subqueries</h2>
        <p className="text-gray-300 mb-4">
          A correlated subquery references columns from the outer query. 
          It executes once for each row in the outer query.
        </p>
        
        <CodeBlock 
          code={correlatedSubquery} 
          title="correlated_subquery.sql"
          highlightLines={[8, 9, 10]}
        />

        <div className="card-dark mt-4 border-accent-cyan/30">
          <h3 className="text-accent-cyan font-semibold mb-2">Performance Note</h3>
          <p className="text-gray-300 text-sm">
            Correlated subqueries can be slow on large datasets because they execute 
            for each outer row. Consider using JOINs or window functions as alternatives.
          </p>
        </div>
      </section>

      {/* Derived Tables */}
      <section className="mb-8">
        <h2 className="section-title">Derived Tables (Inline Views)</h2>
        <p className="text-gray-300 mb-4">
          A subquery in the FROM clause creates a derived table that can be queried like a regular table.
        </p>
        
        <CodeBlock code={derivedTable} title="derived_table.sql" />
      </section>

      {/* Basic CTEs */}
      <section className="mb-8">
        <h2 className="section-title">Common Table Expressions (CTEs)</h2>
        <p className="text-gray-300 mb-4">
          CTEs define named temporary result sets using the <code className="code-inline">WITH</code> clause.
          They improve readability and can be referenced multiple times.
        </p>
        
        <CodeBlock 
          code={basicCTE} 
          title="basic_cte.sql"
          highlightLines={[2, 3, 4, 5, 6, 7, 8]}
        />

        <div className="card-dark mt-4">
          <h3 className="text-sql-green font-semibold mb-3">CTE Benefits</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">•</span>
              <span><strong>Readability:</strong> Break complex queries into named steps</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">•</span>
              <span><strong>Reusability:</strong> Reference the same CTE multiple times</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">•</span>
              <span><strong>Recursion:</strong> Support hierarchical queries</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">•</span>
              <span><strong>Maintainability:</strong> Easier to modify and debug</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Multiple CTEs */}
      <section className="mb-8">
        <h2 className="section-title">Chaining Multiple CTEs</h2>
        <p className="text-gray-300 mb-4">
          Define multiple CTEs separated by commas. Each CTE can reference previously defined CTEs.
        </p>
        
        <CodeBlock 
          code={multipleCTEs} 
          title="multiple_ctes.sql"
          highlightLines={[2, 9]}
        />

        <div className="mt-4">
          <OutputDisplay
            title="Monthly Sales Growth Analysis"
            columns={[
              { name: 'month', type: 'DATE' },
              { name: 'revenue', type: 'DECIMAL' },
              { name: 'prev_revenue', type: 'DECIMAL' },
              { name: 'growth', type: 'DECIMAL' },
              { name: 'growth_pct', type: 'DECIMAL' }
            ]}
            rows={[
              ['2024-02-01', '33200.00', '28450.00', '4750.00', '16.70'],
              ['2024-03-01', '41560.00', '33200.00', '8360.00', '25.18'],
              ['2024-04-01', '38900.00', '41560.00', '-2660.00', '-6.40'],
            ]}
            rowCount={3}
          />
        </div>
      </section>

      {/* Recursive CTEs */}
      <section className="mb-8">
        <h2 className="section-title">Recursive CTEs</h2>
        <p className="text-gray-300 mb-4">
          Recursive CTEs process hierarchical or tree-structured data by repeatedly executing
          until no new rows are produced.
        </p>
        
        <CodeBlock 
          code={recursiveCTE} 
          title="recursive_cte.sql"
          highlightLines={[1, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21]}
        />

        <div className="mt-4">
          <OutputDisplay
            title="Organization Hierarchy"
            columns={[
              { name: 'employee_id', type: 'INT' },
              { name: 'employee_name', type: 'VARCHAR' },
              { name: 'level', type: 'INT' },
              { name: 'path', type: 'TEXT' }
            ]}
            rows={[
              ['1', 'CEO', '1', 'CEO'],
              ['2', 'CTO', '2', 'CEO > CTO'],
              ['5', 'Dev Lead', '3', 'CEO > CTO > Dev Lead'],
              ['8', 'Developer', '4', 'CEO > CTO > Dev Lead > Developer'],
              ['3', 'CFO', '2', 'CEO > CFO'],
            ]}
            rowCount={5}
          />
        </div>

        <div className="card-dark mt-4">
          <h3 className="text-accent-purple font-semibold mb-2">Recursive CTE Structure</h3>
          <div className="space-y-2 text-gray-300 text-sm">
            <p><strong>1. Anchor Member:</strong> The initial query (base case) that starts the recursion</p>
            <p><strong>2. UNION ALL:</strong> Combines anchor with recursive results</p>
            <p><strong>3. Recursive Member:</strong> References the CTE itself to build upon previous results</p>
            <p><strong>4. Termination:</strong> Stops when recursive member returns no rows</p>
          </div>
        </div>
      </section>

      {/* Generate Series */}
      <section className="mb-8">
        <h2 className="section-title">Generating Series with Recursive CTEs</h2>
        <p className="text-gray-300 mb-4">
          Use recursive CTEs to generate sequences of dates, numbers, or other series.
        </p>
        
        <CodeBlock code={recursiveSequence} title="date_series.sql" />
      </section>

      {/* CTE vs Subquery */}
      <section className="mb-8">
        <h2 className="section-title">CTEs vs Subqueries: When to Use Each</h2>
        <p className="text-gray-300 mb-4">
          Both can often achieve the same result, but each has advantages.
        </p>
        
        <CodeBlock code={cteVsSubquery} title="cte_vs_subquery.sql" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="card-dark border-sql-blue/30">
            <h3 className="text-sql-blue font-semibold mb-2">Use CTEs When:</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Complex query with many steps</li>
              <li>• Same subquery needed multiple times</li>
              <li>• Need recursion</li>
              <li>• Readability is priority</li>
              <li>• Team collaboration</li>
            </ul>
          </div>
          <div className="card-dark border-sql-green/30">
            <h3 className="text-sql-green font-semibold mb-2">Use Subqueries When:</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Simple, one-time use</li>
              <li>• Scalar value needed</li>
              <li>• EXISTS/NOT EXISTS checks</li>
              <li>• Quick inline calculations</li>
              <li>• Database doesn't support CTEs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="card-highlight mb-8">
        <h2 className="section-title">Module Summary</h2>
        <div className="space-y-4 text-gray-300">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Scalar subqueries return single values for comparisons</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>EXISTS/NOT EXISTS efficiently check for related data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Correlated subqueries reference outer query columns</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>CTEs (WITH clause) improve readability and reusability</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Multiple CTEs can be chained for complex analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Recursive CTEs handle hierarchies and series generation</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t border-sql-blue/20">
        <Link
          to="/module/4"
          className="flex items-center gap-2 text-gray-400 hover:text-sql-blue transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Module 4: Aggregation</span>
        </Link>
        <Link
          to="/module/6"
          className="btn-primary flex items-center gap-2"
        >
          <span>Module 6: Window Functions</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  )
}
