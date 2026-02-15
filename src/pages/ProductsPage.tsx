import { useEffect, useMemo, useState } from 'react'
import LazyImage from '../components/LazyImage'

type Product = {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}

const PRODUCTS_API = 'https://fakestoreapi.com/products'

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<'all' | string>('all')

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    fetch(PRODUCTS_API)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load products')
        }
        return res.json()
      })
      .then((data: Product[]) => {
        if (!isMounted) return
        setProducts(data)
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

  const categories = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => set.add(p.category))
    return Array.from(set)
  }, [products])

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        const matchesSearch = p.title
          .toLowerCase()
          .includes(search.toLowerCase())
        const matchesCategory = category === 'all' || p.category === category
        return matchesSearch && matchesCategory
      }),
    [products, search, category],
  )

  const total = filteredProducts.length

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <label className="block text-xs text-slate-400 mb-1.5">
            Qidirish
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Mahsulot nomi bo'yicha qidiring..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
              Enter
            </span>
          </div>
        </div>

        <div className="w-full md:w-72">
          <label className="block text-xs text-slate-400 mb-1.5">
            Category
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Summary number */}
      <div className="rounded-3xl bg-slate-900/70 border border-slate-800 flex items-center justify-center py-10 md:py-14">
        <p className="text-5xl md:text-6xl font-semibold text-slate-700/60 select-none">
          {loading ? '...' : total}
        </p>
      </div>

      {/* Products grid */}
      <div className="flex-1 overflow-auto rounded-3xl bg-slate-900/70 border border-slate-800 p-5">
        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        {loading && !products.length ? (
          <div className="flex h-40 items-center justify-center text-sm text-slate-400">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-slate-400">
            Hech narsa topilmadi.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-indigo-500/60 transition-colors shadow-sm shadow-black/40 flex flex-col overflow-hidden"
              >
                <div className="h-40 bg-slate-900/80 flex items-center justify-center overflow-hidden">
                  <LazyImage
                    src={product.image}
                    alt={product.title}
                    className="h-28 w-full object-contain transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 px-4 py-3">
                  <p className="line-clamp-2 text-sm font-medium text-slate-100">
                    {product.title}
                  </p>
                  <p className="text-xs text-slate-500">{product.category}</p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-sm font-semibold text-indigo-300">
                      ${product.price.toFixed(2)}
                    </span>
                    <button className="text-xs px-3 py-1.5 rounded-full bg-linear-to-tr from-indigo-500 to-fuchsia-500 text-white shadow-md shadow-indigo-500/40 hover:brightness-110 transition">
                      View
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage

