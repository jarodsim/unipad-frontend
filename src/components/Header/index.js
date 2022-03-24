import { useState, useEffect, useContext } from 'react'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { Drawer, Box } from '@mui/material'
import { Share, CopyAll } from '@mui/icons-material'

import Options from '../Options'
import NewUrl from '../NewUrl'
import Login from '../Login'
import Loading from '../Loading'
import useWindowsWidth from '../hooks/useWindowWidth'
import useGetUrl from '../hooks/useGetUrl'
import copyToClipBoard from '../../util/copyToClipBoard'
import { MenuContext } from '../../context/menuContext'
import { AuthContext } from '../../context/authContext'
import { SnackbarContext } from '../../context/snackbarContext'
import useLoading from '../hooks/useLoading'

export default function Header(props) {
  const [openDrawer] = useState(false)
  const [drawerWidth, setDrawerWidth] = useState(400)
  const [_showMenu, _setShowMenu] = useState(false)
  const [_logged, _setLogged] = useState(false)

  const { showMenu } = useContext(MenuContext)
  const { logged } = useContext(AuthContext)
  const { setSnackObject } = useContext(SnackbarContext)

  const windowsWidth = useWindowsWidth()
  const actualUrl = useGetUrl()
  const { loading } = useLoading()

  const [state, setState] = useState({
    top: false,
    left: window.location.pathname === '/' ? true : false,
    bottom: false,
    right: false,
  })

  const toggleDrawer = (anchor, open) => (event) => {
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

  // if (loading) {
  //   return <Loading />
  // }

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
          <Typography
            variant='h4'
            component='div'
            sx={{ flexGrow: 1 }}
            textAlign='center'
            style={{ fontWeight: 800 }}
            onClick={() => {
              window.location.href = '/'
            }}
          >
            UNIPAD
          </Typography>

          <div>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              color='inherit'
              onClick={() => {
                const pad = document.getElementsByClassName(
                  'npm__react-simple-code-editor__textarea'
                )[0].value
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

const children = (logged, showMenu, toggleDrawer) => {
  if (!logged && showMenu === 'LOGIN') {
    return <Login />
  } else if (showMenu === 'NEWURL') {
    return <NewUrl />
  } else if (showMenu === 'OPTIONS') {
    return <Options handleCloseMenu={toggleDrawer('left', false)} />
  }
}
