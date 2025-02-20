import React from 'react'
import { StyleSheet } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { getColorProperty } from '../../helpers'
import { Button } from '@rneui/base'

export default function FilledButton({ children, onPress, fontSize }) {
  const { theme } = useTheme()
  const backgroundColor = getColorProperty(theme, 'buttonFilledBackground')
  const color = getColorProperty(theme, 'buttonFilledText')
  const borderColor = getColorProperty(theme, 'buttonFilledBackground')
  return (
    <Button
      title={children}
      onPress={onPress}
      buttonStyle={[styles.container, { backgroundColor, color, borderColor }]}
      titleStyle={{ fontSize: fontSize || 16 }}
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
