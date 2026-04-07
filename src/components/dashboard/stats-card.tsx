'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

interface StatsCardProps {
  label: string
  value: number
  description?: string
}

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0)
  const display = useTransform(motionValue, (v) => Math.round(v).toLocaleString('es-AR'))

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.8, ease: 'easeOut' })
    return controls.stop
  }, [value, motionValue])

  return <motion.span>{display}</motion.span>
}

export function StatsCard({ label, value, description }: StatsCardProps) {
  return (
    <div className="border border-zinc-200 bg-white p-6">
      <p className="text-xs font-mono font-semibold uppercase tracking-widest text-zinc-400 mb-2">
        {label}
      </p>
      <p className="text-4xl font-bold tracking-tight text-black">
        <AnimatedNumber value={value} />
      </p>
      {description && (
        <p className="mt-2 text-xs text-zinc-400">{description}</p>
      )}
    </div>
  )
}
