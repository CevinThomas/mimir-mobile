import React from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { getColorProperty } from '../../helpers'

interface NormalTextProps extends TextProps {
  fontSize?: number
}

export default function NormalText({ fontSize = 16, style, ...props }: NormalTextProps) {
  const { theme } = useTheme()

  return (
    <Text
      style={[
        styles.text,
        {
          color: getColorProperty(theme, 'text'),
          fontSize
        },
        style
      ]}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16
  }
})
