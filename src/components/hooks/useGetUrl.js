import { useState, useEffect } from 'react'

const useGetUrl = () => {
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(`${window.location}`)
  }, [])

  return url
}

export default useGetUrl
