import { CircularProgress } from '@mui/material'
import { Container } from './styles'

export default function Loading() {
  return (
    <Container>
      <CircularProgress color='secondary' />
      <h1>Carregando pad...</h1>
    </Container>
  )
}
