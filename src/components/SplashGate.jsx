import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiZap } from 'react-icons/fi'

/**
 * Splash screen shows only on first load OR hard refresh.
 * Hidden for normal navigation using sessionStorage.
 * Duration: 4 seconds
 */
export default function SplashGate({ children }) {
  const [ready, setReady] = useState(false)
  const [show, setShow] = useState(false)

  const shouldShow = useMemo(() => {
    try {
      return sessionStorage.getItem('splash_seen') !== '1'
    } catch {
      return true
    }
  }, [])

  useEffect(() => {
    if (!shouldShow) {
      setReady(true)
      return
    }

    setShow(true)

    // ⏱️ Splash visible for 4 seconds
    const hideTimer = setTimeout(() => {
      setShow(false)
    }, 4000)

    const readyTimer = setTimeout(() => {
      try {
        sessionStorage.setItem('splash_seen', '1')
      } catch {}
      setReady(true)
    }, 4000)

    return () => {
      clearTimeout(hideTimer)
      clearTimeout(readyTimer)
    }
  }, [shouldShow])

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            className="fixed inset-0 z-[9999] grid place-items-center bg-slate-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <motion.div
                className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/5 shadow-soft"
                initial={{ scale: 0.7, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 18 }}
              >
                <FiZap className="text-2xl text-indigo-200" />
              </motion.div>

              <motion.h1
                className="text-xl font-bold tracking-tight"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                Waiting...
              </motion.h1>

              <motion.p
                className="mt-2 text-sm text-slate-300"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                Preparing your experience
              </motion.p>

              <div className="mx-auto mt-6 h-2 w-56 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full w-full bg-gradient-to-r from-indigo-400 via-emerald-300 to-rose-300"
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  transition={{ duration: 3.6, ease: 'easeInOut' }} // ⏱️ progress sync
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {ready ? children : null}
    </>
  )
}
