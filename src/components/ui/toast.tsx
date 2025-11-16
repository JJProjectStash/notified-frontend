import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToastStore } from '@/store/toastStore'
import { cn } from '@/lib/utils'

const toastVariants = {
  // Dark mode friendly toasts
  success: 'bg-emerald-900/80 border-emerald-700 text-emerald-200',
  error: 'bg-rose-900/80 border-rose-700 text-rose-200',
  warning: 'bg-amber-900/80 border-amber-700 text-amber-200',
  info: 'bg-sky-900/80 border-sky-700 text-sky-200',
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100 }}
            className={cn(
              'p-4 rounded-lg border shadow-lg flex items-start gap-3',
              toastVariants[toast.type]
            )}
          >
            <div className="flex-1">
              {toast.title && <div className="font-semibold mb-1">{toast.title}</div>}
              <div className="text-sm">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-current opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
