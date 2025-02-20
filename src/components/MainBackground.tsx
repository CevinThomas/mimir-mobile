import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { getColorProperty } from '../helpers'

export default function MainBackground({ children }) {
  const { theme } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: getColorProperty(theme, 'background') }]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  }
})
