import { Link } from 'react-router-dom'
import { TrendingUp, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import CodeBlock from '../../components/code/CodeBlock'
import OutputDisplay from '../../components/code/OutputDisplay'
import FlowDiagram from '../../components/visualizations/FlowDiagram'

export default function Module6_WindowFunctions() {
  const basicWindow = `-- Window function basics with OVER()
SELECT 
    order_id,
    customer_id,
    amount,
    SUM(amount) OVER () AS total_all_orders,
    amount / SUM(amount) OVER () * 100 AS pct_of_total
FROM orders;

-- Compare row value to aggregate without collapsing rows
SELECT 
    product_name,
    category,
    unit_price,
    AVG(unit_price) OVER () AS overall_avg,
    unit_price - AVG(unit_price) OVER () AS diff_from_avg
FROM products;`

  const partitionBy = `-- PARTITION BY: Window function per group
SELECT 
    order_id,
    customer_id,
    order_date,
    amount,
    SUM(amount) OVER (PARTITION BY customer_id) AS customer_total,
    COUNT(*) OVER (PARTITION BY customer_id) AS customer_order_count
FROM orders
ORDER BY customer_id, order_date;

-- Multiple partitions
SELECT 
    product_name,
    category,
    unit_price,
    AVG(unit_price) OVER (PARTITION BY category) AS category_avg,
    MAX(unit_price) OVER (PARTITION BY category) AS category_max,
    unit_price / MAX(unit_price) OVER (PARTITION BY category) * 100 AS pct_of_max
FROM products;`

  const orderByWindow = `-- ORDER BY in window: Running calculations
SELECT 
    order_date,
    amount,
    SUM(amount) OVER (ORDER BY order_date) AS running_total,
    AVG(amount) OVER (ORDER BY order_date) AS running_avg,
    COUNT(*) OVER (ORDER BY order_date) AS cumulative_count
FROM orders;

-- Partition + Order for running totals per group
SELECT 
    customer_id,
    order_date,
    amount,
    SUM(amount) OVER (
        PARTITION BY customer_id 
        ORDER BY order_date
    ) AS customer_running_total
FROM orders;`

  const rankingFunctions = `-- ROW_NUMBER: Unique sequential number
SELECT 
    product_name,
    category,
    unit_price,
    ROW_NUMBER() OVER (ORDER BY unit_price DESC) AS price_rank
FROM products;

-- RANK: Same rank for ties, gaps after
SELECT 
    product_name,
    unit_price,
    RANK() OVER (ORDER BY unit_price DESC) AS rank
FROM products;
-- Result: 1, 2, 2, 4 (gap after tie)

-- DENSE_RANK: Same rank for ties, no gaps
SELECT 
    product_name,
    unit_price,
    DENSE_RANK() OVER (ORDER BY unit_price DESC) AS dense_rank
FROM products;
-- Result: 1, 2, 2, 3 (no gap)

-- NTILE: Divide into N buckets
SELECT 
    customer_id,
    total_spent,
    NTILE(4) OVER (ORDER BY total_spent DESC) AS spending_quartile
FROM customer_summary;`

  const rankingByPartition = `-- Ranking within partitions
SELECT 
    product_name,
    category,
    unit_price,
    ROW_NUMBER() OVER (
        PARTITION BY category 
        ORDER BY unit_price DESC
    ) AS rank_in_category
FROM products;

-- Top N per group pattern
WITH ranked_products AS (
    SELECT 
        product_name,
        category,
        unit_price,
        ROW_NUMBER() OVER (
            PARTITION BY category 
            ORDER BY unit_price DESC
        ) AS rn
    FROM products
)
SELECT * FROM ranked_products WHERE rn <= 3;`

  const lagLead = `-- LAG: Access previous row
SELECT 
    order_date,
    amount,
    LAG(amount) OVER (ORDER BY order_date) AS prev_amount,
    amount - LAG(amount) OVER (ORDER BY order_date) AS change
FROM orders;

-- LEAD: Access next row
SELECT 
    order_date,
    amount,
    LEAD(amount) OVER (ORDER BY order_date) AS next_amount
FROM orders;

-- LAG/LEAD with offset and default
SELECT 
    month,
    revenue,
    LAG(revenue, 1, 0) OVER (ORDER BY month) AS prev_month,
    LAG(revenue, 12, 0) OVER (ORDER BY month) AS same_month_last_year
FROM monthly_sales;`

  const firstLastValue = `-- FIRST_VALUE and LAST_VALUE
SELECT 
    order_date,
    customer_id,
    amount,
    FIRST_VALUE(amount) OVER (
        PARTITION BY customer_id 
        ORDER BY order_date
    ) AS first_order_amount,
    LAST_VALUE(amount) OVER (
        PARTITION BY customer_id 
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS last_order_amount
FROM orders;

-- NTH_VALUE
SELECT 
    product_name,
    category,
    unit_price,
    NTH_VALUE(product_name, 2) OVER (
        PARTITION BY category 
        ORDER BY unit_price DESC
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS second_most_expensive
FROM products;`

  const frameClause = `-- Window frame: ROWS BETWEEN
SELECT 
    order_date,
    amount,
    -- Last 3 rows including current
    AVG(amount) OVER (
        ORDER BY order_date
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS moving_avg_3,
    
    -- 7-day moving average
    AVG(amount) OVER (
        ORDER BY order_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS moving_avg_7
FROM daily_sales;

-- Common frame specifications
-- ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW  (default with ORDER BY)
-- ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING          (centered window)
-- ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING  (from current to end)
-- ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING  (entire partition)`

  const rangeVsRows = `-- ROWS vs RANGE
-- ROWS: Physical row positions
SELECT 
    sale_date,
    amount,
    SUM(amount) OVER (
        ORDER BY sale_date
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS sum_3_rows
FROM sales;

-- RANGE: Logical value ranges (same dates grouped)
SELECT 
    sale_date,
    amount,
    SUM(amount) OVER (
        ORDER BY sale_date
        RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW
    ) AS sum_7_days
FROM sales;`

  const namedWindow = `-- Named windows for reuse
SELECT 
    product_name,
    category,
    unit_price,
    ROW_NUMBER() OVER w AS row_num,
    RANK() OVER w AS rank,
    DENSE_RANK() OVER w AS dense_rank,
    AVG(unit_price) OVER w AS running_avg
FROM products
WINDOW w AS (PARTITION BY category ORDER BY unit_price DESC);

-- Multiple named windows
SELECT 
    order_date,
    customer_id,
    amount,
    SUM(amount) OVER all_orders AS total,
    SUM(amount) OVER by_customer AS customer_total,
    ROW_NUMBER() OVER by_date AS daily_rank
FROM orders
WINDOW 
    all_orders AS (),
    by_customer AS (PARTITION BY customer_id),
    by_date AS (PARTITION BY order_date ORDER BY amount DESC);`

  const percentRank = `-- PERCENT_RANK: Relative position (0 to 1)
SELECT 
    customer_id,
    total_spent,
    PERCENT_RANK() OVER (ORDER BY total_spent) AS percentile
FROM customer_summary;

-- CUME_DIST: Cumulative distribution
SELECT 
    product_name,
    unit_price,
    CUME_DIST() OVER (ORDER BY unit_price) AS cumulative_dist
FROM products;

-- Percentile grouping
SELECT 
    customer_id,
    total_spent,
    CASE 
        WHEN PERCENT_RANK() OVER (ORDER BY total_spent DESC) <= 0.1 THEN 'Top 10%'
        WHEN PERCENT_RANK() OVER (ORDER BY total_spent DESC) <= 0.25 THEN 'Top 25%'
        WHEN PERCENT_RANK() OVER (ORDER BY total_spent DESC) <= 0.5 THEN 'Top 50%'
        ELSE 'Bottom 50%'
    END AS customer_tier
FROM customer_summary;`

  const windowFlow = `flowchart TD
    A["PARTITION BY<br/>Divide into groups"] --> B["ORDER BY<br/>Sort within partition"]
    B --> C["Frame Clause<br/>Define window bounds"]
    C --> D["Window Function<br/>Calculate over window"]
    
    style A fill:#1a1a2e,stroke:#3b82f6,color:#3b82f6
    style B fill:#16213e,stroke:#10b981,color:#10b981
    style C fill:#16213e,stroke:#00d4ff,color:#00d4ff
    style D fill:#1a1a2e,stroke:#a855f7,color:#a855f7`

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-sql-blue transition-colors">Home</Link>
          <span>/</span>
          <span className="text-sql-blue">Module 6</span>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-pink-500/20 rounded-xl border border-pink-500/30">
            <TrendingUp className="text-pink-400" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              Window Functions
            </h1>
            <p className="text-gray-400">Module 6 of 7</p>
          </div>
        </div>

        <p className="text-gray-300 text-lg">
          Master window functions for advanced analytics: rankings, running totals,
          moving averages, and row-level comparisons without losing detail.
        </p>
      </div>

      {/* Learning Objectives */}
      <section className="card-highlight mb-8">
        <h2 className="section-title">Learning Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Understand OVER() clause syntax',
            'Use PARTITION BY for grouped calculations',
            'Create running totals with ORDER BY',
            'Apply ranking functions (ROW_NUMBER, RANK, etc.)',
            'Access other rows with LAG/LEAD',
            'Define custom frames with ROWS/RANGE',
            'Calculate percentiles and distributions'
          ].map((objective, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="text-sql-green flex-shrink-0" size={18} />
              <span className="text-gray-300">{objective}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Window Function Flow */}
      <section className="mb-8">
        <FlowDiagram 
          chart={windowFlow} 
          title="Window Function Components"
        />
      </section>

      {/* Basic Window Functions */}
      <section className="mb-8">
        <h2 className="section-title">Introduction to Window Functions</h2>
        <p className="text-gray-300 mb-4">
          Window functions perform calculations across related rows without collapsing them 
          into groups. Unlike GROUP BY, you keep all rows while adding aggregate information.
        </p>
        
        <CodeBlock 
          code={basicWindow} 
          title="basic_window.sql"
          highlightLines={[6, 7]}
        />

        <div className="mt-4">
          <OutputDisplay
            title="Orders with Running Context"
            columns={[
              { name: 'order_id', type: 'INT' },
              { name: 'customer_id', type: 'INT' },
              { name: 'amount', type: 'DECIMAL' },
              { name: 'total_all_orders', type: 'DECIMAL' },
              { name: 'pct_of_total', type: 'DECIMAL' }
            ]}
            rows={[
              ['1001', '101', '150.00', '2850.00', '5.26'],
              ['1002', '102', '275.00', '2850.00', '9.65'],
              ['1003', '101', '89.99', '2850.00', '3.16'],
              ['1004', '103', '425.00', '2850.00', '14.91'],
            ]}
            rowCount={4}
          />
        </div>

        <div className="card-dark mt-4">
          <h3 className="text-sql-green font-semibold mb-2">Window vs GROUP BY</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">GROUP BY:</p>
              <p className="text-gray-300">Collapses rows → one row per group</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Window Function:</p>
              <p className="text-gray-300">Keeps all rows → adds calculated columns</p>
            </div>
          </div>
        </div>
      </section>

      {/* PARTITION BY */}
      <section className="mb-8">
        <h2 className="section-title">PARTITION BY</h2>
        <p className="text-gray-300 mb-4">
          PARTITION BY divides rows into groups (partitions) for the window function.
          Each partition is processed independently.
        </p>
        
        <CodeBlock 
          code={partitionBy} 
          title="partition_by.sql"
          highlightLines={[7, 8]}
        />

        <div className="mt-4">
          <OutputDisplay
            title="Customer Order Context"
            columns={[
              { name: 'order_id', type: 'INT' },
              { name: 'customer_id', type: 'INT' },
              { name: 'amount', type: 'DECIMAL' },
              { name: 'customer_total', type: 'DECIMAL' },
              { name: 'customer_order_count', type: 'INT' }
            ]}
            rows={[
              ['1001', '101', '150.00', '239.99', '2'],
              ['1003', '101', '89.99', '239.99', '2'],
              ['1002', '102', '275.00', '275.00', '1'],
              ['1004', '103', '425.00', '425.00', '1'],
            ]}
            rowCount={4}
          />
        </div>
      </section>

      {/* ORDER BY in Window */}
      <section className="mb-8">
        <h2 className="section-title">ORDER BY in Windows</h2>
        <p className="text-gray-300 mb-4">
          Adding ORDER BY to the window creates running (cumulative) calculations
          from the first row to the current row.
        </p>
        
        <CodeBlock 
          code={orderByWindow} 
          title="order_by_window.sql"
          highlightLines={[5, 6, 7]}
        />

        <div className="mt-4">
          <OutputDisplay
            title="Running Totals"
            columns={[
              { name: 'order_date', type: 'DATE' },
              { name: 'amount', type: 'DECIMAL' },
              { name: 'running_total', type: 'DECIMAL' },
              { name: 'running_avg', type: 'DECIMAL' },
              { name: 'cumulative_count', type: 'INT' }
            ]}
            rows={[
              ['2024-01-01', '150.00', '150.00', '150.00', '1'],
              ['2024-01-02', '275.00', '425.00', '212.50', '2'],
              ['2024-01-03', '89.99', '514.99', '171.66', '3'],
              ['2024-01-04', '425.00', '939.99', '234.99', '4'],
            ]}
            rowCount={4}
          />
        </div>
      </section>

      {/* Ranking Functions */}
      <section className="mb-8">
        <h2 className="section-title">Ranking Functions</h2>
        <p className="text-gray-300 mb-4">
          Assign rankings to rows based on specified ordering.
        </p>
        
        <CodeBlock code={rankingFunctions} title="ranking_functions.sql" />

        <div className="card-dark mt-4">
          <h3 className="text-accent-cyan font-semibold mb-3">Ranking Functions Comparison</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Function</th>
                <th>Ties</th>
                <th>Example Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="text-sql-blue">ROW_NUMBER()</code></td>
                <td>Unique numbers</td>
                <td>1, 2, 3, 4</td>
              </tr>
              <tr>
                <td><code className="text-sql-blue">RANK()</code></td>
                <td>Same rank, gaps</td>
                <td>1, 2, 2, 4</td>
              </tr>
              <tr>
                <td><code className="text-sql-blue">DENSE_RANK()</code></td>
                <td>Same rank, no gaps</td>
                <td>1, 2, 2, 3</td>
              </tr>
              <tr>
                <td><code className="text-sql-blue">NTILE(n)</code></td>
                <td>Bucket assignment</td>
                <td>1, 1, 2, 2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Ranking by Partition */}
      <section className="mb-8">
        <h2 className="section-title">Top-N Per Group Pattern</h2>
        <p className="text-gray-300 mb-4">
          Combine PARTITION BY with ranking to find top records within each group.
        </p>
        
        <CodeBlock 
          code={rankingByPartition} 
          title="top_n_per_group.sql"
          highlightLines={[11, 12, 13, 14, 15, 16, 17, 18]}
        />
      </section>

      {/* LAG and LEAD */}
      <section className="mb-8">
        <h2 className="section-title">LAG and LEAD</h2>
        <p className="text-gray-300 mb-4">
          Access data from other rows relative to the current row without self-joins.
        </p>
        
        <CodeBlock code={lagLead} title="lag_lead.sql" />

        <div className="mt-4">
          <OutputDisplay
            title="Period-over-Period Comparison"
            columns={[
              { name: 'order_date', type: 'DATE' },
              { name: 'amount', type: 'DECIMAL' },
              { name: 'prev_amount', type: 'DECIMAL' },
              { name: 'change', type: 'DECIMAL' }
            ]}
            rows={[
              ['2024-01-01', '150.00', null, null],
              ['2024-01-02', '275.00', '150.00', '125.00'],
              ['2024-01-03', '89.99', '275.00', '-185.01'],
              ['2024-01-04', '425.00', '89.99', '335.01'],
            ]}
            rowCount={4}
          />
        </div>

        <div className="card-dark mt-4">
          <h3 className="text-sql-green font-semibold mb-2">LAG/LEAD Syntax</h3>
          <code className="text-gray-300 text-sm block font-mono">
            LAG(column, offset, default) OVER (ORDER BY ...)
          </code>
          <ul className="mt-2 space-y-1 text-gray-400 text-sm">
            <li>• <code>offset</code>: How many rows back/forward (default: 1)</li>
            <li>• <code>default</code>: Value when no row exists (default: NULL)</li>
          </ul>
        </div>
      </section>

      {/* FIRST_VALUE and LAST_VALUE */}
      <section className="mb-8">
        <h2 className="section-title">FIRST_VALUE, LAST_VALUE, NTH_VALUE</h2>
        <p className="text-gray-300 mb-4">
          Access specific rows within the window frame.
        </p>
        
        <CodeBlock code={firstLastValue} title="first_last_value.sql" />

        <div className="card-dark mt-4 border-accent-orange/30">
          <h3 className="text-accent-orange font-semibold mb-2">⚠️ LAST_VALUE Gotcha</h3>
          <p className="text-gray-300 text-sm">
            By default, LAST_VALUE only sees rows up to the current row. 
            Add <code className="code-inline">ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</code> 
            to see the entire partition.
          </p>
        </div>
      </section>

      {/* Frame Clause */}
      <section className="mb-8">
        <h2 className="section-title">Window Frame (ROWS/RANGE)</h2>
        <p className="text-gray-300 mb-4">
          Define exactly which rows to include in the window calculation.
        </p>
        
        <CodeBlock code={frameClause} title="frame_clause.sql" />

        <div className="card-dark mt-4">
          <h3 className="text-accent-purple font-semibold mb-3">Frame Boundaries</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-accent-cyan font-mono mb-1">Start options:</p>
              <ul className="text-gray-400 space-y-1">
                <li>• UNBOUNDED PRECEDING</li>
                <li>• N PRECEDING</li>
                <li>• CURRENT ROW</li>
              </ul>
            </div>
            <div>
              <p className="text-accent-cyan font-mono mb-1">End options:</p>
              <ul className="text-gray-400 space-y-1">
                <li>• CURRENT ROW</li>
                <li>• N FOLLOWING</li>
                <li>• UNBOUNDED FOLLOWING</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ROWS vs RANGE */}
      <section className="mb-8">
        <h2 className="section-title">ROWS vs RANGE</h2>
        <p className="text-gray-300 mb-4">
          ROWS counts physical rows; RANGE groups by logical values.
        </p>
        
        <CodeBlock code={rangeVsRows} title="rows_vs_range.sql" />
      </section>

      {/* Named Windows */}
      <section className="mb-8">
        <h2 className="section-title">Named Windows</h2>
        <p className="text-gray-300 mb-4">
          Define reusable window definitions with the WINDOW clause.
        </p>
        
        <CodeBlock 
          code={namedWindow} 
          title="named_windows.sql"
          highlightLines={[10]}
        />
      </section>

      {/* Percentiles */}
      <section className="mb-8">
        <h2 className="section-title">Percentiles and Distribution</h2>
        <p className="text-gray-300 mb-4">
          Calculate relative positions and cumulative distributions.
        </p>
        
        <CodeBlock code={percentRank} title="percentiles.sql" />

        <div className="mt-4">
          <OutputDisplay
            title="Customer Tiers by Spending"
            columns={[
              { name: 'customer_id', type: 'INT' },
              { name: 'total_spent', type: 'DECIMAL' },
              { name: 'customer_tier', type: 'VARCHAR' }
            ]}
            rows={[
              ['1001', '15420.00', 'Top 10%'],
              ['1002', '8750.00', 'Top 25%'],
              ['1003', '4200.00', 'Top 50%'],
              ['1004', '1850.00', 'Bottom 50%'],
            ]}
            rowCount={4}
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
              <span>Window functions calculate across rows without collapsing them</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>PARTITION BY creates groups; ORDER BY enables running calculations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>ROW_NUMBER, RANK, DENSE_RANK assign rankings differently</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>LAG/LEAD access previous/next rows for comparisons</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Frame clauses (ROWS/RANGE BETWEEN) define calculation scope</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Named windows improve code reuse and readability</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t border-sql-blue/20">
        <Link
          to="/module/5"
          className="flex items-center gap-2 text-gray-400 hover:text-sql-blue transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Module 5: Subqueries & CTEs</span>
        </Link>
        <Link
          to="/module/7"
          className="btn-primary flex items-center gap-2"
        >
          <span>Module 7: Advanced Analytics</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  )
}
