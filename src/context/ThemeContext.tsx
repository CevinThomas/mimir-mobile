import React, { createContext, useContext, useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import * as SecureStore from 'expo-secure-store'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme()
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const getTheme = async () => {
      try {
        const theme = await SecureStore.getItemAsync('theme')
        if (theme) {
          setTheme(theme)
        }
      } catch (error) {
        console.error(error)
      }
    }

    getTheme()
  }, [])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
