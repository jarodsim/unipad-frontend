'use client'

export default function useHandleLocalToken() {
  if (typeof window === 'undefined') return null
  const local_token = localStorage.getItem('token')
  return local_token
}
