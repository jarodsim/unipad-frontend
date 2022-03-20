import { useState, createContext } from 'react'

export const AuthContext = createContext()

export function AuthProvider(props) {
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
