import { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import LazyImage from '../components/LazyImage'
import ProductModal from '../components/ProductModal'
import { toggleLike } from '../store/likesSlice'
import type { Product } from '../types'
import type { RootState } from '../store/store'

const PRODUCTS_API = 'https://api.escuelajs.co/api/v1/products'

function LikesPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [modalInfo, setModalInfo] = useState<
    | { product?: Product; mode: 'view' | 'edit' | 'create' }
    | null
  >(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const likedIds = useSelector(
    (state: RootState) => state.likes.likedProductIds,
  )
  const dispatch = useDispatch()

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
        setAllProducts(data)
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

  const likedProducts = useMemo(() => {
    return allProducts.filter((product) => likedIds.includes(product.id))
  }, [allProducts, likedIds])

  const filteredProducts = useMemo(
    () =>
      likedProducts.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [likedProducts, search],
  )

  const toggleLikeProduct = (id: number) => {
    dispatch(toggleLike(id))
  }

  const openModal = (product?: Product, mode: 'view' | 'edit' | 'create' = 'view') => {
    setModalInfo({ product, mode })
  }

  const closeModal = () => setModalInfo(null)

  const handleSave = (prod: Product) => {
    if (modalInfo?.mode === 'create') {
      setAllProducts((p) => [prod, ...p])
    } else {
      setAllProducts((p) => p.map((x) => (x.id === prod.id ? prod : x)))
    }
  }

  const handleDelete = (id: number) => {
    setAllProducts((p) => p.filter((x) => x.id !== id))
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
              placeholder="Yoqtirgan mahsulotizni qidiring"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col items-center justify-center py-10 md:py-14">
        <p className="text-5xl md:text-6xl font-semibold text-slate-700/60 select-none">
          {loading ? '...' : likedProducts.length}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Yoqtirgan mahsulotlar soni
        </p>
      </div>

      <div className="flex-1 overflow-auto rounded-3xl bg-slate-900/70 border border-slate-800 p-5">
        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        {loading && !allProducts.length ? (
          <div className="flex h-40 items-center justify-center text-sm text-slate-400">
            Mahsulotlar yuklanmoqda...
          </div>
        ) : likedProducts.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-slate-400">
            Hali yoqtirgan mahsulotlaringiz yo'q. Mahsulotlar bo'limiga o'tib yoqtirgan mahsulotlaringizni belgilang.
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-slate-400">
            Qidiruv bo'yicha hech narsa topilmadi.
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
              const isLiked = likedIds.includes(product.id)

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
                          onClick={() => toggleLikeProduct(product.id)}
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

export default LikesPage
