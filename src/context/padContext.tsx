import React, { useState, createContext, ReactNode } from 'react'

interface PadContextType {
  format: string;
  setFormat: React.Dispatch<React.SetStateAction<string>>;
}

export const PadContext = createContext<PadContextType>({} as PadContextType)

export function PadProvider(props: { children: ReactNode }) {
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
