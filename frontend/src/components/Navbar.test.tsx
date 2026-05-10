import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

function renderNavbar(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Navbar />
    </MemoryRouter>,
  )
}

describe('Navbar', () => {
  it('renders logo image linking to /', () => {
    renderNavbar()
    const logoImg = screen.getByAltText('EverydayAI Tutor Logo')
    expect(logoImg).toBeInTheDocument()
    expect(logoImg.closest('a')).toHaveAttribute('href', '/')
  })

  it('renders all four navigation links', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Videos' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
  })

  it('renders subscribe button with correct YouTube URL', () => {
    renderNavbar()
    const subscribeLink = screen.getByRole('link', { name: /Subscribe on YouTube/i })
    expect(subscribeLink).toHaveAttribute('href', 'https://www.youtube.com/@EverydayAITutor')
  })

  it('subscribe button opens in a new tab with noopener noreferrer', () => {
    renderNavbar()
    const subscribeLink = screen.getByRole('link', { name: /Subscribe on YouTube/i })
    expect(subscribeLink).toHaveAttribute('target', '_blank')
    expect(subscribeLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
