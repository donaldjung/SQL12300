import { Link } from 'react-router-dom'
import { BarChart3, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import CodeBlock from '../../components/code/CodeBlock'
import OutputDisplay from '../../components/code/OutputDisplay'
import FlowDiagram from '../../components/visualizations/FlowDiagram'

export default function Module4_Aggregation() {
  const basicAggregates = `-- Basic aggregate functions
SELECT 
    COUNT(*) AS total_orders,
    COUNT(DISTINCT customer_id) AS unique_customers,
    SUM(amount) AS total_revenue,
    AVG(amount) AS average_order,
    MIN(amount) AS smallest_order,
    MAX(amount) AS largest_order
FROM orders
WHERE order_date >= '2024-01-01';`

  const countVariations = `-- COUNT variations
SELECT
    COUNT(*) AS total_rows,           -- Counts all rows
    COUNT(phone) AS has_phone,        -- Counts non-NULL values
    COUNT(DISTINCT city) AS cities    -- Counts unique values
FROM customers;

-- COUNT with FILTER (PostgreSQL, modern SQL)
SELECT
    COUNT(*) AS total_orders,
    COUNT(*) FILTER (WHERE status = 'completed') AS completed,
    COUNT(*) FILTER (WHERE status = 'pending') AS pending
FROM orders;`

  const groupBy = `-- GROUP BY to aggregate by category
SELECT 
    category,
    COUNT(*) AS product_count,
    AVG(unit_price) AS avg_price,
    SUM(quantity_in_stock) AS total_stock
FROM products
GROUP BY category
ORDER BY product_count DESC;`

  const groupByMultiple = `-- GROUP BY multiple columns
SELECT 
    EXTRACT(YEAR FROM order_date) AS order_year,
    EXTRACT(MONTH FROM order_date) AS order_month,
    COUNT(*) AS order_count,
    SUM(amount) AS monthly_revenue
FROM orders
GROUP BY 
    EXTRACT(YEAR FROM order_date),
    EXTRACT(MONTH FROM order_date)
ORDER BY order_year, order_month;`

  const having = `-- HAVING filters aggregated results
SELECT 
    customer_id,
    COUNT(*) AS order_count,
    SUM(amount) AS total_spent
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 5
   AND SUM(amount) > 1000
ORDER BY total_spent DESC;

-- WHERE vs HAVING
-- WHERE filters rows BEFORE grouping
-- HAVING filters groups AFTER aggregation`

  const rollupCube = `-- ROLLUP for hierarchical subtotals
SELECT 
    region,
    category,
    SUM(amount) AS total_sales
FROM sales
GROUP BY ROLLUP (region, category)
ORDER BY region NULLS LAST, category NULLS LAST;

-- CUBE for all dimension combinations
SELECT 
    region,
    category,
    SUM(amount) AS total_sales
FROM sales
GROUP BY CUBE (region, category);

-- GROUPING SETS for specific combinations
SELECT 
    region,
    category,
    SUM(amount) AS total_sales
FROM sales
GROUP BY GROUPING SETS (
    (region, category),
    (region),
    (category),
    ()
);`

  const groupingFunction = `-- GROUPING() to identify subtotal rows
SELECT 
    CASE WHEN GROUPING(region) = 1 THEN 'All Regions' 
         ELSE region END AS region,
    CASE WHEN GROUPING(category) = 1 THEN 'All Categories' 
         ELSE category END AS category,
    SUM(amount) AS total_sales,
    GROUPING(region) AS is_region_total,
    GROUPING(category) AS is_category_total
FROM sales
GROUP BY ROLLUP (region, category);`

  const stringAgg = `-- String aggregation
SELECT 
    customer_id,
    STRING_AGG(product_name, ', ' ORDER BY product_name) AS products_purchased
FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
GROUP BY customer_id;

-- Array aggregation (PostgreSQL)
SELECT 
    category,
    ARRAY_AGG(DISTINCT product_name ORDER BY product_name) AS products
FROM products
GROUP BY category;`

  const conditionalAgg = `-- Conditional aggregation with CASE
SELECT 
    EXTRACT(YEAR FROM order_date) AS year,
    COUNT(*) AS total_orders,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,
    ROUND(
        100.0 * SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*),
        2
    ) AS completion_rate
FROM orders
GROUP BY EXTRACT(YEAR FROM order_date)
ORDER BY year;`

  const aggregateFlow = `flowchart TD
    A[FROM - Get all rows] --> B[WHERE - Filter rows]
    B --> C[GROUP BY - Create groups]
    C --> D[Aggregate functions applied]
    D --> E[HAVING - Filter groups]
    E --> F[SELECT - Choose output]
    F --> G[ORDER BY - Sort results]
    
    style A fill:#1a1a2e,stroke:#3b82f6,color:#3b82f6
    style B fill:#1a1a2e,stroke:#10b981,color:#10b981
    style C fill:#16213e,stroke:#00d4ff,color:#00d4ff
    style D fill:#16213e,stroke:#a855f7,color:#a855f7
    style E fill:#1a1a2e,stroke:#f97316,color:#f97316
    style F fill:#1a1a2e,stroke:#3b82f6,color:#3b82f6
    style G fill:#16213e,stroke:#ec4899,color:#ec4899`

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-sql-blue transition-colors">Home</Link>
          <span>/</span>
          <span className="text-sql-blue">Module 4</span>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-accent-purple/20 rounded-xl border border-accent-purple/30">
            <BarChart3 className="text-accent-purple" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              Aggregation & Grouping
            </h1>
            <p className="text-gray-400">Module 4 of 7</p>
          </div>
        </div>

        <p className="text-gray-300 text-lg">
          Learn to summarize data with aggregate functions, group results, and filter
          aggregated data. Essential skills for data analysis and reporting.
        </p>
      </div>

      {/* Learning Objectives */}
      <section className="card-highlight mb-8">
        <h2 className="section-title">Learning Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Use COUNT, SUM, AVG, MIN, MAX',
            'Group data with GROUP BY',
            'Filter groups with HAVING',
            'Create subtotals with ROLLUP/CUBE',
            'Aggregate strings and arrays',
            'Apply conditional aggregation',
            'Understand WHERE vs HAVING'
          ].map((objective, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="text-sql-green flex-shrink-0" size={18} />
              <span className="text-gray-300">{objective}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Aggregation Flow */}
      <section className="mb-8">
        <FlowDiagram 
          chart={aggregateFlow} 
          title="Aggregation Query Execution Flow"
        />
      </section>

      {/* Basic Aggregates */}
      <section className="mb-8">
        <h2 className="section-title">Aggregate Functions</h2>
        <p className="text-gray-300 mb-4">
          Aggregate functions perform calculations across multiple rows and return a single result.
        </p>
        
        <CodeBlock 
          code={basicAggregates} 
          title="aggregate_functions.sql"
          highlightLines={[3, 4, 5, 6, 7, 8]}
        />

        <div className="mt-4">
          <OutputDisplay
            title="Aggregation Results"
            columns={[
              { name: 'total_orders', type: 'INT' },
              { name: 'unique_customers', type: 'INT' },
              { name: 'total_revenue', type: 'DECIMAL' },
              { name: 'average_order', type: 'DECIMAL' },
              { name: 'smallest_order', type: 'DECIMAL' },
              { name: 'largest_order', type: 'DECIMAL' }
            ]}
            rows={[
              ['1547', '423', '287459.50', '185.77', '12.99', '2499.99'],
            ]}
            rowCount={1}
          />
        </div>

        <div className="card-dark mt-4">
          <h3 className="text-sql-green font-semibold mb-3">Common Aggregate Functions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <code className="text-sql-blue">COUNT(*)</code>
              <p className="text-gray-400 text-xs mt-1">Count all rows</p>
            </div>
            <div>
              <code className="text-sql-blue">COUNT(col)</code>
              <p className="text-gray-400 text-xs mt-1">Count non-NULL values</p>
            </div>
            <div>
              <code className="text-sql-blue">SUM(col)</code>
              <p className="text-gray-400 text-xs mt-1">Sum of values</p>
            </div>
            <div>
              <code className="text-sql-blue">AVG(col)</code>
              <p className="text-gray-400 text-xs mt-1">Average value</p>
            </div>
            <div>
              <code className="text-sql-blue">MIN(col)</code>
              <p className="text-gray-400 text-xs mt-1">Minimum value</p>
            </div>
            <div>
              <code className="text-sql-blue">MAX(col)</code>
              <p className="text-gray-400 text-xs mt-1">Maximum value</p>
            </div>
          </div>
        </div>
      </section>

      {/* COUNT Variations */}
      <section className="mb-8">
        <h2 className="section-title">COUNT Variations</h2>
        <p className="text-gray-300 mb-4">
          COUNT has several forms for different counting needs.
        </p>
        
        <CodeBlock code={countVariations} title="count_variations.sql" />

        <div className="card-dark mt-4 border-accent-cyan/30">
          <h3 className="text-accent-cyan font-semibold mb-2">COUNT(*) vs COUNT(column)</h3>
          <ul className="space-y-1 text-gray-300 text-sm">
            <li>• <code className="code-inline">COUNT(*)</code> counts all rows, including NULLs</li>
            <li>• <code className="code-inline">COUNT(column)</code> counts only non-NULL values in that column</li>
            <li>• <code className="code-inline">COUNT(DISTINCT column)</code> counts unique non-NULL values</li>
          </ul>
        </div>
      </section>

      {/* GROUP BY */}
      <section className="mb-8">
        <h2 className="section-title">GROUP BY Clause</h2>
        <p className="text-gray-300 mb-4">
          GROUP BY divides rows into groups based on column values, then applies aggregate functions to each group.
        </p>
        
        <CodeBlock 
          code={groupBy} 
          title="group_by.sql"
          highlightLines={[7]}
        />

        <div className="mt-4">
          <OutputDisplay
            title="Products by Category"
            columns={[
              { name: 'category', type: 'VARCHAR' },
              { name: 'product_count', type: 'INT' },
              { name: 'avg_price', type: 'DECIMAL' },
              { name: 'total_stock', type: 'INT' }
            ]}
            rows={[
              ['Electronics', '45', '299.99', '2340'],
              ['Clothing', '78', '49.99', '5120'],
              ['Home & Garden', '34', '79.99', '1890'],
              ['Books', '156', '19.99', '8900'],
            ]}
            rowCount={4}
          />
        </div>

        <div className="card-dark mt-4 border-accent-orange/30">
          <h3 className="text-accent-orange font-semibold mb-2">⚠️ GROUP BY Rule</h3>
          <p className="text-gray-300 text-sm">
            Every column in SELECT must either be in GROUP BY or wrapped in an aggregate function.
            This ensures each output row has a single value per column.
          </p>
        </div>
      </section>

      {/* GROUP BY Multiple Columns */}
      <section className="mb-8">
        <h2 className="section-title">Grouping by Multiple Columns</h2>
        <p className="text-gray-300 mb-4">
          Group by multiple columns to create more granular aggregations.
        </p>
        
        <CodeBlock code={groupByMultiple} title="group_by_multiple.sql" />

        <div className="mt-4">
          <OutputDisplay
            title="Monthly Revenue Summary"
            columns={[
              { name: 'order_year', type: 'INT' },
              { name: 'order_month', type: 'INT' },
              { name: 'order_count', type: 'INT' },
              { name: 'monthly_revenue', type: 'DECIMAL' }
            ]}
            rows={[
              ['2024', '1', '142', '28450.00'],
              ['2024', '2', '168', '33200.00'],
              ['2024', '3', '195', '41560.00'],
              ['2024', '4', '187', '38900.00'],
            ]}
            rowCount={4}
          />
        </div>
      </section>

      {/* HAVING */}
      <section className="mb-8">
        <h2 className="section-title">HAVING Clause</h2>
        <p className="text-gray-300 mb-4">
          HAVING filters groups <strong>after</strong> aggregation, while WHERE filters rows <strong>before</strong>.
        </p>
        
        <CodeBlock 
          code={having} 
          title="having_clause.sql"
          highlightLines={[7, 8]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="card-dark border-sql-blue/30">
            <h3 className="text-sql-blue font-semibold mb-2">WHERE</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Filters individual rows</li>
              <li>• Executes BEFORE grouping</li>
              <li>• Cannot use aggregate functions</li>
              <li>• Use for row-level conditions</li>
            </ul>
          </div>
          <div className="card-dark border-sql-green/30">
            <h3 className="text-sql-green font-semibold mb-2">HAVING</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Filters groups of rows</li>
              <li>• Executes AFTER grouping</li>
              <li>• CAN use aggregate functions</li>
              <li>• Use for group-level conditions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ROLLUP and CUBE */}
      <section className="mb-8">
        <h2 className="section-title">ROLLUP, CUBE, and GROUPING SETS</h2>
        <p className="text-gray-300 mb-4">
          Generate subtotals and grand totals automatically with advanced grouping operations.
        </p>
        
        <CodeBlock code={rollupCube} title="rollup_cube.sql" />

        <div className="mt-4">
          <OutputDisplay
            title="ROLLUP Results with Subtotals"
            columns={[
              { name: 'region', type: 'VARCHAR' },
              { name: 'category', type: 'VARCHAR' },
              { name: 'total_sales', type: 'DECIMAL' }
            ]}
            rows={[
              ['East', 'Electronics', '45000.00'],
              ['East', 'Clothing', '23000.00'],
              ['East', null, '68000.00'],
              ['West', 'Electronics', '52000.00'],
              ['West', 'Clothing', '28000.00'],
              ['West', null, '80000.00'],
              [null, null, '148000.00'],
            ]}
            rowCount={7}
          />
        </div>

        <div className="card-dark mt-4">
          <h3 className="text-accent-purple font-semibold mb-3">Grouping Operations Comparison</h3>
          <div className="space-y-3 text-sm">
            <div>
              <code className="text-sql-blue">ROLLUP (A, B)</code>
              <p className="text-gray-400 mt-1">
                Creates: (A, B), (A), () — hierarchical subtotals
              </p>
            </div>
            <div>
              <code className="text-sql-blue">CUBE (A, B)</code>
              <p className="text-gray-400 mt-1">
                Creates: (A, B), (A), (B), () — all combinations
              </p>
            </div>
            <div>
              <code className="text-sql-blue">GROUPING SETS</code>
              <p className="text-gray-400 mt-1">
                Creates: exactly the combinations you specify
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GROUPING Function */}
      <section className="mb-8">
        <h2 className="section-title">The GROUPING() Function</h2>
        <p className="text-gray-300 mb-4">
          Use GROUPING() to distinguish between NULL values in data and NULL values representing subtotals.
        </p>
        
        <CodeBlock code={groupingFunction} title="grouping_function.sql" />
      </section>

      {/* String Aggregation */}
      <section className="mb-8">
        <h2 className="section-title">String and Array Aggregation</h2>
        <p className="text-gray-300 mb-4">
          Combine multiple values into a single string or array.
        </p>
        
        <CodeBlock code={stringAgg} title="string_aggregation.sql" />

        <div className="mt-4">
          <OutputDisplay
            title="Products by Customer"
            columns={[
              { name: 'customer_id', type: 'INT' },
              { name: 'products_purchased', type: 'TEXT' }
            ]}
            rows={[
              ['1001', 'AirPods, iPhone, MacBook'],
              ['1002', 'iPad, Magic Keyboard'],
              ['1003', 'Apple Watch, iPhone, MacBook Pro'],
            ]}
            rowCount={3}
          />
        </div>
      </section>

      {/* Conditional Aggregation */}
      <section className="mb-8">
        <h2 className="section-title">Conditional Aggregation</h2>
        <p className="text-gray-300 mb-4">
          Use CASE inside aggregate functions to create multiple aggregations in one query.
        </p>
        
        <CodeBlock 
          code={conditionalAgg} 
          title="conditional_aggregation.sql"
          highlightLines={[5, 6, 7, 8, 9, 10, 11]}
        />

        <div className="mt-4">
          <OutputDisplay
            title="Order Status by Year"
            columns={[
              { name: 'year', type: 'INT' },
              { name: 'total_orders', type: 'INT' },
              { name: 'completed', type: 'INT' },
              { name: 'cancelled', type: 'INT' },
              { name: 'completion_rate', type: 'DECIMAL' }
            ]}
            rows={[
              ['2022', '1245', '1156', '89', '92.85'],
              ['2023', '1678', '1589', '89', '94.70'],
              ['2024', '892', '845', '47', '94.73'],
            ]}
            rowCount={3}
          />
        </div>
      </section>

      {/* Summary */}
      <section className="card-highlight mb-8">
        <h2 className="section-title">Module Summary</h2>
        <div className="space-y-4 text-gray-300">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Aggregate functions (COUNT, SUM, AVG, MIN, MAX) summarize data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>GROUP BY creates groups for aggregation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>HAVING filters groups after aggregation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>ROLLUP/CUBE/GROUPING SETS create automatic subtotals</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Conditional aggregation with CASE enables complex summaries</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>STRING_AGG/ARRAY_AGG combine values into single results</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t border-sql-blue/20">
        <Link
          to="/module/3"
          className="flex items-center gap-2 text-gray-400 hover:text-sql-blue transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Module 3: Joins</span>
        </Link>
        <Link
          to="/module/5"
          className="btn-primary flex items-center gap-2"
        >
          <span>Module 5: Subqueries & CTEs</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  )
}
