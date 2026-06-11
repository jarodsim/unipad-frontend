'use client'

import { useContext, useEffect, useMemo, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Editor from 'react-simple-code-editor'

import useHandleLocalToken from '@/components/hooks/useHandleLocalToken'
import api from '@/service/api'

import { PadContext } from '@/context/padContext'

import useDebounce from '@/components/hooks/useDebounce'

// editor styles
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import './prism.css'
import { MenuContext } from '@/context/menuContext'
import { AuthContext } from '@/context/authContext'
import useLoading from '@/components/hooks/useLoading'
import { SnackbarContext } from '@/context/snackbarContext'

import { io, Socket } from 'socket.io-client'

export default function PadPage() {
  const [pad, setPad] = useState('')
  const [format, setFormat] = useState('javascript')
  const { setLoading } = useLoading()
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  const { setFormat: setFormatInContext, format: formatContext } =
    useContext(PadContext)
  const { logged, setLogged } = useContext(AuthContext)
  const { setShowMenu } = useContext(MenuContext)
  const { setSnackObject } = useContext(SnackbarContext)

  const debaunced = useDebounce(updatePad, 1000)
  const token = useHandleLocalToken()

  const pathname = usePathname()
  const padPath = pathname.replace('/', '')

  // Initialize socket on mount (client-side only)
  useEffect(() => {
    const socketClient = api.getUri()
    const socket = io(socketClient, {
      transports: ['websocket'],
    })
    socketRef.current = socket
    setIsConnected(socket.connected)

    socket.on('connection', () => {
      socket.emit('create', `/${padPath}`)
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on(`/${padPath}`, (data) => {
      setPad(data.data.pad)
    })

    return () => {
      socket.off('connection')
      socket.off('disconnect')
      socket.off(`/${padPath}`)
      socket.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (token) {
      ;(async () => {
        await handleGetUnipad()
      })()
    } else {
      ;(async () => {
        await handleAuth()
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setFormat(formatContext)
  }, [formatContext])

  async function handleGetUnipad() {
    setLoading(true)
    try {
      const { data } = await api.put(
        'get',
        {
          url: `/${padPath}`,
        },
        {
          headers: {
            authorization: String(token),
          },
        }
      )
      if (data.success) {
        const { pad: response_pad, format } = data

        setPad(response_pad)
        setFormatInContext(format)
        setLogged(true)
        setShowMenu('OPTIONS')
        setLoading(false)
      } else {
        window.localStorage.removeItem('token')
        window.location.reload()
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setShowMenu('NEWURL')
        setLoading(false)
        setSnackObject({
          open: true,
          type: 'warning',
          message:
            'A url ainda não existe, abra o menu para cria-lá da forma que preferir.',
        })
      }
      if (error?.response?.status === 403) {
        setShowMenu('LOGIN')
        setLogged(false)
        setLoading(false)
        setSnackObject({
          open: true,
          type: 'warning',
          message: 'A url é protegida, abra o menu para efetuar o login.',
        })
      }
      if (error?.response?.status === 401) {
        await handleAuth()
      }
    }
  }

  async function handleAuth() {
    try {
      setLoading(true)
      const { data: auth } = await api.post(
        'auth',
        {
          url: `/${padPath}`,
          password: '123456',
        },
        {
          headers: {
            authorization: String(token),
          },
        }
      )

      if (auth.success) {
        const { token } = auth
        localStorage.setItem('token', `Bearer ${token}`)

        window.location.reload()
        setLogged(true)
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setShowMenu('LOGIN')
        setLogged(false)
        setLoading(false)
        setSnackObject({
          open: true,
          type: 'warning',
          message: 'A url é protegida, abra o menu para efetuar o login.',
        })
        if (logged) {
          setLogged(false)
        }
      }
    }
  }

  async function updatePad() {
    await api.put(
      '',
      {
        pad,
        format,
        url: `/${padPath}`,
      },
      {
        headers: {
          authorization: String(token),
        },
      }
    )
  }

  useMemo(async () => {
    if (logged) {
      debaunced()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pad])

  if (!logged && !isConnected) {
    return <></>
  }

  return (
    <div className="w-full h-[calc(100vh-64px)] overflow-y-auto">
      <Editor
        className="w-full min-h-[90vh] rounded-sm bg-white text-black resize-none border-none outline-none"
        value={pad}
        onValueChange={(newPad) => {
          socketRef.current?.emit('editpad', { pad: newPad })
          setPad(newPad)
        }}
        highlight={(pad) =>
          highlight(
            pad,
            languages[
              format === 'text/markdown'
                ? 'markdown'
                : format === 'html/markup'
                  ? 'markup'
                  : format
            ]
          )
        }
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
        }}
      />
    </div>
  )
}
