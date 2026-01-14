import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { cn } from '../../lib/utils'

interface FlowDiagramProps {
  chart: string
  title?: string
  className?: string
}

// Initialize mermaid with custom theme
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#1a1a2e',
    primaryTextColor: '#3b82f6',
    primaryBorderColor: '#3b82f6',
    lineColor: '#00d4ff',
    secondaryColor: '#16213e',
    tertiaryColor: '#0a0a1a',
    background: '#0a0a1a',
    mainBkg: '#1a1a2e',
    nodeBorder: '#3b82f6',
    clusterBkg: '#16213e',
    clusterBorder: '#3b82f6',
    titleColor: '#3b82f6',
    edgeLabelBackground: '#1a1a2e',
  },
  flowchart: {
    curve: 'basis',
    padding: 20,
  },
})

export default function FlowDiagram({ chart, title, className }: FlowDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return

      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const { svg } = await mermaid.render(id, chart)
        setSvg(svg)
        setError(null)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError('Failed to render diagram')
      }
    }

    renderDiagram()
  }, [chart])

  return (
    <div className={cn('card-highlight', className)}>
      {title && (
        <h4 className="text-accent-cyan font-display font-semibold mb-4">{title}</h4>
      )}
      <div
        ref={containerRef}
        className="overflow-x-auto"
      >
        {error ? (
          <div className="text-red-400 text-sm font-mono p-4 bg-red-500/10 rounded-lg">
            {error}
          </div>
        ) : (
          <div
            className="mermaid-container flex justify-center [&_svg]:max-w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
      </div>
    </div>
  )
}
