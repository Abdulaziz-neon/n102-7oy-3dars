import { useState } from 'react'
import type { Product } from '../types'

export type ProductFormData = {
  title: string
  price: number
  description: string
  category: string
  image: string
}

interface Props {
  initialProduct?: Partial<Product>
  onSubmit: (data: ProductFormData) => void
  onCancel?: () => void
}

function ProductFormPage({ initialProduct, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initialProduct?.title || '')
  const [price, setPrice] = useState<number>(initialProduct?.price || 0)
  const [description, setDescription] = useState(initialProduct?.description || '')
  const [category, setCategory] = useState(
    typeof initialProduct?.category === 'string'
      ? initialProduct?.category
      : initialProduct?.category?.name || '',
  )
  const [image, setImage] = useState(
    initialProduct?.images && initialProduct.images.length
      ? initialProduct.images[0]
      : '',
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, price, description, category, image })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs text-slate-400 mb-1.5">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          required
        />
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1.5">Price</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
          className="w-full rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          required
        />
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1.5">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          required
        />
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1.5">Image URL</label>
        <input
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          required
        />
      </div>

      <div className="flex justify-end gap-3 mt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-2xl bg-slate-800 text-sm text-slate-300 hover:bg-slate-700 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded-2xl bg-linear-to-tr from-indigo-500 to-fuchsia-500 text-sm font-medium text-white shadow-md shadow-indigo-500/40 hover:brightness-110 transition"
        >
          Save
        </button>
      </div>
    </form>
  )
}

export default ProductFormPage
