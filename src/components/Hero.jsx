import React from 'react'
import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'

export default function Hero({ onStart }) {
  return (
    <section className="relative min-h-[88vh] w-full overflow-hidden bg-[#070815] text-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07081566] to-[#070815] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight"
        >
          Study Space Station
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 max-w-xl text-lg text-white/80"
        >
          Launch your focus capsule, grow your cosmic cherry tree, and earn Stellar Credits as you learn.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 flex gap-3"
        >
          <button onClick={onStart} className="rounded-xl bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20">
            Start Focus Capsule
          </button>
          <a href="#vault" className="rounded-xl bg-white/10 backdrop-blur px-5 py-3 font-semibold text-white hover:bg-white/15 border border-white/10">
            Explore Knowledge Vault
          </a>
        </motion.div>
      </div>
    </section>
  )
}
