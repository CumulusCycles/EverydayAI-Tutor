import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const YT_URL = 'https://www.youtube.com/@EverydayAITutor'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/videos', label: 'Videos', end: false },
  { to: '/blog', label: 'Blog', end: false },
  { to: '/about', label: 'About', end: false },
]

function linkClass(isActive: boolean): string {
  return `text-[15px] font-medium transition-colors ${
    isActive ? 'text-brand-orange' : 'text-brand-charcoal hover:text-brand-orange'
  }`
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-brand-gray">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/logo.png"
            alt="EverydayAI Tutor Logo"
            className="w-11 h-11 rounded-full object-cover"
          />
          <span className="text-lg font-bold text-brand-navy">
            Everyday<span className="text-brand-orange">AI</span> Tutor
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-9 list-none">
          {navLinks.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={({ isActive }) => linkClass(isActive)}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Subscribe button — always visible */}
        <div className="flex items-center gap-3">
          <a
            href={YT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-orange text-white text-sm font-bold px-[22px] py-2.5 rounded-lg hover:opacity-[0.88] transition-opacity whitespace-nowrap"
          >
            Subscribe on YouTube
          </a>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden flex flex-col justify-center gap-1.5 p-1"
          >
            <span className="block w-5 h-0.5 bg-brand-navy rounded-full" />
            <span className="block w-5 h-0.5 bg-brand-navy rounded-full" />
            <span className="block w-5 h-0.5 bg-brand-navy rounded-full" />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-brand-gray px-6 py-4">
          <ul className="flex flex-col gap-4 list-none">
            {navLinks.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => linkClass(isActive)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
