import React, { memo, useEffect, useRef, useState } from 'react'
import { StyleSheet, TextInputProps, View } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { getColorProperty } from '../../helpers'
import { Input } from '@rneui/base'
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated'
import NormalText from '../Typography/NormalText'

interface CustomTextInputProps extends TextInputProps {
  label: string
}

const CustomTextInput: React.FC<CustomTextInputProps> = memo(
  ({ label, style, outline, onChangeText, ...props }) => {
    const { theme } = useTheme()
    const inputValue = useRef('')
    const [isFocused, setIsFocused] = useState(false)
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)

    const backgroundColor = getColorProperty(theme, 'inputBackground')
    const textColor = getColorProperty(theme, 'inputText')

    useEffect(() => {
      if (props.value === undefined) return

      if (props.value !== '') {
        translateY.value = -35
        translateX.value = -15
      } else {
        translateY.value = 0
        translateX.value = 0
      }
    }, [props.value])

    useEffect(() => {
      if (isFocused) {
        translateY.value = withTiming(-35)
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
)

const styles = StyleSheet.create({
  container: {
    height: 55
  },
  label: {
    fontWeight: 'normal',
    position: 'absolute',
    top: -57,
    left: 25,
    color: 'white'
  },
  input: {
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 12
  }
})

export default CustomTextInput
