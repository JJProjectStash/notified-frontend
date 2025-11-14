import { useEffect, useCallback, useRef, useState } from 'react'

/**
 * Hook to trap focus within a modal or dialog
 * @param isOpen - Whether the modal is open
 * @param onClose - Function to call when Escape is pressed
 */
export function useFocusTrap(isOpen: boolean, onClose?: () => void) {
  const containerRef = useRef<HTMLElement | null>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement

    // Get all focusable elements within the container
    const getFocusableElements = (): HTMLElement[] => {
      if (!containerRef.current) return []

      const selector =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable]'
      const elements = containerRef.current.querySelectorAll(selector)
      return Array.from(elements).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1'
      ) as HTMLElement[]
    }

    // Focus the first focusable element
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      // Focus the first input or button
      const firstInput = focusableElements.find((el) => el.tagName === 'INPUT')
      const firstButton = focusableElements.find((el) => el.tagName === 'BUTTON')
      const elementToFocus = firstInput || firstButton || focusableElements[0]
      setTimeout(() => elementToFocus.focus(), 100)
    }

    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
      if (e.key === 'Escape' && onClose) {
        onClose()
        return
      }

      // Trap focus with Tab
      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements()
        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen, onClose])

  return containerRef
}

/**
 * Hook to handle keyboard navigation for custom interactive elements
 * @param onAction - Function to call when Enter or Space is pressed
 */
export function useKeyboardAction(onAction: () => void) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onAction()
      }
    },
    [onAction]
  )

  return handleKeyDown
}

/**
 * Hook to announce screen reader messages
 * @returns Function to announce a message
 */
export function useScreenReaderAnnounce() {
  const liveRegionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Create a live region for screen reader announcements
    const liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', 'polite')
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.setAttribute('class', 'sr-only')
    liveRegion.style.position = 'absolute'
    liveRegion.style.left = '-10000px'
    liveRegion.style.width = '1px'
    liveRegion.style.height = '1px'
    liveRegion.style.overflow = 'hidden'
    document.body.appendChild(liveRegion)
    liveRegionRef.current = liveRegion

    return () => {
      if (liveRegionRef.current) {
        document.body.removeChild(liveRegionRef.current)
      }
    }
  }, [])

  const announce = useCallback((message: string) => {
    if (liveRegionRef.current) {
      // Clear and then set the message for proper announcement
      liveRegionRef.current.textContent = ''
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = message
        }
      }, 100)
    }
  }, [])

  return announce
}

/**
 * Hook to manage focus for dropdown/menu components
 * @param isOpen - Whether the dropdown is open
 * @param itemCount - Number of items in the dropdown
 * @param onSelect - Function to call when an item is selected
 */
export function useDropdownKeyboardNav(
  isOpen: boolean,
  itemCount: number,
  onSelect: (index: number) => void
) {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)

  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1)
    }
  }, [isOpen])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((prev) => (prev < itemCount - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : itemCount - 1))
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (focusedIndex >= 0) {
            onSelect(focusedIndex)
          }
          break
        case 'Home':
          e.preventDefault()
          setFocusedIndex(0)
          break
        case 'End':
          e.preventDefault()
          setFocusedIndex(itemCount - 1)
          break
      }
    },
    [isOpen, itemCount, focusedIndex, onSelect]
  )

  return { focusedIndex, handleKeyDown }
}

/**
 * Hook to prevent body scroll when modal is open
 * @param isOpen - Whether the modal is open
 */
export function usePreventBodyScroll(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'

      return () => {
        // Restore scroll position
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])
}
