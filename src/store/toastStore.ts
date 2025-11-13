import { create } from 'zustand'

interface ToastMessage {
  id: string
  title?: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface ToastState {
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(7)
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))
    // Auto-remove after 5 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, 5000)
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}))

// Helper hook for toast notifications
export const useToast = () => {
  const { addToast } = useToastStore()

  return {
    success: (message: string, title?: string) => addToast({ message, title, type: 'success' }),
    error: (message: string, title?: string) => addToast({ message, title, type: 'error' }),
    warning: (message: string, title?: string) => addToast({ message, title, type: 'warning' }),
    info: (message: string, title?: string) => addToast({ message, title, type: 'info' }),
  }
}
