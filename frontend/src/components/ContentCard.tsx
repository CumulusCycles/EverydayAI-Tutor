interface ContentCardProps {
  title: string
  description: string
  publishDate: string
  thumbnailUrl?: string
  linkUrl: string
  linkText: string
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'Coming soon'
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ContentCard({
  title,
  description,
  publishDate,
  thumbnailUrl,
  linkUrl,
  linkText,
}: ContentCardProps) {
  return (
    <div className="bg-white rounded-xl border border-brand-gray overflow-hidden transition-colors hover:border-brand-orange">
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-auto object-contain bg-brand-gray block"
        />
      ) : (
        <div className="w-full h-[180px] bg-gradient-to-br from-brand-gray to-brand-workspace flex items-center justify-center text-brand-slate text-[13px] font-medium">
          Coming soon
        </div>
      )}

      <div className="p-5">
        <p className="text-xs text-brand-slate font-medium mb-2">{formatDate(publishDate)}</p>
        <h3 className="text-base font-bold text-brand-navy mb-2 leading-snug">{title}</h3>
        <p className="text-[13px] text-brand-charcoal leading-relaxed mb-4">{description}</p>
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-bold text-brand-orange inline-flex items-center gap-1 hover:underline"
        >
          {linkText} →
        </a>
      </div>
    </div>
  )
}
