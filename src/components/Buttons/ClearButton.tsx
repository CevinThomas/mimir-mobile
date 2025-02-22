import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { getColorProperty } from '../../helpers'
import { Button } from '@rneui/base'

export default function ClearButton({ children, onPress }) {
  const { theme } = useTheme()
  const [backgroundColor, setBackgroundColor] = useState('')
  const [color, setColor] = useState('')
  const [borderColor, setBorderColor] = useState('')

  useEffect(() => {
    setColor(getColorProperty(theme, 'buttonClearText'))
    setBorderColor(getColorProperty(theme, 'inputBorder'))
    setBackgroundColor(getColorProperty(theme, 'buttonClearBackground'))
    console.log('HELL=O2')
  }, [])

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
