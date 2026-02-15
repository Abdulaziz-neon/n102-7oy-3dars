import { useState } from 'react'
import type { ImgHTMLAttributes, ReactNode } from 'react'

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  placeholder?: ReactNode
}

function LazyImage({
  placeholder,
  className = '',
  onLoad,
  onError,
  ...imgProps
}: LazyImageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className={`relative ${className}`.trim()}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
          {placeholder || (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-white" />
          )}
        </div>
      )}

      <img
        {...imgProps}
        className={`${className} transition-opacity duration-200 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`.trim()}
        onLoad={(e) => {
          setLoading(false)
          onLoad && onLoad(e)
        }}
        onError={(e) => {
          setLoading(false)
          setError(true)
          onError && onError(e)
        }}
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-red-400">
          failed
        </div>
      )}
    </div>
  )
}

export default LazyImage
