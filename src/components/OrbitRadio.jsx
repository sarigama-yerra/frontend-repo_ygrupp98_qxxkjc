import React, { useEffect, useState } from 'react'

export default function OrbitRadio() {
  const backend = import.meta.env.VITE_BACKEND_URL || ''
  const [lists, setLists] = useState([])
  const [active, setActive] = useState(null)

  useEffect(() => {
    fetch(`${backend}/api/playlists`).then(r=>r.json()).then(d=>{
      setLists(d.items || [])
      setActive((d.items || [])[0] || null)
    }).catch(()=>{})
  }, [])

  return (
    <section className="relative w-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(200px_120px_at_20%_0%,rgba(0,255,255,0.08),transparent),radial-gradient(200px_120px_at_80%_100%,rgba(255,0,255,0.08),transparent)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Orbit Radio</h2>
          <div className="flex gap-2">
            {lists.map((pl) => (
              <button key={pl.name} onClick={()=>setActive(pl)} className={`px-3 py-1 rounded-full text-sm border ${active?.name===pl.name? 'border-purple-400 bg-purple-400/10 text-purple-200' : 'border-white/15 text-white/70 hover:bg-white/5'}`}>
                {pl.name}
              </button>
            ))}
          </div>
        </div>
        {active && (
          <div className="mt-4 rounded-lg bg-black/30 border border-white/10 p-4">
            <div className="font-semibold">{active.name}</div>
            <div className="text-sm text-white/60">{active.description}</div>
            <audio className="mt-3 w-full" controls>
              {/* If tracks exist, try playing first track url */}
              {active.tracks?.[0]?.url ? (
                <source src={active.tracks[0].url} type="audio/mpeg" />
              ) : null}
            </audio>
          </div>
        )}
      </div>
    </section>
  )
}
