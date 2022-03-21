import { useState, createContext } from 'react'

export const MenuContext = createContext()

export function MenuProvider(props) {
  const [showMenu, setShowMenu] = useState('NEWURL')

  // OPTIONS: 'NEWURL' | 'LOGIN' | 'OPTIONS',
  return (
    <MenuContext.Provider
      value={{
        showMenu,
        setShowMenu,
      }}
    >
      {props.children}
    </MenuContext.Provider>
  )
}
