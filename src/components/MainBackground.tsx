import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { getColorProperty } from '../helpers'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function MainBackground({ children }) {
  const { theme } = useTheme()

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: getColorProperty(theme, 'background') }]}
      >
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  }
})
