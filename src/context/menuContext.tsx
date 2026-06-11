import React, { useState, createContext, ReactNode } from 'react'

export type MenuType = 'NEWURL' | 'LOGIN' | 'OPTIONS'

interface MenuContextType {
  showMenu: MenuType;
  setShowMenu: React.Dispatch<React.SetStateAction<MenuType>>;
}

export const MenuContext = createContext<MenuContextType>({} as MenuContextType)

export function MenuProvider(props: { children: ReactNode }) {
  const [showMenu, setShowMenu] = useState<MenuType>('NEWURL')

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
