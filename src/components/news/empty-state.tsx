'use client'

import { motion } from 'framer-motion'

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center py-24"
    >
      <p className="font-mono text-3xl font-bold text-zinc-200">—</p>
      <p className="mt-4 text-sm text-zinc-400 font-mono">Sin resultados</p>
      <p className="mt-2 text-xs text-zinc-300">
        No hay noticias que coincidan con los filtros seleccionados.
      </p>
    </motion.div>
  )
}
