import React from 'react'

import { MyButton } from './styles'

export default function Button({ label, color, callback }) {
  return (
    <MyButton variant='contained' color={color} onClick={callback}>
      {label}
    </MyButton>
  )
}
