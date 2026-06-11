'use client'

import React, { useState, useEffect, useContext, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@heroui/react'
import { Bars3Icon, ShareIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'

import Options from '@/components/Options'
import NewUrl from '@/components/NewUrl'
import Login from '@/components/Login'
import useWindowsWidth from '@/components/hooks/useWindowWidth'
import copyToClipBoard from '@/util/copyToClipBoard'
import { MenuContext, MenuType } from '@/context/menuContext'
import { AuthContext } from '@/context/authContext'
import { SnackbarContext } from '@/context/snackbarContext'

interface HeaderProps {
  children?: ReactNode
}

export default function Header(props: HeaderProps) {
  const [drawerWidth, setDrawerWidth] = useState(400)

  const { showMenu } = useContext(MenuContext)
  const { logged } = useContext(AuthContext)
  const { setSnackObject } = useContext(SnackbarContext)

  const windowsWidth = useWindowsWidth()
  const pathname = usePathname()

  const [actualUrl, setActualUrl] = useState('')

  useEffect(() => {
    setActualUrl(`${window.location}`)
  }, [])

  const [state, setState] = useState<Record<string, boolean>>({
    left: false,
  })

  // Open drawer by default on home page
  useEffect(() => {
    if (pathname === '/') {
      setState((prev) => ({ ...prev, left: true }))
    }
  }, [pathname])

  const toggleDrawer = (open: boolean) => (event?: React.MouseEvent | React.KeyboardEvent) => {
    if (
      event?.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setState({ ...state, left: open })
  }

  useEffect(() => {
    if (windowsWidth && windowsWidth <= 800) {
      setDrawerWidth(windowsWidth)
    } else if (windowsWidth > 400) {
      setDrawerWidth(400)
    }
  }, [windowsWidth])

  return (
    <div>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-[#5d111a]/30 bg-[#871523] px-3 text-white shadow-[0_10px_28px_rgba(64,10,19,0.22)] sm:px-4">
        <Button
          isIconOnly
          variant="ghost"
          className="mr-2 text-white hover:bg-white/10 sm:mr-4"
          onPress={() => toggleDrawer(!state.left)()}
          aria-label="menu"
        >
          <Bars3Icon className="w-6 h-6" />
        </Button>
        <Link
          href="/"
          className="min-w-0 flex-grow truncate px-2 text-center text-base font-extrabold tracking-wide text-white no-underline hover:text-white/90 sm:text-xl md:text-2xl"
        >
          UNIPAD - Codifique e compartilhe
        </Link>

        <div className="flex shrink-0">
          <Button
            isIconOnly
            variant="ghost"
            className="text-white hover:bg-white/10"
            aria-label="copy pad content"
            onPress={() => {
              const padElements = document.getElementsByClassName(
                'npm__react-simple-code-editor__textarea'
              )
              if (padElements.length > 0) {
                const pad = (padElements[0] as HTMLTextAreaElement).value
                copyToClipBoard(pad)
                setSnackObject({
                  open: true,
                  message: 'Copiado para sua área de transferência!',
                  type: 'success',
                })
              }
            }}
          >
            <DocumentDuplicateIcon className="w-6 h-6" />
          </Button>
          <Button
            isIconOnly
            variant="ghost"
            className="text-white hover:bg-white/10"
            aria-label="share url"
            onPress={() => {
              copyToClipBoard(actualUrl)
              setSnackObject({
                open: true,
                message: 'Copiado para sua área de transferência!',
                type: 'success',
              })
            }}
          >
            <ShareIcon className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Drawer Overlay */}
      {state.left && (
        <div 
          className="fixed inset-x-0 bottom-0 top-16 z-40 bg-neutral-900/45 backdrop-blur-[1px]" 
          onClick={pathname === '/' ? undefined : toggleDrawer(false)}
        />
      )}

      {/* Drawer Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 h-full overflow-y-auto border-r border-white/10 bg-[linear-gradient(180deg,#ff5d4b_0%,#fb284e_55%,#f01d46_100%)] text-white shadow-[24px_0_70px_rgba(94,13,28,0.28)] transition-transform duration-300 ease-in-out ${
          state.left ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: drawerWidth }}
      >
        {renderChildren(logged, showMenu, toggleDrawer)}
      </div>

      {props.children}
    </div>
  )
}

const renderChildren = (
  logged: boolean,
  showMenu: MenuType,
  toggleDrawer: (open: boolean) => (event?: React.MouseEvent | React.KeyboardEvent) => void
) => {
  if (!logged && showMenu === 'LOGIN') {
    return <Login />
  } else if (showMenu === 'NEWURL') {
    return <NewUrl />
  } else if (showMenu === 'OPTIONS') {
    return <Options handleCloseMenu={toggleDrawer(false)} />
  }
  return null
}
