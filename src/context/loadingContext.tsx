import React, { useState, createContext, ReactNode } from 'react'
import Loading from '../components/Loading'

interface LoadingContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoadingContext = createContext<LoadingContextType>({} as LoadingContextType)

export function LoadingProvider(props: { children: ReactNode }) {
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
