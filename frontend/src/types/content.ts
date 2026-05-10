export interface Video {
  id: string
  title: string
  description: string
  publishDate?: string // ISO "2026-05-09"; omit for coming-soon entries
  thumbnailUrl?: string
  youtubeUrl: string // empty string for coming-soon entries
}

export interface BlogPost {
  id: string
  title: string
  description: string
  publishDate?: string // ISO "2026-05-09"; omit for coming-soon entries
  thumbnailUrl?: string
  postUrl: string // empty string for coming-soon entries
}
