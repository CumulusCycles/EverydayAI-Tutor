import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import VideosPage from './pages/VideosPage'
import BlogPage from './pages/BlogPage'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white text-brand-charcoal">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function NotFound() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 text-center">
      <h1 className="text-[52px] font-extrabold text-brand-navy mb-4">404</h1>
      <p className="text-lg text-brand-slate mb-8">That page doesn't exist.</p>
      <a href="/" className="text-brand-orange font-semibold hover:underline">
        ← Back to home
      </a>
    </div>
  )
}
