import { useState, useEffect } from 'react'

const useWindowsWidth = () => {
  const [width, setWidth] = useState(false)

  let getScreenSize = () => {
    setWidth(window.innerWidth)
  }
  useEffect(() => {
    getScreenSize()
    window.addEventListener('resize', getScreenSize)

    return () => window.removeEventListener('resize', getScreenSize)
  }, [])

  return width
}

export default useWindowsWidth
