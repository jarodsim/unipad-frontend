import React, { useState, createContext, ReactNode, useEffect } from 'react'
import { Button } from '@heroui/react'

export type AlertColor = 'success' | 'info' | 'warning' | 'error'

export interface SnackObjectType {
  open: boolean;
  type: AlertColor;
  message: string;
}

interface SnackbarContextType {
  snackObject: SnackObjectType;
  setSnackObject: React.Dispatch<React.SetStateAction<SnackObjectType>>;
}

export const SnackbarContext = createContext<SnackbarContextType>({} as SnackbarContextType)

export function SnackbarProvider(props: { children: ReactNode }) {
  const [snackObject, setSnackObject] = useState<SnackObjectType>({
    open: false,
    type: 'success',
    message: 'teste',
  })

  useEffect(() => {
    if (snackObject.open) {
      const timer = setTimeout(() => {
        handleClose()
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [snackObject.open])

  function handleClose() {
    setSnackObject(prev => ({ ...prev, open: false }))
  }

  const bgColorMap: Record<AlertColor, string> = {
    success: 'bg-green-600',
    info: 'bg-[#871523]',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
  }

  return (
    <SnackbarContext.Provider
      value={{
        snackObject,
        setSnackObject,
      }}
    >
      {props.children}
      {snackObject.open && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100000] min-w-[300px]">
          <div
            className={`flex items-center justify-between px-4 py-3 rounded shadow-lg text-white ${bgColorMap[snackObject.type]}`}
          >
            <span>{snackObject.message}</span>
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              className="ml-4 text-white hover:bg-white/10"
              aria-label="Fechar aviso"
              onPress={handleClose}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </SnackbarContext.Provider>
  )
}
