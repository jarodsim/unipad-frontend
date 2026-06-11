import React from 'react'
import { Button as HeroButton } from '@heroui/react'
import type { ButtonProps as HeroButtonProps, PressEvent } from '@heroui/react'

interface ButtonProps extends Omit<HeroButtonProps, 'children' | 'onPress'> {
  label: React.ReactNode;
  callback?: (event: PressEvent) => void;
  onPress?: (event: PressEvent) => void;
}

export default function Button({
  label,
  callback,
  onPress,
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <HeroButton
      {...props}
      variant={variant}
      onPress={onPress ?? callback}
      className={`font-semibold shadow-md ${className ?? ''}`.trim()}
    >
      {label}
    </HeroButton>
  )
}
