'use client'

import { useContext, useState } from 'react'
import { usePathname } from 'next/navigation'
import { InputGroup, Label, TextField } from '@heroui/react'
import { LockClosedIcon } from '@heroicons/react/24/outline'

import HeaderMenu from '@/components/HeaderMenu'
import MyButton from '@/components/Button'
import { menuPanelStyles } from '@/components/menuPanelStyles'

import api from '@/service/api'

import { AuthContext } from '@/context/authContext'
import { SnackbarContext } from '@/context/snackbarContext'

export default function Login() {
  const [password, setPassword] = useState('')

  const { setLogged } = useContext(AuthContext)
  const { setSnackObject } = useContext(SnackbarContext)

  const url = usePathname()

  async function handleLogin() {
    try {
      const { data: auth } = await api.post('auth', {
        url: url,
        password: password,
      })

      if (auth.success) {
        const { token } = auth
        localStorage.setItem('token', `Bearer ${token}`)
        setLogged(true)
        window.location.reload()
      } else {
        setSnackObject({
          open: true,
          type: 'error',
          message: 'Ops! Algo de errado aconteceu',
        })
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setSnackObject({
          open: true,
          type: 'error',
          message: 'Senha incorreta!',
        })
      }
    }
  }

  return (
    <div className="min-h-full w-full px-5 pb-8 text-white">
      <HeaderMenu title={`LOGIN PARA ${url}`} />
      <div className="mx-auto flex w-full max-w-[360px] flex-col items-center pt-3">
        <h2 className="mb-6 text-center text-2xl font-extrabold leading-tight text-white drop-shadow-sm">
          Faça o login para continuar
        </h2>

        <div className="flex w-full flex-col gap-4">
          <TextField isRequired className={menuPanelStyles.field}>
            <Label className={menuPanelStyles.label}>Senha</Label>
            <InputGroup variant="secondary" className={menuPanelStyles.control}>
              <InputGroup.Prefix className="pl-4 pr-1 text-white/70">
                <LockClosedIcon className="h-5 w-5" />
              </InputGroup.Prefix>
              <InputGroup.Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="senha"
                type="password"
                className={menuPanelStyles.input}
                aria-label="Senha"
              />
            </InputGroup>
          </TextField>

          <MyButton
            label="LOGAR"
            variant="primary"
            callback={handleLogin}
            fullWidth
            className={menuPanelStyles.primaryAction}
          />
        </div>

        <p className="mt-12 text-center text-sm text-white/90">
          Desenvolvido por{' '}
          <a href="https://jarod.dev/" target="_blank" rel="noreferrer" className="font-bold text-white no-underline hover:underline">
            Jarod Mateus
          </a>
        </p>
      </div>
    </div>
  )
}
