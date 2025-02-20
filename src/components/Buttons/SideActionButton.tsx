import React from 'react'
import { StyleSheet } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { getColorProperty } from '../../helpers'
import { Button } from '@rneui/base'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function SideActionButton({ children, onPress }) {
  const { theme } = useTheme()
  const backgroundColor = getColorProperty(theme, 'buttonFilledBackground')
  const color = getColorProperty(theme, 'buttonFilledText')
  const borderColor = getColorProperty(theme, 'buttonFilledBackground')
  return (
    <Button
      iconPosition={'left'}
      icon={<Ionicons name="add" size={14} color="white" />}
      title={children}
      onPress={onPress}
      buttonStyle={[styles.container, { backgroundColor, color, borderColor }]}
      titleStyle={styles.text}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 40,
    borderWidth: 1
  },
  text: {
    fontSize: 12
  }
})
