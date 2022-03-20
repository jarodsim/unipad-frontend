import { useContext, useState } from 'react'
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
import useGetUrl from '../hooks/useGetUrl'
import MyButton from '../Button'
import { languages } from '../../constants/languages'

import { PadContext } from '../../context/padContext'

export default function Options({ handleCloseMenu }) {
  const { format: formatContext } = useContext(PadContext)
  const [format, setFormat] = useState(formatContext)

  const url = useGetUrl()
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
          {window.location.pathname.replace('/', '')}
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
          <MyButton
            label='SALVAR'
            color='secondary'
            callback={() => {
              console.log(`salvar`)
            }}
          />
          <MyButton
            label='NOVA URL'
            color='secondary'
            callback={() => {
              console.log(`nova url`)
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
