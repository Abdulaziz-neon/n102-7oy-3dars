import { useState } from 'react'
import type { Product } from '../types'
import ProductFormPage from '../pages/ProductFormPage'
import type { ProductFormData } from '../pages/ProductFormPage'
import LazyImage from './LazyImage'
import ConfirmModal from './ConfirmModal'

interface Props {
  product?: Product
  mode: 'view' | 'edit' | 'create'
  onClose: () => void
  onSave: (product: Product) => void
  onDelete?: (id: number) => void
}

function ProductModal({
  product,
  mode: initialMode,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [mode, setMode] = useState(initialMode)
  const blank: Product = {
    id: 0,
    title: '',
    price: 0,
    description: '',
    category: '',
    images: [],
  }
  const current: Product = product || blank

  const handleSubmit = (data: ProductFormData) => {
    const updated: Product = {
      ...current,
      ...data,
      category: data.category,
      images: data.image ? [data.image] : [],
    }
    if (mode === 'create') {
      const newProd = { ...updated, id: Date.now() }
      onSave(newProd)
    } else {
      onSave(updated)
    }
    onClose()
  }

  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleDelete = () => {
    if (product) {
      setConfirmOpen(true)
    }
  }

  const confirmDelete = () => {
    if (product && onDelete) {
      onDelete(product.id)
      onClose()
    }
  }

  const catName =
    typeof current.category === 'string'
      ? current.category
      : (current.category as any)?.name || ''
  const imageUrl = current.images?.[0] || ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 overflow-auto max-h-full">
        {mode === 'view' && (
          <>
            <h2 className="text-xl font-semibold text-slate-100 mb-4">
              {current.title}
            </h2>
            {imageUrl && (
              <div className="mb-4 flex justify-center">
                <LazyImage
                  src={imageUrl}
                  alt={current.title}
                  className="max-h-48 object-contain"
                />
              </div>
            )}
            <p className="text-sm text-slate-300 mb-2">{current.description}</p>
            <p className="text-xs text-slate-500 mb-1">Category: {catName}</p>
            <p className="text-sm font-semibold text-indigo-300 mb-4">
              ${current.price.toFixed(2)}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMode('edit')}
                className="px-4 py-2 rounded-2xl bg-indigo-600 text-sm text-white hover:brightness-110 transition"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-2xl bg-red-600 text-sm text-white hover:brightness-110 transition"
              >
                Delete
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-2xl bg-slate-800 text-sm text-slate-300 hover:bg-slate-700 transition"
              >
                Close
              </button>
            </div>
          </>
        )}
        {(mode === 'edit' || mode === 'create') && (
          <>
            <h2 className="text-lg font-semibold text-slate-100 mb-4">
              {mode === 'create' ? 'New product' : 'Edit product'}
            </h2>
            <ProductFormPage
              initialProduct={current}
              onSubmit={handleSubmit}
              onCancel={() => {
                if (mode === 'create') onClose()
                else setMode('view')
              }}
            />
          </>
        )}
      </div>
      {confirmOpen && (
        <ConfirmModal
          title="O'chirmoqchimisiz?"
          message="Mahsulotni o'chirmoqchimisiz?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
          confirmText="Ha"
          cancelText="Bekor"
        />
      )}
    </div>
  )
}

export default ProductModal
