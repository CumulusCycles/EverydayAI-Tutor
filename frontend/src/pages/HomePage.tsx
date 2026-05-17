import ContentCard from '../components/ContentCard'
import videosData from '../data/videos.json'
import type { Video } from '../types/content'

const videos = videosData as Video[]

const YT_URL = 'https://www.youtube.com/@EverydayAITutor'

const learnItems = [
  {
    icon: '🧠',
    title: 'Understand AI',
    description: 'What AI actually is, how it works, and why it matters — in plain English.',
  },
  {
    icon: '💬',
    title: 'Use AI Tools',
    description: 'Hands-on with ChatGPT, Claude, and other tools you can start using today.',
  },
  {
    icon: '✍️',
    title: 'Master Prompting',
    description: 'Communicate with AI effectively and get dramatically better results.',
  },
  {
    icon: '⚙️',
    title: 'Build with AI',
    description: 'Eventually: Claude Code, agentic AI, and building real things with AI tools.',
  },
]

export default function HomePage() {
  const latestVideos = videos.slice(0, 1)

  return (
    <>
      {/* ── HERO ── */}
      <div className="bg-white border-b border-brand-gray">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-[80px] pb-[72px] flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <span className="inline-block bg-[#fff0e6] text-brand-orange text-[13px] font-bold px-3.5 py-1.5 rounded-full mb-5 uppercase tracking-wide">
              Practical AI for Everyday People
            </span>
            <h1 className="text-[52px] font-extrabold text-brand-navy leading-[1.1] tracking-tight mb-4">
              Learn AI.
              <br />
              <span className="text-brand-orange">Without</span> the Jargon.
            </h1>
            <p className="text-[19px] text-brand-slate mb-9 leading-relaxed">
              From understanding what AI is to building with it — EverydayAI Tutor takes you step by
              step, no technical background required.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={YT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-orange text-white text-base font-bold px-[30px] py-3.5 rounded-lg hover:opacity-[0.88] transition-opacity"
              >
                Subscribe on YouTube
              </a>
              <span className="text-sm text-brand-slate">Free. No sign-up required.</span>
            </div>
          </div>

          <div className="flex-1 rounded-xl overflow-hidden">
            <img
              src="/thumbnail.png"
              alt="EverydayAI Tutor"
              className="w-full h-auto object-contain rounded-xl border border-brand-gray"
            />
          </div>
        </div>
      </div>

      {/* ── WHAT YOU'LL LEARN ── */}
      <section className="py-16 px-6 md:px-12 bg-brand-beige">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-[28px] font-extrabold text-brand-navy">What You'll Learn</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {learnItems.map(({ icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-xl border border-brand-gray p-7 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[#fff0e6] flex items-center justify-center mx-auto mb-4 text-[22px]">
                  {icon}
                </div>
                <h3 className="text-[15px] font-bold text-brand-navy mb-2">{title}</h3>
                <p className="text-[13px] text-brand-slate leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST VIDEOS ── */}
      <section className="py-16 px-6 md:px-12 bg-brand-white">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[28px] font-extrabold text-brand-navy mb-8">Latest Videos</h2>
          <div className="max-w-sm">
            {latestVideos.length === 0 ? (
              <ContentCard
                title="Coming Soon"
                description="Our first video is on its way. Subscribe on YouTube to be notified."
                linkUrl=""
                linkText=""
              />
            ) : (
              latestVideos.map((video) => (
                <ContentCard
                  key={video.videoId}
                  title={video.title}
                  description={video.description}
                  publishDate={video.publishDate}
                  thumbnailUrl={`/thumbnails/video/${video.thumbnail}`}
                  linkUrl={video.youtubeUrl}
                  linkText="Watch on YouTube"
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div className="bg-brand-navy py-16 px-6 text-center">
        <div className="max-w-[640px] mx-auto">
          <h2 className="text-[34px] font-extrabold text-white mb-3">
            Ready to start learning <span className="text-brand-orange">AI?</span>
          </h2>
          <p className="text-[17px] text-[#94a3b8] mb-8">
            Join the EverydayAI Tutor community and go from curious beginner to confident AI user —
            one video at a time.
          </p>
          <a
            href={YT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-orange text-white text-base font-bold px-[30px] py-3.5 rounded-lg hover:opacity-[0.88] transition-opacity"
          >
            Subscribe on YouTube — It's Free
          </a>
        </div>
      </div>
    </>
  )
}
