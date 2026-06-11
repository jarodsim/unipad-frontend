import { useState, useEffect } from 'react'

const useVerifyIsPad = () => {
  const [ispad, setIsPad] = useState(true)

  useEffect(() => {
    const pathname = window.location.pathname

    if (pathname === '/') {
      setIsPad(false)
    }
  }, [])

  return ispad
}

export default useVerifyIsPad
