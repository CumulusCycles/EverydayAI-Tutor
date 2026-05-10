import ContentCard from '../components/ContentCard'
import { posts } from '../data/posts'
import type { BlogPost } from '../types/content'

function sortPosts(items: BlogPost[]): BlogPost[] {
  return [...items].sort((a, b) => {
    if (!a.publishDate && !b.publishDate) return 0
    if (!a.publishDate) return 1
    if (!b.publishDate) return -1
    return b.publishDate.localeCompare(a.publishDate)
  })
}

export default function BlogPage() {
  const sorted = sortPosts(posts)

  return (
    <>
      {/* Page header */}
      <div className="bg-white border-b border-brand-gray">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16">
          <h1 className="text-[40px] font-extrabold text-brand-navy mb-4">Blog</h1>
          <p className="text-lg text-brand-slate max-w-2xl">
            Articles, guides, and practical tips on using AI in everyday life.
          </p>
        </div>
      </div>

      {/* Card grid */}
      <section className="py-16 px-6 md:px-12 bg-brand-white">
        <div className="max-w-[1200px] mx-auto">
          {sorted.length === 0 ? (
            <p className="text-brand-slate">No posts yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sorted.map((post) => (
                <ContentCard
                  key={post.id}
                  title={post.title}
                  description={post.description}
                  publishDate={post.publishDate}
                  thumbnailUrl={post.thumbnailUrl}
                  linkUrl={post.postUrl}
                  linkText="Read post"
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
