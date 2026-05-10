import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Footer from './Footer'

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  )
}

describe('Footer', () => {
  it('renders logo and tagline', () => {
    renderFooter()
    expect(screen.getByAltText('EverydayAI Tutor Logo')).toBeInTheDocument()
    expect(screen.getByText('Practical AI for Everyday People')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderFooter()
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Videos' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
  })

  it('renders YouTube subscribe link with correct href in a new tab', () => {
    renderFooter()
    const subscribeLink = screen.getByRole('link', { name: /Subscribe on YouTube/i })
    expect(subscribeLink).toHaveAttribute('href', 'https://www.youtube.com/@EverydayAITutor')
    expect(subscribeLink).toHaveAttribute('target', '_blank')
    expect(subscribeLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders copyright text', () => {
    renderFooter()
    expect(screen.getByText(/© 2026 EverydayAI Tutor/)).toBeInTheDocument()
  })

  it('renders Privacy Policy link pointing to /privacy', () => {
    renderFooter()
    const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' })
    expect(privacyLink).toHaveAttribute('href', '/privacy')
  })

  it('"Built with Claude Code" link points to /built-with as an internal link', () => {
    renderFooter()
    const link = screen.getByRole('link', { name: /Built with Claude Code/i })
    expect(link).toHaveAttribute('href', '/built-with')
    expect(link).not.toHaveAttribute('target')
    expect(link).not.toHaveAttribute('rel')
  })

  it('"Built with Claude Code" link includes the Anthropic asterisk SVG', () => {
    renderFooter()
    const link = screen.getByRole('link', { name: /Built with Claude Code/i })
    const svg = link.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('"View Source on GitHub" link has correct href and opens in a new tab', () => {
    renderFooter()
    const link = screen.getByRole('link', { name: /View Source on GitHub/i })
    expect(link).toHaveAttribute('href', 'https://github.com/CumulusCycles/EverydayAI-Tutor')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('"View Source on GitHub" link includes the GitHub mark SVG', () => {
    renderFooter()
    const link = screen.getByRole('link', { name: /View Source on GitHub/i })
    const svg = link.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})
