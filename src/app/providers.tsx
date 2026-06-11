'use client'

import React, { ReactNode } from 'react'
import { PadProvider } from '@/context/padContext'
import { MenuProvider } from '@/context/menuContext'
import { AuthProvider } from '@/context/authContext'
import { SnackbarProvider } from '@/context/snackbarContext'
import { LoadingProvider } from '@/context/loadingContext'
import Header from '@/components/Header'
import Analytics from './Analytics'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SnackbarProvider>
      <AuthProvider>
        <MenuProvider>
          <PadProvider>
            <LoadingProvider>
              <Analytics />
              <Header>{children}</Header>
            </LoadingProvider>
          </PadProvider>
        </MenuProvider>
      </AuthProvider>
    </SnackbarProvider>
  )
}
