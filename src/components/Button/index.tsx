import React from 'react'
import { MyButton } from './styles'
import { ButtonProps as MuiButtonProps } from '@mui/material'

interface ButtonProps {
  label: React.ReactNode;
  color?: MuiButtonProps['color'];
  callback?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({ label, color, callback }: ButtonProps) {
  return (
    <MyButton variant='contained' color={color as any} onClick={callback}>
      {label}
    </MyButton>
  )
}
