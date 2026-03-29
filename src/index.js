import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider } from '@mui/material';

import GlobalStyles, { theme } from './globalStyles';
import Routes from './routes';
import reportWebVitals from './reportWebVitals';
import Header from './components/Header';
import { PadProvider } from './context/padContext';
import { MenuProvider } from './context/menuContext';
import { AuthProvider } from './context/authContext';
import { SnackbarProvider } from './context/snackbarContext';
import { LoadingProvider } from './context/loadingContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <SnackbarProvider>
          <AuthProvider>
            <MenuProvider>
              <PadProvider>
                <LoadingProvider>
                  <Header>
                    <Routes />
                  </Header>
                </LoadingProvider>
              </PadProvider>
            </MenuProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
