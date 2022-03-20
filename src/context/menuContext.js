import { useState, createContext } from 'react'

export const MenuContext = createContext()

export function MenuProvider(props) {
  const [showNewUrlMenu, setShowNewUrlMenu] = useState(true)

  return (
    <MenuContext.Provider
      value={{
        showNewUrlMenu,
        setShowNewUrlMenu,
      }}
    >
      {props.children}
    </MenuContext.Provider>
  )
}
