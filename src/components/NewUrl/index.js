import { useContext, useEffect, useState } from 'react'
import { LockOutlined } from '@mui/icons-material'
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material'

import { Container, BoxContainer, DevParagraph } from './styles'
import HeaderMenu from '../HeaderMenu'
import MyButton from '../Button'
import { languages } from '../../constants/languages'

import { useGetFormatedDate } from '../hooks/useGetFormatedDate'
import api from '../../service/api'
import { SnackbarContext } from '../../context/snackbarContext'
import useLoading from '../hooks/useLoading'

export default function NewUrl() {
  const [format, setFormat] = useState('sql')
  const [url, setUrl] = useState('')
  const [password, setPassword] = useState('')
  const [expiration, setExpiration] = useState(null)

  const formatedDate = useGetFormatedDate()
  const { setLoading } = useLoading()

  const { setSnackObject } = useContext(SnackbarContext)

  async function handleGoButton() {
    setLoading(true)
    try {
      const post_object = {
        url,
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

        window.location.pathname = `${url}`
      }
    } catch (error) {
      setLoading(false)

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

  useEffect(() => {
    if (window.location.pathname !== '/') {
      setUrl(window.location.pathname.replace('/', ''))
    }
  }, [])

  return (
    <Container>
      <HeaderMenu title='NOVA URL' />
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
          Crie uma url e clique em "ir" para começar!
        </Typography>

        {/* URL */}
        <FormControl
          variant='outlined'
          sx={{ m: 1, minWidth: '90%' }}
          color='secondary'
        >
          <TextField
            variant='outlined'
            label='URL'
            color='secondary'
            required={true}
            placeholder='minha_url'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>/</InputAdornment>
              ),
            }}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
            }}
          />
        </FormControl>

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
            required={false}
            placeholder='opcional'
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

        {/* FORMAT */}
        <FormControl
          variant='outlined'
          sx={{ m: 1, minWidth: '90%' }}
          color='secondary'
        >
          <InputLabel id='format'>
            <Typography variant='body1'>Formato</Typography>
          </InputLabel>
          <Select
            labelId='format'
            id='select-format'
            variant='outlined'
            label='Formato'
            value={format}
            onChange={(e) => {
              setFormat(e.target.value)
            }}
            color='secondary'
            sx={{
              textAlign: 'center',
            }}
          >
            {languages.map((language, index) => (
              <MenuItem
                key={index}
                value={language === 'GO' ? language.toLowerCase() : language}
                color='#e3f2fd'
              >
                <Typography variant='body1'>{language}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          variant='outlined'
          sx={{ m: 1, minWidth: '90%' }}
          color='secondary'
        >
          <TextField
            variant='outlined'
            label='Data de Expiração (opcional)'
            type='datetime-local'
            defaultValue={formatedDate}
            inputProps={{
              min: formatedDate,
            }}
            onChange={(e) => {
              setExpiration(e.target.value)
            }}
          />
        </FormControl>
        <FormControl
          variant='outlined'
          sx={{ m: 1, minWidth: '90%' }}
          color='secondary'
        >
          <MyButton
            label='IR'
            color='secondary'
            callback={() => {
              if (url.length > 0) {
                handleGoButton()
              } else {
                setSnackObject({
                  open: true,
                  message: 'Ops! Digite uma url.',
                  type: 'warning',
                })
              }
            }}
          />
        </FormControl>
        <DevParagraph>
          Desenvolvido por{' '}
          <a href='https://jarodmateus.com' target='_blank' rel='noreferrer'>
            Jarod Cavalcante
          </a>
        </DevParagraph>
      </BoxContainer>
    </Container>
  )
}
