import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import CustomCheckBox from './Forms/Checkbox'
import { getColorProperty } from '../helpers'

export default function CheckboxClickItem({ title, checked, onPress, ...props }) {
  const { theme } = useTheme()

  const backgroundColor = getColorProperty(theme, 'inputBackground')

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <CustomCheckBox onPress={onPress} label={title} checked={checked} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10
  },

  shadowStyles: {
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 }
  }
})
