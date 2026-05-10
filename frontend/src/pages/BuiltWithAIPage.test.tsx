import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BuiltWithAIPage from './BuiltWithAIPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <BuiltWithAIPage />
    </MemoryRouter>,
  )
}

describe('BuiltWithAIPage', () => {
  it('renders without errors', () => {
    renderPage()
    expect(document.body).toBeInTheDocument()
  })

  it('renders "Built with Claude Code." as the page heading', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { level: 1, name: /Built with Claude Code/i }),
    ).toBeInTheDocument()
  })

  it('renders Claude Code link with correct href opening in a new tab', () => {
    renderPage()
    const link = screen.getByRole('link', { name: /Learn more about Claude Code/i })
    expect(link).toHaveAttribute('href', 'https://claude.ai/code')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders GitHub repository link with correct href opening in a new tab', () => {
    renderPage()
    const link = screen.getByRole('link', { name: /View the repository on GitHub/i })
    expect(link).toHaveAttribute('href', 'https://github.com/CumulusCycles/EverydayAI-Tutor')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders Subscribe CTA with correct YouTube link opening in a new tab', () => {
    renderPage()
    const link = screen.getByRole('link', { name: /Subscribe on YouTube/i })
    expect(link).toHaveAttribute('href', 'https://www.youtube.com/@EverydayAITutor')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
