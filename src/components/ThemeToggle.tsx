import React from 'react'
import { Button, View } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import * as SecureStore from 'expo-secure-store'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  const onToggleThemePress = async () => {
    try {
      await SecureStore.setItemAsync('theme', theme === 'dark' ? 'light' : 'dark')
      toggleTheme()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View>
      <Button
        onPress={onToggleThemePress}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      />
    </View>
  )
}
