import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

const categories = ["All", "Memory", "Focus", "Exam Prep", "Crazy Methods"]

export default function KnowledgeVault() {
  const backend = import.meta.env.VITE_BACKEND_URL || ''
  const [selected, setSelected] = useState('All')
  const [q, setQ] = useState('')
  const [items, setItems] = useState([])

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams()
    if (selected !== 'All') params.set('category', selected)
    if (q) params.set('q', q)
    fetch(`${backend}/api/tips?${params.toString()}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => {})
    return () => controller.abort()
  }, [selected, q])

  return (
    <section id="vault" className="relative w-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(200px_120px_at_20%_0%,rgba(0,255,255,0.1),transparent),radial-gradient(200px_120px_at_80%_100%,rgba(255,0,255,0.1),transparent)]" />
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold">Knowledge Vault</h2>
          <div className="flex items-center gap-2">
            {categories.map((c) => (
              <button key={c} className={`px-3 py-1 rounded-full text-sm border ${selected===c? 'border-cyan-400 bg-cyan-400/10 text-cyan-200' : 'border-white/15 text-white/70 hover:bg-white/5'}`} onClick={() => setSelected(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/10 border border-white/15 px-3 py-2">
          <Search size={16} className="text-white/60"/>
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search tips or tags" className="bg-transparent outline-none w-full text-white" />
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((t) => (
            <a key={t._id} href={t.tiktok_url || '#'} target="_blank" className="group block rounded-xl overflow-hidden bg-[#0b0e22] border border-white/10">
              <div className="aspect-video bg-gradient-to-tr from-fuchsia-500/30 to-cyan-500/30" />
              <div className="p-3">
                <div className="text-sm text-white/60">{t.category}</div>
                <div className="font-semibold group-hover:text-cyan-200 transition">{t.title}</div>
              </div>
            </a>
          ))}
          {items.length === 0 && (
            <div className="text-white/60">No tips yet. Add some in the database to see them here.</div>
          )}
        </div>
      </div>
    </section>
  )
}
