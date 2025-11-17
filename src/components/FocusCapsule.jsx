import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw } from 'lucide-react'

const format = (s) => {
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const r = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${r}`
}

export default function FocusCapsule({ username = 'cadet' }) {
  const [phase, setPhase] = useState('focus') // 'focus' | 'break'
  const [running, setRunning] = useState(false)
  const [focusMin, setFocusMin] = useState(25)
  const [breakMin, setBreakMin] = useState(5)
  const [seconds, setSeconds] = useState(focusMin * 60)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!running) return
    const t = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [running])

  useEffect(() => {
    if (seconds >= 0) return
    if (phase === 'focus') {
      setPhase('break')
      setSeconds(breakMin * 60)
    } else {
      // Auto-complete cycle and award points
      completeSession('completed')
      setPhase('focus')
      setSeconds(focusMin * 60)
      setRunning(false)
    }
  }, [seconds])

  const backend = import.meta.env.VITE_BACKEND_URL || ''
  const rocketPct = useMemo(() => {
    const total = (phase === 'focus' ? focusMin : breakMin) * 60
    return Math.max(0, (seconds / total) * 100)
  }, [seconds, phase, focusMin, breakMin])

  const start = () => setRunning(true)
  const pause = () => setRunning(false)
  const reset = () => {
    setRunning(false)
    setPhase('focus')
    setSeconds(focusMin * 60)
  }

  const completeSession = async (status = 'completed') => {
    try {
      const res = await fetch(`${backend}/api/sessions/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: username, duration_min: focusMin, break_min: breakMin, status }),
      })
      const data = await res.json()
      setStats(data)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <section className="relative w-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(200px_120px_at_20%_0%,rgba(0,255,255,0.15),transparent),radial-gradient(200px_120px_at_80%_100%,rgba(255,0,255,0.12),transparent)]" />
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Focus Capsule</h2>
            <p className="text-white/60">25/5 minute cycles • Rocket countdown • Auto rewards</p>
          </div>
          <div className="flex items-center gap-3">
            <input type="number" min="1" value={focusMin} onChange={(e)=>{setFocusMin(+e.target.value); setSeconds(+e.target.value*60)}} className="w-16 rounded bg-white/10 px-2 py-1" />
            <span className="text-white/60">/</span>
            <input type="number" min="1" value={breakMin} onChange={(e)=>setBreakMin(+e.target.value)} className="w-16 rounded bg-white/10 px-2 py-1" />
            <span className="text-white/60">min</span>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
          <div className="relative h-52 sm:h-72 rounded-xl bg-[#0b0e22] border border-white/10 overflow-hidden">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2">
              <div className="text-center">
                <div className="text-5xl sm:text-6xl font-black tracking-wider tabular-nums drop-shadow-[0_0_30px_rgba(0,255,255,0.35)]">
                  {format(Math.max(0, seconds))}
                </div>
                <div className="mt-2 text-sm uppercase tracking-widest text-white/60">{phase === 'focus' ? 'Focus' : 'Break'} Phase</div>
              </div>
            </div>
            <motion.div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-500" initial={{ width: '100%' }} animate={{ width: `${rocketPct}%` }} transition={{ ease: 'linear', duration: 0.2 }} />
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-3">
              {!running ? (
                <button onClick={start} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"><Play size={18}/> Start</button>
              ) : (
                <button onClick={pause} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40"><Pause size={18}/> Pause</button>
              )}
              <button onClick={reset} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-white/10 text-white border border-white/20"><RotateCcw size={18}/> Reset</button>
              <button onClick={()=>completeSession('cancelled')} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/40">Save</button>
            </div>

            {stats && (
              <div className="mt-2 w-full rounded-lg bg-black/30 border border-white/10 p-3 text-sm">
                <div className="flex justify-between"><span>Stellar Credits</span><span className="font-semibold">{stats.points}</span></div>
                <div className="flex justify-between"><span>Level</span><span className="font-semibold">{stats.level}</span></div>
                <div className="flex justify-between"><span>Streak</span><span className="font-semibold">{stats.streak}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
