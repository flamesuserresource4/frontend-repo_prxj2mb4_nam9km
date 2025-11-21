import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import { Search, BarChart3, Flame, TrendingUp, Phone, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
)

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Navbar() {
  const navItem = ({ to, label, icon: Icon }) => (
    <NavLink
      to={to}
      className={({ isActive }) => `inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-slate-200 hover:text-white hover:bg-white/10'}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  )
  return (
    <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 bg-slate-900/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-white">
          <Flame className="w-6 h-6 text-blue-400" />
          <span className="font-semibold">PricePulse</span>
        </Link>
        <div className="flex items-center gap-2">
          {navItem({ to: '/', label: 'Home', icon: Flame })}
          {navItem({ to: '/compare', label: 'Price Comparison', icon: Search })}
          {navItem({ to: '/trending', label: 'Trending Deals', icon: TrendingUp })}
          {navItem({ to: '/insights', label: 'Graphical Insights', icon: BarChart3 })}
          {navItem({ to: '/contact', label: 'Contact', icon: Mail })}
        </div>
      </div>
    </div>
  )
}

function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(600px_200px_at_20%_0%,rgba(59,130,246,.15),transparent),radial-gradient(800px_200px_at_80%_0%,rgba(34,197,94,.15),transparent)]" />
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Find the best price across stores</h1>
          <p className="mt-4 text-slate-300 text-lg">Search any product and instantly compare prices from Amazon, Flipkart, Myntra, AJIO, Meesho and more.</p>
          <div className="mt-8">
            <Link to="/compare" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition">
              <Search className="w-4 h-4" /> Start Comparing
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Filters({ filters, setFilters }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <input value={filters.query} onChange={(e)=>setFilters(f=>({...f, query: e.target.value}))} placeholder="Search product..." className="px-4 py-2 rounded-lg bg-slate-800/60 border border-white/10 text-white placeholder:text-slate-400" />
      <select value={filters.category} onChange={(e)=>setFilters(f=>({...f, category: e.target.value}))} className="px-4 py-2 rounded-lg bg-slate-800/60 border border-white/10 text-white">
        <option value="">All Categories</option>
        <option>Mobiles</option>
        <option>Headphones</option>
        <option>Shoes</option>
        <option>Laptops</option>
        <option>Fashion</option>
      </select>
      <input type="text" value={filters.brand} onChange={(e)=>setFilters(f=>({...f, brand: e.target.value}))} placeholder="Brand (optional)" className="px-4 py-2 rounded-lg bg-slate-800/60 border border-white/10 text-white placeholder:text-slate-400" />
      <div className="flex items-center gap-2">
        <input type="number" min={0} value={filters.price_min ?? ''} onChange={(e)=>setFilters(f=>({...f, price_min: e.target.value ? Number(e.target.value) : null}))} placeholder="Min" className="w-1/2 px-4 py-2 rounded-lg bg-slate-800/60 border border-white/10 text-white placeholder:text-slate-400" />
        <input type="number" min={0} value={filters.price_max ?? ''} onChange={(e)=>setFilters(f=>({...f, price_max: e.target.value ? Number(e.target.value) : null}))} placeholder="Max" className="w-1/2 px-4 py-2 rounded-lg bg-slate-800/60 border border-white/10 text-white placeholder:text-slate-400" />
      </div>
    </div>
  )
}

function ComparisonTable({ result }) {
  if (!result) return null
  const prices = result.platforms?.map(p=>p.price) || []
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
        <thead>
          <tr className="text-slate-300">
            <th className="px-4">Platform</th>
            <th className="px-4">Price</th>
            <th className="px-4">Rating</th>
            <th className="px-4">Delivery</th>
            <th className="px-4">Link</th>
          </tr>
        </thead>
        <tbody>
          {result.platforms.map((p, idx)=>{
            const isMin = p.price === min
            const isMax = p.price === max
            return (
              <tr key={idx} className={`rounded-xl ${isMin ? 'bg-green-500/10' : isMax ? 'bg-red-500/10' : 'bg-white/5'}`}>
                <td className="px-4 py-3 font-medium text-white">{p.platform}</td>
                <td className="px-4 py-3 font-semibold {isMin ? 'text-green-400' : isMax ? 'text-red-400' : 'text-white'}">₹{p.price.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-200">{p.rating ?? '—'}</td>
                <td className="px-4 py-3 text-slate-200">{p.delivery ?? '—'}</td>
                <td className="px-4 py-3"><a className="text-blue-400 hover:text-blue-300" href={p.url} target="_blank">View</a></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function PriceCharts({ result }) {
  if (!result) return null
  const labels = result.platforms[0]?.history?.map(h=>new Date(h.date).toLocaleDateString()) || []
  const lineData = {
    labels,
    datasets: result.platforms.map((p, idx)=>({
      label: p.platform,
      data: p.history.map(h=>h.price),
      fill: false,
      tension: 0.3,
      borderColor: ['#60a5fa','#34d399','#f472b6','#f87171','#fbbf24','#a78bfa','#22d3ee'][idx%7],
      pointRadius: 0,
    }))
  }
  const barData = {
    labels: result.platforms.map(p=>p.platform),
    datasets: [{
      label: 'Current Price',
      data: result.platforms.map(p=>p.price),
      backgroundColor: result.platforms.map(p=>p.price === Math.min(...result.platforms.map(x=>x.price)) ? 'rgba(34,197,94,0.6)' : p.price === Math.max(...result.platforms.map(x=>x.price)) ? 'rgba(239,68,68,0.6)' : 'rgba(99,102,241,0.6)')
    }]
  }
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h4 className="text-white font-semibold mb-3">Price Trend</h4>
        <Line data={lineData} options={{ plugins: { legend: { labels: { color: 'white' } } }, scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' } } } }} />
      </div>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h4 className="text-white font-semibold mb-3">Platform Comparison</h4>
        <Bar data={barData} options={{ plugins: { legend: { labels: { color: 'white' } } }, scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' } } } }} />
      </div>
    </div>
  )
}

function ComparePage() {
  const [filters, setFilters] = useState({ query: 'iPhone 15', category: '', brand: '', price_min: null, price_max: null })
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const search = async () => {
    if (!filters.query) return
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      params.set('q', filters.query)
      if (filters.category) params.set('category', filters.category)
      if (filters.brand) params.set('brand', filters.brand)
      if (filters.price_min != null) params.set('price_min', String(filters.price_min))
      if (filters.price_max != null) params.set('price_max', String(filters.price_max))
      const res = await fetch(`${baseUrl}/api/search?${params.toString()}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError('Failed to fetch results')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ search() }, [])

  const result = data?.results?.[0]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-white mb-4">Price Comparison</h2>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <Filters filters={filters} setFilters={setFilters} />
        <div className="mt-4 flex items-center gap-3">
          <button onClick={search} className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg"><Search className="w-4 h-4"/>Search</button>
          {loading && <span className="text-slate-300 text-sm">Loading...</span>}
          {error && <span className="text-red-400 text-sm">{error}</span>}
        </div>
        {result && (
          <div className="mt-6">
            <div className="flex gap-4 items-center">
              {result.image && <img src={result.image} className="w-24 h-24 rounded-lg object-cover" />}
              <div>
                <h3 className="text-white text-xl font-semibold">{result.name}</h3>
                <p className="text-slate-300 text-sm">{result.brand || '—'} • {result.category || '—'}</p>
              </div>
            </div>
            <ComparisonTable result={result} />
            <PriceCharts result={result} />
          </div>
        )}
      </div>
    </div>
  )
}

function TrendingPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    (async ()=>{
      try {
        const res = await fetch(`${baseUrl}/api/trending`)
        const json = await res.json()
        setItems(json.items || [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-white mb-4">Trending Deals</h2>
      {loading ? <p className="text-slate-300">Loading...</p> : (
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it, idx)=>{
            const low = it.lowest
            return (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <img src={it.image} className="w-full h-40 object-cover rounded-lg" />
                <h4 className="text-white font-semibold mt-3">{it.name}</h4>
                <p className="text-slate-300 text-sm">{it.brand} • {it.category}</p>
                {low && <p className="mt-2 text-green-400 font-semibold">Best from {low.platform}: ₹{low.price.toLocaleString()}</p>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function InsightsPage() {
  const [query, setQuery] = useState('iPhone 15')
  const [data, setData] = useState(null)
  const load = async () => {
    const res = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(query)}`)
    const json = await res.json()
    setData(json)
  }
  useEffect(()=>{ load() }, [])
  const result = data?.results?.[0]
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-4">
        <input value={query} onChange={(e)=>setQuery(e.target.value)} className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white" />
        <button onClick={load} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg">Update</button>
      </div>
      {!result ? <p className="text-slate-300">Search a product to see insights.</p> : (
        <div>
          <PriceCharts result={result} />
        </div>
      )}
    </div>
  )
}

function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
      <p className="text-slate-300">Questions or feedback? Drop a message at hello@pricepulse.app</p>
    </div>
  )
}

function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <footer className="py-8 text-center text-slate-400">© {new Date().getFullYear()} PricePulse</footer>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
