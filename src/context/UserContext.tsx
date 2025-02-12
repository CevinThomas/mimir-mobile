import React, { createContext, useContext, useReducer } from 'react'

const UserContext = createContext()

const initialState = {
  account: {}
}

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACCOUNT':
      return {
        ...state,
        account: action.payload
      }
  }
}

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState)

  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>
}

export const useUserContext = () => useContext(UserContext)
