const LAST_UPDATED = 'May 9, 2026'
const CONTACT_EMAIL = 'aieverydayforyou@gmail.com'

interface Section {
  heading: string
  body: string[]
}

const sections: Section[] = [
  {
    heading: 'What information we collect',
    body: [
      'We do not currently collect any personal information from visitors to this site.',
      'There are no user accounts, no sign-up forms, and no contact forms that capture your data.',
    ],
  },
  {
    heading: 'Analytics and tracking',
    body: [
      'We do not use any analytics or tracking tools on this site at launch.',
      'We do not use Google Analytics, Meta Pixel, or any other third-party tracking service.',
      'We do not track your behavior across other websites.',
    ],
  },
  {
    heading: 'Cookies',
    body: [
      'We do not use cookies for tracking, advertising, or personalization.',
      'Your browser may store technically necessary information (such as cached assets) to make the site load faster, but this is standard browser behavior and contains no personal data.',
    ],
  },
  {
    heading: 'Third-party services',
    body: [
      'This site links to YouTube and other external platforms. When you click those links, you leave this site and are subject to the privacy policies of those services.',
      'We are not responsible for the privacy practices of external websites.',
    ],
  },
  {
    heading: 'Future changes',
    body: [
      'This privacy policy will be updated when features that involve personal data are introduced — for example, email sign-up, user accounts, or newsletter subscriptions.',
      'Any future data collection will be clearly disclosed and handled in compliance with applicable privacy laws.',
    ],
  },
  {
    heading: 'Contact',
    body: [
      `If you have any questions about this privacy policy, please reach out at ${CONTACT_EMAIL}.`,
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-white border-b border-brand-gray">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16">
          <h1 className="text-[40px] font-extrabold text-brand-navy mb-4">Privacy Policy</h1>
          <p className="text-brand-slate">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* Content */}
      <section className="py-16 px-6 md:px-12 bg-brand-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-2xl">
            <p className="text-brand-charcoal leading-relaxed mb-10 text-lg">
              Your privacy matters to us. This policy explains what information we collect (and what
              we don't), how we use it, and your rights. We've written it in plain English — no
              legal jargon.
            </p>

            <div className="flex flex-col gap-10">
              {sections.map(({ heading, body }) => (
                <div key={heading}>
                  <h2 className="text-[20px] font-bold text-brand-navy mb-3">{heading}</h2>
                  <div className="flex flex-col gap-2">
                    {body.map((paragraph) => (
                      <p key={paragraph} className="text-brand-charcoal leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
