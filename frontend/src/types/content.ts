export interface Video {
  videoId: string
  title: string
  description: string
  publishDate: string // ISO "YYYY-MM-DD"
  thumbnail: string // filename only, e.g. "v_what_ai_actually_is.png"
  youtubeUrl: string
}

export interface BlogPost {
  postId: string
  title: string
  description: string
  publishDate: string // ISO "YYYY-MM-DD"
  postUrl: string
  thumbnail: string // filename only, e.g. "b_my-first-post.png"
}
