import { Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Home — coming soon</div>} />
      <Route path="/videos" element={<div>Videos — coming soon</div>} />
      <Route path="/blog" element={<div>Blog — coming soon</div>} />
      <Route path="/about" element={<div>About — coming soon</div>} />
      <Route path="/privacy" element={<div>Privacy — coming soon</div>} />
      <Route path="*" element={<div>404 — Page not found</div>} />
    </Routes>
  )
}
