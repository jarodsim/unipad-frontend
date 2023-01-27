import { useContext, useState } from 'react'
import { LockOutlined } from '@mui/icons-material'
import {
  Typography,
  FormControl,
  TextField,
  InputAdornment,
} from '@mui/material'

import { Container, BoxContainer, DevParagraph } from './styles'
import HeaderMenu from '../HeaderMenu'
import MyButton from '../Button'

import api from '../../service/api'

import { AuthContext } from '../../context/authContext'
import { SnackbarContext } from '../../context/snackbarContext'

export default function NewUrl() {
  const [password, setPassword] = useState('')

  const { setLogged } = useContext(AuthContext)
  const { setSnackObject } = useContext(SnackbarContext)

  const url = window.location.pathname

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
    } catch (error) {
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
    <Container>
      <HeaderMenu title={`LOGIN PARA ${url}`} />
      <BoxContainer
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant='h5'
          textAlign='center'
          fontWeight='700'
          color='white'
        >
          Faça o login para continuar
        </Typography>

        {/* PASSWORD */}
        <FormControl
          variant='outlined'
          sx={{ m: 1, minWidth: '90%' }}
          color='secondary'
        >
          <TextField
            variant='outlined'
            label='Senha'
            color='secondary'
            required={true}
            placeholder='senha'
            type='password'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <LockOutlined />
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
        </FormControl>
        <FormControl
          variant='outlined'
          sx={{ m: 1, minWidth: '90%' }}
          color='secondary'
        >
          <MyButton
            label='LOGAR'
            color='secondary'
            callback={() => {
              handleLogin()
            }}
          />
        </FormControl>
        <DevParagraph>
          Desenvolvido por{' '}
          <a href='https://jarod.dev/' target='_blank' rel='noreferrer'>
            Jarod Cavalcante
          </a>
        </DevParagraph>
      </BoxContainer>
    </Container>
  )
}
