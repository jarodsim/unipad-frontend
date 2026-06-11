import React, { useState, createContext, ReactNode } from 'react'
import { Alert, Snackbar, AlertColor } from '@mui/material'

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

  // TYPE: error | warning | info  | success

  function handleClose() {
    setSnackObject({
      open: false,
      type: snackObject.type,
      message: snackObject.message,
    })
  }

  return (
    <SnackbarContext.Provider
      value={{
        snackObject,
        setSnackObject,
      }}
    >
      <>
        {props.children}
        <Snackbar
          open={snackObject.open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={snackObject.type}
            sx={{ width: '100%' }}
          >
            {snackObject?.message}
          </Alert>
        </Snackbar>
      </>
    </SnackbarContext.Provider>
  )
}
