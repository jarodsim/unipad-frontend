import React, { useState, createContext, ReactNode } from 'react'

interface AuthContextType {
  logged: boolean;
  setLogged: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider(props: { children: ReactNode }) {
  const [logged, setLogged] = useState(false)

  return (
    <AuthContext.Provider
      value={{
        logged,
        setLogged,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
