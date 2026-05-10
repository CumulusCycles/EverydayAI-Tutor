import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ContentCard from './ContentCard'

const baseProps = {
  title: 'Test Video Title',
  description: 'Test description text',
  publishDate: '2026-05-09',
  linkUrl: 'https://www.youtube.com/watch?v=test',
  linkText: 'Watch on YouTube',
}

describe('ContentCard', () => {
  it('renders title and description', () => {
    render(<ContentCard {...baseProps} thumbnailUrl="/thumb.png" />)
    expect(screen.getByText('Test Video Title')).toBeInTheDocument()
    expect(screen.getByText('Test description text')).toBeInTheDocument()
  })

  it('renders formatted publish date', () => {
    render(<ContentCard {...baseProps} thumbnailUrl="/thumb.png" />)
    expect(screen.getByText(/May 9, 2026/)).toBeInTheDocument()
  })

  it('shows "Coming soon" when publishDate is empty string', () => {
    render(<ContentCard {...baseProps} publishDate="" thumbnailUrl="/thumb.png" />)
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
  })

  it('shows "Coming soon" when publishDate is undefined', () => {
    render(<ContentCard {...baseProps} publishDate={undefined} thumbnailUrl="/thumb.png" />)
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
  })

  it('does not render external link when linkUrl is empty string', () => {
    render(<ContentCard {...baseProps} linkUrl="" thumbnailUrl="/thumb.png" />)
    expect(screen.queryByRole('link', { name: /Watch on YouTube/i })).not.toBeInTheDocument()
  })

  it('renders thumbnail image when thumbnailUrl is provided', () => {
    render(<ContentCard {...baseProps} thumbnailUrl="/thumb.png" />)
    const img = screen.getByRole('img', { name: 'Test Video Title' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/thumb.png')
  })

  it('renders placeholder and no img when thumbnailUrl is not provided', () => {
    // Valid publishDate so the only "Coming soon" is the thumbnail placeholder
    render(<ContentCard {...baseProps} />)
    expect(screen.queryByRole('img', { name: 'Test Video Title' })).not.toBeInTheDocument()
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
  })

  it('external link has correct href, target, and rel', () => {
    render(<ContentCard {...baseProps} thumbnailUrl="/thumb.png" />)
    const link = screen.getByRole('link', { name: /Watch on YouTube/i })
    expect(link).toHaveAttribute('href', 'https://www.youtube.com/watch?v=test')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
