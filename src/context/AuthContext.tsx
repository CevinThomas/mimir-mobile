import React, { createContext, useContext, useReducer } from 'react'

const AuthContext = createContext()

const initialState = {
  isLoggedIn: false
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOG_IN':
      return {
        ...state,
        isLoggedIn: true
      }
    case 'LOG_OUT':
      return {
        ...state,
        isLoggedIn: false
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
