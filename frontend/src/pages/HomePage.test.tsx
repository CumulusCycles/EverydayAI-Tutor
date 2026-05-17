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

async function renderPage() {
  const { default: HomePage } = await import('./HomePage')
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )
}

describe('HomePage — videos empty', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.doMock('../data/videos.json', () => ({ default: [] }))
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
})

describe('HomePage — videos populated', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.doMock('../data/videos.json', () => ({ default: [mockVideo] }))
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
})
