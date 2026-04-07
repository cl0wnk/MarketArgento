import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full border border-zinc-300 bg-white px-3 py-2 text-sm',
        'placeholder:text-zinc-400',
        'focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'transition-colors duration-150',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
