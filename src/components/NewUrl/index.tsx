'use client'

import { useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  Input,
  InputGroup,
  Label,
  ListBox,
  Select,
  TextField,
} from '@heroui/react'
import type { Key } from '@heroui/react'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import ReactGA from 'react-ga4'

import HeaderMenu from '@/components/HeaderMenu'
import MyButton from '@/components/Button'
import { menuPanelStyles } from '@/components/menuPanelStyles'
import { languages } from '@/constants/languages'
import { useGetFormatedDate } from '@/components/hooks/useGetFormatedDate'
import api from '@/service/api'
import { SnackbarContext } from '@/context/snackbarContext'
import useLoading from '@/components/hooks/useLoading'

export default function NewUrl() {
  const [format, setFormat] = useState('sql')
  const [url, setUrl] = useState('')
  const [password, setPassword] = useState('')
  const [expiration, setExpiration] = useState<string | null>(null)

  const formatedDate = useGetFormatedDate()
  const { setLoading } = useLoading()
  const pathname = usePathname()

  const { setSnackObject } = useContext(SnackbarContext)

  async function handleGoButton() {
    setLoading(true)
    try {
      const post_object = {
        url: `/${url}`,
        password: password,
        secure: password.length > 0 ? true : false,
        format,
        expiration,
      }
      const { data } = await api.post('', { ...post_object })
      const { data: auth } = await api.post('auth', {
        url: post_object.url,
        password: password,
      })
      if (data.success && auth.success) {
        const { token } = auth
        localStorage.setItem('token', `Bearer ${token}`)

        ReactGA.event({
          category: 'New URL',
          action: 'Click',
          label: `New URL: ${url}`,
        })

        window.location.pathname = `${url}`
      }
    } catch (error: any) {
      setLoading(false)
      console.error(error)
      if (error?.response?.status === 403) {
        setSnackObject({
          open: true,
          message:
            'A url já existe e é protegida. Provavelmente a senha está incorreta.',
          type: 'error',
        })
      } else {
        setSnackObject({
          open: true,
          message:
            'Ops! Sinto muito, mas aconteceu algo de errado. Tente novamente.',
          type: 'error',
        })
      }
    }
  }

  function submitUrl() {
    if (url.length > 0) {
      handleGoButton()
    } else {
      setSnackObject({
        open: true,
        message: 'Ops! Digite uma url.',
        type: 'warning',
      })
    }
  }

  useEffect(() => {
    if (pathname !== '/') {
      setUrl(pathname.replace('/', ''))
    }
  }, [pathname])

  return (
    <div className="min-h-full w-full px-5 pb-8 text-white">
      <HeaderMenu title="Unipad" />
      <div className="mx-auto flex w-full max-w-[360px] flex-col items-center pt-3">
        <h2 className="mb-5 text-center text-2xl font-extrabold leading-tight text-white drop-shadow-sm">
          Crie uma url e clique em &quot;ir&quot; para começar!
        </h2>

        <div className="flex w-full flex-col gap-4">
          <TextField isRequired className={menuPanelStyles.field}>
            <Label className={menuPanelStyles.label}>URL</Label>
            <InputGroup variant="secondary" className={menuPanelStyles.control}>
              <InputGroup.Prefix className="pl-4 pr-1 text-lg font-semibold text-white/75">
                /
              </InputGroup.Prefix>
              <InputGroup.Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="minha_url"
                className={menuPanelStyles.input}
                aria-label="URL"
                autoComplete="off"
                spellCheck={false}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitUrl()
                }}
              />
            </InputGroup>
          </TextField>

          <TextField className={menuPanelStyles.field}>
            <Label className={menuPanelStyles.label}>Senha (opcional)</Label>
            <InputGroup variant="secondary" className={menuPanelStyles.control}>
              <InputGroup.Prefix className="pl-4 pr-1 text-white/70">
                <LockClosedIcon className="h-5 w-5" />
              </InputGroup.Prefix>
              <InputGroup.Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="opcional"
                type="password"
                className={menuPanelStyles.input}
                aria-label="Senha opcional"
              />
            </InputGroup>
          </TextField>

          <Select
            className={menuPanelStyles.field}
            placeholder="Selecione o formato"
            selectedKey={format}
            onSelectionChange={(key: Key | null) => {
              if (key) setFormat(String(key))
            }}
          >
            <Label className={menuPanelStyles.label}>Formato</Label>
            <Select.Trigger className={menuPanelStyles.selectTrigger}>
              <Select.Value className={menuPanelStyles.selectValue} />
              <Select.Indicator className="text-white/70" />
            </Select.Trigger>
            <Select.Popover className="border border-red-100/80 bg-white shadow-xl">
              <ListBox>
                {languages.map((language) => {
                  const val = language === 'GO' ? language.toLowerCase() : language
                  return (
                    <ListBox.Item key={val} id={val} textValue={language}>
                      {language}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  )
                })}
              </ListBox>
            </Select.Popover>
          </Select>

          <TextField className={menuPanelStyles.field}>
            <Label className={menuPanelStyles.label}>Data de Expiração (opcional)</Label>
            <Input
              value={expiration ?? ''}
              onChange={(e) => setExpiration(e.target.value || null)}
              type="datetime-local"
              min={formatedDate}
              className={`${menuPanelStyles.control} px-4 [color-scheme:dark]`}
            />
          </TextField>

          <MyButton
            label="IR"
            variant="primary"
            callback={submitUrl}
            fullWidth
            className={menuPanelStyles.primaryAction}
          />
        </div>

        <p className="mt-12 text-center text-sm text-white/90">
          Desenvolvido por{' '}
          <a
            href="https://jarod.dev"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-white no-underline hover:underline"
          >
            Jarod Mateus
          </a>
        </p>
      </div>
    </div>
  )
}
