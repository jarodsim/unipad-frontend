import styled from 'styled-components'

import { Box, IconButton as ICButton } from '@mui/material'

export const Container = styled.div`
  width: 100%;
  height: 100%;
`
export const IconButton = styled(ICButton)`
  color: white;
`

export const BoxContainer = styled(Box)`
  padding-top: 20px;
`
export const DevParagraph = styled.p`
  margin-top: 10%;
  color: white;
  text-align: center;

  a {
    color: white;
    font-weight: 700;
    text-decoration: none;
  }
`
