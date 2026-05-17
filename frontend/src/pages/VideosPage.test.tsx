import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockVideo = {
  videoId: 'v_test',
  title: 'Test Video',
  description: 'A test video.',
  publishDate: '2026-05-01',
  thumbnail: 'v_test.png',
  youtubeUrl: 'https://www.youtube.com/watch?v=abcdefghijk',
  type: 'video' as const,
}

const mockPlaylist = {
  videoId: 'p_test',
  title: 'Test Playlist',
  description: 'A test playlist.',
  publishDate: '2026-04-01',
  thumbnail: 'p_test.png',
  youtubeUrl: 'https://www.youtube.com/playlist?list=PLtest123',
  type: 'playlist' as const,
}

async function renderPage() {
  const { default: VideosPage } = await import('./VideosPage')
  return render(
    <MemoryRouter>
      <VideosPage />
    </MemoryRouter>,
  )
}

describe('VideosPage — both empty', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.doMock('../data/videos.json', () => ({ default: [] }))
  })

  it('renders the page heading', async () => {
    await renderPage()
    expect(screen.getByRole('heading', { level: 1, name: 'Videos' })).toBeInTheDocument()
  })

  it('renders the videos empty state', async () => {
    await renderPage()
    expect(screen.getByText(/No videos yet/i)).toBeInTheDocument()
  })

  it('renders the playlists empty state', async () => {
    await renderPage()
    expect(screen.getByText(/No playlists yet/i)).toBeInTheDocument()
  })
})

describe('VideosPage — videos populated', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.doMock('../data/videos.json', () => ({ default: [mockVideo] }))
  })

  it('renders the video title', async () => {
    await renderPage()
    expect(screen.getByText('Test Video')).toBeInTheDocument()
  })

  it('renders Watch on YouTube link with correct href', async () => {
    await renderPage()
    const link = screen.getByRole('link', { name: /Watch on YouTube/i })
    expect(link).toHaveAttribute('href', 'https://www.youtube.com/watch?v=abcdefghijk')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('still renders playlists empty state', async () => {
    await renderPage()
    expect(screen.getByText(/No playlists yet/i)).toBeInTheDocument()
  })
})

describe('VideosPage — playlists populated', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.doMock('../data/videos.json', () => ({ default: [mockPlaylist] }))
  })

  it('renders the playlist title', async () => {
    await renderPage()
    expect(screen.getByText('Test Playlist')).toBeInTheDocument()
  })

  it('renders View Playlist link with correct href', async () => {
    await renderPage()
    const link = screen.getByRole('link', { name: /View Playlist/i })
    expect(link).toHaveAttribute('href', 'https://www.youtube.com/playlist?list=PLtest123')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('still renders videos empty state', async () => {
    await renderPage()
    expect(screen.getByText(/No videos yet/i)).toBeInTheDocument()
  })
})

describe('VideosPage — both populated', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.doMock('../data/videos.json', () => ({ default: [mockVideo, mockPlaylist] }))
  })

  it('renders both video and playlist cards', async () => {
    await renderPage()
    expect(screen.getByText('Test Video')).toBeInTheDocument()
    expect(screen.getByText('Test Playlist')).toBeInTheDocument()
  })

  it('renders correct link text for each type', async () => {
    await renderPage()
    expect(screen.getByRole('link', { name: /Watch on YouTube/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /View Playlist/i })).toBeInTheDocument()
  })
})
