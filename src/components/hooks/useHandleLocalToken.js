import { useEffect, useState } from 'react'

export default function useHandleLocalToken() {
  let [token, setToken] = useState(null)

  const local_token = localStorage.getItem('token')

  useEffect(() => {
    if (local_token !== null || local_token !== undefined) {
      setToken(local_token)
    }
  }, [local_token])

  return token
}
