import React from 'react'
import { StyleSheet, View } from 'react-native'
import MainButton from './MainButton'
import { getColorProperty } from '../../helpers'
import { useTheme } from '../../context/ThemeContext'

export default function ClickButton({ children, ...props }) {
  const { theme } = useTheme()
  return (
    <View style={[styles.container, theme === 'light' ? styles.shadowStyles : {}]}>
      <MainButton
        {...props}
        buttonStyle={[
          styles.button,
          {
            backgroundColor: getColorProperty(theme, 'darkGray'),

            ...props.buttonStyle
          }
        ]}
        titleStyle={{
          textAlign: 'left',
          width: '100%',
          color: getColorProperty(theme, 'text'),
          ...props.titleStyle
        }}
        type={'filled'}
        iconContainerStyle={{ ...props.iconContainerStyle }}
      >
        {children}
      </MainButton>
    </View>
  )
}
const styles = StyleSheet.create({
  shadowStyles: {
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 }
  },
  container: {
    flex: 1
  },
  button: {
    borderRadius: 4,
    padding: 12
  }
})
