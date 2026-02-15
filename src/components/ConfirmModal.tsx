
interface ConfirmModalProps {
  title?: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
}

function ConfirmModal({
  title = 'Tasdiqlash',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Ha',
  cancelText = 'Bekor qilish',
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full p-6">
        {title && <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>}
        <p className="text-sm text-slate-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-2xl bg-slate-800 text-sm text-slate-300 hover:bg-slate-700 transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-2xl bg-linear-to-tr from-indigo-500 to-fuchsia-500 text-sm font-medium text-white shadow-md shadow-indigo-500/40 hover:brightness-110 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
