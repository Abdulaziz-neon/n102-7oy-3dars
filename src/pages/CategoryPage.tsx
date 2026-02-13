import { useEffect, useState } from 'react'

const CATEGORIES_API = 'https://fakestoreapi.com/products/categories'

function CategoryPage() {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    fetch(CATEGORIES_API)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load categories')
        }
        return res.json()
      })
      .then((data: string[]) => {
        if (!isMounted) return
        setCategories(data)
      })
      .catch((err: unknown) => {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : 'Unknown error')
      })
      .finally(() => {
        if (!isMounted) return
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="h-full w-full rounded-3xl bg-slate-900/70 border border-slate-800 shadow-inner shadow-black/40 p-6 flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-slate-200 tracking-wide mb-1">
        Categories
      </h2>
      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {error}
        </div>
      )}
      {loading && !categories.length ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
          Loading categories...
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li
              key={c}
              className="rounded-2xl bg-slate-900 border border-slate-800/80 px-4 py-3 text-sm text-slate-100 flex items-center justify-between"
            >
              <span className="capitalize">{c}</span>
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CategoryPage

