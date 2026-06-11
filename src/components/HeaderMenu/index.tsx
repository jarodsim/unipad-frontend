import React, { ReactNode } from 'react'

interface HeaderMenuProps {
  title: string
  actionButton?: ReactNode
}

export default function HeaderMenu({ title, actionButton }: HeaderMenuProps) {
  const isBrand = title === 'Unipad'

  return (
    <div className={`flex h-20 w-full items-center px-5 ${actionButton ? 'justify-between' : 'justify-center'}`}>
      <h1
        className={`min-w-0 text-center text-white ${
          isBrand
            ? 'text-3xl font-medium tracking-tight'
            : 'truncate text-lg font-extrabold uppercase tracking-wide'
        }`}
      >
        {title}
      </h1>
      {actionButton ? <div className="ml-3 shrink-0">{actionButton}</div> : null}
    </div>
  )
}
