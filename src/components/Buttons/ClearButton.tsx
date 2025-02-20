import React from 'react'
import { StyleSheet } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { getColorProperty } from '../../helpers'
import { Button } from '@rneui/base'

export default function ClearButton({ children, onPress }) {
  const { theme } = useTheme()
  const backgroundColor = getColorProperty(theme, 'buttonClearBackground')
  const color = getColorProperty(theme, 'buttonClearText')
  const borderColor = getColorProperty(theme, 'inputBorder')
  console.log(color)
  return (
    <Button
      title={children}
      onPress={onPress}
      buttonStyle={[styles.container, { backgroundColor, borderColor }]}
      titleStyle={{ color }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
    borderRadius: 40,
    borderWidth: 1
  }
})
