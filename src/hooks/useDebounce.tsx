import { useEffect } from 'react'

/**
 * Calls the effect after the delay
 *
 * @param effect - The function to run after debounce
 * @param deps - Dependency array. THis will have the value being typed
 * @param delay - Time in ms to wait before firing the effect
 */
const useDebounce = (effect: () => void, deps: any[], delay: number = 300) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      effect()
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [...deps, delay])
}

export default useDebounce
