import React from 'react'
import { StyleSheet } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { getColorProperty } from '../../helpers'
import { Button } from '@rneui/base'

export default function OutlineButton({ children, onPress, disabled, ...props }) {
  const { theme } = useTheme()
  const backgroundColor = 'transparent'
  const color = getColorProperty(theme, 'buttonFilledText')
  const borderColor = getColorProperty(theme, 'inputBorder')
  return (
    <Button
      disabled={disabled}
      disabledStyle={{ backgroundColor: 'transparent' }}
      title={children}
      onPress={onPress}
      buttonStyle={[styles.container, { backgroundColor, color, borderColor }]}
      titleStyle={[styles.text]}
      {...props}
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
  },
  text: {
    fontSize: 12
  }
})
