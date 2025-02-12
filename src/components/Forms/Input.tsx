import React from 'react'
import { StyleSheet, TextInputProps, View } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { getColorProperty } from '../../helpers'
import { Input } from '@rneui/base'

interface CustomTextInputProps extends TextInputProps {
  label: string
}

export default function CustomTextInput({ label, style, outline, ...props }: CustomTextInputProps) {
  const { theme } = useTheme()

  const backgroundColor = getColorProperty(theme, 'inputBackground')
  const textColor = getColorProperty(theme, 'inputText')

  return (
    <View style={styles.container}>
      <Input
        autoCapitalize={'none'}
        autoComplete={label === 'Email' ? 'email' : 'off'}
        style={[
          styles.input,
          {
            backgroundColor,
            color: textColor,
            borderColor: getColorProperty(theme, 'inputBorder'),
            borderWidth: outline ? 1 : 0
          },
          style
        ]}
        label={label}
        inputContainerStyle={{ borderBottomWidth: 0 }}
        labelStyle={[styles.label, { color: textColor }]}
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5
  },
  label: {
    marginBottom: 8,
    fontWeight: 'normal'
  },
  input: {
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 12
  }
})
