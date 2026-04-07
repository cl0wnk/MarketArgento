"use client"

import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { updateAlertPreferences } from "@/actions/user"
import { AlertPreference } from "@prisma/client"
import { SharpButton } from "@/components/ui/sharp-button"
import { cn } from "@/lib/utils"

interface SettingsFormProps {
  initialData: AlertPreference | null
}

const SECTORS = [
  { id: 'BANKING', label: 'BANKING' },
  { id: 'ENERGY', label: 'ENERGY' },
  { id: 'AGRICULTURE', label: 'AGRICULTURE' },
  { id: 'TECHNOLOGY', label: 'TECH' },
  { id: 'CURRENCY', label: 'FX / USD' },
  { id: 'BONDS', label: 'BONDS' },
  { id: 'REAL_ESTATE', label: 'REAL ESTATE' },
  { id: 'GENERAL', label: 'GENERAL' },
]

const IMPACT_LEVELS = [
  { id: 'LOW', label: 'LOW +' },
  { id: 'MEDIUM', label: 'MEDIUM +' },
  { id: 'HIGH', label: 'HIGH ONLY' },
]

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [enabled, setEnabled] = useState(initialData?.enabled ?? true)
  const [minImpact, setMinImpact] = useState(initialData?.minImpact ?? 'HIGH')
  const [sectors, setSectors] = useState<string[]>(initialData?.sectors ?? [])

  const { execute, isExecuting } = useAction(updateAlertPreferences, {
    onSuccess: () => {
      // Show some toast or indication
    }
  })

  const toggleSector = (id: string) => {
    setSectors(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleSave = () => {
    execute({
      enabled,
      minImpact: minImpact as 'LOW' | 'MEDIUM' | 'HIGH',
      sectors: sectors as any,
    })
  }

  return (
    <div className="flex flex-col gap-16 animate-mech-slide">
      {/* Master Toggle */}
      <section className="flex items-center justify-between border-b-[4px] border-black dark:border-white pb-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-4xl font-black uppercase">ALERTS</h2>
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-40">REAL-TIME EMAIL DISPATCH</p>
        </div>
        <button 
          onClick={() => setEnabled(!enabled)}
          className={cn(
            "w-24 h-12 border-2 border-black dark:border-white transition-all flex items-center px-1",
            enabled ? "bg-black dark:bg-white justify-end" : "bg-transparent justify-start"
          )}
        >
          <div className={cn(
            "w-10 h-10 border-2",
            enabled ? "bg-white dark:bg-black border-white dark:border-black" : "bg-black dark:bg-white border-black dark:border-white"
          )} />
        </button>
      </section>

      <div className={cn("flex flex-col gap-16 transition-opacity duration-500", !enabled && "opacity-20 pointer-events-none")}>
        {/* Impact Level */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-2xl font-black uppercase tracking-tight text-black dark:text-white">IMPACT THRESHOLD</h3>
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-40">SELECT MINIMUM SENSITIVITY</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {IMPACT_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => setMinImpact(level.id)}
                className={cn(
                  "p-8 border-2 font-mono text-xs font-bold uppercase tracking-[0.3em] transition-all text-left",
                  minImpact === level.id 
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black" 
                    : "border-black/10 text-black/40 dark:border-white/10 dark:text-white/40 hover:border-black dark:hover:border-white"
                )}
              >
                {level.label}
              </button>
            ))}
          </div>
        </section>

        {/* Sectors */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-2xl font-black uppercase tracking-tight text-black dark:text-white">SECTORS OF INTEREST</h3>
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-40">LEAVE EMPTY TO TRACK ALL</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SECTORS.map((sector) => (
              <button
                key={sector.id}
                onClick={() => toggleSector(sector.id)}
                className={cn(
                  "py-4 px-6 border font-mono text-[10px] font-bold uppercase tracking-widest transition-all text-left flex justify-between items-center",
                  sectors.includes(sector.id)
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-black/10 text-black/40 dark:border-white/10 dark:text-white/40 hover:border-black dark:hover:border-white"
                )}
              >
                {sector.label}
                {sectors.includes(sector.id) && <span>[✓]</span>}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Save Button */}
      <section className="mt-12 pt-12 border-t border-black dark:border-white flex justify-end">
        <SharpButton 
          onClick={handleSave} 
          disabled={isExecuting}
          className="w-full md:w-64 h-16 text-lg font-black"
        >
          {isExecuting ? "SAVING..." : "COMMIT CHANGES"}
        </SharpButton>
      </section>
    </div>
  )
}
