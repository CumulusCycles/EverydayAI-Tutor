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
            © {new Date().getFullYear()} EverydayAI Tutor. All rights reserved.
          </p>
          <Link
            to="/privacy"
            className="text-[13px] text-brand-slate hover:text-brand-orange transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
