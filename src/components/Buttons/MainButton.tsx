import React, { useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { getColorProperty } from '../../helpers'
import { Button, ButtonProps } from '@rneui/base'
import { StyleSheet } from 'react-native'

interface MainButtonProps extends ButtonProps {
  children: string
  type: 'filled' | 'clear'
}

export default function MainButton({ children, outline, ...props }: MainButtonProps) {
  const { theme } = useTheme()
  const [backgroundColor, setBackgroundColor] = useState('')
  const [color, setColor] = useState('')
  const [borderColor, setBorderColor] = useState('')

  useEffect(() => {
    if (outline) {
      setBackgroundColor('transparent')
      setColor(getColorProperty(theme, 'buttonFilledText'))
      setBorderColor(getColorProperty(theme, 'inputBorder'))
      return
    }
    const backgroundProperty =
      props.type === 'filled' ? 'buttonFilledBackground' : 'buttonClearBackground'
    const textProperty = props.type === 'filled' ? 'buttonFilledText' : 'buttonClearText'
    setBackgroundColor(getColorProperty(theme, backgroundProperty))
    setColor(getColorProperty(theme, textProperty))
    if (theme === 'light') {
      setBorderColor(getColorProperty(theme, 'inputBorder'))
      return
    }
    setBorderColor(getColorProperty(theme, 'buttonFilledBackground'))
  }, [theme])

  return (
    <Button
      buttonStyle={[
        styles.container,
        {
          backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
          ...props.buttonStyling
        }
      ]}
      titleStyle={{ color, ...props.titleStyling }}
      titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
      title={children}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 80,
    width: '100%',
    borderRadius: 40
  }
})
