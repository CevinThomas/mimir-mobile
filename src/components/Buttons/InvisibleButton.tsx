import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from '@rneui/themed'
import { getColorProperty } from '../../helpers'
import { useTheme } from '../../context/ThemeContext'

export default function InvisibleButton({ children, ...props }) {
  const { theme } = useTheme()
  return (
    <Button
      type={'clear'}
      title={children}
      titleStyle={{
        color: getColorProperty(theme, 'text'),
        fontSize: 14
      }}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    borderRadius: 1,
    padding: 12
  }
})
