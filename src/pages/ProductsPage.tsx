import { useEffect, useMemo, useState } from 'react'
import LazyImage from '../components/LazyImage'
import ProductModal from '../components/ProductModal'
import type { Product } from '../types'

const PRODUCTS_API = 'https://api.escuelajs.co/api/v1/products'

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [liked, setLiked] = useState<Set<number>>(new Set())
  const [modalInfo, setModalInfo] = useState<
    | { product?: Product; mode: 'view' | 'edit' | 'create' }
    | null
  >(null)
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
    products.forEach((p) => {
      const name = typeof p.category === 'string' ? p.category : (p.category as any)?.name
      set.add(name)
    })
    return Array.from(set)
  }, [products])

  const MAX_DISPLAY = 30

  const filteredProducts = useMemo(
    () =>
      products
        .filter((p) => {
          const matchesSearch = p.title
            .toLowerCase()
            .includes(search.toLowerCase())
          const catName = typeof p.category === 'string' ? p.category : (p.category as any)?.name
          const matchesCategory = category === 'all' || catName === category
          return matchesSearch && matchesCategory
        })
        .slice(0, MAX_DISPLAY),
    [products, search, category],
  )

  const total = filteredProducts.length
  const allCount = products.filter((p) => {
    const matchesSearch = p.title
      .toLowerCase()
      .includes(search.toLowerCase())
    const catName = typeof p.category === 'string' ? p.category : (p.category as any)?.name
    const matchesCategory = category === 'all' || catName === category
    return matchesSearch && matchesCategory
  }).length

  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const copy = new Set(prev)
      if (copy.has(id)) copy.delete(id)
      else copy.add(id)
      return copy
    })
  }

  const openModal = (product?: Product, mode: 'view' | 'edit' | 'create' = 'view') => {
    setModalInfo({ product, mode })
  }

  const closeModal = () => setModalInfo(null)

  const handleSave = (prod: Product) => {
    if (modalInfo?.mode === 'create') {
      setProducts((p) => [prod, ...p])
    } else {
      setProducts((p) => p.map((x) => (x.id === prod.id ? prod : x)))
    }
  }

  const handleDelete = (id: number) => {
    setProducts((p) => p.filter((x) => x.id !== id))
  }

  return (
    <div className="flex flex-col gap-6 h-full">
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
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setModalInfo({ mode: 'create' })}
          className="px-4 py-2 rounded-2xl bg-linear-to-tr from-indigo-500 to-fuchsia-500 text-sm font-medium text-white shadow-md shadow-indigo-500/40 hover:brightness-110 transition"
        >
          + Yangi mahsulot
        </button>
      </div>

      <div className="rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col items-center justify-center py-10 md:py-14">
        <p className="text-5xl md:text-6xl font-semibold text-slate-700/60 select-none">
          {loading ? '...' : total}
        </p>
        {!loading && allCount > total && (
          <p className="text-xs text-slate-500 mt-1">
            First {total} of {allCount} products shown
          </p>
        )}
      </div>

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
            {filteredProducts.map((product) => {
              const catName =
                typeof product.category === 'string'
                  ? product.category
                  : (product.category as any)?.name || ''
              const imageUrl =
                product.images && product.images.length
                  ? product.images[0]
                  :
                    (product as any).image || ''
              const isLiked = liked.has(product.id)

              return (
                <article
                  key={product.id}
                  className="group rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-indigo-500/60 transition-colors shadow-sm shadow-black/40 flex flex-col overflow-hidden"
                >
                  <div className="h-40 bg-slate-900/80 flex items-center justify-center overflow-hidden">
                    <LazyImage
                      src={imageUrl}
                      alt={product.title}
                      className="h-28 w-full object-contain transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 px-4 py-3">
                    <p className="line-clamp-2 text-sm font-medium text-slate-100">
                      {product.title}
                    </p>
                    <p className="text-xs text-slate-500">{catName}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-sm font-semibold text-indigo-300">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleLike(product.id)}
                          className={
                            'text-lg ' +
                            (isLiked ? 'text-red-400' : 'text-slate-400')
                          }
                          aria-label="Like"
                        >
                          <i
                            className={
                              isLiked
                                ? 'fa-solid fa-heart'
                                : 'fa-regular fa-heart'
                            }
                          ></i>
                        </button>
                        <button
                          onClick={() => openModal(product, 'view')}
                          className="text-slate-400 hover:text-slate-100 text-lg"
                          aria-label="More"
                        >
                          <i className="fa-solid fa-ellipsis"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
      {modalInfo && (
        <ProductModal
          product={modalInfo.product}
          mode={modalInfo.mode}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default ProductsPage

