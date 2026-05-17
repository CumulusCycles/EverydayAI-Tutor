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
  type: 'video' as const,
}

const mockPlaylist = {
  videoId: 'p_test-playlist',
  title: 'Test Playlist',
  description: 'A test playlist description.',
  publishDate: '2026-05-10',
  thumbnail: 'p_test-playlist.png',
  youtubeUrl: 'https://www.youtube.com/playlist?list=PLtest123',
  type: 'playlist' as const,
}

async function renderPage() {
  const { default: HomePage } = await import('./HomePage')
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )
}

describe('HomePage — all empty', () => {
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

  it('renders playlist empty state when no playlists', async () => {
    await renderPage()
    expect(screen.getByText(/Curated playlists are on the way/i)).toBeInTheDocument()
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

  it('renders the Watch on YouTube link with correct href', async () => {
    await renderPage()
    const link = screen.getByRole('link', { name: /Watch on YouTube/i })
    expect(link).toHaveAttribute('href', 'https://www.youtube.com/watch?v=abc123')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders the video thumbnail with correct src', async () => {
    await renderPage()
    const imgs = screen.getAllByRole('img')
    const thumbnail = imgs.find((img) => img.getAttribute('src')?.includes('/thumbnails/video/v_'))
    expect(thumbnail).toHaveAttribute('src', '/thumbnails/video/v_test-video.png')
  })

  it('still renders playlist empty state', async () => {
    await renderPage()
    expect(screen.getByText(/Curated playlists are on the way/i)).toBeInTheDocument()
  })
})

describe('HomePage — playlists populated', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.doMock('../data/videos.json', () => ({ default: [mockPlaylist] }))
  })

  it('renders the latest playlist title', async () => {
    await renderPage()
    expect(screen.getByText('Test Playlist')).toBeInTheDocument()
  })

  it('renders the View Playlist link with correct href', async () => {
    await renderPage()
    const link = screen.getByRole('link', { name: /View Playlist/i })
    expect(link).toHaveAttribute('href', 'https://www.youtube.com/playlist?list=PLtest123')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('still renders video empty state', async () => {
    await renderPage()
    expect(screen.getByText(/Our first video is on its way/i)).toBeInTheDocument()
  })
})
