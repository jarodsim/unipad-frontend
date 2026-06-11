'use client'

import React, { createContext, useContext, useMemo } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#F82C4B',
    },
    secondary: {
      main: '#e3f2fd',
    },
  },
  typography: {
    fontFamily: 'Poppins',
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        filled: {
          borderBottom: '2px solid white',
          color: 'white',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {},
      },
    },
  },
})

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}
