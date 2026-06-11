import { useRef } from 'react'

export default function useDebounce(fn: (...args: any[]) => void, delay: number) {
  const timeoutRef = useRef<number | null>(null)

  function debouncedFn(...args: any[]) {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => {
      fn(...args)
    }, delay)
  }

  return debouncedFn
}
