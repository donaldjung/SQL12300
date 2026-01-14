import { Link } from 'react-router-dom'
import { LineChart, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import CodeBlock from '../../components/code/CodeBlock'
import OutputDisplay from '../../components/code/OutputDisplay'
import FlowDiagram from '../../components/visualizations/FlowDiagram'

export default function Module7_AdvancedAnalytics() {
  const caseExpressions = `-- CASE expressions for conditional logic
SELECT 
    customer_name,
    total_spent,
    CASE 
        WHEN total_spent >= 10000 THEN 'Platinum'
        WHEN total_spent >= 5000 THEN 'Gold'
        WHEN total_spent >= 1000 THEN 'Silver'
        ELSE 'Bronze'
    END AS customer_tier,
    CASE 
        WHEN last_order_date >= CURRENT_DATE - INTERVAL '30 days' THEN 'Active'
        WHEN last_order_date >= CURRENT_DATE - INTERVAL '90 days' THEN 'At Risk'
        ELSE 'Churned'
    END AS status
FROM customer_summary;

-- CASE in aggregations
SELECT 
    category,
    COUNT(*) AS total_products,
    COUNT(CASE WHEN unit_price > 100 THEN 1 END) AS premium_products,
    COUNT(CASE WHEN quantity_in_stock = 0 THEN 1 END) AS out_of_stock
FROM products
GROUP BY category;`

  const pivotQuery = `-- Pivoting rows to columns with CASE
SELECT 
    product_category,
    SUM(CASE WHEN EXTRACT(QUARTER FROM sale_date) = 1 THEN amount ELSE 0 END) AS q1_sales,
    SUM(CASE WHEN EXTRACT(QUARTER FROM sale_date) = 2 THEN amount ELSE 0 END) AS q2_sales,
    SUM(CASE WHEN EXTRACT(QUARTER FROM sale_date) = 3 THEN amount ELSE 0 END) AS q3_sales,
    SUM(CASE WHEN EXTRACT(QUARTER FROM sale_date) = 4 THEN amount ELSE 0 END) AS q4_sales,
    SUM(amount) AS yearly_total
FROM sales
WHERE EXTRACT(YEAR FROM sale_date) = 2024
GROUP BY product_category
ORDER BY yearly_total DESC;

-- Conditional aggregation for cross-tab reports
SELECT 
    region,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled,
    ROUND(100.0 * COUNT(CASE WHEN status = 'completed' THEN 1 END) / COUNT(*), 1) AS completion_rate
FROM orders
GROUP BY region;`

  const cohortAnalysis = `-- Cohort analysis: Retention by signup month
WITH user_cohorts AS (
    SELECT 
        user_id,
        DATE_TRUNC('month', signup_date) AS cohort_month
    FROM users
),
user_activity AS (
    SELECT 
        uc.cohort_month,
        DATE_TRUNC('month', e.event_date) AS activity_month,
        COUNT(DISTINCT e.user_id) AS active_users
    FROM user_cohorts uc
    JOIN events e ON uc.user_id = e.user_id
    GROUP BY uc.cohort_month, DATE_TRUNC('month', e.event_date)
),
cohort_size AS (
    SELECT cohort_month, COUNT(*) AS users
    FROM user_cohorts
    GROUP BY cohort_month
)
SELECT 
    ua.cohort_month,
    EXTRACT(MONTH FROM AGE(ua.activity_month, ua.cohort_month)) AS months_since_signup,
    ua.active_users,
    cs.users AS cohort_size,
    ROUND(100.0 * ua.active_users / cs.users, 1) AS retention_pct
FROM user_activity ua
JOIN cohort_size cs ON ua.cohort_month = cs.cohort_month
ORDER BY ua.cohort_month, months_since_signup;`

  const funnelAnalysis = `-- Funnel analysis: Conversion through steps
WITH funnel_steps AS (
    SELECT 
        user_id,
        MAX(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) AS visited,
        MAX(CASE WHEN event_type = 'add_to_cart' THEN 1 ELSE 0 END) AS added_cart,
        MAX(CASE WHEN event_type = 'checkout_start' THEN 1 ELSE 0 END) AS started_checkout,
        MAX(CASE WHEN event_type = 'purchase' THEN 1 ELSE 0 END) AS completed_purchase
    FROM events
    WHERE event_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY user_id
)
SELECT 
    'Visited' AS step,
    SUM(visited) AS users,
    100.0 AS conversion_pct
FROM funnel_steps
UNION ALL
SELECT 
    'Added to Cart',
    SUM(added_cart),
    ROUND(100.0 * SUM(added_cart) / SUM(visited), 1)
FROM funnel_steps
UNION ALL
SELECT 
    'Started Checkout',
    SUM(started_checkout),
    ROUND(100.0 * SUM(started_checkout) / SUM(visited), 1)
FROM funnel_steps
UNION ALL
SELECT 
    'Completed Purchase',
    SUM(completed_purchase),
    ROUND(100.0 * SUM(completed_purchase) / SUM(visited), 1)
FROM funnel_steps;`

  const timeSeriesAnalysis = `-- Year-over-year comparison
SELECT 
    DATE_TRUNC('month', order_date) AS month,
    SUM(amount) AS revenue,
    LAG(SUM(amount), 12) OVER (ORDER BY DATE_TRUNC('month', order_date)) AS revenue_last_year,
    ROUND(
        100.0 * (SUM(amount) - LAG(SUM(amount), 12) OVER (ORDER BY DATE_TRUNC('month', order_date))) 
        / NULLIF(LAG(SUM(amount), 12) OVER (ORDER BY DATE_TRUNC('month', order_date)), 0),
        1
    ) AS yoy_growth_pct
FROM orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;

-- Moving averages for trend analysis
SELECT 
    order_date,
    daily_revenue,
    AVG(daily_revenue) OVER (
        ORDER BY order_date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS ma_7_day,
    AVG(daily_revenue) OVER (
        ORDER BY order_date 
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
    ) AS ma_30_day
FROM (
    SELECT order_date, SUM(amount) AS daily_revenue
    FROM orders
    GROUP BY order_date
) daily_totals
ORDER BY order_date;`

  const gapAnalysis = `-- Identifying gaps in sequences
WITH numbered AS (
    SELECT 
        order_date,
        ROW_NUMBER() OVER (ORDER BY order_date) AS rn,
        order_date - CAST(ROW_NUMBER() OVER (ORDER BY order_date) AS INTEGER) * INTERVAL '1 day' AS grp
    FROM (SELECT DISTINCT order_date FROM orders) dates
)
SELECT 
    MIN(order_date) AS period_start,
    MAX(order_date) AS period_end,
    COUNT(*) AS consecutive_days
FROM numbered
GROUP BY grp
ORDER BY period_start;

-- Find days with no orders
WITH date_range AS (
    SELECT generate_series(
        (SELECT MIN(order_date) FROM orders),
        (SELECT MAX(order_date) FROM orders),
        '1 day'::interval
    )::date AS date
)
SELECT dr.date AS missing_date
FROM date_range dr
LEFT JOIN orders o ON dr.date = DATE(o.order_date)
WHERE o.order_id IS NULL;`

  const sessionization = `-- Sessionize user activity (30-min timeout)
WITH session_boundaries AS (
    SELECT 
        user_id,
        event_timestamp,
        LAG(event_timestamp) OVER (
            PARTITION BY user_id 
            ORDER BY event_timestamp
        ) AS prev_timestamp,
        CASE 
            WHEN event_timestamp - LAG(event_timestamp) OVER (
                PARTITION BY user_id ORDER BY event_timestamp
            ) > INTERVAL '30 minutes' 
            THEN 1 
            ELSE 0 
        END AS new_session
    FROM events
),
sessions AS (
    SELECT 
        user_id,
        event_timestamp,
        SUM(new_session) OVER (
            PARTITION BY user_id 
            ORDER BY event_timestamp
        ) + 1 AS session_id
    FROM session_boundaries
)
SELECT 
    user_id,
    session_id,
    MIN(event_timestamp) AS session_start,
    MAX(event_timestamp) AS session_end,
    COUNT(*) AS events_in_session,
    MAX(event_timestamp) - MIN(event_timestamp) AS session_duration
FROM sessions
GROUP BY user_id, session_id;`

  const performanceTips = `-- Use indexes for WHERE and JOIN columns
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_date ON orders(order_date);

-- Avoid SELECT * - specify needed columns
SELECT order_id, amount, order_date  -- Good
FROM orders;

-- Filter early with WHERE before joins
SELECT o.*, c.customer_name
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_date >= '2024-01-01';  -- Filter before join

-- Use EXISTS instead of IN for large subqueries
SELECT * FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);

-- EXPLAIN ANALYZE to understand query performance
EXPLAIN ANALYZE
SELECT customer_id, SUM(amount)
FROM orders
WHERE order_date >= '2024-01-01'
GROUP BY customer_id;`

  const commonPatterns = `-- Running difference (change from previous)
SELECT 
    order_date,
    amount,
    amount - LAG(amount) OVER (ORDER BY order_date) AS daily_change,
    ROUND(100.0 * (amount - LAG(amount) OVER (ORDER BY order_date)) 
          / NULLIF(LAG(amount) OVER (ORDER BY order_date), 0), 1) AS pct_change
FROM daily_revenue;

-- Cumulative percentage
SELECT 
    product_name,
    revenue,
    SUM(revenue) OVER (ORDER BY revenue DESC) AS cumulative_revenue,
    ROUND(100.0 * SUM(revenue) OVER (ORDER BY revenue DESC) 
          / SUM(revenue) OVER (), 1) AS cumulative_pct
FROM product_revenue
ORDER BY revenue DESC;

-- First/Last per group
SELECT DISTINCT ON (customer_id)
    customer_id,
    order_id,
    order_date,
    amount
FROM orders
ORDER BY customer_id, order_date DESC;  -- Most recent order per customer`

  const deduplication = `-- Remove duplicates keeping first occurrence
DELETE FROM orders
WHERE order_id NOT IN (
    SELECT MIN(order_id)
    FROM orders
    GROUP BY customer_id, order_date, amount
);

-- Identify duplicates
SELECT 
    customer_id, order_date, amount,
    COUNT(*) AS occurrences
FROM orders
GROUP BY customer_id, order_date, amount
HAVING COUNT(*) > 1;

-- Deduplicate with ROW_NUMBER
WITH ranked AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY customer_id, order_date, amount
            ORDER BY created_at
        ) AS rn
    FROM orders
)
SELECT * FROM ranked WHERE rn = 1;`

  const analyticsFlow = `flowchart LR
    A[Raw Data] --> B[Clean/Filter]
    B --> C[Transform]
    C --> D[Aggregate]
    D --> E[Analyze]
    E --> F[Insights]
    
    style A fill:#1a1a2e,stroke:#3b82f6,color:#3b82f6
    style B fill:#16213e,stroke:#10b981,color:#10b981
    style C fill:#16213e,stroke:#00d4ff,color:#00d4ff
    style D fill:#16213e,stroke:#a855f7,color:#a855f7
    style E fill:#1a1a2e,stroke:#f97316,color:#f97316
    style F fill:#1a1a2e,stroke:#ec4899,color:#ec4899`

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-sql-blue transition-colors">Home</Link>
          <span>/</span>
          <span className="text-sql-blue">Module 7</span>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
            <LineChart className="text-yellow-400" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              Advanced Analytics Patterns
            </h1>
            <p className="text-gray-400">Module 7 of 7</p>
          </div>
        </div>

        <p className="text-gray-300 text-lg">
          Apply everything you've learned to real-world analytics scenarios: cohort analysis,
          funnels, time series, and query performance optimization.
        </p>
      </div>

      {/* Learning Objectives */}
      <section className="card-highlight mb-8">
        <h2 className="section-title">Learning Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Build dynamic queries with CASE expressions',
            'Create pivot tables and cross-tabs',
            'Perform cohort and retention analysis',
            'Build conversion funnels',
            'Analyze time series data',
            'Identify gaps and islands in data',
            'Optimize query performance'
          ].map((objective, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="text-sql-green flex-shrink-0" size={18} />
              <span className="text-gray-300">{objective}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics Flow */}
      <section className="mb-8">
        <FlowDiagram 
          chart={analyticsFlow} 
          title="Data Analytics Pipeline"
        />
      </section>

      {/* CASE Expressions */}
      <section className="mb-8">
        <h2 className="section-title">Advanced CASE Expressions</h2>
        <p className="text-gray-300 mb-4">
          CASE expressions enable conditional logic directly in SQL for classification,
          bucketing, and complex business rules.
        </p>
        
        <CodeBlock 
          code={caseExpressions} 
          title="case_expressions.sql"
          highlightLines={[5, 6, 7, 8, 9, 10]}
        />

        <div className="mt-4">
          <OutputDisplay
            title="Customer Segmentation"
            columns={[
              { name: 'customer_name', type: 'VARCHAR' },
              { name: 'total_spent', type: 'DECIMAL' },
              { name: 'customer_tier', type: 'VARCHAR' },
              { name: 'status', type: 'VARCHAR' }
            ]}
            rows={[
              ['John Smith', '15420.00', 'Platinum', 'Active'],
              ['Jane Doe', '6800.00', 'Gold', 'Active'],
              ['Bob Wilson', '2100.00', 'Silver', 'At Risk'],
              ['Alice Brown', '450.00', 'Bronze', 'Churned'],
            ]}
            rowCount={4}
          />
        </div>
      </section>

      {/* Pivot Tables */}
      <section className="mb-8">
        <h2 className="section-title">Pivot Tables and Cross-Tabs</h2>
        <p className="text-gray-300 mb-4">
          Transform rows into columns for comparison reports using conditional aggregation.
        </p>
        
        <CodeBlock code={pivotQuery} title="pivot_query.sql" />

        <div className="mt-4">
          <OutputDisplay
            title="Quarterly Sales by Category"
            columns={[
              { name: 'product_category', type: 'VARCHAR' },
              { name: 'q1_sales', type: 'DECIMAL' },
              { name: 'q2_sales', type: 'DECIMAL' },
              { name: 'q3_sales', type: 'DECIMAL' },
              { name: 'q4_sales', type: 'DECIMAL' },
              { name: 'yearly_total', type: 'DECIMAL' }
            ]}
            rows={[
              ['Electronics', '125000', '142000', '138000', '189000', '594000'],
              ['Clothing', '78000', '92000', '85000', '115000', '370000'],
              ['Home', '45000', '52000', '48000', '72000', '217000'],
            ]}
            rowCount={3}
          />
        </div>
      </section>

      {/* Cohort Analysis */}
      <section className="mb-8">
        <h2 className="section-title">Cohort Analysis</h2>
        <p className="text-gray-300 mb-4">
          Track user behavior over time based on when they joined (signup cohort).
          Essential for measuring retention and product engagement.
        </p>
        
        <CodeBlock 
          code={cohortAnalysis} 
          title="cohort_analysis.sql"
          highlightLines={[3, 4, 5, 6]}
        />

        <div className="mt-4">
          <OutputDisplay
            title="Cohort Retention Analysis"
            columns={[
              { name: 'cohort_month', type: 'DATE' },
              { name: 'months_since_signup', type: 'INT' },
              { name: 'active_users', type: 'INT' },
              { name: 'cohort_size', type: 'INT' },
              { name: 'retention_pct', type: 'DECIMAL' }
            ]}
            rows={[
              ['2024-01-01', '0', '1000', '1000', '100.0'],
              ['2024-01-01', '1', '680', '1000', '68.0'],
              ['2024-01-01', '2', '520', '1000', '52.0'],
              ['2024-01-01', '3', '450', '1000', '45.0'],
            ]}
            rowCount={4}
          />
        </div>
      </section>

      {/* Funnel Analysis */}
      <section className="mb-8">
        <h2 className="section-title">Funnel Analysis</h2>
        <p className="text-gray-300 mb-4">
          Measure conversion through a sequence of steps to identify drop-off points.
        </p>
        
        <CodeBlock code={funnelAnalysis} title="funnel_analysis.sql" />

        <div className="mt-4">
          <OutputDisplay
            title="Conversion Funnel"
            columns={[
              { name: 'step', type: 'VARCHAR' },
              { name: 'users', type: 'INT' },
              { name: 'conversion_pct', type: 'DECIMAL' }
            ]}
            rows={[
              ['Visited', '10000', '100.0'],
              ['Added to Cart', '3200', '32.0'],
              ['Started Checkout', '1800', '18.0'],
              ['Completed Purchase', '1200', '12.0'],
            ]}
            rowCount={4}
          />
        </div>
      </section>

      {/* Time Series */}
      <section className="mb-8">
        <h2 className="section-title">Time Series Analysis</h2>
        <p className="text-gray-300 mb-4">
          Compare periods, calculate growth rates, and identify trends with moving averages.
        </p>
        
        <CodeBlock 
          code={timeSeriesAnalysis} 
          title="time_series.sql"
          highlightLines={[5, 6, 7, 8, 9, 10]}
        />
      </section>

      {/* Gap Analysis */}
      <section className="mb-8">
        <h2 className="section-title">Gaps and Islands Analysis</h2>
        <p className="text-gray-300 mb-4">
          Find missing dates, identify consecutive periods, and detect anomalies.
        </p>
        
        <CodeBlock code={gapAnalysis} title="gap_analysis.sql" />
      </section>

      {/* Sessionization */}
      <section className="mb-8">
        <h2 className="section-title">Session Analysis</h2>
        <p className="text-gray-300 mb-4">
          Group user events into sessions based on activity gaps.
        </p>
        
        <CodeBlock 
          code={sessionization} 
          title="sessionization.sql"
          highlightLines={[8, 9, 10, 11, 12, 13, 14]}
        />

        <div className="mt-4">
          <OutputDisplay
            title="User Sessions"
            columns={[
              { name: 'user_id', type: 'INT' },
              { name: 'session_id', type: 'INT' },
              { name: 'session_start', type: 'TIMESTAMP' },
              { name: 'events_in_session', type: 'INT' },
              { name: 'session_duration', type: 'INTERVAL' }
            ]}
            rows={[
              ['101', '1', '2024-01-15 10:00:00', '12', '00:25:30'],
              ['101', '2', '2024-01-15 14:30:00', '8', '00:15:45'],
              ['102', '1', '2024-01-15 09:15:00', '23', '00:45:00'],
            ]}
            rowCount={3}
          />
        </div>
      </section>

      {/* Common Patterns */}
      <section className="mb-8">
        <h2 className="section-title">Common Analytics Patterns</h2>
        <p className="text-gray-300 mb-4">
          Frequently used patterns for everyday analytics tasks.
        </p>
        
        <CodeBlock code={commonPatterns} title="common_patterns.sql" />
      </section>

      {/* Deduplication */}
      <section className="mb-8">
        <h2 className="section-title">Deduplication Techniques</h2>
        <p className="text-gray-300 mb-4">
          Identify and remove duplicate records while preserving data integrity.
        </p>
        
        <CodeBlock code={deduplication} title="deduplication.sql" />
      </section>

      {/* Performance Tips */}
      <section className="mb-8">
        <h2 className="section-title">Query Performance Optimization</h2>
        <p className="text-gray-300 mb-4">
          Write efficient queries that scale with your data.
        </p>
        
        <CodeBlock code={performanceTips} title="performance_tips.sql" />

        <div className="card-dark mt-4">
          <h3 className="text-sql-green font-semibold mb-3">Performance Checklist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-accent-cyan text-sm font-semibold mb-2">Do:</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>✓ Use indexes on filtered columns</li>
                <li>✓ Filter early in the query</li>
                <li>✓ Select only needed columns</li>
                <li>✓ Use EXISTS over IN for large sets</li>
                <li>✓ Analyze query plans with EXPLAIN</li>
              </ul>
            </div>
            <div>
              <h4 className="text-accent-orange text-sm font-semibold mb-2">Avoid:</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>✗ SELECT * in production</li>
                <li>✗ Functions on indexed columns in WHERE</li>
                <li>✗ Cartesian joins (missing ON clause)</li>
                <li>✗ Correlated subqueries when joins work</li>
                <li>✗ Large IN lists (use temp tables)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="card-highlight mb-8">
        <h2 className="section-title">Course Summary</h2>
        <div className="space-y-4 text-gray-300">
          <p className="text-lg">
            Congratulations! You've completed the SQL for Data Analytics course. 
            You now have the skills to:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Write queries from basic SELECT to complex analytics</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Join and combine data from multiple tables</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Aggregate and group data for summary reports</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Use CTEs and window functions for advanced analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Perform cohort, funnel, and time series analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sql-blue">✓</span>
              <span>Optimize queries for performance</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Next Steps */}
      <section className="card-dark border-sql-blue/30 mb-8">
        <h2 className="text-sql-blue font-display font-bold text-xl mb-4">Next Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-accent-cyan font-semibold mb-2">Practice</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Use the <Link to="/playground" className="text-sql-blue hover:underline">Playground</Link> to experiment</li>
              <li>• Try challenges on LeetCode SQL</li>
              <li>• Analyze your own datasets</li>
            </ul>
          </div>
          <div>
            <h3 className="text-accent-cyan font-semibold mb-2">Learn More</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Database-specific features (PostgreSQL, etc.)</li>
              <li>• Query optimization and indexing</li>
              <li>• Data modeling and schema design</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t border-sql-blue/20">
        <Link
          to="/module/6"
          className="flex items-center gap-2 text-gray-400 hover:text-sql-blue transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Module 6: Window Functions</span>
        </Link>
        <Link
          to="/playground"
          className="btn-primary flex items-center gap-2"
        >
          <span>Try the Playground</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  )
}
