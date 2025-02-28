import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, TextInputProps, View } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { getColorProperty } from '../../helpers'
import { Input } from '@rneui/base'
import NormalText from '../Typography/NormalText'
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated'

interface CustomTextInputProps extends TextInputProps {
  label: string
}

export default function CustomTextArea({
  label,
  style,
  onChangeText,
  ...props
}: CustomTextInputProps) {
  const { theme } = useTheme()
  const inputValue = useRef('')
  const [isFocused, setIsFocused] = useState(false)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const backgroundColor = getColorProperty(theme, 'inputBackground')
  const textColor = getColorProperty(theme, 'inputText')

  useEffect(() => {
    if (isFocused) {
      translateY.value = withTiming(-61)
      translateX.value = withTiming(-15)
    } else {
      if (inputValue.current === '') {
        translateY.value = withTiming(0)
        translateX.value = withTiming(0)
      }
    }
  }, [isFocused])

  return (
    <View style={styles.container}>
      <Input
        onChangeText={(text) => {
          inputValue.current = text
          onChangeText(text)
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline={true}
        autoCapitalize={'none'}
        autoComplete={label === 'Email' ? 'email' : 'off'}
        style={[
          styles.input,
          {
            backgroundColor,
            color: textColor,
            borderColor: getColorProperty(theme, 'inputBorder'),
            borderWidth: 0
          },
          style
        ]}
        inputContainerStyle={{ borderBottomWidth: 0 }}
        labelStyle={[styles.label, { color: textColor }]}
        {...props}
      />
      <Animated.View style={{ transform: [{ translateY }, { translateX }] }}>
        <NormalText style={[styles.label]}>{label}</NormalText>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5
  },
  label: {
    marginBottom: 8,
    fontWeight: 'normal',
    position: 'absolute',
    top: -85,
    left: 25
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 12
  }
})
