'use client'

import { useState, useEffect } from 'react'

const useWindowsWidth = () => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const getScreenSize = () => {
      setWidth(window.innerWidth)
    }
    getScreenSize()
    window.addEventListener('resize', getScreenSize)

    return () => window.removeEventListener('resize', getScreenSize)
  }, [])

  return width
}

export default useWindowsWidth
