import { useState, createContext } from 'react'
import Loading from '../components/Loading'

export const LoadingContext = createContext()

export function LoadingProvider(props) {
  const [loading, setLoading] = useState(false)

  return (
    <LoadingContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      <div>
        {loading && <Loading />}
        {props.children}
      </div>
    </LoadingContext.Provider>
  )
}
