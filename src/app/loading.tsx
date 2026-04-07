export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-black animate-bounce [animation-delay:-0.3s]" />
        <div className="w-1.5 h-1.5 bg-black animate-bounce [animation-delay:-0.15s]" />
        <div className="w-1.5 h-1.5 bg-black animate-bounce" />
      </div>
    </div>
  )
}
