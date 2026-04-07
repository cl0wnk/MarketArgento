'use client'

import { useState, useCallback } from 'react'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error'
}

let toastIdCounter = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
      const id = String(++toastIdCounter)
      setToasts((prev) => [...prev, { id, title, description, variant }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 5000)
    },
    []
  )

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toast, toasts, dismiss }
}
