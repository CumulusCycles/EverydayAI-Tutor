import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockVideo = {
  videoId: 'v_test-video',
  title: 'Test Video',
  description: 'A test video description.',
  publishDate: '2026-05-16',
  thumbnail: 'v_test-video.png',
  youtubeUrl: 'https://www.youtube.com/watch?v=abc123',
}

const mockPost = {
  postId: 'b_test-post',
  title: 'Test Post',
  description: 'A test blog post description.',
  publishDate: '2026-05-16',
  postUrl: 'https://example.com/test-post',
  thumbnail: 'b_test-post.png',
}

async function renderPage() {
  const { default: HomePage } = await import('./HomePage')
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )
}

describe('HomePage — both empty', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.doMock('../data/videos.json', () => ({ default: [] }))
    vi.doMock('../data/blogs.json', () => ({ default: [] }))
  })

  it('renders the main heading', async () => {
    await renderPage()
    expect(screen.getByRole('heading', { level: 1, name: /Learn AI/i })).toBeInTheDocument()
  })

  it('renders the Subscribe CTA with correct YouTube link', async () => {
    await renderPage()
    const links = screen.getAllByRole('link', { name: /Subscribe on YouTube/i })
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', 'https://www.youtube.com/@EverydayAITutor')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('renders video empty state when no videos', async () => {
    await renderPage()
    expect(screen.getByText(/Our first video is on its way/i)).toBeInTheDocument()
  })

  it('renders blog empty state when no posts', async () => {
    await renderPage()
    expect(screen.getByText(/New articles and guides are on the way/i)).toBeInTheDocument()
  })
})

describe('HomePage — videos populated, blogs empty', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.doMock('../data/videos.json', () => ({ default: [mockVideo] }))
    vi.doMock('../data/blogs.json', () => ({ default: [] }))
  })

  it('renders the latest video title', async () => {
    await renderPage()
    expect(screen.getByText('Test Video')).toBeInTheDocument()
  })

  it('renders the video Watch on YouTube link with correct href', async () => {
    await renderPage()
    const link = screen.getByRole('link', { name: /Watch on YouTube/i })
    expect(link).toHaveAttribute('href', 'https://www.youtube.com/watch?v=abc123')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders the video thumbnail with correct src', async () => {
    await renderPage()
    const imgs = screen.getAllByRole('img')
    const thumbnail = imgs.find((img) => img.getAttribute('src')?.includes('/thumbnails/video/'))
    expect(thumbnail).toHaveAttribute('src', '/thumbnails/video/v_test-video.png')
  })

  it('still renders blog empty state', async () => {
    await renderPage()
    expect(screen.getByText(/New articles and guides are on the way/i)).toBeInTheDocument()
  })
})

describe('HomePage — blogs populated, videos empty', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.doMock('../data/videos.json', () => ({ default: [] }))
    vi.doMock('../data/blogs.json', () => ({ default: [mockPost] }))
  })

  it('renders the latest blog post title', async () => {
    await renderPage()
    expect(screen.getByText('Test Post')).toBeInTheDocument()
  })

  it('renders the Read post link with correct href', async () => {
    await renderPage()
    const link = screen.getByRole('link', { name: /Read post/i })
    expect(link).toHaveAttribute('href', 'https://example.com/test-post')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders the blog thumbnail with correct src', async () => {
    await renderPage()
    const imgs = screen.getAllByRole('img')
    const thumbnail = imgs.find((img) => img.getAttribute('src')?.includes('/thumbnails/blog/'))
    expect(thumbnail).toHaveAttribute('src', '/thumbnails/blog/b_test-post.png')
  })

  it('still renders video empty state', async () => {
    await renderPage()
    expect(screen.getByText(/Our first video is on its way/i)).toBeInTheDocument()
  })
})
