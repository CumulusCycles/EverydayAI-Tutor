export interface Video {
  id: string
  title: string
  description: string
  publishDate: string // ISO "2026-05-09" or "" for coming-soon
  thumbnailUrl?: string
  youtubeUrl: string
}

export interface BlogPost {
  id: string
  title: string
  description: string
  publishDate: string // ISO "2026-05-09"
  thumbnailUrl?: string
  postUrl: string
}
