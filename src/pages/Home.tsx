import { Link } from 'react-router-dom'
import { 
  Database, 
  Filter, 
  GitMerge, 
  BarChart3, 
  Layers, 
  TrendingUp, 
  LineChart,
  ArrowRight,
  Zap,
  BookOpen,
  Code2
} from 'lucide-react'
import CodeBlock from '../components/code/CodeBlock'

const modules = [
  { 
    id: 1, 
    title: 'SQL Fundamentals', 
    icon: Database, 
    description: 'SELECT, FROM, column aliases, DISTINCT, data types',
    color: 'text-sql-blue'
  },
  { 
    id: 2, 
    title: 'Filtering & Sorting', 
    icon: Filter, 
    description: 'WHERE clauses, comparison operators, ORDER BY, LIMIT',
    color: 'text-sql-green'
  },
  { 
    id: 3, 
    title: 'Joins & Relations', 
    icon: GitMerge, 
    description: 'INNER, LEFT, RIGHT, FULL, CROSS JOINs and self-joins',
    color: 'text-accent-cyan'
  },
  { 
    id: 4, 
    title: 'Aggregation', 
    icon: BarChart3, 
    description: 'COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING',
    color: 'text-accent-purple'
  },
  { 
    id: 5, 
    title: 'Subqueries & CTEs', 
    icon: Layers, 
    description: 'Scalar subqueries, correlated subqueries, WITH clause',
    color: 'text-accent-orange'
  },
  { 
    id: 6, 
    title: 'Window Functions', 
    icon: TrendingUp, 
    description: 'OVER, PARTITION BY, ROW_NUMBER, RANK, LAG, LEAD',
    color: 'text-pink-400'
  },
  { 
    id: 7, 
    title: 'Advanced Analytics', 
    icon: LineChart, 
    description: 'CASE expressions, pivoting, cohort analysis, performance',
    color: 'text-yellow-400'
  },
]

const sampleQuery = `-- Find top customers by total order value
SELECT 
    c.customer_name,
    COUNT(o.order_id) AS total_orders,
    SUM(o.amount) AS total_spent,
    RANK() OVER (ORDER BY SUM(o.amount) DESC) AS customer_rank
FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY c.customer_id, c.customer_name
HAVING COUNT(o.order_id) >= 5
ORDER BY total_spent DESC
LIMIT 10;`

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="relative py-8">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-sql-blue/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-sql-blue/20 rounded-xl border border-sql-blue/30">
              <Database className="text-sql-blue" size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                SQL <span className="text-sql-blue animate-glow">Education</span>
              </h1>
              <p className="text-gray-400 font-mono text-sm">Data Analytics Training Platform</p>
            </div>
          </div>

          <p className="text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
            Master Structured Query Language from fundamentals to advanced analytics.
            Learn to extract insights from data with industry-standard SQL techniques.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/module/1"
              className="btn-primary flex items-center gap-2 group"
            >
              <BookOpen size={18} />
              Start Learning
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/playground"
              className="btn-secondary flex items-center gap-2"
            >
              <Code2 size={18} />
              Open Playground
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-dark flex items-center gap-4">
          <div className="p-3 bg-sql-blue/20 rounded-lg">
            <BookOpen className="text-sql-blue" size={24} />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-white">7</p>
            <p className="text-gray-400 text-sm">Learning Modules</p>
          </div>
        </div>
        <div className="card-dark flex items-center gap-4">
          <div className="p-3 bg-accent-cyan/20 rounded-lg">
            <Code2 className="text-accent-cyan" size={24} />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-white">50+</p>
            <p className="text-gray-400 text-sm">Code Examples</p>
          </div>
        </div>
        <div className="card-dark flex items-center gap-4">
          <div className="p-3 bg-sql-green/20 rounded-lg">
            <Zap className="text-sql-green" size={24} />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-white">ANSI</p>
            <p className="text-gray-400 text-sm">Standard SQL</p>
          </div>
        </div>
      </section>

      {/* Sample Query Preview */}
      <section>
        <h2 className="section-title">What You'll Learn</h2>
        <CodeBlock 
          code={sampleQuery} 
          title="sample_analytics_query.sql"
        />
        <p className="mt-4 text-gray-400 text-sm">
          By the end of this course, you'll write complex analytical queries like this with confidence.
        </p>
      </section>

      {/* Modules Grid */}
      <section>
        <h2 className="section-title">Learning Path</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => (
            <Link
              key={module.id}
              to={`/module/${module.id}`}
              className="card-highlight group hover:border-sql-blue/40 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 bg-sql-terminal rounded-lg border border-sql-blue/20 group-hover:border-sql-blue/40 transition-colors`}>
                  <module.icon className={module.color} size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500">Module {module.id}</span>
                  </div>
                  <h3 className="font-display font-semibold text-white group-hover:text-sql-blue transition-colors mb-1">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-400">{module.description}</p>
                </div>
                <ArrowRight 
                  className="text-gray-600 group-hover:text-sql-blue group-hover:translate-x-1 transition-all" 
                  size={18} 
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SQL for Analytics Overview */}
      <section className="card-highlight">
        <h2 className="section-title">Why SQL for Data Analytics?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="subsection-title">Universal Data Language</h3>
            <p className="text-gray-300 mb-4">
              SQL (Structured Query Language) is the standard language for managing and analyzing 
              relational databases. It's used across virtually every industry and is a fundamental 
              skill for data analysts, engineers, and scientists.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 rounded-full bg-sql-blue" />
                Works with PostgreSQL, MySQL, SQL Server, Oracle, and more
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 rounded-full bg-sql-green" />
                Scales from simple queries to complex analytics
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                Integrates with modern data warehouses (Snowflake, BigQuery, Redshift)
              </li>
            </ul>
          </div>
          <div>
            <h3 className="subsection-title">Analytics Capabilities</h3>
            <p className="text-gray-300 mb-4">
              Modern SQL extends far beyond basic queries. With window functions, CTEs, 
              and advanced aggregations, SQL is a powerful tool for data analysis and 
              business intelligence.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 rounded-full bg-accent-purple" />
                Time series analysis and trending
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 rounded-full bg-accent-orange" />
                Cohort analysis and customer segmentation
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 rounded-full bg-pink-400" />
                Running totals, rankings, and percentiles
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="text-center py-8">
        <p className="text-gray-400 mb-4">Ready to master SQL?</p>
        <Link
          to="/module/1"
          className="btn-primary inline-flex items-center gap-2 text-lg"
        >
          Begin with Fundamentals
          <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  )
}
