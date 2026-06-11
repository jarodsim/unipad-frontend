import React, { useState, useEffect, useContext, ReactNode } from 'react'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { Drawer, Box, Link } from '@mui/material'
import { Share, CopyAll } from '@mui/icons-material'

import Options from '../Options'
import NewUrl from '../NewUrl'
import Login from '../Login'
import useWindowsWidth from '../hooks/useWindowWidth'
import useGetUrl from '../hooks/useGetUrl'
import copyToClipBoard from '../../util/copyToClipBoard'
import { MenuContext, MenuType } from '../../context/menuContext'
import { AuthContext } from '../../context/authContext'
import { SnackbarContext } from '../../context/snackbarContext'

interface HeaderProps {
  children?: ReactNode;
}

export default function Header(props: HeaderProps) {
  const [openDrawer] = useState(false)
  const [drawerWidth, setDrawerWidth] = useState(400)
  const [_showMenu, _setShowMenu] = useState<MenuType>('NEWURL')
  const [_logged, _setLogged] = useState(false)

  const { showMenu } = useContext(MenuContext)
  const { logged } = useContext(AuthContext)
  const { setSnackObject } = useContext(SnackbarContext)

  const windowsWidth = useWindowsWidth()
  const actualUrl = useGetUrl()

  const [state, setState] = useState<Record<string, boolean>>({
    top: false,
    left: window.location.pathname === '/' ? true : false,
    bottom: false,
    right: false,
  })

  const toggleDrawer = (anchor: string, open: boolean) => (event: any) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setState({ ...state, [anchor]: open })
  }

  useEffect(() => {
    if (windowsWidth && windowsWidth <= 800) {
      setDrawerWidth(windowsWidth)
    } else if (windowsWidth > 400) {
      setDrawerWidth(400)
    }
  }, [windowsWidth])

  useEffect(() => {
    _setShowMenu(showMenu)
  }, [showMenu])

  useEffect(() => {
    _setLogged(logged)
  }, [logged])



  return (
    <div>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
            onClick={toggleDrawer('left', !openDrawer)}
          >
            <MenuIcon />
          </IconButton>
          <Link
            variant='h1'
            component='div'
            sx={{ flexGrow: 1 }}
            textAlign='center'
            style={{ fontWeight: 800, fontSize: '1.5rem', color: 'white', cursor: 'pointer', textDecoration: 'none' }}
            onClick={() => {
              window.location.href = '/'
            }}
          >
            UNIPAD - Codifique e compartilhe
          </Link>

          <div>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              color='inherit'
              onClick={() => {
                const pad = (document.getElementsByClassName(
                  'npm__react-simple-code-editor__textarea'
                )[0] as HTMLTextAreaElement).value
                copyToClipBoard(pad)
                setSnackObject({
                  open: true,
                  message: 'Copiado para sua área de transferência!',
                  type: 'success',
                })
              }}
            >
              <CopyAll />
            </IconButton>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              color='inherit'
              onClick={() => {
                copyToClipBoard(actualUrl)
                setSnackObject({
                  open: true,
                  message: 'Copiado para sua área de transferência!',
                  type: 'success',
                })
              }}
            >
              <Share />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor='left'
        open={state['left']}
        onClose={toggleDrawer(
          'left',
          window.location.pathname === '/' ? true : false
        )}
        elevation={1}
      >
        <Box
          sx={{
            bgcolor: 'primary.main',
            width: drawerWidth,
            height: window.innerHeight ? window.innerHeight : 500,
          }}
        >
          {children(_logged, _showMenu, toggleDrawer)}
        </Box>
      </Drawer>
      {props.children}
    </div>
  )
}

const children = (logged: boolean, showMenu: MenuType, toggleDrawer: Function) => {
  if (!logged && showMenu === 'LOGIN') {
    return <Login />
  } else if (showMenu === 'NEWURL') {
    return <NewUrl />
  } else if (showMenu === 'OPTIONS') {
    return <Options handleCloseMenu={toggleDrawer('left', false)} />
  }
}
