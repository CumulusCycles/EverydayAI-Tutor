import { Link } from 'react-router-dom'

const YT_URL = 'https://www.youtube.com/@EverydayAITutor'

const contentPillars = [
  {
    label: 'Understand AI',
    description: 'What AI actually is, how it works, and why it matters — in plain English.',
  },
  {
    label: 'Use AI Tools',
    description: 'Hands-on with ChatGPT, Claude, and other tools you can start using today.',
  },
  {
    label: 'Master Prompting',
    description: 'How to communicate with AI effectively and get dramatically better results.',
  },
  {
    label: 'Real-World Workflows',
    description: 'Practical productivity use cases for everyday life and work.',
  },
  {
    label: 'Going Deeper',
    description: 'Advanced prompting, automation, and agentic AI.',
  },
  {
    label: 'Build with AI',
    description: 'Claude Code, AI-assisted development, and building real things with AI tools.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-white border-b border-brand-gray">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16">
          <h1 className="text-[40px] font-extrabold text-brand-navy mb-4">
            About EverydayAI Tutor
          </h1>
          <p className="text-lg text-brand-slate max-w-2xl">
            Making AI accessible, practical, and approachable for everyday people — with zero
            technical background required.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-16 px-6 md:px-12 bg-brand-beige">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-[28px] font-extrabold text-brand-navy mb-6">Our Mission</h2>
              <p className="text-brand-charcoal leading-relaxed mb-4">
                AI is changing everything — but most of the people talking about it are already
                technical. EverydayAI Tutor exists for everyone else: the curious beginner, the
                professional who wants to work smarter, the person who's heard about AI constantly
                but doesn't know where to start.
              </p>
              <p className="text-brand-charcoal leading-relaxed mb-4">
                This channel takes you step by step — from understanding what AI actually is, all
                the way to using it confidently in your daily life and work. No jargon. No assumed
                knowledge. Just clear, practical guidance from someone who gets it.
              </p>
              <p className="text-brand-charcoal leading-relaxed">
                You don't need to be technical to use AI effectively. You just need the right guide.
              </p>
            </div>

            <div>
              <h2 className="text-[28px] font-extrabold text-brand-navy mb-6">Who It's For</h2>
              <ul className="flex flex-col gap-3">
                {[
                  'Complete beginners with no technical background',
                  'People who feel left behind by the AI revolution',
                  'Curious adults who want practical skills, not theory',
                  'Professionals who want AI to improve their productivity',
                  "Anyone who has tried ChatGPT once but doesn't know where to go next",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-brand-charcoal">
                    <span className="text-brand-orange font-bold mt-0.5 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Learning journey */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[28px] font-extrabold text-brand-navy mb-3">Your Learning Journey</h2>
          <p className="text-brand-slate mb-10 text-lg">
            A structured path from absolute beginner to confident AI user.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentPillars.map(({ label, description }, index) => (
              <div key={label} className="bg-brand-white rounded-xl border border-brand-gray p-6">
                <div className="w-8 h-8 rounded-lg bg-[#fff0e6] flex items-center justify-center text-brand-orange text-sm font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-[15px] font-bold text-brand-navy mb-2">{label}</h3>
                <p className="text-[13px] text-brand-slate leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host */}
      <section className="py-16 px-6 md:px-12 bg-brand-white">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[28px] font-extrabold text-brand-navy mb-8">The Host</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <img
              src="/images/rob.png"
              alt="Rob Frenette at his workspace"
              className="w-full rounded-xl shadow-sm"
            />
            <div>
              <p className="text-brand-charcoal leading-relaxed mb-4">
                I'm{' '}
                <a
                  href="https://www.linkedin.com/in/robertmfrenette"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange font-semibold hover:underline"
                >
                  Rob Frenette
                </a>{' '}
                — a full-stack developer, cloud engineer, and educator with a passion for making
                complex technology accessible to everyday people.
              </p>
              <p className="text-brand-charcoal leading-relaxed mb-4">
                By day I design and build full-stack applications, deployed on AWS cloud
                infrastructure. By night I build things like this — because I believe the best way
                to learn something deeply is to teach it clearly.
              </p>
              <p className="text-brand-charcoal leading-relaxed mb-4">
                As an AWS Community Builder in AI Engineering, I stay at the edge of what's possible
                with cloud and AI. I also run{' '}
                <a
                  href="https://www.youtube.com/@CumulusCycles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange font-semibold hover:underline"
                >
                  Cumulus Cycles
                </a>{' '}
                — a YouTube channel covering AWS cloud development and AI engineering tutorials for
                developers.
              </p>
              <p className="text-brand-charcoal leading-relaxed mb-4">
                EverydayAI Tutor was born from a simple observation: AI is transforming how we work
                and live, but most of the educational content out there assumes you're already
                technical. I built this channel for everyone else.
              </p>
              <p className="text-brand-charcoal leading-relaxed">
                No jargon. No hype. Just honest, practical guidance — from someone who builds with
                these tools every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Built with Claude Code blurb */}
      <section className="py-16 px-6 md:px-12 bg-brand-beige">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-[28px] font-extrabold text-brand-navy mb-6">Built with AI</h2>
            <p className="text-brand-charcoal leading-relaxed mb-6">
              This site was built entirely using Claude Code — Anthropic's agentic AI coding tool —
              without a human developer writing a single line of code directly.
            </p>
            <Link
              to="/built-with"
              className="inline-flex items-center gap-1.5 text-brand-orange font-semibold hover:underline"
            >
              Learn how it was built →
            </Link>
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <div className="bg-brand-navy py-16 px-6 text-center">
        <div className="max-w-[640px] mx-auto">
          <h2 className="text-[34px] font-extrabold text-white mb-3">
            Ready to start your <span className="text-brand-orange">AI journey?</span>
          </h2>
          <p className="text-[17px] text-[#94a3b8] mb-8">
            Subscribe to the channel and get practical AI tutorials delivered — free, no sign-up
            required.
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
