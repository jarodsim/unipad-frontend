import { useContext } from 'react'
import { LoadingContext } from '../../context/loadingContext'

const useLoading = () => {
  const context = useContext(LoadingContext)

  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}

export default useLoading
