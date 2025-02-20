import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from '@rneui/themed'
import { getColorProperty } from '../../helpers'
import { useTheme } from '../../context/ThemeContext'

export default function ClickButton({ children, onPress, short, background }) {
  const { theme } = useTheme()
  return (
    <View style={[styles.container, theme === 'light' ? styles.shadowStyles : {}]}>
      <Button
        onPress={onPress}
        buttonStyle={[
          styles.button,
          {
            backgroundColor: background || getColorProperty(theme, 'darkGray')
          }
        ]}
        titleStyle={[
          styles.titleStyle,
          { color: getColorProperty(theme, 'text'), width: short ? '50%' : '100%' }
        ]}
        titleProps={{ numberOfLines: 1, ellipsizeMode: 'tail' }}
      >
        {children}
      </Button>
    </View>
  )
}
const styles = StyleSheet.create({
  titleStyle: {
    textAlign: 'left',
    fontSize: 16
  },
  shadowStyles: {
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 }
  },
  button: {
    borderRadius: 4,
    padding: 12,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  }
})
