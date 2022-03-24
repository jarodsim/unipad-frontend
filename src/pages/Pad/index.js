import { useContext, useEffect, useMemo, useState } from 'react'

import useHandleLocalToken from '../../components/hooks/useHandleLocalToken'
import api from '../../service/api'

import { PadContext } from '../../context/padContext'

import { Textarea } from './styles'

import useDebounce from '../../components/hooks/useDebounce'

// editor styles
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
import { MenuContext } from '../../context/menuContext'
import { AuthContext } from '../../context/authContext'
import useLoading from '../../components/hooks/useLoading'

export default function Pad() {
  const [pad, setPad] = useState(null)
  const [format, setFormat] = useState('javascript')
  const { setLoading } = useLoading()

  const { setFormat: setFormatInContext, format: formatContext } =
    useContext(PadContext)
  const { logged, setLogged } = useContext(AuthContext)
  const { setShowMenu } = useContext(MenuContext)

  const debaunced = useDebounce(updatePad, 1000)
  const token = useHandleLocalToken()

  const pathname = window.location.pathname.replace('/', '')

  useEffect(() => {
    if (token) {
      ;(async () => {
        await handleGetUnipad()
      })()
    } else {
      window.location.href = ''
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
          url: pathname,
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
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        setShowMenu('NEWURL')
        setLoading(false)
      }
      if (error?.response?.status === 403) {
        setShowMenu('LOGIN')
        setLogged(false)
        setLoading(false)
      }
      if (error?.response?.status === 401) {
        await handleAuth()
      }
    }
  }

  async function handleAuth() {
    try {
      const { data: auth } = await api.post(
        'auth',
        {
          url: pathname,
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
    } catch (error) {
      if (error?.response?.status === 403) {
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
        url: pathname,
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

  if (!logged) {
    return <div>Não autenticado</div>
  }

  return (
    <div>
      <Textarea
        value={pad}
        onValueChange={(pad) => setPad(pad)}
        highlight={(pad) => highlight(pad, languages[format])}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
        }}
      />
    </div>
  )
}
