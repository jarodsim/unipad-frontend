import { useState, createContext } from 'react'

export const PadContext = createContext()

export function PadProvider(props) {
  const [format, setFormat] = useState('javascript')

  return (
    <PadContext.Provider
      value={{
        format,
        setFormat,
      }}
    >
      {props.children}
    </PadContext.Provider>
  )
}
