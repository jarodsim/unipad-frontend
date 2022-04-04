import { useContext, useEffect, useState } from 'react'
import { ArrowBack } from '@mui/icons-material'
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'

import { Container, IconButton, BoxContainer, DevParagraph } from './styles'
import HeaderMenu from '../HeaderMenu'
import MyButton from '../Button'

import { languages } from '../../constants/languages'

import { PadContext } from '../../context/padContext'
import { MenuContext } from '../../context/menuContext'
import { SnackbarContext } from '../../context/snackbarContext'

import api from '../../service/api'
import useHandleLocalToken from '../hooks/useHandleLocalToken'

export default function Options({ handleCloseMenu }) {
  const [format, setFormat] = useState('javascript')

  const url = window.location.pathname
  const token = useHandleLocalToken()

  const { format: formatContext, setFormat: setFormatContext } =
    useContext(PadContext)
  const { setShowMenu } = useContext(MenuContext)
  const { setSnackObject } = useContext(SnackbarContext)

  useEffect(() => {
    setFormat(formatContext)
  }, [formatContext])

  async function updateFormat() {
    const { data } = await api.put(
      '',
      {
        url,
        pad: '',
        format,
        onlyformat: true,
      },
      {
        headers: {
          authorization: String(token),
        },
      }
    )

    if (data.success) {
      setSnackObject({
        open: true,
        message: 'Formato atualizado com sucesso!',
        type: 'success',
      })
    }
  }

  return (
    <Container>
      <HeaderMenu
        title='CONFIGURAÇÕES DA URL'
        actionButton={
          <IconButton onClick={handleCloseMenu}>
            <ArrowBack />
          </IconButton>
        }
      />
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
          {url}
        </Typography>
        <FormControl
          variant='outlined'
          sx={{ m: 1, minWidth: '90%', minHeight: '100%' }}
          color='secondary'
        >
          <InputLabel id='format'>
            <Typography variant='body1' color='#e3f2fd'>
              Formato
            </Typography>
          </InputLabel>
          <Select
            labelId='format'
            id='select-format'
            variant='outlined'
            label='Formato'
            value={format}
            onChange={(e) => {
              setFormatContext(e.target.value)
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
          <MyButton
            label='SALVAR'
            color='secondary'
            callback={() => {
              updateFormat()
            }}
          />
          <MyButton
            label='NOVA URL'
            color='secondary'
            callback={() => {
              setShowMenu('NEWURL')
            }}
          />
        </FormControl>
        <DevParagraph>
          Desenvolvido por{' '}
          <a href='https://jarodmateus.tech' target='_blank' rel='noreferrer'>
            Jarod Cavalcante
          </a>
        </DevParagraph>
      </BoxContainer>
    </Container>
  )
}
