import ContentCard from '../components/ContentCard'
import { videos } from '../data/videos'
import type { Video } from '../types/content'

function sortVideos(items: Video[]): Video[] {
  return [...items].sort((a, b) => {
    if (!a.publishDate && !b.publishDate) return 0
    if (!a.publishDate) return 1
    if (!b.publishDate) return -1
    return b.publishDate.localeCompare(a.publishDate)
  })
}

export default function VideosPage() {
  const sorted = sortVideos(videos)

  return (
    <>
      {/* Page header */}
      <div className="bg-white border-b border-brand-gray">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16">
          <h1 className="text-[40px] font-extrabold text-brand-navy mb-4">Videos</h1>
          <p className="text-lg text-brand-slate max-w-2xl">
            Practical AI tutorials for everyday people — from complete beginner to confident AI
            user.
          </p>
        </div>
      </div>

      {/* Card grid */}
      <section className="py-16 px-6 md:px-12 bg-brand-white">
        <div className="max-w-[1200px] mx-auto">
          {sorted.length === 0 ? (
            <p className="text-brand-slate">No videos yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sorted.map((video) => (
                <ContentCard
                  key={video.id}
                  title={video.title}
                  description={video.description}
                  publishDate={video.publishDate}
                  thumbnailUrl={video.thumbnailUrl}
                  linkUrl={video.youtubeUrl}
                  linkText="Watch on YouTube"
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
