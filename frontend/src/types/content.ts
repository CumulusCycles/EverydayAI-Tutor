export interface Video {
  videoId: string
  title: string
  description: string
  publishDate: string // ISO "YYYY-MM-DD"
  thumbnail: string // filename only, e.g. "v_what_ai_actually_is.png"
  youtubeUrl: string
}

export interface BlogPost {
  id: string
  title: string
  description: string
  publishDate?: string // ISO "2026-05-09"; omit for coming-soon entries
  thumbnailUrl?: string
  postUrl: string // empty string for coming-soon entries
}
