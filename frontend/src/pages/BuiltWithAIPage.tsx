const YT_URL = 'https://www.youtube.com/@EverydayAITutor'

const techStack = [
  { name: 'React + Vite + TypeScript', description: 'frontend framework' },
  { name: 'Tailwind CSS v4', description: 'styling' },
  { name: 'React Router', description: 'client-side routing' },
  { name: 'Vitest + Playwright', description: 'unit and E2E testing' },
  { name: 'AWS CDK (TypeScript)', description: 'infrastructure as code' },
  { name: 'AWS S3 + CloudFront', description: 'hosting and CDN' },
  { name: 'AWS ACM + Route 53', description: 'SSL and DNS' },
  { name: 'GitHub Actions + OIDC', description: 'CI/CD pipeline, zero stored credentials' },
]

const steps = [
  { n: 1, text: 'A prompt describing what to build' },
  {
    n: 2,
    text: 'Claude Code reads the codebase, writes the code, and runs checks',
  },
  { n: 3, text: 'A pull request opened for review' },
  { n: 4, text: 'Merged to main — automatically deployed to AWS' },
]

export default function BuiltWithAIPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-white border-b border-brand-gray">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16">
          <span className="inline-block bg-[#fff0e6] text-brand-orange text-[13px] font-bold px-3.5 py-1.5 rounded-full mb-5 uppercase tracking-wide">
            Claude Code
          </span>
          <h1 className="text-[52px] font-extrabold text-brand-navy leading-[1.1] tracking-tight mb-4">
            Built with Claude Code.
          </h1>
          <p className="text-[22px] font-semibold text-brand-charcoal mb-5">
            No human developer wrote a single line of code directly.
          </p>
          <p className="text-lg text-brand-slate max-w-2xl leading-relaxed">
            This site was designed, built, and deployed entirely through conversations with Claude
            Code — Anthropic's agentic AI coding tool.
          </p>
        </div>
      </div>

      {/* What is Claude Code */}
      <section className="py-16 px-6 md:px-12 bg-brand-beige">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-[28px] font-extrabold text-brand-navy mb-6">
              What is Claude Code?
            </h2>
            <p className="text-brand-charcoal leading-relaxed mb-4">
              Claude Code is an agentic AI coding tool by Anthropic. Instead of writing code
              manually, you describe what you want in plain language — and Claude Code reads your
              codebase, writes the code, runs the tests, and opens pull requests for your review.
            </p>
            <p className="text-brand-charcoal leading-relaxed mb-8">
              It's AI that doesn't just suggest code — it acts.
            </p>
            <a
              href="https://claude.ai/code"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-orange font-semibold hover:underline"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="#F97316"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="7,1 8.2,7 7,13 5.8,7" />
                <polygon transform="rotate(45 7 7)" points="7,1 8.2,7 7,13 5.8,7" />
                <polygon transform="rotate(90 7 7)" points="7,1 8.2,7 7,13 5.8,7" />
                <polygon transform="rotate(135 7 7)" points="7,1 8.2,7 7,13 5.8,7" />
              </svg>
              Learn more about Claude Code →
            </a>
          </div>
        </div>
      </section>

      {/* What Was Built */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[28px] font-extrabold text-brand-navy mb-4">What Was Built</h2>
          <p className="text-brand-slate text-lg mb-10 max-w-2xl">
            A full production website — designed, coded, tested, and deployed to AWS — built
            entirely through AI prompts.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {techStack.map(({ name, description }) => (
              <div key={name} className="bg-brand-white rounded-xl border border-brand-gray p-5">
                <h3 className="text-[14px] font-bold text-brand-navy mb-1">{name}</h3>
                <p className="text-[13px] text-brand-slate">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Was Built */}
      <section className="py-16 px-6 md:px-12 bg-brand-beige">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-[28px] font-extrabold text-brand-navy mb-4">How It Was Built</h2>
            <p className="text-brand-charcoal leading-relaxed mb-8">
              Every feature was built through a simple workflow:
            </p>
            <ol className="flex flex-col gap-4 mb-8 list-none">
              {steps.map(({ n, text }) => (
                <li key={n} className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-lg bg-[#fff0e6] flex items-center justify-center text-brand-orange text-sm font-bold shrink-0">
                    {n}
                  </span>
                  <p className="text-brand-charcoal leading-relaxed pt-1">{text}</p>
                </li>
              ))}
            </ol>
            <div className="bg-white rounded-xl border border-brand-gray p-5">
              <p className="text-[13px] text-brand-slate leading-relaxed">
                The full prompt log is available in the GitHub repository — every prompt used to
                build this site, documented session by session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* View the Source */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-[28px] font-extrabold text-brand-navy mb-4">View the Source</h2>
            <p className="text-brand-charcoal leading-relaxed mb-8">
              The complete source code — including all Claude Code prompts, architecture docs, and
              brand guidelines — is open source.
            </p>
            <a
              href="https://github.com/CumulusCycles/EverydayAI-Tutor"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-orange font-semibold hover:underline"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 98 96"
                fill="currentColor"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                />
              </svg>
              View the repository on GitHub →
            </a>
          </div>
        </div>
      </section>

      {/* Coming Soon: AI Chat */}
      <section className="py-16 px-6 md:px-12 bg-brand-beige">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-2xl">
            <span className="inline-block bg-[#fff0e6] text-brand-orange text-[13px] font-bold px-3.5 py-1.5 rounded-full mb-5 uppercase tracking-wide">
              Coming Soon
            </span>
            <h2 className="text-[28px] font-extrabold text-brand-navy mb-4">
              Coming Soon: AI-Powered Chat
            </h2>
            <p className="text-brand-charcoal leading-relaxed">
              We're adding an AI chatbot powered by AWS Bedrock Knowledge Base and S3 Vectors. Ask
              plain English questions about the site, the channel, and the content — and get
              grounded, accurate answers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div className="bg-brand-navy py-16 px-6 text-center">
        <div className="max-w-[640px] mx-auto">
          <h2 className="text-[34px] font-extrabold text-white mb-3">
            The Claude Code tutorial series is{' '}
            <span className="text-brand-orange">coming to EverydayAI Tutor.</span>
          </h2>
          <p className="text-[17px] text-[#94a3b8] mb-8">
            Learn how to build real projects with AI — from scratch, step by step.
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
