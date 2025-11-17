import React, { useRef } from 'react'
import Hero from './components/Hero'
import FocusCapsule from './components/FocusCapsule'
import KnowledgeVault from './components/KnowledgeVault'
import OrbitRadio from './components/OrbitRadio'

function App() {
  const vaultRef = useRef(null)

  return (
    <div className="min-h-screen bg-[#070815]">
      <Hero onStart={() => {
        const el = document.getElementById('focus')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }} />

      <main className="mx-auto max-w-6xl px-6 -mt-24 space-y-8 pb-20 relative z-10">
        <div id="focus">
          <FocusCapsule />
        </div>

        <OrbitRadio />
        <KnowledgeVault />
      </main>

      <footer className="border-t border-white/10 py-10 text-center text-white/60">
        Built for explorers. Stay curious.
      </footer>
    </div>
  )
}

export default App
