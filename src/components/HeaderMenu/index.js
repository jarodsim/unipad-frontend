import { Container } from './styles'

import { Typography } from '@mui/material'
// import { ArrowBack } from '@mui/icons-material'

export default function HeaderMenu({ title, actionButton }) {
  return (
    <Container>
      <Typography variant='h6' color='white' fontWeight={600}>
        {title}
      </Typography>
      {actionButton}
    </Container>
  )
}
