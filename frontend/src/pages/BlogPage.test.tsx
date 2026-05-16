import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockPost = {
  postId: 'b_my-first-post',
  title: 'My First Post',
  description: 'A beginner guide to AI tools.',
  publishDate: '2026-05-16',
  postUrl: 'https://example.com/my-first-post',
  thumbnail: 'b_my-first-post.png',
}

async function renderPage() {
  const { default: BlogPage } = await import('./BlogPage')
  return render(
    <MemoryRouter>
      <BlogPage />
    </MemoryRouter>,
  )
}

describe('BlogPage — empty state', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.doMock('../data/blogs.json', () => ({ default: [] }))
  })

  it('renders the page heading', async () => {
    await renderPage()
    expect(screen.getByRole('heading', { level: 1, name: /Blog/i })).toBeInTheDocument()
  })

  it('renders the page description', async () => {
    await renderPage()
    expect(screen.getByText(/Articles, guides, and practical tips/i)).toBeInTheDocument()
  })

  it('renders empty state message when no posts', async () => {
    await renderPage()
    expect(screen.getByText(/No posts yet. Check back soon!/i)).toBeInTheDocument()
  })

  it('does not render any post cards when empty', async () => {
    await renderPage()
    expect(screen.queryByText('Read post')).not.toBeInTheDocument()
  })
})

describe('BlogPage — populated state', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.doMock('../data/blogs.json', () => ({ default: [mockPost] }))
  })

  it('renders the post title', async () => {
    await renderPage()
    expect(screen.getByText('My First Post')).toBeInTheDocument()
  })

  it('renders the post description', async () => {
    await renderPage()
    expect(screen.getByText('A beginner guide to AI tools.')).toBeInTheDocument()
  })

  it('renders a "Read post" link with correct href opening in a new tab', async () => {
    await renderPage()
    const link = screen.getByRole('link', { name: /Read post/i })
    expect(link).toHaveAttribute('href', 'https://example.com/my-first-post')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders the thumbnail image with correct src', async () => {
    await renderPage()
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/thumbnails/blog/b_my-first-post.png')
  })

  it('does not render the empty state message', async () => {
    await renderPage()
    expect(screen.queryByText(/No posts yet/i)).not.toBeInTheDocument()
  })
})
