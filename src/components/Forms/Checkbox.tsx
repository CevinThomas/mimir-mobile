import { CheckBox, CheckboxProps } from '@rneui/themed'
import { useTheme } from '../../context/ThemeContext'
import { getColorProperty } from '../../helpers'
import React from 'react'
import { StyleSheet, View } from 'react-native'

export default function CustomCheckBox({ label, style, ...props }: CheckboxProps) {
  const { theme } = useTheme()

  const backgroundColor = getColorProperty(theme, 'inputBackground')
  const textColor = getColorProperty(theme, 'inputText')

  return (
    <View>
      <CheckBox
        {...props}
        containerStyle={styles.checkboxContainer}
        textStyle={[styles.label, { color: textColor }]}
        title={label}
        checkedColor={'white'}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0
  },
  label: {
    fontWeight: 'normal'
  }
})
