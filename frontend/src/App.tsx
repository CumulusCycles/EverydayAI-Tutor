import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white text-brand-charcoal">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/videos" element={<div className="p-12">Videos — coming soon</div>} />
          <Route path="/blog" element={<div className="p-12">Blog — coming soon</div>} />
          <Route path="/about" element={<div className="p-12">About — coming soon</div>} />
          <Route path="/privacy" element={<div className="p-12">Privacy — coming soon</div>} />
          <Route path="*" element={<div className="p-12">404 — Page not found</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
