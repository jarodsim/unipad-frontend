import { createGlobalStyle } from 'styled-components'
import { createTheme } from '@mui/material'

const GlobalStyle = createGlobalStyle`
  html {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
    outline: 0;
  }
  body {
    margin: 0px;
    padding: 0px;
  }

  button{
    outline: 0;
  }

  ::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    -webkit-border-radius: 4px;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    -webkit-border-radius: 4px;
    border-radius: 4px;
    background: rgba(255, 93, 75, 1);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}

::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(255, 0, 0, 0.4);
}
`
export default GlobalStyle

export const theme = createTheme({
  palette: {
    primary: {
      main: '#F82C4B',
    },
    secondary: {
      main: '#e3f2fd',
    },
  },
  typography: {
    fontFamily: ['Poppins'],
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
