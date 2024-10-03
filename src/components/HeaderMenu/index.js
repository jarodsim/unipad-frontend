import { Container } from './styles'

import { Typography } from '@mui/material'

export default function HeaderMenu({ title, actionButton }) {
  return (
    <Container>
      <Typography variant='h1' color='white' style={{
        fontSize: title === 'CONFIGURAÇÕES DA URL' ? '1.5rem' : '2rem',
        textAlign: 'center',
      }}>
        {title}
      </Typography>
      {actionButton}
    </Container>
  )
}
