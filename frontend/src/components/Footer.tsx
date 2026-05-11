import { Link } from 'react-router-dom'

const YT_URL = 'https://www.youtube.com/@EverydayAITutor'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-brand-gray">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-12 pb-6">
        {/* Three-column top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
          {/* Left — brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-2.5">
              <img
                src="/logo.png"
                alt="EverydayAI Tutor Logo"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-base font-bold text-brand-navy">
                Everyday<span className="text-brand-orange">AI</span> Tutor
              </span>
            </Link>
            <p className="text-[13px] text-brand-slate">Practical AI for Everyday People</p>
          </div>

          {/* Center — navigation */}
          <div>
            <h4 className="text-[13px] font-bold text-brand-navy uppercase tracking-widest mb-4">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2.5 list-none">
              {[
                { to: '/', label: 'Home' },
                { to: '/videos', label: 'Videos' },
                { to: '/blog', label: 'Blog' },
                { to: '/about', label: 'About' },
                { to: '/built-with', label: 'Built with AI' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-brand-slate hover:text-brand-orange transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — YouTube */}
          <div>
            <h4 className="text-[13px] font-bold text-brand-navy uppercase tracking-widest mb-4">
              YouTube Channel
            </h4>
            <p className="text-[13px] text-brand-slate mb-4 leading-relaxed">
              Free AI tutorials for everyday people — new videos published regularly.
            </p>
            <a
              href={YT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-orange text-white text-sm font-bold px-[22px] py-2.5 rounded-lg hover:opacity-[0.88] transition-opacity"
            >
              Subscribe on YouTube
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-gray pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-brand-slate">
            © {new Date().getFullYear()} EverydayAI Tutor.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="text-[13px] text-brand-slate hover:text-brand-orange transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/built-with"
              className="inline-flex items-center gap-1.5 text-[13px] text-brand-slate hover:text-brand-orange transition-colors"
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
              Built with Claude Code
            </Link>
            <a
              href="https://github.com/CumulusCycles/EverydayAI-Tutor"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] text-brand-slate hover:text-brand-orange transition-colors"
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
              View Source on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
