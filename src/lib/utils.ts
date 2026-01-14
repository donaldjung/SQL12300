import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import mermaid from 'mermaid'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  },
})

export { mermaid }
