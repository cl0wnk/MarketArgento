'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertPreferenceSchema, type AlertPreferenceInput } from '@/schemas/alerts.schema'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { SECTORS } from '@/config/app.config'
import { useState } from 'react'
import type { AlertPreference } from '@prisma/client'

interface AlertPreferencesFormProps {
  initialData?: AlertPreference | null
  onSubmit: (data: AlertPreferenceInput) => Promise<{ success: boolean; error?: string }>
}

export function AlertPreferencesForm({ initialData, onSubmit }: AlertPreferencesFormProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const form = useForm<AlertPreferenceInput>({
    resolver: zodResolver(AlertPreferenceSchema),
    defaultValues: {
      enabled: initialData?.enabled ?? true,
      minImpact: (initialData?.minImpact as AlertPreferenceInput['minImpact']) ?? 'HIGH',
      sectors: (initialData?.sectors as string[]) ?? [],
    },
  })

  const handleSubmit = async (data: AlertPreferenceInput) => {
    const result = await onSubmit(data)
    setStatus(result.success ? 'success' : 'error')
    setTimeout(() => setStatus('idle'), 3000)
  }

  const enabled = form.watch('enabled')
  const minImpact = form.watch('minImpact')
  const sectors = form.watch('sectors')

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      {/* Enable toggle */}
      <div className="flex items-center justify-between py-4 border-b border-zinc-100">
        <div>
          <Label>Alertas por email</Label>
          <p className="text-xs text-zinc-400 mt-1 normal-case tracking-normal font-normal">
            Recibí un email cuando se detecte una noticia importante.
          </p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={(v) => form.setValue('enabled', v)}
        />
      </div>

      {/* Min Impact */}
      <div>
        <Label className="mb-3 block">Impacto mínimo</Label>
        <div className="flex gap-3">
          {(['LOW', 'MEDIUM', 'HIGH'] as const).map((level) => {
            const labels = { LOW: 'Bajo', MEDIUM: 'Medio', HIGH: 'Alto' }
            return (
              <button
                key={level}
                type="button"
                onClick={() => form.setValue('minImpact', level)}
                className={`flex-1 py-2 text-sm font-medium border transition-colors ${
                  minImpact === level
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'
                }`}
              >
                {labels[level]}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-zinc-400 mt-2">
          Solo recibirás alertas de noticias con este nivel de impacto o superior.
        </p>
      </div>

      {/* Sectors */}
      <div>
        <Label className="mb-3 block">Sectores de interés</Label>
        <p className="text-xs text-zinc-400 mb-4 normal-case tracking-normal font-normal">
          Dejá vacío para recibir alertas de todos los sectores.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {SECTORS.map((sector) => {
            const isChecked = sectors.includes(sector.value)
            return (
              <label key={sector.value} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    const current = form.getValues('sectors')
                    if (checked) {
                      form.setValue('sectors', [...current, sector.value])
                    } else {
                      form.setValue('sectors', current.filter((s) => s !== sector.value))
                    }
                  }}
                />
                <span className="text-sm text-zinc-600 group-hover:text-black transition-colors">
                  {sector.label}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" loading={form.formState.isSubmitting}>
          Guardar preferencias
        </Button>
        {status === 'success' && (
          <span className="text-sm text-zinc-500">Guardado correctamente.</span>
        )}
        {status === 'error' && (
          <span className="text-sm text-red-600">Error al guardar. Intentá de nuevo.</span>
        )}
      </div>
    </form>
  )
}
