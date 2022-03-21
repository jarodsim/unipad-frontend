import { Alert, Snackbar } from '@mui/material'
import { useState, createContext } from 'react'

export const SnackbarContext = createContext()

export function SnackbarProvider(props) {
  const [snackObject, setSnackObject] = useState({
    open: false,
    type: 'success',
    message: 'teste',
  })

  // TYPE: error | warning | information  | success

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
