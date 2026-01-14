import { useState } from 'react'
import { Copy, Check, Play } from 'lucide-react'
import { cn } from '../../lib/utils'

interface CodeBlockProps {
  code: string
  title?: string
  language?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  className?: string
  onRun?: () => void
}

// Token type definitions
type TokenType = 'keyword' | 'function' | 'string' | 'number' | 'comment' | 'type' | 'text'

interface Token {
  type: TokenType
  value: string
}

const KEYWORDS = new Set([
  'select', 'from', 'where', 'and', 'or', 'not', 'in', 'between', 'like', 'is', 'null',
  'order', 'by', 'group', 'having', 'limit', 'offset', 'distinct', 'all', 'as',
  'join', 'inner', 'left', 'right', 'full', 'cross', 'outer', 'on',
  'union', 'intersect', 'except',
  'insert', 'into', 'values', 'update', 'set', 'delete', 'create', 'drop', 'alter',
  'table', 'index', 'view', 'database', 'schema',
  'primary', 'key', 'foreign', 'references', 'unique', 'check', 'default',
  'with', 'recursive', 'case', 'when', 'then', 'else', 'end',
  'over', 'partition', 'rows', 'range', 'unbounded', 'preceding', 'following', 'current', 'row',
  'asc', 'desc', 'nulls', 'first', 'last',
  'exists', 'any', 'some',
  'cast', 'coalesce', 'nullif', 'greatest', 'least',
  'true', 'false'
])

const FUNCTIONS = new Set([
  'count', 'sum', 'avg', 'min', 'max', 'round', 'floor', 'ceil', 'abs',
  'row_number', 'rank', 'dense_rank', 'ntile', 'lag', 'lead', 'first_value', 'last_value', 'nth_value',
  'upper', 'lower', 'trim', 'ltrim', 'rtrim', 'length', 'substring', 'concat', 'replace',
  'date', 'time', 'timestamp', 'extract', 'date_trunc', 'now', 'current_date', 'current_timestamp',
  'year', 'month', 'day', 'hour', 'minute', 'second',
  'string_agg', 'array_agg', 'json_agg', 'jsonb_agg',
  'rollup', 'cube', 'grouping'
])

const DATA_TYPES = new Set([
  'int', 'integer', 'bigint', 'smallint', 'tinyint',
  'decimal', 'numeric', 'float', 'real', 'double',
  'varchar', 'char', 'text', 'nvarchar',
  'datetime', 'interval',
  'boolean', 'bool',
  'json', 'jsonb', 'xml',
  'array', 'uuid'
])

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: '#3b82f6',
  function: '#00d4ff',
  string: '#f97316',
  number: '#a855f7',
  comment: '#6b7280',
  type: '#10b981',
  text: '#d1d5db'
}

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = []
  
  // Check for comment
  if (line.trim().startsWith('--')) {
    return [{ type: 'comment', value: line }]
  }
  
  // Simple tokenizer
  let i = 0
  while (i < line.length) {
    // Skip whitespace - add as text
    if (/\s/.test(line[i])) {
      let ws = ''
      while (i < line.length && /\s/.test(line[i])) {
        ws += line[i]
        i++
      }
      tokens.push({ type: 'text', value: ws })
      continue
    }
    
    // String literal
    if (line[i] === "'") {
      let str = "'"
      i++
      while (i < line.length && line[i] !== "'") {
        str += line[i]
        i++
      }
      if (i < line.length) {
        str += line[i]
        i++
      }
      tokens.push({ type: 'string', value: str })
      continue
    }
    
    // Number
    if (/\d/.test(line[i])) {
      let num = ''
      while (i < line.length && /[\d.]/.test(line[i])) {
        num += line[i]
        i++
      }
      tokens.push({ type: 'number', value: num })
      continue
    }
    
    // Word (identifier, keyword, function)
    if (/[a-zA-Z_]/.test(line[i])) {
      let word = ''
      while (i < line.length && /[a-zA-Z0-9_]/.test(line[i])) {
        word += line[i]
        i++
      }
      
      const lowerWord = word.toLowerCase()
      
      // Check if it's a function (followed by parenthesis)
      let j = i
      while (j < line.length && /\s/.test(line[j])) j++
      
      if (FUNCTIONS.has(lowerWord) && j < line.length && line[j] === '(') {
        tokens.push({ type: 'function', value: word })
      } else if (KEYWORDS.has(lowerWord)) {
        tokens.push({ type: 'keyword', value: word })
      } else if (DATA_TYPES.has(lowerWord)) {
        tokens.push({ type: 'type', value: word })
      } else {
        tokens.push({ type: 'text', value: word })
      }
      continue
    }
    
    // Other characters (operators, punctuation)
    tokens.push({ type: 'text', value: line[i] })
    i++
  }
  
  return tokens
}

export default function CodeBlock({
  code,
  title,
  language = 'sql',
  showLineNumbers = true,
  highlightLines = [],
  className,
  onRun,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.trim().split('\n')

  return (
    <div className={cn('terminal-window', className)}>
      {/* Header */}
      <div className="terminal-header">
        <div className="terminal-dot" style={{ backgroundColor: '#ef4444' }} />
        <div className="terminal-dot" style={{ backgroundColor: '#eab308' }} />
        <div className="terminal-dot" style={{ backgroundColor: '#22c55e' }} />
        <span style={{ marginLeft: '0.75rem', color: '#9ca3af', fontSize: '0.875rem', fontFamily: 'JetBrains Mono, monospace', flex: 1 }}>
          {title || `${language.toUpperCase()}`}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {onRun && (
            <button
              onClick={onRun}
              style={{ padding: '0.375rem', color: '#9ca3af', borderRadius: '0.25rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
              title="Run query"
            >
              <Play size={14} />
            </button>
          )}
          <button
            onClick={handleCopy}
            style={{ padding: '0.375rem', color: '#9ca3af', borderRadius: '0.25rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
            title="Copy code"
          >
            {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div style={{ padding: '1rem', overflowX: 'auto' }}>
        <pre style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', lineHeight: '1.625', margin: 0 }}>
          {lines.map((line, index) => {
            const tokens = language === 'sql' ? tokenizeLine(line) : [{ type: 'text' as TokenType, value: line }]
            
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  backgroundColor: highlightLines.includes(index + 1) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  marginLeft: highlightLines.includes(index + 1) ? '-1rem' : 0,
                  marginRight: highlightLines.includes(index + 1) ? '-1rem' : 0,
                  paddingLeft: highlightLines.includes(index + 1) ? '1rem' : 0,
                  paddingRight: highlightLines.includes(index + 1) ? '1rem' : 0,
                }}
              >
                {showLineNumbers && (
                  <span style={{ 
                    userSelect: 'none', 
                    color: '#4b5563', 
                    width: '2rem', 
                    textAlign: 'right', 
                    marginRight: '1rem', 
                    flexShrink: 0 
                  }}>
                    {index + 1}
                  </span>
                )}
                <code style={{ flex: 1 }}>
                  {tokens.map((token, tokenIndex) => (
                    <span
                      key={tokenIndex}
                      style={{
                        color: TOKEN_COLORS[token.type],
                        fontWeight: token.type === 'keyword' ? 600 : 400,
                        fontStyle: token.type === 'comment' ? 'italic' : 'normal'
                      }}
                    >
                      {token.value}
                    </span>
                  ))}
                </code>
              </div>
            )
          })}
        </pre>
      </div>
    </div>
  )
}
