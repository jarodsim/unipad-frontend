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
import useWindowsWidth from '../hooks/useWindowWidth'
import useVerifyIsPad from '../hooks/useVerifyIsPad'
import useGetUrl from '../hooks/useGetUrl'
import copyToClipBoard from '../../util/copyToClipBoard'
import { MenuContext } from '../../context/menuContext'
import { AuthContext } from '../../context/authContext'

export default function Header(props) {
  const [openDrawer] = useState(false)
  const [drawerWidth, setDrawerWidth] = useState(400)
  const [showNewMenu, setShowNewMenu] = useState(false)
  const [_logged, _setLogged] = useState(false)

  const { showNewUrlMenu } = useContext(MenuContext)
  const { logged } = useContext(AuthContext)

  const windowsWidth = useWindowsWidth()

  const [state, setState] = useState({
    top: false,
    left: true,
    bottom: false,
    right: false,
  })

  const actualUrl = useGetUrl()

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
    setShowNewMenu(showNewUrlMenu)
  }, [showNewUrlMenu])

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
                copyToClipBoard('vixe')
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
        onClose={toggleDrawer('left', false)}
        elevation={1}
      >
        <Box
          sx={{
            bgcolor: 'primary.main',
            width: drawerWidth,
            height: window.innerHeight ? window.innerHeight : 500,
          }}
        >
          {children(logged, showNewMenu, toggleDrawer)}
        </Box>
      </Drawer>
      {props.children}
    </div>
  )
}

const children = (logged, showNewUrlMenu, toggleDrawer) => {
  if (logged || window.location.pathname === '/' || showNewUrlMenu) {
    if (showNewUrlMenu) {
      return <NewUrl />
    } else {
      return <Options handleCloseMenu={toggleDrawer('left', false)} />
    }
  } else if (!logged && window.location.pathname !== '/' && !showNewUrlMenu) {
    return <Login />
  }
}
